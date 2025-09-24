"use client";
import { X } from "lucide-react";
import { use, useEffect, useState } from "react";
import Timer from "@/components/Timer";
import { createClient } from "@/app/utils/supabase/client";

type Question = {
    id: string;
    question_text: string;
    answer_options: string[];
    correct_answer: string;
};

const Quiz = ({ params }: { params: Promise<{ quizId: string }> }) => {
    const { quizId } = use(params);
    const questionBank: Question[] = [];
    // const []

    const fetchGameData = async () => {
        try {
            const supabase = createClient();
            let { data, error } = await supabase
                .from("games")
                .select(`quizzes (questions)`)
                .eq("game_code", quizId)
                .single();

            questionBank = data?.quizzes.questions;
            console.log("Fetched game data:", questionBank);
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    };

    const handleQuizTimerComplete = () => {};

    useEffect(() => {
        fetchGameData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-4">
            <div className="absolute top-10 left-10 bg-foreground p-2 outline-none rounded-full shadow-none text-secondary hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer">
                <X size={30} />
            </div>
            <div>
                <Timer
                    initialMinutes={5} // 10 seconds for testing
                    onComplete={handleQuizTimerComplete}
                />
            </div>
            {questionBank?.map((q, index) => (
                <>
                    <div>Question {index + 1}</div>
                    <div>{q.question_text}</div>
                    <div className="grid grid-cols-2 gap-10">
                        <div>{q.answer_options[0]}</div>
                        <div>{q.answer_options[1]}</div>
                        <div>{q.answer_options[2]}</div>
                        <div>{q.answer_options[3]}</div>
                    </div>
                </>
            ))}
        </div>
    );
};

export default Quiz;
