import React from 'react';
import Logo from "@/components/Logo";

const PageBase = ({children, showLogo = true}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral text-base-content h-screen w-screen">
            <div className="bg-secondary border-2 border-primary shadow-lg rounded-lg p-8 w-full md:w-[50dvw] text-center">
                {showLogo && <Logo />}
                {children}
            </div>
        </div>
    );
};

export default PageBase;