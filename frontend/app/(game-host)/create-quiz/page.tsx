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
            <div></div>
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
