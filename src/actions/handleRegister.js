"use server"

import {errorMessage, successMessage} from "@/utils/actionResponse";
import prisma from "@/lib/prisma";
import {cookies} from "next/headers";

export default async function handleRegister(_prevState, formData){
    const name = formData.get('name');
    const avatar = formData.get('avatar');

    if(!name || !avatar) return errorMessage("Please fill all the fields.");

    if(name.length < 1 || name.length > 50) return errorMessage("Name must be between 1 and 50 characters.");
    if(!avatar.match(/avatar-\d+/)) return errorMessage("Please select a valid avatar.");

    const newUser = await prisma.user.create({
        data: {
            name,
            avatar,
        }
    })

    if(!newUser) return errorMessage("Something went wrong. Please try again.");

    (await cookies()).set("user", JSON.stringify(newUser))

    return successMessage("You have successfully registered.", newUser);
}