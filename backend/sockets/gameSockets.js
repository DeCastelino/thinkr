const { supabaseAdmin } = require("../services/supabase");

// In-memory storage for active game rooms
const gameRooms = new Map();

module.exports = (io) => {
    let connectedClients = new Map();
    io.on("connection", (socket) => {
        console.log(`1. ✅ Client connected: ${socket.id}`);

        // Host joins the game room after creating it.
        socket.on("host-join-game", async (data) => {
            console.log(
                `Received 'host-join-game' from ${socket.id} with data:`,
                data
            );

            // Destructure the gameCode from the data object.
            const gameCode = data.gameCode.toUpperCase();

            if (!gameCode) {
                console.error(
                    "Error: 'host-join-game' received without a gameCode."
                );
                return socket.emit("error", {
                    message: "gameCode is required.",
                });
            }

            try {
                // .single() will return an error if no row is found, which we'll catch.
                const { data: game, error } = await supabaseAdmin
                    .from("games")
                    .select("*")
                    .eq("game_code", gameCode)
                    .single();

                if (error) {
                    console.error(
                        `Error finding game ${gameCode}:`,
                        error.message
                    );
                    return socket.emit("error", {
                        message: `Game with code ${gameCode} not found.`,
                    });
                }

                // Creating a new game room. Join the game room
                socket.join(gameCode);
                console.log(`Rooms: ${JSON.stringify(socket.rooms)}`);

                console.log(
                    `Host ${socket.id} successfully joined room ${gameCode}`
                );

                await supabaseAdmin
                    .from("games")
                    .update({ host_id: socket.id })
                    .eq("game_code", gameCode);

                socket.to(gameCode).emit("game-joined", game);
                socket.emit("game-joined", game);
            } catch (err) {
                // This is the critical catch block for any unexpected errors.
                console.error(
                    `🔥🔥🔥 UNHANDLED ERROR in 'host-join-game' for socket ${socket.id}:`,
                    err
                );
                socket.emit("error", {
                    message: "A server error occurred while joining the game.",
                });
            }
        });

        /**
         * Participant joins an existing game room.
         */
        socket.on("participant-join-game", async (data) => {
            console.log(
                `2. Received 'participant-join-game' from ${socket.id} with data:`,
                data
            );
            const username = data.username.trim();
            const gameCode = data.gameCode.toUpperCase();

            if (!gameCode || !username) {
                console.error(
                    "Error: 'participant-join-game' received with missing data."
                );
                return socket.emit("error", {
                    message: "gameCode and username are required.",
                });
            }

            try {
                const { data: game, error: gameError } = await supabaseAdmin
                    .from("games")
                    .select("*")
                    .eq("game_code", gameCode)
                    .single();

                if (gameError) {
                    console.error(
                        `Error finding game ${gameCode} for participant:`,
                        gameError.message
                    );
                    return socket.emit("error", {
                        message: `Game with code ${gameCode} not found.`,
                    });
                }

                // Store the username in the socket session for future reference
                socket.username = username;

                const existingParticipant = game.participants.find(
                    (p) =>
                        (p.username === username || p.socketId === socket.id) &&
                        typeof p === "object"
                );

                let updatedParticipants;
                if (!existingParticipant) {
                    updatedParticipants = [
                        ...game.participants,
                        { username, socketId: socket.id, score: 0 },
                    ];
                } else {
                    // Participant is reconnecting; update their socketId
                    updatedParticipants = game.participants.map((p) => {
                        p.username === username
                            ? { ...p, socketId: socket.id }
                            : p;
                    });
                }
                const { data: updatedGame, error: updateError } =
                    await supabaseAdmin
                        .from("games")
                        .update({ participants: updatedParticipants })
                        .eq("game_code", gameCode)
                        .select()
                        .single();

                if (updateError) throw updateError;

                socket.join(gameCode);
                console.log(
                    `3. Participant ${username} (${socket.id}) successfully joined room ${gameCode}`
                );

                socket.emit("game-joined", updatedGame);
                console.log(
                    `4. Participant ${username} (${socket.id}) successfully joined room ${gameCode}`
                );
                console.log("Updated Participants:", updatedGame.participants);

                io.to(gameCode).emit(
                    "participant-updated",
                    updatedGame.participants
                );
            } catch (err) {
                console.error(
                    `🔥🔥🔥 UNHANDLED ERROR in 'participant-join-game' for socket ${socket.id}:`,
                    err
                );
                socket.emit("error", {
                    message: "A server error occurred while joining the game.",
                });
            }
        });

        socket.on("host-request-game-data", async (data) => {
            console.log(
                `7. Received 'host-request-game-data' from ${socket.id} for room:`,
                data.gameCode
            );
            const gameCode = data.gameCode.toUpperCase();

            try {
                // Fetch game data AND the related quiz questions
                // This uses Supabase's foreign key joining
                const { data: game, error } = await supabaseAdmin
                    .from("games")
                    .select(
                        `
                        *,
                        quizzes (
                            questions
                        )
                    `
                    )
                    .eq("game_code", gameCode)
                    .single();

                if (error) {
                    console.error(
                        `Error fetching game data for ${gameCode}:`,
                        error.message
                    );
                    return socket.emit("error", {
                        message: `Game with code ${gameCode} not found.`,
                    });
                }

                // The quiz data is nested, so let's flatten it for easier use on the frontend
                const gameData = {
                    ...game,
                    questions: game.quizzes.questions,
                };
                delete gameData.quizzes; // Clean up the nested object

                // Initialize in-memory game room if not exists
                const currentQuestion =
                    gameData.questions[gameData.current_question_index];
                gameRooms.set(gameCode, {
                    buzzQueue: [],
                    currentQuestion: currentQuestion,
                });

                // Join the host to the room again (important for refreshes)
                socket.join(gameCode);

                // Send the comprehensive game data back to the host
                socket.emit("game-data-response", gameData);
                // Tell all the participants that a new question is ready
                io.to(gameCode).emit("new-question-ready");
                console.log(
                    `8. Sent 'game-data-response' to host ${socket.id}`
                );
            } catch (err) {
                console.error(
                    `🔥🔥🔥 UNHANDLED ERROR in 'host-request-game-data' for socket ${socket.id}:`,
                    err
                );
                socket.emit("error", {
                    message:
                        "A server error occurred while fetching game data.",
                });
            }
        });

        socket.on("ensure-in-room", (data) => {
            const gameCode = data.gameCode.toUpperCase();
            if (gameCode) {
                console.log(
                    `SOCKET: Ensureing socket ${socket.id} is in the room ${gameCode}`
                );
                socket.join(gameCode);
            }
        });

        socket.on("host-start-game", async (data) => {
            console.log(
                `5. Received 'host-start-game' from ${socket.id} for room:`,
                data.gameCode
            );
            const gameCode = data.gameCode.toUpperCase();

            try {
                // (Recommended) Update the game state in Supabase
                const { error } = await supabaseAdmin
                    .from("games")
                    .update({ game_state: "started" })
                    .eq("game_code", gameCode);

                if (error) {
                    console.error(
                        `Error updating game state for ${gameCode}:`,
                        error.message
                    );
                    // Continue anyway, but log the error
                }

                // *** THIS IS THE KEY ***
                // Broadcast to EVERYONE in the room (host + participants)
                io.to(gameCode).emit("game-started");
                console.log(
                    `6. Broadcast 'game-started' to everyone in room ${gameCode}`
                );
            } catch (err) {
                console.error(
                    `🔥🔥🔥 UNHANDLED ERROR in 'host-start-game' for socket ${socket.id}:`,
                    err
                );
                socket.emit("error", {
                    message: "A server error occurred while starting the game.",
                });
            }
        });

        socket.on("participant-buzz", (data) => {
            const { gameCode } = data;
            const room = gameRooms.get(gameCode);

            if (!room) {
                return console.error(`No in-memory room found for ${gameCode}`);
            }

            // Check if user is already in the queue for this question
            const alreadyBuzzed = room.buzzQueue.some(
                (p) => p.socketId === socket.id
            );
            if (alreadyBuzzed) {
                return console.log(`User ${socket.id} already buzzed.`);
            }

            // Add participant to the queue
            const participantData = {
                socketId: socket.id,
                username: socket.username, // We stored this on join
            };
            room.buzzQueue.push(participantData);
            console.log(
                `BUZZ: ${socket.username} is #${room.buzzQueue.length} in queue for ${gameCode}`
            );

            // If this is the first buzz, give them the chance to answer
            if (room.buzzQueue.length === 1) {
                // Tell host who is answering
                io.to(gameCode).emit("waiting-for-answer", {
                    username: participantData.username,
                });
                // Tell participant it's their turn
                socket.emit("your-turn-to-answer", {
                    options: room.currentQuestion.options,
                });
            }
        });

        // *** NEW: PARTICIPANT ANSWER HANDLER ***
        socket.on("participant-submit-answer", async (data) => {
            const { gameCode, answer } = data;
            const room = gameRooms.get(gameCode);
            if (!room) return;

            const participant = room.buzzQueue[0];
            if (!participant || participant.socketId !== socket.id) {
                return console.log(`Not ${socket.id}'s turn to answer.`);
            }

            const isCorrect = answer === room.currentQuestion.correctAnswer;

            if (isCorrect) {
                console.log(`CORRECT: ${participant.username}`);
                // 1. Update score in Supabase
                const { data: game, error } = await supabaseAdmin
                    .from("games")
                    .select("participants")
                    .eq("game_code", gameCode)
                    .single();

                if (error) throw error;

                let newScore = 0;
                const updatedParticipants = game.participants.map((p) => {
                    const pObj = typeof p === "string" ? JSON.parse(p) : p;
                    if (pObj.socketId === participant.socketId) {
                        pObj.score += 10;
                        newScore = pObj.score;
                    }
                    return pObj;
                });

                await supabaseAdmin
                    .from("games")
                    .update({ participants: updatedParticipants })
                    .eq("game_code", gameCode);

                // 2. Broadcast result to everyone
                io.to(gameCode).emit("answer-result-correct", {
                    username: participant.username,
                    score: newScore,
                    participants: updatedParticipants,
                });
                // 3. Clear buzz queue for next question
                room.buzzQueue = [];
            } else {
                console.log(`INCORRECT: ${participant.username}`);
                // 1. Remove from queue
                room.buzzQueue.shift();

                // 2. Broadcast incorrect result
                io.to(gameCode).emit("answer-result-incorrect", {
                    username: participant.username,
                });

                // 3. Check if anyone is left in the queue
                if (room.buzzQueue.length > 0) {
                    const nextParticipant = room.buzzQueue[0];
                    // Tell host who is next
                    io.to(gameCode).emit("waiting-for-answer", {
                        username: nextParticipant.username,
                    });
                    // Tell next participant it's their turn
                    io.to(nextParticipant.socketId).emit(
                        "your-turn-to-answer",
                        {
                            options: room.currentQuestion.options,
                        }
                    );
                } else {
                    // No one left in queue
                    io.to(gameCode).emit("question-over-wrong");
                }
            }
        });

        // *** NEW: HOST NEXT QUESTION HANDLER ***
        socket.on("host-next-question", async (data) => {
            const { gameCode, newQuestionIndex } = data;

            // 1. Update database
            const { data: game, error } = await supabaseAdmin
                .from("games")
                .update({ current_question_index: newQuestionIndex })
                .eq("game_code", gameCode)
                .select(
                    `
                    *,
                    quizzes (
                        questions
                    )
                `
                )
                .single();

            if (error) {
                return console.error("Failed to update question index:", error);
            }

            // 2. Update in-memory state
            const currentQuestion = game.quizzes.questions[newQuestionIndex];
            gameRooms.set(gameCode, {
                buzzQueue: [],
                currentQuestion: currentQuestion,
            });

            // 3. Broadcast new question state to host
            const gameData = { ...game, questions: game.quizzes.questions };
            delete gameData.quizzes;
            socket.emit("game-data-response", gameData); // Send full state back to host

            // 4. Tell participants to get ready
            io.to(gameCode).emit("new-question-ready");
        });

        socket.on("disconnect", () => {
            console.log(`3. 🔌 Client disconnected: ${socket.id}`);
        });
    });
};
