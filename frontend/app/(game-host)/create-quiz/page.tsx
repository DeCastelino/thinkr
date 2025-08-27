import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
                    <Select>
                        <SelectTrigger className="rounded-full bg-accent w-[180px]">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg bg-accent">
                            <SelectGroup className="hover:cursor-pointer">
                                <SelectItem
                                    value="easy"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    Easy
                                </SelectItem>
                                <SelectItem
                                    value="medium"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    Medium
                                </SelectItem>
                                <SelectItem
                                    value="hard"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    Hard
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="timePerQuestion" className="italic">
                        Time Per Question
                    </label>
                    <Select>
                        <SelectTrigger className="rounded-full bg-accent w-[180px]">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg bg-accent">
                            <SelectGroup className="hover:cursor-pointer">
                                <SelectItem
                                    value="10"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    10s
                                </SelectItem>
                                <SelectItem
                                    value="30s"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    30s
                                </SelectItem>
                                <SelectItem
                                    value="1min"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    1min
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="numberOfQuestion" className="italic">
                        Number of Questions
                    </label>
                    <Select>
                        <SelectTrigger className="rounded-full bg-accent w-[180px]">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg bg-accent">
                            <SelectGroup className="hover:cursor-pointer">
                                <SelectItem
                                    value="10"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    10
                                </SelectItem>
                                <SelectItem
                                    value="20"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    20
                                </SelectItem>
                                <SelectItem
                                    value="30"
                                    className="hover:cursor-pointer hover:font-bold"
                                >
                                    30
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
