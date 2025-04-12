import React from 'react';
import GetStartedForm from "@/components/pages/setup/GetStartedForm";
import PageBase from "@/components/pages/PageBase";
import {FaUserAlt} from "react-icons/fa";

const Register = () => {
    return (
        <PageBase>
            <div className="px-4 py-6 md:p-8 space-y-6 md:space-y-8 max-w-5xl mx-auto">
                <div className="relative rounded-2xl bg-gradient-to-br from-primary/90 to-primary/70 p-8 text-white shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="relative z-10 text-center">
                        <h1 className="text-3xl font-extrabold mb-3">Setup Your Account</h1>
                        <p className="text-lg italic font-medium text-white/90">
                            Your journey to better fitness starts here
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5">
                    <div className="bg-gradient-to-r from-neutral/20 to-neutral/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-neutral rounded-lg p-2 text-white">
                                <FaUserAlt className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-neutral">Create Your Profile</h2>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <p className="text-neutral/80 mb-6">
                            Choose a name and avatar to represent you in your fitness communities.
                        </p>
                        <GetStartedForm />
                    </div>
                </div>
            </div>
        </PageBase>
    );
};

export default Register;
