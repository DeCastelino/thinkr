"use client";

import { useEffect, useRef } from "react";
import socket from "@/app/utils/websockets/webSockets";
import type {
    SocketEventHandlerMap,
    SocketEventName,
} from "@/app/utils/websockets/events";

type UseSocketEventsOptions = {
    enabled?: boolean;
    onMount?: () => void;
};

export const useSocketEvents = (
    handlers: SocketEventHandlerMap,
    { enabled = true, onMount }: UseSocketEventsOptions = {}
) => {
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    const onMountRef = useRef(onMount);
    onMountRef.current = onMount;

    useEffect(() => {
        if (!enabled) return;

        if (!socket.connected) socket.connect();

        const events = Object.keys(handlersRef.current) as SocketEventName[];
        const listeners: {
            event: SocketEventName;
            listener: (...args: unknown[]) => void;
        }[] = [];

        for (const event of events) {
            const handler = handlersRef.current[event];
            if (handler) {
                listeners.push({
                    event,
                    listener: handler as (...args: unknown[]) => void,
                });
            }
        }

        for (const { event, listener } of listeners) {
            socket.on(event, listener);
        }

        onMountRef.current?.();

        return () => {
            for (const { event, listener } of listeners) {
                socket.off(event, listener);
            }
        };
    }, [enabled]);
};
