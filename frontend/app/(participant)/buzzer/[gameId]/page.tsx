"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import {
    emit,
    socketEmits,
    socketEvents,
} from "@/app/utils/websockets/events";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Buzzer from "@/components/Buzzer";

const BuzzerPage = () => {
    const params = useParams();
    const gameCode = params.gameId as string;

    // 'buzzer' = Can buzz
    // 'waiting' = Buzzed, waiting for turn or result
    // 'answering' = Your turn to answer
    const [view, setView] = useState<"buzzer" | "waiting" | "answering">(
        "waiting"
    );
    const [options, setOptions] = useState<string[]>([]);

    useSocketEvents(
        {
            [socketEvents.newQuestionReady]: () => {
                console.log("New question, buzzer is active.");
                setView("buzzer");
            },
            [socketEvents.yourTurnToAnswer]: (data) => {
                console.log("It's my turn to answer!");
                setOptions(data.options);
                setView("answering");
            },
            [socketEvents.answerResultCorrect]: () => setView("waiting"),
            [socketEvents.answerResultIncorrect]: () => setView("waiting"),
            [socketEvents.questionOverWrong]: () => setView("waiting"),
        },
        {
            enabled: Boolean(gameCode),
            onMount: () => emit(socketEmits.ensureInRoom, { gameCode }),
        }
    );

    const handleBuzz = () => {
        console.log("Buzzing in!");
        emit(socketEmits.participantBuzz, { gameCode });
        setView("waiting");
    };

    const handleAnswerSubmit = (answer: string) => {
        console.log(`Submitting answer: ${answer}`);
        emit(socketEmits.participantSubmitAnswer, { gameCode, answer });
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
