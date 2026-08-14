import type { Game, Participant } from "@/types/game";
import socket from "./webSockets";

export type IncomingEventPayloads = {
    "game-joined": Game;
    "participant-updated": Participant[];
    "game-started": undefined;
    "game-data-response": Game;
    "error": { message: string };
    "waiting-for-answer": { username: string };
    "your-turn-to-answer": { options: string[] };
    "answer-result-correct": {
        username: string;
        score: number;
        participants: Participant[];
    };
    "answer-result-incorrect": { username: string };
    "question-over-wrong": undefined;
    "new-question-ready": undefined;
};

export type SocketEventName = keyof IncomingEventPayloads;

export const socketEvents = {
    gameJoined: "game-joined",
    participantUpdated: "participant-updated",
    gameStarted: "game-started",
    gameDataResponse: "game-data-response",
    error: "error",
    waitingForAnswer: "waiting-for-answer",
    yourTurnToAnswer: "your-turn-to-answer",
    answerResultCorrect: "answer-result-correct",
    answerResultIncorrect: "answer-result-incorrect",
    questionOverWrong: "question-over-wrong",
    newQuestionReady: "new-question-ready",
} as const satisfies Record<string, SocketEventName>;

export type SocketEventHandlers = {
    [K in SocketEventName]: (payload: IncomingEventPayloads[K]) => void;
};

export type SocketEventHandlerMap = Partial<SocketEventHandlers>;

export const socketEmits = {
    hostJoinGame: "host-join-game",
    hostStartGame: "host-start-game",
    hostRequestGameData: "host-request-game-data",
    hostNextQuestion: "host-next-question",
    ensureInRoom: "ensure-in-room",
    participantJoinGame: "participant-join-game",
    participantBuzz: "participant-buzz",
    participantSubmitAnswer: "participant-submit-answer",
} as const;

export type OutgoingEventPayloads = {
    "host-join-game": { gameCode: string };
    "host-start-game": { gameCode: string };
    "host-request-game-data": { gameCode: string };
    "host-next-question": { gameCode: string; newQuestionIndex: number };
    "ensure-in-room": { gameCode: string };
    "participant-join-game": { gameCode: string; username: string };
    "participant-buzz": { gameCode: string };
    "participant-submit-answer": { gameCode: string; answer: string };
};

export type OutgoingEventName = keyof OutgoingEventPayloads;

export const emit = <K extends OutgoingEventName>(
    event: K,
    payload: OutgoingEventPayloads[K]
): void => {
    socket.emit(event, payload);
};
