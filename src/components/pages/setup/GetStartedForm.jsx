"use client"

import React, {startTransition, useActionState, useEffect, useState} from 'react';
import LabelInput from "@/components/form/LabelInput";
import {FaUser} from "react-icons/fa6";
import handleRegister from "@/actions/handleRegister";
import fireToast from "@/utils/fireToast";
import {useRouter} from "next/navigation";
import {useUserContext} from "@/components/contexts/UserContext";
import {HiArrowRight} from "react-icons/hi";

const GetStartedForm = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [status, action] = useActionState(
        handleRegister,
        null,
    );

    const {setUser} = useUserContext();
    const router = useRouter();

    useEffect(() => {
        if(status && status?.type && status?.message){
            setSubmitting(false);
            fireToast(status.type, status.message);
            if(status.type === "success" && status?.data){
                setUser(status.data);
                router.refresh();
            }
        }
    }, [status]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);
        formData.set("avatar", selectedAvatar);
        startTransition(() => {
            action(formData);
        })
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
                <LabelInput 
                    placeholder="Your name" 
                    svgIcon={<FaUser />} 
                    name="name" 
                    type="text" 
                    maxLength={50} 
                    minLength={1} 
                    required={true}
                    labelClassName="input input-bordered bg-base-100 shadow-sm w-full" 
                />
            </div>
            
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral/70 text-left">Select an avatar</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 bg-base-100 p-4 rounded-xl border border-neutral/10">
                    {Array.from({length: 19}, (_, i) => i).map(i => (
                        <button 
                            className="group relative" 
                            onClick={() => setSelectedAvatar("avatar-" + (i + 1).toString())} 
                            type="button" 
                            key={i}
                        >
                            <div className={`
                                absolute inset-0 rounded-full 
                                ${selectedAvatar === "avatar-" + (i + 1).toString() 
                                  ? "bg-primary/20 ring-2 ring-primary" 
                                  : "opacity-0 group-hover:opacity-100 bg-primary/10"}
                                transition-all duration-200
                            `}></div>
                            <img 
                                src={`/avatars/avatar-${(i + 1)}.svg`} 
                                className="transition-all duration-200 group-hover:scale-105 p-1" 
                                alt={`Avatar option ${i+1}`}
                            />
                        </button>
                    ))}
                </div>
            </div>
            
            <button 
                className="btn btn-primary w-full shadow-md mt-4 flex items-center gap-2" 
                type="submit"
                disabled={submitting || !selectedAvatar}
            >
                {submitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    <HiArrowRight className="w-5 h-5" />
                )}
                Get Started
            </button>
        </form>
    );
};

export default GetStartedForm;
