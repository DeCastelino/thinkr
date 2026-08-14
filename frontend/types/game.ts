export type Participant = {
    socketId: string;
    username: string;
    score: number;
};

export type Question = {
    questionText: string;
    options: string[];
    correctAnswer: string;
};

export type Game = {
    id: string;
    game_code: string;
    quiz_id: string;
    host_id: string | null;
    game_state: string;
    time_per_question: number;
    participants: Participant[];
    leaderboard: unknown[];
    current_question_index: number;
    questions?: Question[];
    created_at?: string;
    user_id?: string;
    title?: string;
    difficulty?: string;
};
