"use server"

import {errorMessage, successMessage} from "@/utils/actionResponse";
import prisma from "@/lib/prisma";
import {getLoggedInUser} from "@/utils/getLoggedInUser";

export default async function handleCreateCommunity(_prevState, formData){
    const name = formData.get('name');
    const avatar = formData.get('avatar');

    const user = await getLoggedInUser();

    if(!user) return errorMessage("You must be logged in to create a community.");

    if(!name || !avatar) return errorMessage("Please fill all the fields.");

    if(name.length < 1 || name.length > 50) return errorMessage("Name must be between 1 and 50 characters.");
    if(!avatar.match(/avatar-\d+/)) return errorMessage("Please select a valid avatar.");

    // Check if the community already exists
    const existingCommunity = await prisma.community.findUnique({
        where: {
            id: name,
        }
    })

    if(existingCommunity) return errorMessage("Community with this slug already exists.");

    const exercises = await prisma.exercise.findMany({
        take: 10,
    })

    const newCommunity = await prisma.community.create({
        data: {
            id: name,
            name,
            avatar,
            owner: {
                connect: {
                    id: user.id,
                }
            },
            users: {
                connect: {
                    id: user.id,
                }
            },
            exercises: {
                connect: exercises,
            },
            activities: {
                create: {
                    exerciseId: exercises[0].id,
                }
            }
        },
        include: {
            activities: true,
        }
    })

    if(!newCommunity) return errorMessage("Something went wrong. Please try again.");

    // Update the community with a new activity
    const updatedCommunity = await prisma.community.update({
        where: {
            id: newCommunity.id,
        },
        data: {
            currentActivity: {
                connect: {
                    id: newCommunity.activities[0].id,
                }
            }
        }
    })

    if(!updatedCommunity) return errorMessage("Something went wrong. Please try again.");

    return successMessage("You have successfully created a community.", updatedCommunity);
}