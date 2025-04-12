import React from 'react';
import {getCommunityBySlug} from "@/utils/db/community";
import NotFound from "@/app/not-found";
import {getLoggedInUser} from "@/utils/getLoggedInUser";
import CommunityMain from "@/components/pages/community/CommunityMain";

const Page = async (props) => {
    const params = await props.params;
    const slug = params?.slug;

    const loggedInUser = await getLoggedInUser();

    const community = await getCommunityBySlug(slug);
    if (!community) return <NotFound />;

    return <CommunityMain initialCommunity={community} loggedInUser={loggedInUser} />;
};

export default Page;
