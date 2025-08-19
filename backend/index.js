const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Import the function from gameSocket.js
const initializeSocketIO = require("./sockets/gameSockets");
// Import your API routes
const quizRoutes = require("./routes/routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/quiz", quizRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // For development, allow all origins.
        methods: ["GET", "POST"],
    },
});
// Call the function and pass the 'io' instance.
initializeSocketIO(io);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
