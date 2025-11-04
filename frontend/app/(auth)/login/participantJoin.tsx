"use client";

import { useEffect, useState } from "react";
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

    useEffect(() => {
        if (!socket) return;

        if (!socket.connected) socket.connect();

        const handleGameJoined = (game: { game_code: string }) => {
            console.log("Participant successfully joined game:", game);
            // Redirect to participant waiting room
            router.push(`/participant-waiting/${game.game_code}`);
        };

        const handleError = (errorMessage: string) => {
            console.error("Server error:", errorMessage);
            setError(errorMessage);
            socket.disconnect(); // Disconnect on error
        };

        socket.on("game-joined", handleGameJoined);
        // socket.on("error", handleError);

        return () => {
            console.log("Cleaning up socket listeners for participant join");
            socket.off("game-joined", handleGameJoined);
            // socket.off("error", handleError);
        };
    }, [router]);

    const handleJoinGame = async () => {
        if (!username.trim() || !gameCode.trim()) {
            setError("Both username and game code are required.");
            return;
        }

        setError("");

        console.log("Attempting to join game with code:", gameCode);

        socket.emit("participant-join-game", {
            gameCode: gameCode.toUpperCase(),
            username,
        });
        router.push(`/participant-waiting/${gameCode}`);
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
                    className="w-full bg-foreground text-background border-2 border-foreground hover:text-foreground hover:bg-transparent group-hover:bg-accent group-hover:text-background disabled:bg-accent disabled:text-background disabled:border-accent hover:cursor-pointer"
                    onClick={handleJoinGame}
                >
                    JOIN
                </Button>
            </CardFooter>
        </>
    );
};

export default ParticipantJoinPage;
