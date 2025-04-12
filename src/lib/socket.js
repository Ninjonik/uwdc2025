"use client";

import {io} from "socket.io-client";

export const handleSocket = (options) => {
    const { type, roomId, userId } = options;

    if (!type || !roomId || !userId) {
        throw new Error("Socket connection requires a type, roomId and userId");
    }

    console.log("CONNECTING:", type, roomId, userId);

    const connectionOptions = {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: {
            type,
            roomId: roomId.toString(),
            userId: userId.toString(),
        },
        transports: ['websocket', 'polling'],
    };

    const socketUrl = process.env.NEXT_PUBLIC_HOSTNAME || "http://localhost:3000";
    const socketInstance = io(socketUrl, connectionOptions);
    
    // Add error handling
    socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });
    
    return socketInstance;
};