const { PrismaClient } = require('../../generated/prisma/client')

const prismaClientSingleton = () => {
    return new PrismaClient();
};

const globalThis = global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
