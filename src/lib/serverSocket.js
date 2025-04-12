import {io} from "socket.io-client";

export const handleSocket = (options) => {
    const { type, roomId, userId } = options;

    if (!type || !roomId || !userId) {
        throw new Error("Socket connection requires a type, roomId and userId");
    }

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
    return io(socketUrl, connectionOptions);
};

export const handleSocketEmit = (type, roomId, event, data) => {
    return new Promise((resolve, reject) => {
        console.log("initializing");
        const socketIo = handleSocket({
            type,
            roomId,
            userId: process.env.INTERNAL_WEBSOCKETS_TOKEN,
        });
        console.log("connecting");
        
        // Add timeout for connection
        const connectionTimeout = setTimeout(() => {
            socketIo.disconnect();
            reject(new Error("Connection timeout"));
        }, 5000);
        
        socketIo.on("connect", () => {
            console.log("connected");
            clearTimeout(connectionTimeout);
            try {
                console.log("emitting", data);
                socketIo.emit(event, data);
                setTimeout(() => {
                    socketIo.disconnect();
                    resolve();
                }, 100);
            } catch (error) {
                socketIo.disconnect();
                reject(error);
            }
        });

        socketIo.on("connect_error", (error) => {
            clearTimeout(connectionTimeout);
            socketIo.off("connect");
            socketIo.disconnect();
            console.error("Socket connection error:", error);
            reject(error);
        });
    });
};

// Remove default socket as it should be created with proper params
// Removing this line: export const socket = io(process.env.NEXT_PUBLIC_HOSTNAME || "");
