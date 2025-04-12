"use client"

import React, {startTransition, useActionState, useEffect, useState} from 'react';
import LabelInput from "@/components/form/LabelInput";
import handleJoinCommunity from "@/actions/handleJoinCommunity";
import fireToast from "@/utils/fireToast";
import {useRouter} from "next/navigation";
import {FaRegArrowAltCircleRight} from "react-icons/fa";
import {RiUserCommunityFill} from "react-icons/ri";

const JoinCommunityForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [status, formAction] = useActionState(
        handleJoinCommunity,
        null,
    );

    const router = useRouter();

    useEffect(() => {
        if(status && status?.type && status?.message){
            setSubmitting(false);
            fireToast(status.type, status.message);
            if(status.type === "success" && status?.data){
                router.push(`/${status.data.id}`);
            }
        }
    }, [status]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleSubmit}>
            <div className="grow">
                <LabelInput 
                    placeholder="Enter community slug" 
                    name="communityId"
                    labelClassName="input input-bordered bg-base-100 shadow-sm w-full" 
                    svgIcon={
                        <RiUserCommunityFill />
                    }
                />
            </div>
            <button 
                className="btn btn-primary shadow-md flex items-center gap-2 shrink-0 px-6" 
                type="submit"
                disabled={submitting}
            >
                {submitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    <FaRegArrowAltCircleRight />
                )}
                Join
            </button>
        </form>
    );
};

export default JoinCommunityForm;
