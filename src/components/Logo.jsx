import React from 'react';
import Link from 'next/link'

const Logo = ({className}) => {
    return (
        <Link href={"/communities"} className={"group"}>
            <img src={"/logo/logo.png"} alt={"ActivePulse Logo"} className={`w-24 h-24 mx-auto mb-6 group-hover:scale-[110%] transition-all ease-in-out ${className}`} />
        </Link>
    );
};

export default Logo;