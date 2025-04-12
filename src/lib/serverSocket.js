import {io} from "socket.io-client";

export const handleSocket = (options) => {
    const { type, roomId, token } = options;

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
            ...(token && { token }),
        },
    };

    return io("127.0.0.1", connectionOptions);
};

export const handleSocketEmit = (type, roomId, event, data) => {
    return new Promise((resolve, reject) => {
        console.log("initializing");
        const socketIo = handleSocket({
            type,
            roomId,
            token: process.env.INTERNAL_WEBSOCKETS_TOKEN,
        });
        console.log("connecting");
        socketIo.on("connect", () => {
            console.log("connected");
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
            socketIo.off("connect");
            socketIo.disconnect();
            reject(error);
        });
    });
};

export const socket = io("127.0.0.1");
