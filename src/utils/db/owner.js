import prisma from "@/lib/prisma";

export const getAllCommunities = async () => {
    return prisma.community.findMany({
        include: {
            users: true,
            exercises: true,
            owner: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
};

export const updateCommunityLimits = async (communityId, participantLimit, exerciseLimit) => {
    return prisma.community.update({
        where: {
            id: communityId
        },
        data: {
            participantLimit,
            exerciseLimit
        }
    });
};

export const removeCommunity = async (communityId) => {
    // First, remove any relationships
    await prisma.community.update({
        where: {
            id: communityId
        },
        data: {
            currentActivity: {
                disconnect: true
            },
            activities: {
                deleteMany: {}
            },
            exercises: {
                set: []
            },
            users: {
                set: []
            }
        }
    });
    
    // Then delete the community
    return prisma.community.delete({
        where: {
            id: communityId
        }
    });
};
