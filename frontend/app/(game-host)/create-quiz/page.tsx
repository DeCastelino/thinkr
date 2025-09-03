"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/Dropdown";
import { createClient } from "@/app/utils/supabase/client";
import socket from "@/app/utils/websockets/webSockets";

const CreateQuiz = () => {
    const router = useRouter();
    const [quizTheme, setQuizTheme] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [timePerQuestion, setTimePerQuestion] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("");

    // Options for the dropdowns
    const difficultyOptions = ["easy", "medium", "hard"];
    const timeOptions = ["10", "30", "60"];
    const numberOfQuestionsOptions = ["10", "20", "30"];

    const handleSubmit = async () => {
        try {
            // Get the session to ensure the user is authenticated
            const {
                data: { session },
            } = await createClient().auth.getSession();

            if (!session) {
                throw new Error("User not authenticated");
            }

            axios
                .post(
                    "http://localhost:8080/api/quiz/create-quiz",
                    {
                        quizTheme,
                        difficulty,
                        timePerQuestion,
                        numberOfQuestions,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                )
                .then((response) => {
                    socket.connect(); // Manually connect the socket
                    socket.emit("host-join-game", {
                        gameCode: response.data.gameCode,
                    });
                    router.push(`/waiting-room/${response.data.gameCode}`);
                    // Handle success (e.g., navigate to the quiz page)
                })
                .catch((error) => {
                    console.error("Error creating quiz:", error);
                });
        } catch (error: any) {
            console.error("Error creating quiz:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-4">
            <h1 className="text-5xl font-extrabold text-center italic">
                THINKr
            </h1>
            <p className="mt-4 text-lg text-center">
                Create your quiz and host a fun game!
            </p>
            <input
                type="text"
                className="mt-4 p-2 rounded-full bg-accent w-3/4 italic outline-none focus:ring-2 focus:ring-black/50"
                placeholder="Enter the theme of your quiz i.e. General Knowledge about Cars..."
                onChange={(e) => setQuizTheme(e.target.value)}
                required
            />
            <div className="w-2/4 mt-4 flex justify-between gap-4">
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="difficulty" className="italic">
                        Difficulty Level
                    </label>
                    <Dropdown
                        options={difficultyOptions}
                        placeholder="Select"
                        value={difficulty}
                        onValueChange={setDifficulty}
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="timePerQuestion" className="italic">
                        Time Per Question
                    </label>
                    <Dropdown
                        options={timeOptions}
                        placeholder="Select (in seconds)"
                        value={timePerQuestion}
                        onValueChange={setTimePerQuestion}
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="numberOfQuestion" className="italic">
                        Number of Questions
                    </label>
                    <Dropdown
                        options={numberOfQuestionsOptions}
                        placeholder="Select"
                        value={numberOfQuestions}
                        onValueChange={setNumberOfQuestions}
                    />
                </div>
            </div>
            <Button
                type="submit"
                onClick={handleSubmit}
                className="bg-foreground outline-none mt-20 w-[180px] rounded-full shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer"
            >
                LOGIN
            </Button>
        </div>
    );
};

export default CreateQuiz;
