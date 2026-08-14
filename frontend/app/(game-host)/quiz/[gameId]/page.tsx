"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Leaderboard from "@/components/Leaderboard";
import Timer from "@/components/Timer";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import {
    emit,
    socketEmits,
    socketEvents,
} from "@/app/utils/websockets/events";
import { normalizeParticipants } from "@/app/utils/participants";
import type { Game } from "@/types/game";

type QuestionState =
    | "showing_question"
    | "waiting_for_answer"
    | "showing_result";

const Quiz = () => {
    const params = useParams();
    const gameId = Array.isArray(params.gameId)
        ? params.gameId[0]
        : params.gameId;
    const [game, setGame] = useState<Game | null>(null);
    const [questionState, setQuestionState] =
        useState<QuestionState>("showing_question");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useSocketEvents(
        {
            [socketEvents.gameDataResponse]: (gameData) => {
                console.log("Received game data:", gameData);
                setGame({
                    ...gameData,
                    participants: normalizeParticipants(gameData.participants),
                });
                setQuestionState("showing_question");
                setMessage("");
                setLoading(false);
            },
            [socketEvents.error]: (errorMessage) => {
                setError(errorMessage.message);
                setLoading(false);
            },
            [socketEvents.waitingForAnswer]: (data) => {
                setQuestionState("waiting_for_answer");
                setMessage(`Waiting for ${data.username} to answer...`);
            },
            [socketEvents.answerResultCorrect]: (data) => {
                setQuestionState("showing_result");
                setMessage(`CORRECT! ${data.username} gets 10 points.`);
                setGame((prevGame) =>
                    prevGame
                        ? { ...prevGame, participants: data.participants }
                        : null
                );
            },
            [socketEvents.answerResultIncorrect]: (data) => {
                setQuestionState("showing_result");
                setMessage(
                    `INCORRECT! ${data.username} chose the wrong answer.`
                );
            },
            [socketEvents.questionOverWrong]: () => {
                setQuestionState("showing_result");
                setMessage("No one got the answer! Moving on...");
            },
        },
        {
            enabled: Boolean(gameId),
            onMount: () => {
                console.log(`Requesting game data for ${gameId}`);
                if (gameId) {
                    emit(socketEmits.hostRequestGameData, {
                        gameCode: gameId,
                    });
                }
            },
        }
    );

    const handleNextQuestion = () => {
        if (!game || !gameId) return;
        const newIndex = game.current_question_index + 1;
        if (!game.questions || newIndex >= game.questions.length) {
            alert("End of game!");
            return;
        }
        emit(socketEmits.hostNextQuestion, {
            gameCode: gameId,
            newQuestionIndex: newIndex,
        });
    };

    // Handle loading and error states
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-4">
                <Spinner className="h-12 w-12" />
                <p>Loading Quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-4">
                <h1 className="text-2xl text-destructive">Error: {error}</h1>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-4">
                <h1>Game not found.</h1>
            </div>
        );
    }

    const currentQuestion = game.questions?.[game.current_question_index];

    const renderQuizContent = () => {
        switch (questionState) {
            case "waiting_for_answer":
            case "showing_result":
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold italic">{message}</h2>
                        {questionState === "showing_result" && (
                            <Button
                                onClick={handleNextQuestion}
                                className="mt-8 text-lg p-6 bg-primary"
                            >
                                Next Question
                            </Button>
                        )}
                    </div>
                );
            case "showing_question":
            default:
                return (
                    <>
                        <div>Question {game.current_question_index + 1}</div>
                        <div className="text-2xl font-bold">
                            {currentQuestion
                                ? currentQuestion.questionText
                                : "Waiting for question..."}
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                            {currentQuestion?.options.map((option, index) => (
                                <div
                                    key={index}
                                    className="bg-accent text-accent-foreground p-4 rounded-lg text-lg"
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-4">
            <div className="absolute top-10 left-10 bg-foreground border-2 border-foreground p-2 outline-none rounded-full shadow-none text-secondary hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer">
                <X size={30} />
            </div>
            <div className="absolute top-10 right-10">
                <Leaderboard participants={game.participants} />
            </div>
            <div>
                <Timer duration={game.time_per_question} />
            </div>
            <div>Question {game.current_question_index + 1}</div>
            {renderQuizContent()}
        </div>
    );
};

export default Quiz;
