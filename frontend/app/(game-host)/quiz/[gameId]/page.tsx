import { X } from "lucide-react";
import Leaderboard from "@/components/Leaderboard";
import Timer from "@/components/Timer";

const Quiz = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary p-10 gap-4">
            <div className="absolute top-10 left-10 bg-foreground p-2 outline-none rounded-full shadow-none text-secondary hover:bg-inherit hover:text-foreground hover:border-2 hover:border-foreground hover:cursor-pointer">
                <X size={30} />
            </div>
            <div className="absolute top-10 right-10">
                <Leaderboard />
            </div>
            <div>
                <Timer />
            </div>
            <div>Question 1</div>
            <div>Question</div>
            <div className="grid grid-cols-2 gap-10">
                <div>Answer 1</div>
                <div>Answer 2</div>
                <div>Answer 3</div>
                <div>Answer 4</div>
            </div>
        </div>
    );
};

export default Quiz;
