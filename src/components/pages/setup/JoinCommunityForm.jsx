"use client"

import React, {useActionState, useEffect} from 'react';
import LabelInput from "@/components/form/LabelInput";
import handleJoinCommunity from "@/actions/handleJoinCommunity";
import fireToast from "@/utils/fireToast";
import {useRouter} from "next/navigation";

const JoinCommunityForm = () => {

    const [status, formAction] = useActionState(
        handleJoinCommunity,
        null,
    );

    const router = useRouter();

    useEffect(() => {
        if(status && status?.type && status?.message){
            fireToast(status.type, status.message);
            if(status.type === "success" && status?.data){
                router.push(`/${status.data.id}`);
            }
        }
    }, [status]);

    return (
        <form className="flex flex-row gap-2 justify-center items-center" action={formAction}>
            <LabelInput placeholder={"Community's slug"} name={"communityId"} />
            <button className={"btn btn-primary"} type={"submit"}>Join</button>
        </form>
    );
};

export default JoinCommunityForm;