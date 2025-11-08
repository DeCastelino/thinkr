"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import socket from "@/app/utils/websockets/webSockets";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Buzzer from "@/components/Buzzer"; // We'll keep your Buzzer component for the view

const BuzzerPage = () => {
    const params = useParams();
    const router = useRouter();
    const gameCode = params.gameId as string;

    // 'buzzer' = Can buzz
    // 'waiting' = Buzzed, waiting for turn or result
    // 'answering' = Your turn to answer
    const [view, setView] = useState<"buzzer" | "waiting" | "answering">(
        "waiting"
    );
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        if (!gameCode) return;

        if (!socket.connected) {
            socket.connect();
        }

        // Re-join room on load/refresh
        socket.emit("ensure-in-room", { gameCode });

        // --- SOCKET LISTENERS ---
        const onNewQuestion = () => {
            console.log("New question, buzzer is active.");
            setView("buzzer");
        };

        const onYourTurn = (data: { options: string[] }) => {
            console.log("It's my turn to answer!");
            setOptions(data.options);
            setView("answering");
        };

        const onResult = () => {
            // After any result, correct or incorrect, wait for next question
            setView("waiting");
        };

        socket.on("new-question-ready", onNewQuestion);
        socket.on("your-turn-to-answer", onYourTurn);
        socket.on("answer-result-correct", onResult);
        socket.on("answer-result-incorrect", onResult); // You still wait
        socket.on("question-over-wrong", onResult); // Everyone was wrong

        return () => {
            socket.off("new-question-ready", onNewQuestion);
            socket.off("your-turn-to-answer", onYourTurn);
            socket.off("answer-result-correct", onResult);
            socket.off("answer-result-incorrect", onResult);
            socket.off("question-over-wrong", onResult);
        };
    }, [gameCode]);

    const handleBuzz = () => {
        console.log("Buzzing in!");
        socket.emit("participant-buzz", { gameCode });
        setView("waiting");
    };

    const handleAnswerSubmit = (answer: string) => {
        console.log(`Submitting answer: ${answer}`);
        socket.emit("participant-submit-answer", { gameCode, answer });
        setView("waiting");
    };

    // --- RENDER LOGIC ---
    const renderContent = () => {
        switch (view) {
            case "buzzer":
                return (
                    <div onClick={handleBuzz}>
                        <Buzzer />
                    </div>
                );
            case "answering":
                return (
                    <div className="flex flex-col items-center gap-4 w-full max-w-md">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Your Turn!
                        </h2>
                        {options.map((option, index) => (
                            <Button
                                key={index}
                                onClick={() => handleAnswerSubmit(option)}
                                className="w-full text-lg p-6 bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                );
            case "waiting":
            default:
                return (
                    <div className="flex flex-col items-center gap-4 text-xl text-muted-foreground">
                        <Spinner className="h-10 w-10" />
                        <span>Get Ready...</span>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10">
            {renderContent()}
        </div>
    );
};

export default BuzzerPage;
