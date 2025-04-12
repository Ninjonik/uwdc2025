"use server"

import {getAllCommunities, removeCommunity, updateCommunityLimits} from "@/utils/db/owner";
import {errorMessage, successMessage} from "@/utils/actionResponse";

export async function getAllCommunitiesAction() {
    try {
        const communities = await getAllCommunities();
        return successMessage('Communities fetched successfully', communities);
    } catch (error) {
        console.error('Error fetching communities:', error);
        return errorMessage('Failed to fetch communities');
    }
}

export async function updateCommunityLimitsAction(communityId, participantLimit, exerciseLimit) {
    try {
        const numParticipantLimit = parseInt(participantLimit) || 0;
        const numExerciseLimit = parseInt(exerciseLimit) || 0;
        
        const updatedCommunity = await updateCommunityLimits(
            communityId,
            numParticipantLimit,
            numExerciseLimit
        );
        
        return successMessage('Community limits updated successfully', updatedCommunity);
    } catch (error) {
        console.error('Error updating community limits:', error);
        return errorMessage('Failed to update community limits');
    }
}

export async function removeCommunityAction(communityId) {
    try {
        await removeCommunity(communityId);
        return successMessage('Community removed successfully');
    } catch (error) {
        console.error('Error removing community:', error);
        return errorMessage('Failed to remove community');
    }
}
