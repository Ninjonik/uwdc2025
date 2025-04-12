"use client";

import {io} from "socket.io-client";

export const handleSocket = (options) => {
    const { type, roomId, userId } = options;

    if (!type || !roomId) {
        throw new Error("Socket connection requires a type and roomId");
    }

    const connectionOptions = {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: {
            type,
            roomId: roomId.toString(),
            ...(token && { userId }),
        },
    };

    return io(process.env.NEXT_PUBLIC_HOSTNAME || "", connectionOptions);
};

export const socket = io(process.env.NEXT_PUBLIC_HOSTNAME || "");
