const { supabase } = require("../services/supabase");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected with socket id: ", socket.id);

        // Host joins the game room after creating a quiz
        socket.on("host-join-game", async ({ gameCode }) => {
            try {
                // Find the game in the database
                const { data: game, error } = await supabase
                    .from("games")
                    .select("*")
                    .eq("game_code", gameCode)
                    .single();

                if (error || !game) {
                    socket.emit("error", "Game not found");
                    return;
                }

                // Join the Socket.IO room
                socket.join(gameCode);
                console.log(`Host ${socket.id} joined room ${gameCode}`);

                // Update the game with the host's socket ID
                await supabase
                    .from("games")
                    .update({ host_id: socket.id })
                    .eq("game_code", gameCode);

                // Send confirmation back to the host
                socket.emit("game-joined", game);
            } catch (error) {
                console.error(error);
                socket.emit(
                    "error",
                    "An error occurred while joining the game."
                );
            }
        });

        // Participant joins an existing game room
        socket.on("participant-join-game", async ({ gameCode, username }) => {
            try {
                // Find the gfame in the database
                const { data: game, error: gameError } = await supabase
                    .from("games")
                    .select("*")
                    .eq("game_code", gameCode)
                    .single();

                if (gameError || !game) {
                    socket.emit("error", "Game not found");
                    return;
                }

                // Add the participant to the game
                const updatedParticipants = [
                    ...game.participants,
                    { username, socketId: socket.id, score: 0 },
                ];

                const { data: updatedGame, error: updateError } = await supabase
                    .from("games")
                    .update({ participants: updatedParticipants })
                    .eq("game_code", gameCode)
                    .select("*")
                    .single();

                if (updateError) {
                    socket.emit("error", "Failed to join the game");
                    return;
                }

                // Join the Socket.IO room
                socket.join(gameCode);
                console.log(
                    `Participant ${username} (${socket.id}) joined room ${gameCode}`
                );

                socket.emit("game-joined", updatedGame);

                // Notify the host that a new participant has joined
                io.to(game.host_id).emit(
                    "participant-updated",
                    updatedGame.participants
                );
            } catch (error) {
                console.error(error);
                socket.emit(
                    "error",
                    "An error occurred while joining the game."
                );
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected with socket id: ", socket.id);

            // LATER: Handle disconnection logic
        });
    });
};
