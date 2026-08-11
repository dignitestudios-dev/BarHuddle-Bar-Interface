"use client";

import React, { createContext, useContext, useState } from "react";

interface ProfileContextType {
    fullName: string;
    email: string;
    initials: string;
    firstName: string;
    updateFullName: (newFullName: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [fullName, setFullName] = useState("James Dorsey");
    const [email] = useState("james@barhuddle.com");

    const getInitials = (nameStr: string) => {
        const parts = nameStr.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "JD";
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(fullName);
    const firstName = fullName.trim().split(" ")[0] || fullName;

    const updateFullName = (newFullName: string) => {
        setFullName(newFullName);
    };

    return (
        <ProfileContext.Provider
            value={{
                fullName,
                email,
                initials,
                firstName,
                updateFullName,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (!context) {
        // Return default fallback if used outside provider
        return {
            fullName: "James Dorsey",
            email: "james@barhuddle.com",
            initials: "JD",
            firstName: "James",
            updateFullName: () => {},
        };
    }
    return context;
}
