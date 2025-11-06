const { supabaseAdmin } = require("../services/supabase");

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

                const updatedParticipants = [
                    ...game.participants,
                    { username, socketId: socket.id, score: 0 },
                ];

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

                // Join the host to the room again (important for refreshes)
                socket.join(gameCode);

                // Send the comprehensive game data back to the host
                socket.emit("game-data-response", gameData);
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
            const gameCode = data.gamCode.toUpperCase();
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

        socket.on("disconnect", () => {
            console.log(`3. 🔌 Client disconnected: ${socket.id}`);
        });
    });
};
