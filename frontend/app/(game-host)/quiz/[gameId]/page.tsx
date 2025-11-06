"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Leaderboard from "@/components/Leaderboard";
import Timer from "@/components/Timer";
import socket from "@/app/utils/websockets/webSockets";
import { Spinner } from "@/components/ui/spinner";
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

const Quiz = () => {
    const params = useParams();
    const gameId = Array.isArray(params.gameId)
        ? params.gameId[0]
        : params.gameId;
    const [game, setGame] = useState<Game | null>(null);
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

        socket.on("game-data-response", handleGameData);
        socket.on("error", handleError);
        socket.emit("host-request-game-data", { gameCode: gameId });

        // Cleanup on unmount
        return () => {
            socket.off("game-data", handleGameData);
            socket.off("error", handleError);
        };
    }, [gameId]);

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
            <div>
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
        </div>
    );
};

export default Quiz;
