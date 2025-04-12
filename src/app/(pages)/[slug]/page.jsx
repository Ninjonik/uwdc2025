import React from 'react';
import {getCommunityByAdminSlug, getCommunityBySlug} from "@/utils/db/community";
import NotFound from "@/app/not-found";
import {getLoggedInUser} from "@/utils/getLoggedInUser";
import CommunityMain from "@/components/pages/community/CommunityMain";
import AdminPage from "@/components/pages/admin/AdminPage";
import prisma from "@/lib/prisma";

const Page = async (props) => {
    const params = await props.params;
    const slug = params?.slug;

    const loggedInUser = await getLoggedInUser();

    const community = await getCommunityBySlug(slug);
    if (!community) {
        const adminCommunity = await getCommunityByAdminSlug(slug);
        if(!adminCommunity) {
            return <NotFound />;
        }

        const exercises = await prisma.exercise.findMany({
            orderBy: {
                name: 'asc',
            }
        });

        return <AdminPage community={adminCommunity} allExercises={exercises} loggedInUser={loggedInUser} />
    }

    return <CommunityMain initialCommunity={community} loggedInUser={loggedInUser} />;
};

export default Page;
