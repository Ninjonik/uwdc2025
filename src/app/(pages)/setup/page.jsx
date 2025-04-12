import React from 'react';
import {getLoggedInUser} from "@/utils/getLoggedInUser";
import Communities from "@/components/pages/setup/Communities";
import Register from "@/components/pages/setup/Register";

const Page = async () => {
    const user = await getLoggedInUser();

    if(user){
        return <Communities />
    } else {
        return <Register />
    }
};

export default Page;