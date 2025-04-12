"use client"

import React, {useEffect} from 'react';
import {useUserContext} from "@/components/contexts/UserContext";

const ClientWrapper = ({children, user}) => {
    const {setUser} = useUserContext();
    useEffect(() => {
        setUser(user)
    }, []);
    return (
        <>
            {children}
        </>
    );
};

export default ClientWrapper;