// Define the Participant type
type Participant = {
    socketId: string;
    username: string;
    score: number;
};

// Define props for the Leaderboard
type LeaderboardProps = {
    participants: Participant[];
};

const Leaderboard = ({ participants = [] }: LeaderboardProps) => {
    // 1. Sort participants by score in descending order
    const sortedParticipants = [...participants].sort(
        (a, b) => b.score - a.score
    );

    return (
        <div className="min-w-[250px] bg-accent text-accent-foreground p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold italic text-center mb-4">
                Leaderboard
            </h3>
            <ul className="space-y-2">
                {sortedParticipants &&
                    sortedParticipants.map((participant, index) => (
                        <li
                            key={participant.socketId}
                            className="flex justify-between items-center text-lg font-medium p-2 rounded-md"
                        >
                            {/* Columns 1 & 2 (Rank & Username) */}
                            <div className="flex items-center gap-3">
                                <span className="font-bold w-6 text-right">
                                    {index + 1}.
                                </span>
                                <span className="italic">
                                    {participant.username}
                                </span>
                            </div>

                            {/* Column 3 (Points) */}
                            <span className="font-bold">
                                {participant.score}
                            </span>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
