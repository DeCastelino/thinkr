"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/app/utils/websockets/webSockets";
import { Button } from "@/components/ui/button";
const WaitingRoom = ({ params }: { params: Promise<{ gameId: string }> }) => {
    const { gameId } = use(params);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    type Participant = {
        socketId: string;
        username: string;
        score: number;
    };

    // This effect hook handles all WebSocket communication
    useEffect(() => {
        // --- SETUP ---
        // 1. Tell the server we are the host for this game room
        socket.emit("host-join-game", { gameCode: gameId });

        // --- EVENT LISTENERS ---
        // 2. Listen for the initial game state confirmation from the server
        const handleGameJoined = (updatedGame: any) => {
            console.log("Client: Host successfully joined game:", updatedGame);
            // Set the initial list of participants who might already be there
            const participantsAsObjects = (updatedGame.participants || []).map(
                (p: any) => (typeof p === "string" ? JSON.parse(p) : p)
            );
            setParticipants(participantsAsObjects);
        };

        // 3. Listen for REAL-TIME updates to the participant list
        const handleParticipantUpdate = (
            updatedParticipants: Participant[]
        ) => {
            console.log(
                "Client: Received participant update:",
                updatedParticipants
            );
            const participantsAsObjects = (updatedParticipants || []).map(
                (p: any) => (typeof p === "string" ? JSON.parse(p) : p)
            );
            setParticipants(participantsAsObjects);
        };

        // 4. Listen for any errors sent by the server
        const handleError = (errorMessage: string) => {
            console.error("Server error:", errorMessage);
            setError(errorMessage);
        };

        const handleGameStarted = () => {
            router.push(`/quiz/${gameId}`);
        };

        // Attach all the event listeners
        socket.on("game-joined", handleGameJoined);
        socket.on("participant-updated", handleParticipantUpdate);
        socket.on("game-started", handleGameStarted);
        socket.on("error", handleError);

        // --- CLEANUP ---
        // This function runs when the component is unmounted (e.g., user navigates away)
        // It's crucial for preventing memory leaks.
        return () => {
            console.log("Cleaning up socket listeners for waiting room");
            socket.off("game-joined", handleGameJoined);
            socket.off("participant-updated", handleParticipantUpdate);
            socket.off("error", handleError);
            // You could also emit a "host-left-game" event here if needed
        };
    }, [gameId, router]);

    const handleStartGame = () => {
        // Emit the start-game event to the server
        socket.emit("host-start-game", { gameCode: gameId });
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
