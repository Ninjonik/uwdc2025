import React from 'react';
import GetStartedForm from "@/components/pages/setup/GetStartedForm";
import PageBase from "@/components/pages/PageBase";

const Register = () => {
    return (
        <PageBase>
            <h1 className="text-4xl font-bold text-neutral mb-4">
                Setup Your Account
            </h1>
            <p className="text-lg text-primary italic font-semibold mb-6">
                Stay Ready. Stay Active. Stay Together.
            </p>
            <p className="text-base-content mb-8">
                Its  been easier to get moving. Just press start, and join your
                community for a daily burst of fun and fitness.
            </p>
            <GetStartedForm />
        </PageBase>
    );
};

export default Register;