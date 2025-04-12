"use server"

import prisma from "@/lib/prisma";
import {getLoggedInUser} from "@/utils/getLoggedInUser";
import {assignNewActivity, updateCommunityExercises} from "@/utils/db/community";
import {errorMessage, successMessage} from "@/utils/actionResponse";

export async function updateCommunityExercisesAction(communityId, exerciseIds) {
    try {
        // Verify user is admin of this community
        const user = await getLoggedInUser();
        const community = await prisma.community.findUnique({
            where: { id: communityId },
            select: { ownerId: true }
        });

        if (!community) {
            return errorMessage('Community not found');
        }

        if (community.ownerId !== user.id) {
            return errorMessage('You do not have permission to update exercises');
        }

        // Update the exercises
        const updatedCommunity = await updateCommunityExercises(communityId, exerciseIds);
        
        return successMessage('Exercises updated successfully', updatedCommunity);
    } catch (error) {
        console.error('Error updating exercises:', error);
        return errorMessage('Failed to update exercises');
    }
}

export async function assignNewActivityAction(communityId, exerciseId) {
    try {
        // Verify user is admin of this community
        const user = await getLoggedInUser();
        const community = await prisma.community.findUnique({
            where: { id: communityId },
            select: { ownerId: true }
        });

        if (!community) {
            return errorMessage('Community not found');
        }

        if (community.ownerId !== user.id) {
            return errorMessage('You do not have permission to assign activities');
        }

        const newActivity = await assignNewActivity(communityId, exerciseId);
        
        return successMessage('New activity assigned successfully', newActivity);
    } catch (error) {
        console.error('Error assigning new activity:', error);
        return errorMessage('Failed to assign new activity');
    }
}
