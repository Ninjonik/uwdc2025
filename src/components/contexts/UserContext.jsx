"use client"

import React, {createContext, useContext, useState,} from "react";

const UserContext = createContext(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
};

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);

    return (
        <UserContext.Provider
            value={{ user, setUser }}
        >
            {children}
        </UserContext.Provider>
    );
};
