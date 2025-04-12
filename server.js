import {createServer} from "node:http";
import {Server as SocketServer} from "socket.io";
import next from "next";
import {PrismaClient} from "./generated/prisma/client.js";

// Authentication Service
class AuthenticationService {
    static async authenticateSocket(socket, options) {
        const userId = socket.handshake.query.userId;

        if (userId === process.env.INTERNAL_WEBSOCKETS_TOKEN) {
            return -10;
        }

        if (!userId) {
            console.error("No token provided");
            return false;
        }

        try {
            if (options?.additionalValidation) {
                const additionalValidationResult =
                    await options.additionalValidation(userId);
                if (!additionalValidationResult) {
                    console.error("Additional validation failed");
                    return false;
                }
            }

            return userId;
        } catch (error) {
            console.error("Authentication error", error);
            return false;
        }
    }
}

// Base class
class BaseSocketHandler {
    constructor(io, prisma) {
        this.io = io;
        this.prisma = prisma;
    }

    async validateRoomAccess(socket, roomId) {
        return socket.userId !== undefined;
    }

    registerHandlers(socket) {
        throw new Error("registerHandlers must be implemented in subclasses");
    }
}

// Factory to create socket handlers
class SocketHandlerFactory {
    static createHandler(type, io, prisma) {
        switch (type) {
            case "chat":
                return new ChatSocketHandler(io, prisma);
            case "project":
                return new ProjectSocketHandler(io, prisma);
            default:
                throw new Error(`Unsupported socket handler type: ${type}`);
        }
    }
}

// Chat-specific Handler
class ChatSocketHandler extends BaseSocketHandler {
    async validateRoomAccess(socket, roomId) {
        if (!socket.userId) return false;

        if (socket.userId === -10) {
            return true;
        }

        // Handle client user check in the future

        return false;
    }

    registerHandlers(socket) {
        socket.on("sendMessage", async ({ message }) => {
            if (!socket.userId) {
                console.error("Unauthorized: No user attached to socket");
                return;
            }

            const parsedMessage = JSON.parse(message);
            const chatId = parsedMessage.chatId;

            const chatCheck = await this.prisma.chat.findFirst({
                where: {
                    id: chatId,
                    OR: [
                        { firstUserId: socket.userId },
                        { secondUserId: socket.userId },
                    ],
                },
            });

            if (!chatCheck) {
                console.error(`Unauthorized chat access: ${chatId}`);
                return;
            }

            this.io.to(chatId.toString()).emit("newMessage", message);
        });

        socket.on("sendEditTicket", async ({ ticket }) => {
            if (!socket.userId) {
                console.error("Unauthorized: No user attached to socket");
                return;
            }

            const parsedTicket = JSON.parse(ticket);
            const chatId = parsedTicket.id;

            if (socket.userId !== -10) {
                const chatCheck = await this.prisma.chat.findFirst({
                    where: {
                        id: chatId,
                        OR: [
                            { firstUserId: socket.userId },
                            { secondUserId: socket.userId },
                        ],
                    },
                });

                if (!chatCheck) {
                    console.error(`Unauthorized ticket edit: ${chatId}`);
                    return;
                }
            }

            this.io.to(chatId.toString()).emit("editTicket", ticket);
        });
    }
}

// Socket Server Configuration
class SocketServerConfig {
    constructor(prisma, dev = process.env.NODE_ENV !== "production") {
        this.prisma = prisma;
        this.dev = dev;
        this.hostname =
            process.env.NEXT_PUBLIC_HOST ?? (dev ? "localhost" : "0.0.0.0");
        this.port = dev ? 3000 : 80;
    }

    async initializeServer() {
        console.log(`STARTING SERVER | DEV: ${this.dev} | HOST: ${this.hostname} | PORT: ${this.port}`);
        if (this.dev) process.env.TURBOPACK = "1";

        const app = next({
            dev: this.dev,
            hostname: this.hostname,
            port: this.port,
        });
        const handler = app.getRequestHandler();

        await app.prepare();

        const httpServer = createServer(handler);
        const io = new SocketServer(httpServer);

        io.use(async (socket, next) => {
            try {
                const decoded = await AuthenticationService.authenticateSocket(socket);
                if (decoded) {
                    socket.userId = decoded;
                    next();
                } else {
                    const err = new Error("Authentication error");
                    next(err);
                }
            } catch (error) {
                console.error("Middleware authentication error", error);
                const err = new Error("Authentication error");
                next(err);
            }
        });

        io.on("connection", async (socket) => {
            const connectionType = socket.handshake.query.type;
            const roomId = parseInt(socket.handshake.query.roomId);

            try {
                const handler = SocketHandlerFactory.createHandler(
                    connectionType,
                    io,
                    this.prisma,
                );

                if (roomId && socket.userId !== -10) {
                    const hasRoomAccess = await handler.validateRoomAccess(
                        socket,
                        roomId,
                    );

                    if (!hasRoomAccess) {
                        console.error(`Unauthorized room access: ${roomId}`);
                        socket.disconnect(true);
                        return;
                    }
                }

                handler.registerHandlers(socket);

                if (roomId) {
                    socket.join(roomId.toString());
                }

                console.log(`User ${socket.userId} connected to ${connectionType}`);
            } catch (error) {
                console.error(`Error setting up socket handler: ${error}`);
                socket.disconnect(true);
            }

            socket.on("disconnect", () => {
                console.log(
                    `User ${socket.userId} disconnected from ${connectionType}`,
                );
            });
        });

        httpServer
            .once("error", (err) => {
                console.error(err);
                process.exit(1);
            })
            .listen(this.port, () => {
                console.log(`> Ready on http://${this.hostname}:${this.port}`);
            });
    }
}

const prismaClientSingleton = () => {
    return new PrismaClient();
};

const prisma = globalThis.prismaGlobal
    ? globalThis.prismaGlobal
    : prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

const serverConfig = new SocketServerConfig(prisma);
serverConfig.initializeServer();