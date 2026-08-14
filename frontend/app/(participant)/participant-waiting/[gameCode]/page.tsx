"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import {
    emit,
    socketEmits,
    socketEvents,
} from "@/app/utils/websockets/events";

const ParticipantWaitingRoom = ({
    params,
}: {
    params: Promise<{ gameCode: string }>;
}) => {
    const router = useRouter();
    const { gameCode } = use(params);

    useSocketEvents(
        {
            [socketEvents.gameStarted]: () => {
                console.log("Game is starting! Navigating to buzzer...");
                router.push(`/buzzer/${gameCode}`);
            },
        },
        {
            onMount: () => emit(socketEmits.ensureInRoom, { gameCode }),
        }
    );

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-6 text-center">
            {/* Title, styled to match your other pages */}
            <h1 className="text-5xl font-extrabold text-foreground italic">
                THINKr
            </h1>

            {/* Main status message */}
            <h2 className="text-4xl font-bold text-primary italic">
                You&apos;re in!
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
