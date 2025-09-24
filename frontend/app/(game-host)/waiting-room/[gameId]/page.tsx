"use client";
import { use, useEffect, useState } from "react";
import socket from "@/app/utils/websockets/webSockets";
const WaitingRoom = ({ params }: { params: Promise<{ gameId: string }> }) => {
  const { gameId } = use(params);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState<string | null>(null);

  type Participant = {
    socketId: string;
    username: string;
    score: number;
  };

  // This effect hook handles all WebSocket communication
  useEffect(() => {
    // --- SETUP ---
    // 1. Tell the server we are the host for this game room
    // socket.emit("host-join-game", { gameCode: gameId });

    // --- EVENT LISTENERS ---
    // 2. Listen for the initial game state confirmation from the server
    const handleGameJoined = (updatedGame: any) => {
      console.log("Client: Host successfully joined game:", updatedGame);
      // Set the initial list of participants who might already be there
      setParticipants(updatedGame.participants);
    };

    // 3. Listen for REAL-TIME updates to the participant list
    const handleParticipantUpdate = (updatedParticipants: Participant[]) => {
      console.log("Client: Received participant update:", updatedParticipants);
      setParticipants(updatedParticipants);
    };

    // 4. Listen for any errors sent by the server
    const handleError = (errorMessage: string) => {
      console.error("Server error:", errorMessage);
      setError(errorMessage);
    };

    // Attach all the event listeners
    socket.on("game-joined", handleGameJoined);
    socket.on("participant-updated", handleParticipantUpdate);
    socket.on("error", handleError);

    // --- CLEANUP ---
    // This function runs when the component is unmounted (e.g., user navigates away)
    // It's crucial for preventing memory leaks.
    return () => {
      console.log("Cleaning up socket listeners for waiting room");
      // socket.off("game-joined", handleGameJoined);
      // socket.off("participant-updated", handleParticipantUpdate);
      socket.off("error", handleError);
      // You could also emit a "host-left-game" event here if needed
    };
  }, [gameId]);

  return (
    <div className="grid grid-cols-2 items-center justify-center h-screen bg-secondary p-10 gap-4">
      <div className="bg-accent rounded-4xl h-full flex flex-col items-center justify-start p-10 text-3xl font-bold italic">
        Players Joined
        <div>
          {participants.length > 0 ? (
            <ul className="space-y-3">
              {participants.map((participant) => (
                <li
                  key={participant.socketId}
                  className="bg-accent rounded-full px-6 py-2 text-2xl font-semibold italic"
                >
                  {participant.username}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xl italic">No players have joined yet.</p>
          )}
        </div>
      </div>
      <div className="h-full items-center justify-center flex flex-col">
        <h1 className="text-5xl font-extrabold text-center italic">THINKr</h1>
        <p className="mt-4 text-lg text-center">
          Waiting for players to join...
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-2xl italic">Game Code</p>
          <div className="text-4xl tracking-widest font-bold italic bg-accent px-6 py-2 rounded-full">
            {gameId}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
