const router = require("express").Router();
const quizController = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to create a new quiz and game session
router.post("/create-quiz", authMiddleware, quizController.createQuizAndGame);

module.exports = router;
