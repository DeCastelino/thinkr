import { io } from "socket.io-client";

// Initialize the socket connection to your backend server
const URL = "http://localhost:8080";
const socket = io(URL, {
    autoConnect: false, // We will connect manually when needed
});

export default socket;
