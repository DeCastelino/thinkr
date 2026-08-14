"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import {
    emit,
    socketEmits,
    socketEvents,
} from "@/app/utils/websockets/events";
import { normalizeParticipants } from "@/app/utils/participants";
import type { Game, Participant } from "@/types/game";

const WaitingRoom = ({ params }: { params: Promise<{ gameId: string }> }) => {
    const { gameId } = use(params);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useSocketEvents(
        {
            [socketEvents.gameJoined]: (game: Game) => {
                console.log("Client: Host successfully joined game:", game);
                setParticipants(normalizeParticipants(game.participants));
            },
            [socketEvents.participantUpdated]: (updatedParticipants) => {
                console.log(
                    "Client: Received participant update:",
                    updatedParticipants
                );
                setParticipants(normalizeParticipants(updatedParticipants));
            },
            [socketEvents.error]: (errorMessage) => {
                console.error("Server error:", errorMessage);
                setError(errorMessage.message);
            },
            [socketEvents.gameStarted]: () => {
                router.push(`/quiz/${gameId}`);
            },
        },
        {
            onMount: () => emit(socketEmits.hostJoinGame, { gameCode: gameId }),
        }
    );

    const handleStartGame = () => {
        emit(socketEmits.hostStartGame, { gameCode: gameId });
        router.push(`/quiz/${gameId}`);
    };

    return (
        <div className="grid grid-cols-2 items-center justify-center h-screen bg-secondary p-10 gap-4">
            <div className="bg-accent rounded-4xl h-full flex flex-col items-center justify-start p-10 text-3xl font-bold italic">
                Players Joined
                <div>
                    {participants.length > 0 ? (
                        <ul className="space-y-3">
                            {participants.map((participant) => (
                                <li
                                    key={participant.socketId}
                                    className=" text-black rounded-full px-6 py-2 text-2xl font-semibold italic z-50"
                                >
                                    {participant.username}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xl italic">
                            No players have joined yet.
                        </p>
                    )}
                </div>
            </div>
            <div className="h-full items-center justify-center flex flex-col">
                <h1 className="text-5xl font-extrabold text-center italic">
                    THINKr
                </h1>
                <p className="mt-4 text-lg text-center">
                    Waiting for players to join...
                </p>
                <div className="mt-10 flex flex-col items-center gap-4">
                    <p className="text-2xl italic">Game Code</p>
                    <div className="text-4xl tracking-widest font-bold italic bg-accent px-6 py-2 rounded-full">
                        {gameId}
                    </div>
                </div>
                {error && (
                    <p className="text-lg italic text-red-500 text-center mt-4">
                        {error}
                    </p>
                )}
                <Button
                    onClick={handleStartGame}
                    disabled={participants.length === 0}
                    className="absolute bottom-16 py-5 px-10 bg-primary text-foreground font-extrabold border-2 border-primary hover:text-foreground hover:bg-transparent group-hover:bg-accent group-hover:text-background disabled:bg-accent disabled:text-background disabled:border-accent hover:cursor-pointer"
                >
                    START GAME
                </Button>
            </div>
        </div>
    );
};

export default WaitingRoom;
