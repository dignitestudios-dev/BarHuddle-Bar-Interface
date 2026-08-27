"use client";

import React, { createContext, useContext } from "react";
import { useAppSelector } from "@/store";

interface ProfileContextType {
    fullName: string;
    email: string;
    initials: string;
    firstName: string;
    bio: string;
    avatarUrl?: string;
    updateFullName: (newFullName: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const getAvatarUrl = (user: any): string | undefined => {
    if (!user) return undefined;
    if (user.profilePicture?.location) return user.profilePicture.location;
    if (typeof user.profilePicture === "string" && user.profilePicture) return user.profilePicture;
    if (user.image?.location) return user.image.location;
    if (typeof user.image === "string" && user.image) return user.image;
    if (user.avatar?.location) return user.avatar.location;
    if (typeof user.avatar === "string" && user.avatar) return user.avatar;
    if (user.profileImage?.location) return user.profileImage.location;
    if (typeof user.profileImage === "string" && user.profileImage) return user.profileImage;
    return undefined;
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAppSelector((state) => state.auth);

    const fullName = (user as any)?.name || ((user as any)?.firstName && (user as any)?.lastName ? `${(user as any).firstName} ${(user as any).lastName}` : (user as any)?.firstName) || user?.email?.split('@')[0] || "Venue Owner";
    const email = user?.email || "owner@barhuddle.com";
    const bio = (user as any)?.bio || "";
    const avatarUrl = getAvatarUrl(user);

    const getInitials = (nameStr: string) => {
        const parts = nameStr.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "VO";
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(fullName);
    const firstName = fullName.trim().split(" ")[0] || fullName;

    const updateFullName = (_newFullName: string) => {
        // Updated via Redux / API
    };

    return (
        <ProfileContext.Provider
            value={{
                fullName,
                email,
                initials,
                firstName,
                bio,
                avatarUrl,
                updateFullName,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    const { user } = useAppSelector((state) => state.auth);

    const fullName = (user as any)?.name || ((user as any)?.firstName && (user as any)?.lastName ? `${(user as any).firstName} ${(user as any).lastName}` : (user as any)?.firstName) || user?.email?.split('@')[0] || "Venue Owner";
    const email = user?.email || "owner@barhuddle.com";
    const bio = (user as any)?.bio || "";
    const avatarUrl = getAvatarUrl(user);

    const getInitials = (nameStr: string) => {
        const parts = nameStr.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "VO";
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(fullName);
    const firstName = fullName.trim().split(" ")[0] || fullName;

    if (!context) {
        return {
            fullName,
            email,
            initials,
            firstName,
            bio,
            avatarUrl,
            updateFullName: () => {},
        };
    }
    return context;
}

