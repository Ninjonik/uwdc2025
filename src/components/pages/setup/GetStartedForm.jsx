"use client"

import React, {startTransition, useActionState, useEffect, useState} from 'react';
import LabelInput from "@/components/form/LabelInput";
import {FaUser} from "react-icons/fa6";
import handleRegister from "@/actions/handleRegister";
import fireToast from "@/utils/fireToast";
import {useRouter} from "next/navigation";
import {useUserContext} from "@/components/contexts/UserContext";

const GetStartedForm = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [status, action] = useActionState(
        handleRegister,
        null,
    );

    const {setUser} = useUserContext();

    const router = useRouter();

    useEffect(() => {
        if(status && status?.type && status?.message){
            fireToast(status.type, status.message);
            if(status.type === "success" && status?.data){
                setUser(status.data);
                router.push("/communities");
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
        <form className={"flex flex-col gap-2"} onSubmit={handleSubmit}>
            <LabelInput placeholder={"Your name"} svgIcon={<FaUser />} name={"name"} type={"text"} maxLength={50} minLength={1} required={true} />
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-wrap gap-2"}>
                    {Array.from({length: 19}, (_, i) => i).map(i => (
                        <button className={"h-24 w-24 group"} onClick={() => setSelectedAvatar("avatar-" + (i + 1).toString())} type={"button"} key={i}>
                            <img src={`/logo/avatars/avatar-${(i + 1) < 10 ? "0" + (i + 1) : (i + 1)}.svg`} className={`group-hover:scale-125 transition-all ease-in-out group-hover:cursor-pointer ${selectedAvatar && selectedAvatar === "avatar-" + (i + 1).toString() && "border-2 border-primary rounded-full"}`} />
                        </button>
                    ))}
                </div>
            </div>
            <button className="btn btn-primary" type={"submit"}>Start</button>
        </form>
    );
};

export default GetStartedForm;