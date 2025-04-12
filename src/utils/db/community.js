import prisma from "@/lib/prisma";

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