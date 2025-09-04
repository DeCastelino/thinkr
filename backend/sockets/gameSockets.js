// server/src/sockets/gameSocket.js

const { supabaseAdmin } = require("../services/supabase");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        /**
         * Host joins the game room after creating it.
         * The incoming data is now the second argument of the event listener.
         */
        socket.on("host-join-game", async (data) => {
            console.log(
                `Received 'host-join-game' from ${socket.id} with data:`,
                data
            );

            // Destructure the gameCode from the data object.
            const { gameCode } = data;

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

                socket.join(gameCode);
                console.log(
                    `Host ${socket.id} successfully joined room ${gameCode}`
                );

                await supabaseAdmin
                    .from("games")
                    .update({ host_id: socket.id })
                    .eq("game_code", gameCode);

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
                `Received 'participant-join-game' from ${socket.id} with data:`,
                data
            );
            const { gameCode, username } = data;

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
                    `Participant ${username} (${socket.id}) successfully joined room ${gameCode}`
                );

                socket.emit("game-joined", updatedGame);
                io.to(game.host_id).emit(
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
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
};
