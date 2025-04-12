import {createServer} from "node:http";
import {Server as SocketServer} from "socket.io";
import next from "next";
import {PrismaClient} from "./generated/prisma/client.js";

const getCommunityBySlug = async (slug) => {
    return prisma.community.findUnique({
        where: {
            id: slug,
        },
        include: {
            users: true,
            activities: true,
            exercises: true,
            currentActivity: {
                include: {
                    exercise: true,
                    completions: {
                        include: {
                            user: true,
                        },
                        orderBy: {
                            reaction: 'asc',
                        }
                    },
                }
            },
        }
    });
}

// Authentication Service
class AuthenticationService {
    static async authenticateSocket(socket, options) {
        const userId = socket.handshake.query.userId;

        if (userId === process.env.INTERNAL_WEBSOCKETS_TOKEN) {
            console.log("Internal token provided");
            return -10;
        }

        if (!userId) {
            console.error("No userId provided", userId, socket.handshake.query);
            return false;
        }

        try {
            if (options?.additionalValidation) {
                const additionalValidationResult =
                    await options.additionalValidation(userId);
                if (!additionalValidationResult) {
                    console.error("Additional validation failed");
                    console.log("Disconnecting socket");
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
            case "community":
                return new CommunitySocketHandler(io, prisma);
            default:
                throw new Error(`Unsupported socket handler type: ${type}`);
        }
    }
}

// Chat-specific Handler
class CommunitySocketHandler extends BaseSocketHandler {
    async validateRoomAccess(socket, roomId) {
        if (!socket.userId) {
            console.error("Unauthorized: No user attached to socket");
            return false
        }

        if (socket.userId === -10) {
            console.log("Internal token provided");
            return true;
        }

        const communityCheck = await this.prisma.community.findFirst({
            where: {
                id: roomId,
                users: {
                    some: {
                        id: socket.userId,
                    }
                }
            }
        })

        if (communityCheck)
            return true;

        console.error(`Unauthorized room access: ${roomId}`);
        return false;
    }

    registerHandlers(socket) {
        socket.on("sendCompletionUpdate", async ({ newActivityCompletion }) => {
            console.log("GOT NEW COMPLETION UPDATE", newActivityCompletion)

            if (!socket.userId) {
                console.error("Unauthorized: No user attached to socket");
                return;
            }

            if(socket.userId !== -10){
                console.error("Unauthorized: This user is not allowed to send completion updates");
                return;
            }

            const parsedData = JSON.parse(newActivityCompletion);
            const id = parsedData.activity.communityId;

            const newCommunityData = await getCommunityBySlug(id);

            console.log(`SENDING NEW COMPLETION UPDATE TO ROOM ${id}`)
            this.io.to(id).emit("completionUpdate", newCommunityData);
        });

        socket.on("sendCommunityUpdate", async ({ data }) => {
            console.log("GOT NEW COMMUNITY UPDATE", data)

            if (!socket.userId) {
                console.error("Unauthorized: No user attached to socket");
                return;
            }

            if(socket.userId !== -10){
                console.error("Unauthorized: This user is not allowed to send completion updates");
                return;
            }

            const id = data;

            const newCommunityData = await getCommunityBySlug(id);
            console.log("NCD:", newCommunityData)

            console.log(`SENDING NEW COMPLETION UPDATE TO ROOM ${id}`)
            this.io.to(id).emit("communityUpdate", newCommunityData);
        });
        
        // Add connection confirmation
        socket.emit("connectionConfirmed", { userId: socket.userId });
    }

}

// Socket Server Configuration
class SocketServerConfig {
    constructor(prisma, dev = process.env.NODE_ENV !== "production") {
        this.prisma = prisma;
        this.dev = dev;
        this.hostname = dev ? "localhost" : "0.0.0.0";
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
                const { userId, type, roomId } = socket.handshake.query;
                
                if (!type || !roomId) {
                    console.error("Missing required connection parameters", socket.handshake.query);
                    return next(new Error("Missing required connection parameters"));
                }
                
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
            const roomId = socket.handshake.query.roomId;

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

                console.log(`User ${socket.userId} connected to ${connectionType} ${roomId}`);
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
