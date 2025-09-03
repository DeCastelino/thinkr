const { generateQuiz } = require("../services/gemini");
// const { supabase } = require("../services/supabase");
const { nanoid } = require("nanoid");

exports.createQuizAndGame = async (req, res) => {
    const { supabase, user } = req;
    const { quizTheme, numberOfQuestions, difficulty, timePerQuestion } =
        req.body;

    if (!quizTheme || !numberOfQuestions || !difficulty || !timePerQuestion) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        // 1. Generate quiz questions using Gemini API
        const quizData = await generateQuiz(
            quizTheme,
            numberOfQuestions,
            difficulty
        );
        console.log("User ID:", user);

        // 2. Save the generated quiz to the 'quizzes' table in supabase
        const { data: savedQuiz, error: quizError } = await supabase
            .from("quizzes")
            .insert([
                {
                    title: quizTheme,
                    questions: quizData.questions,
                    difficulty: difficulty,
                    user_id: user.id,
                },
            ])
            .select()
            .single();

        if (quizError) throw quizError;

        // 3. Create a new game session in the 'games' table
        const gameCode = nanoid(6).toUpperCase();
        const { data: newGame, error: gameError } = await supabase
            .from("games")
            .insert([
                {
                    game_code: gameCode,
                    quiz_id: savedQuiz.id,
                    host_id: null,
                    game_state: "waiting",
                    time_per_question: timePerQuestion,
                    participants: [],
                    leaderboard: [],
                    current_question_index: 0,
                    user_id: user.id,
                },
            ])
            .select()
            .single();

        if (gameError) throw gameError;
        console.log("New Game Created:", newGame);

        // Return the game code to the host
        res.status(201).json({ gameCode: newGame.game_code });
    } catch (error) {
        console.error("Error creating quiz and game session:", error);
        res.status(500).json({
            error: "Failed to create quiz and game session",
        });
    }
};
