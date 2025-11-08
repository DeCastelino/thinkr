"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Leaderboard from "@/components/Leaderboard";
import Timer from "@/components/Timer";
import socket from "@/app/utils/websockets/webSockets";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

type Question = {
    questionText: string;
    options: string[];
    correctAnswer: string;
};

type Game = {
    id: string;
    game_code: string;
    quiz_id: string;
    host_id: string;
    gmae_state: "waiting" | "in-progress" | "completed";
    time_per_question: number;
    participants: any[];
    leaderboard: any[];
    current_question_index: number;
    questions: Question[];
};

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

    // Connect to socket and get game data
    useEffect(() => {
        if (!gameId || !socket) return;

        if (!socket.connected) socket.connect();

        const handleGameData = (gameData: Game) => {
            console.log("Received game data:", gameData);
            // Ensure participants are objects, not strings
            const participantsAsObjects = (gameData.participants || []).map(
                (p: any) => (typeof p === "string" ? JSON.parse(p) : p)
            );
            setGame({ ...gameData, participants: participantsAsObjects });
            setLoading(false);
        };

        const handleError = (errorMessage: string) => {
            setError(errorMessage);
            setLoading(false);
        };

        const onWaiting = (data: { username: string }) => {
            setQuestionState("waiting_for_answer");
            setMessage(`Waiting for ${data.username} to answer...`);
        };
        const onCorrect = (data: {
            username: string;
            score: number;
            participants: any[];
        }) => {
            setQuestionState("showing_result");
            setMessage(`CORRECT! ${data.username} gets 10 points.`);
            // Update participants in game state for leaderboard
            setGame((prevGame) =>
                prevGame
                    ? { ...prevGame, participants: data.participants }
                    : null
            );
        };

        const onIncorrect = (data: { username: string }) => {
            setQuestionState("showing_result"); // Still showing a result
            setMessage(`INCORRECT! ${data.username} chose the wrong answer.`);
        };

        const onAllWrong = () => {
            setQuestionState("showing_result");
            setMessage("No one got the answer! Moving on...");
        };

        // Attach listeners
        socket.on("game-data-response", handleGameData);
        socket.on("error", handleError);
        socket.on("waiting-for-answer", onWaiting);
        socket.on("answer-result-correct", onCorrect);
        socket.on("answer-result-incorrect", onIncorrect);
        socket.on("question-over-wrong", onAllWrong);

        // Request game data on load
        console.log(`Requesting game data for ${gameId}`);
        socket.emit("host-request-game-data", { gameCode: gameId });

        // Cleanup on unmount
        return () => {
            socket.off("game-data-response", handleGameData);
            socket.off("error", handleError);
            socket.off("waiting-for-answer", onWaiting);
            socket.off("answer-result-correct", onCorrect);
            socket.off("answer-result-incorrect", onIncorrect);
            socket.off("question-over-wrong", onAllWrong);
        };
    }, [gameId]);

    const handleNextQuestion = () => {
        if (!game) return;
        const newIndex = game.current_question_index + 1;
        if (newIndex >= game.questions.length) {
            // End of game logic
            alert("End of game!");
            return;
        }
        // Tell server to move to next question
        socket.emit("host-next-question", {
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
