// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenAI } from "@google/genai";

// Initialize the Google Generative AI client with your API key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates a quiz using the Google Gemini API.
 * @param {string} theme - The theme of the quiz.
 * @param {number} numQuestions - The number of questions.
 * @param {string} difficulty - The difficulty level (e.g., 'easy', 'medium', 'hard').
 * @returns {Promise<Object>} - A promise that resolves to the generated quiz data.
 */
export async function generateQuiz(theme, numQuestions, difficulty) {
    try {
        // const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const contents = `
      Create a quiz with ${numQuestions} questions about ${theme}.
      The difficulty level should be ${difficulty}.
      For each question, provide 4 multiple-choice options, with one correct answer.
      Return the result as a valid JSON object with the following structure:
      {
        "questions": [
          {
            "questionText": "...",
            "options": ["...", "...", "...", "..."],
            "correctAnswer": "..."
          }
        ]
      }
    `;

        // const result = await model.generateContent(prompt);
        // const response = await result.response;
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
        });
        const text = response.text;

        // Clean up the text to ensure it's valid JSON
        const jsonString = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating quiz with Gemini API:", error);
        throw new Error("Failed to generate quiz.");
    }
}

// module.exports = { generateQuiz };
