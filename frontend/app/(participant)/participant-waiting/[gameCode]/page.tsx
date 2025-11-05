"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import socket from "@/app/utils/websockets/webSockets";
import { Spinner } from "@/components/ui/spinner";

const ParticipantWaitingRoom = ({
    params,
}: {
    params: { gameCode: string };
}) => {
    const router = useRouter();
    const { gameCode } = params;

    useEffect(() => {
        // Ensure the socket is connected
        if (!socket.connected) {
            socket.connect();
        }

        // Define the event handler for when the host starts the game
        const handleGameStarted = () => {
            console.log("Game is starting! Navigating to buzzer...");
            // Navigate to the buzzer page for this game
            router.push(`/buzzer/${gameCode}`);
        };

        // Listen for the 'game-started' event from the server
        socket.on("game-started", handleGameStarted);

        // Clean up the listener when the component unmounts
        return () => {
            console.log("Cleaning up 'game-started' listener.");
            socket.off("game-started", handleGameStarted);
        };
    }, [gameCode, router]); // Re-run if gameCode or router changes

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-6 text-center">
            {/* Title, styled to match your other pages */}
            <h1 className="text-5xl font-extrabold text-foreground italic">
                THINKr
            </h1>

            {/* Main status message */}
            <h2 className="text-4xl font-bold text-primary italic">
                You're in!
            </h2>

            {/* Reassuring sub-message with spinner */}
            <div className="flex items-center gap-4 text-xl text-muted-foreground">
                <Spinner className="h-6 w-6" />
                <span>Waiting for the host to start the game...</span>
            </div>
        </div>
    );
};

export default ParticipantWaitingRoom;
