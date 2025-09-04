"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/app/utils/websockets/webSockets";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ParticipantJoinPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [gameCode, setGameCode] = useState("");
    const [error, setError] = useState("");

    const handleJoinGame = () => {
        if (!username.trim() || !gameCode.trim()) {
            setError("Both username and game code are required.");
            return;
        }

        setError("");
        socket.connect(); // Manually connect the socket

        socket.emit("participant-join-game", {
            gameCode: gameCode.toUpperCase(),
            username,
        });

        // Listen for confirmation that the game was joined
        socket.on("game-joined", (game) => {
            // Redirect to a participant waiting screen
            router.push(`/participant-waiting/${game.game_code}`);
        });

        // Listen for errors from the server
        socket.on("error", (errorMessage) => {
            setError(errorMessage);
            socket.disconnect(); // Disconnect on error
        });
    };

    return (
        <>
            <CardContent className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="username"
                        className="bg-secondary"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="gameCode">Game Code</Label>
                    <Input
                        id="gameCode"
                        type="text"
                        className="bg-secondary"
                        required
                        onChange={(e) => setGameCode(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-center mt-10">
                <Button
                    className="w-full bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer"
                    onClick={handleJoinGame}
                >
                    JOIN
                </Button>
            </CardFooter>
        </>
    );
};

export default ParticipantJoinPage;
