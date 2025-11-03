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

        socket.on("disconnect", () => {
            console.log(`3. 🔌 Client disconnected: ${socket.id}`);
        });
    });
};
