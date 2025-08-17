require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const gameSockets = require("./sockets/gameSockets");
// Custom Imports
const routes = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("./public"));

app.use("/", routes);

const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Listen for new connections
io.on("connection", (socket) => {
    console.log("New client connected with socker id: ", socket.id);

    // --- Game logic event listeners will go here ---//

    socket.on("disconnect", () => {
        console.log("Client disconnected with socket id: ", socket.id);
    });
});

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
