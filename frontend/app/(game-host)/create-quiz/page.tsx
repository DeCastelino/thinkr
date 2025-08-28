import { Button } from "@/components/ui/button";
import Dropdown from "@/components/Dropdown";

const CreateQuiz = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10">
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
            />
            <div className="w-2/4 mt-4 flex justify-between gap-4">
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="difficulty" className="italic">
                        Difficulty Level
                    </label>
                    <Dropdown options={["easy", "medium", "hard"]} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="timePerQuestion" className="italic">
                        Time Per Question
                    </label>
                    <Dropdown options={["10s", "30s", "1min"]} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="numberOfQuestion" className="italic">
                        Number of Questions
                    </label>
                    <Dropdown options={["10", "20", "30"]} />
                </div>
            </div>
            <Button
                type="submit"
                className="bg-foreground outline-none shadow-none hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer"
            >
                LOGIN
            </Button>
        </div>
    );
};

export default CreateQuiz;
