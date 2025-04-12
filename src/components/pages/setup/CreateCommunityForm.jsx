"use client"

import React, {startTransition, useActionState, useEffect, useState} from 'react';
import LabelInput from "@/components/form/LabelInput";
import fireToast from "@/utils/fireToast";
import {useRouter} from "next/navigation";
import {TbLabelImportant} from "react-icons/tb";
import handleCreateCommunity from "@/actions/handleCreateCommunity";

const CreateCommunityForm = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [status, action] = useActionState(
        handleCreateCommunity,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.avatar = selectedAvatar;
        startTransition(() => {
            action(data);
        })
    }

    return (
        <form className={"flex flex-col gap-2 justify-center items-center"} onSubmit={handleSubmit}>
            <LabelInput placeholder={"Your community's slug"} svgIcon={<TbLabelImportant />} name={"name"} type={"text"} maxLength={50} minLength={1} required={true} pattern={"^[A-Za-z]+$"} />
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-wrap gap-2"}>
                    {Array.from({length: 19}, (_, i) => i).map(i => (
                        <button className={"h-24 w-24 group"} onClick={() => setSelectedAvatar("avatar-" + (i + 1).toString())} type={"button"} key={i}>
                            <img src={`/avatars/avatar-${(i + 1)}.svg`} className={`group-hover:scale-125 transition-all ease-in-out group-hover:cursor-pointer ${selectedAvatar && selectedAvatar === "avatar-" + (i + 1).toString() && "border-2 border-primary rounded-full"}`} />
                        </button>
                    ))}
                </div>
            </div>
            <button className="btn btn-primary" type={"submit"}>Create</button>
        </form>
    );
};

export default CreateCommunityForm;