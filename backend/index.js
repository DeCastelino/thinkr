const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// --- 1. IMPORT YOUR MODULES ---
// Import the function from gameSocket.js
const initializeSocketIO = require("./sockets/gameSockets");
// Import your API routes
const quizRoutes = require("./routes/routes");

// --- 2. INITIALIZE EXPRESS APP ---
const app = express();
app.use(cors());
app.use(express.json());

// --- 3. DEFINE API ROUTES ---
app.use("/api/quiz", quizRoutes);

// --- 4. CREATE HTTP SERVER ---
const server = http.createServer(app);

// --- 5. INITIALIZE SOCKET.IO SERVER ---
const io = new Server(server, {
    cors: {
        origin: "*", // For development, allow all origins.
        methods: ["GET", "POST"],
    },
});

// --- 6. ATTACH SOCKET.IO LOGIC ---
// This is the crucial step. Call the function and pass the 'io' instance.
initializeSocketIO(io);

// --- 7. START THE SERVER ---
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
