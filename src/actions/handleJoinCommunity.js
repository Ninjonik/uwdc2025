"use server"

import prisma from "@/lib/prisma";
import {errorMessage, successMessage} from "@/utils/actionResponse";
import {getLoggedInUser} from "@/utils/getLoggedInUser";

export default async function handleJoinCommunity(_prevState, formData) {
    const communityId = formData.get('communityId');

    if (!communityId) {
        return errorMessage('Community Slug is required');
    }

    const user = await getLoggedInUser();
    if (!user) {
        return errorMessage('You must be logged in to join a community');
    }

    // Check if the user is already in the community
    const existingUser = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        include: {
            communities: true,
        }
    });

    if (existingUser.communities.some(community => community.id === communityId)) {
        return errorMessage('You are already a member of this community');
    }

    // Check if the community exists and if yes then join it
    try {
        const joinedCommunity = await prisma.community.update({
            where: {
                id: communityId,
            },
            data: {
                users: {
                    connect: {
                        id: user.id,
                    }
                }
            },
            include: {
                users: true,
            }
        })

        if (!joinedCommunity) {
            return errorMessage('Community not found');
        }

        return successMessage('You have successfully joined a community', joinedCommunity);
    } catch (e) {
        return errorMessage('Community not found');

    }
}
