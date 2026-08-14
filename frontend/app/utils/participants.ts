import type { Participant } from "@/types/game";

export const normalizeParticipants = (
    participants: unknown
): Participant[] => {
    if (!Array.isArray(participants)) return [];
    return participants.map((participant) =>
        typeof participant === "string"
            ? (JSON.parse(participant) as Participant)
            : (participant as Participant)
    );
};
