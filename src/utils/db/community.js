import prisma from "@/lib/prisma";

// Get community by slug (id)
export const getCommunityBySlug = async (slug) => {
    const community = await prisma.community.findUnique({
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
                }
            },
        }
    })

    return community;
}