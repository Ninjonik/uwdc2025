import React from 'react';

const Logo = ({className}) => {
    return (
        <img src={"/logo/logo.png"} alt={"ActivePulse Logo"} className={`w-24 h-24 mx-auto mb-6 ${className}`} />
    );
};

export default Logo;