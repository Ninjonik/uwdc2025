import {cookies} from "next/headers";

export const getLoggedInUser = async () => {
    const userCookie = (await cookies()).get("user");
    if(!userCookie) return null;
    const user = JSON.parse(userCookie.value);
    return user || null;
}
