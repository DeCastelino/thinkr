"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import {
    emit,
    socketEmits,
    socketEvents,
} from "@/app/utils/websockets/events";
import type { Game } from "@/types/game";

const ParticipantJoinPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [gameCode, setGameCode] = useState("");
    const [error, setError] = useState("");

    useSocketEvents({
        [socketEvents.gameJoined]: (game: Game) => {
            console.log("Participant successfully joined game:", game);
            router.push(`/participant-waiting/${game.game_code}`);
        },
        [socketEvents.error]: (errorMessage) => {
            console.error("Server error:", errorMessage);
            setError(errorMessage.message);
        },
    });

    const handleJoinGame = () => {
        if (!username.trim() || !gameCode.trim()) {
            setError("Both username and game code are required.");
            return;
        }

        setError("");

        console.log("Attempting to join game with code:", gameCode);

        emit(socketEmits.participantJoinGame, {
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
                {error && (
                    <p className="text-red-500 text-sm mt-1 text-center">
                        {error}
                    </p>
                )}
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
