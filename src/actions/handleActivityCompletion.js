"use server"

import {errorMessage, successMessage} from "@/utils/actionResponse";
import prisma from "@/lib/prisma";
import {getLoggedInUser} from "@/utils/getLoggedInUser";
import {handleSocketEmit} from "@/lib/serverSocket";

export default async function handleActivityCompletion(_prevState, formData){
    const activityId = formData.get('activityId');
    const reps = formData.get('reps') ? parseInt(formData.get('reps')) : 0;

    const user = await getLoggedInUser();

    if(!user) return errorMessage("You must be logged in to complete an activity.");

    if(!activityId || (!reps && reps !== 0)) return errorMessage("Please fill all the fields.");

    if(reps < 0) return errorMessage("Reps must be a positive number.");

    // Check if user has the permission
    const communityCheck = await prisma.community.findFirst({
        where: {
            activities: {
                some: {
                    id: activityId,
                }
            },
            users: {
                some: {
                    id: user.id,
                }
            }
        }
    })

    if(!communityCheck) return errorMessage("You don't have permission to complete this activity.");

    const alreadyExistingCompletion = await prisma.completion.findFirst({
        where: {
            activityId: activityId,
            userId: user.id,
        }
    })

    if(alreadyExistingCompletion) return errorMessage("You have already completed this activity.");

    const activity = await prisma.activity.findUnique({
        where: {
            id: activityId,
        },
        include: {
            completions: true,
        }
    })

    if(!activity) return errorMessage("Activity not found.");

    const reactionTime = Math.abs(new Date(activity.createdAt).getTime() - new Date().getTime())/1000;


    const newActivityCompletion = await prisma.completion.create({
        data: {
            reps,
            reaction: reactionTime,
            user: {
                connect: {
                    id: user.id,
                }
            },
            activity: {
                connect: {
                    id: activityId,
                }
            }
        },
        include: {
            activity: {
                include: {
                    community: true
                }
            }
        }
    })

    if(!newActivityCompletion) return errorMessage("Something went wrong. Please try again.");

    // Send the websocket update about activity completion
    await handleSocketEmit("community", communityCheck.id, "sendCompletionUpdate", {
        newActivityCompletion: JSON.stringify(newActivityCompletion),
    });

    return successMessage("You have successfully marked the activity as completed.", newActivityCompletion);
}