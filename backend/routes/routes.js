const router = require("express").Router();
const quizController = require("../controllers/quizController");

// Route to create a new quiz and game session
router.post("/create-quiz", quizController.createQuizAndGame);

module.exports = router;
