"use client";
import { use } from "react";
const WaitingRoom = ({ params }: { params: Promise<{ gameId: string }> }) => {
    const { gameId } = use(params);

    return (
        <div className="grid grid-cols-2 items-center justify-center h-screen bg-secondary p-10 gap-4">
            <div className="bg-accent rounded-4xl h-full flex flex-col items-center justify-start p-10 text-3xl font-bold italic">
                Players Joined
            </div>
            <div className="h-full items-center justify-center flex flex-col">
                <h1 className="text-5xl font-extrabold text-center italic">
                    THINKr
                </h1>
                <p className="mt-4 text-lg text-center">
                    Waiting for players to join...
                </p>
                <div className="mt-10 flex flex-col items-center gap-4">
                    <p className="text-2xl italic">Game Code</p>
                    <div className="text-4xl tracking-widest font-bold italic bg-accent px-6 py-2 rounded-full">
                        {gameId}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingRoom;
