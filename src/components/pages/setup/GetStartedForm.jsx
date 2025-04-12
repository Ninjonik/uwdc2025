"use client"

import React, {useState} from 'react';
import LabelInput from "@/components/form/LabelInput";
import {FaUser} from "react-icons/fa6";

const GetStartedForm = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    return (
        <div className={"flex flex-col gap-2"}>
            <LabelInput placeholder={"Your name"} svgIcon={<FaUser />} />
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-wrap gap-2"}>
                    {Array.from({length: 19}, (_, i) => i).map(i => (
                        <button className={"h-24 w-24 group"} onClick={() => setSelectedAvatar(i + 1)}>
                            <img src={`/logo/avatars/avatar-${(i + 1) < 10 ? "0" + (i + 1) : (i + 1)}.svg`} className={`group-hover:scale-125 transition-all ease-in-out group-hover:cursor-pointer ${selectedAvatar && selectedAvatar === i + 1 && "border-2 border-primary rounded-full"}`} />
                        </button>
                    ))}
                </div>
            </div>
            <button className="btn btn-primary">Start</button>
        </div>
    );
};

export default GetStartedForm;