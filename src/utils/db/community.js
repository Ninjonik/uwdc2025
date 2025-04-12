import prisma from "@/lib/prisma";
import {handleSocketEmit} from "@/lib/serverSocket";

export const getCommunityBySlug = async (slug) => {
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

export const getCommunityByAdminSlug = async (adminSlug) => {
    return prisma.community.findFirst({
        where: {
            adminSlug: adminSlug,
        },
        include: {
            exercises: true,
            owner: true,
        }
    });
}

export const getAvailableExercises = async () => {
    return prisma.exercise.findMany({
        orderBy: {
            name: 'asc',
        }
    });
}

export const updateCommunityExercises = async (communityId, exerciseIds) => {
    return prisma.community.update({
        where: {
            id: communityId,
        },
        data: {
            exercises: {
                set: exerciseIds.map(id => ({ id })),
            }
        },
        include: {
            exercises: true
        }
    });
}

export const assignNewActivity = async (communityId, exerciseId) => {
    // Find already exising activity for this community if it exists
    const currentActivity = await prisma.activity.findFirst({
        where: {
            currentCommunityId: communityId
        }
    });
    
    // If there is a current activity, mark it as completed and disconnect it
    if (currentActivity) {
        await prisma.activity.update({
            where: { id: currentActivity.id },
            data: {
                status: 1, // Set to completed
                currentCommunity: { disconnect: true } // Disconnect from being the current activity
            }
        });
    }

    const res = await prisma.activity.create({
        data: {
            exercise: {
                connect: { id: exerciseId }
            },
            community: {
                connect: { id: communityId }
            },
            currentCommunity: {
                connect: { id: communityId }
            },
            status: 0
        },
        include: {
            exercise: true
        }
    });

    await handleSocketEmit("community", communityId, "sendCommunityUpdate", {
        data: communityId,
    });

    return res;
}
