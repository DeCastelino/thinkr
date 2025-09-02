"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/Dropdown";

const CreateQuiz = () => {
    const [quizTheme, setQuizTheme] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [timePerQuestion, setTimePerQuestion] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("");

    // Options for the dropdowns
    const difficultyOptions = ["easy", "medium", "hard"];
    const timeOptions = ["10s", "30s", "1min"];
    const numberOfQuestionsOptions = ["10", "20", "30"];

    const handleSubmit = () => {
        axios
            .post("/api/create-quiz", {
                quizTheme,
                difficulty,
                timePerQuestion,
                numberOfQuestions,
            })
            .then((response) => {
                console.log("Quiz created successfully:", response.data);
                // Handle success (e.g., navigate to the quiz page)
            })
            .catch((error) => {
                console.error("Error creating quiz:", error);
            });
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
                        placeholder="Select"
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
