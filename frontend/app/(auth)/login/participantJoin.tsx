"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/app/utils/websockets/webSockets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
        <div className="flex items-center justify-center h-screen bg-secondary">
            <Card className="bg-primary px-3 py-6 w-lg h-auto p-12">
                <CardContent className="grid gap-6">
                    <h1 className="text-3xl font-extrabold text-center italic">
                        Join Game
                    </h1>
                    <div className="grid gap-3">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            className="bg-secondary"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="gameCode">Game Code</Label>
                        <Input
                            id="gameCode"
                            type="text"
                            className="bg-secondary"
                            value={gameCode}
                            onChange={(e) => setGameCode(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </CardContent>
                <CardFooter className="flex justify-center mt-10">
                    <Button
                        onClick={handleJoinGame}
                        className="w-full bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer"
                    >
                        JOIN
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ParticipantJoinPage;
