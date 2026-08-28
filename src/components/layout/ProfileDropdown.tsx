"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getAvatarUrl } from "@/context/ProfileContext";
import { LogoutConfirmationModal } from "@/components/ui/LogoutConfirmationModal";

export function ProfileDropdown() {
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { user, handleLogout } = useAuth();
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleViewProfileClick = () => {
        setShowProfileMenu(false);
        router.push("/app/profile");
    };

    const handleLogoutClick = () => {
        setShowProfileMenu(false);
        setIsLogoutModalOpen(true);
    };

    // Calculate display name, avatar, and initials
    const displayName = (user as any)?.firstName || (user as any)?.name || (user as any)?.fullName || user?.email?.split('@')[0] || "User";
    const firstName = displayName.split(" ")[0];
    const avatarUrl = getAvatarUrl(user);
    
    const getInitials = (name: string) => {
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "U";
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };
    
    const initials = getInitials(displayName);

    return (
        <div ref={profileRef} className="relative font-['Manrope',sans-serif]">
            {/* Profile Pill Button */}
            <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-[37.6px] px-3 bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] rounded-[24px] flex items-center gap-2.5 hover:bg-[rgba(124,58,237,0.2)] transition-all focus:outline-none cursor-pointer"
            >
                {/* Gradient Avatar or Image */}
                {avatarUrl ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[rgba(124,58,237,0.4)]">
                        <img
                            src={avatarUrl}
                            alt={firstName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#F472B6] flex items-center justify-center text-[10px] font-bold text-[#F0EEFF] shrink-0">
                        {initials}
                    </div>
                )}

                {/* Name */}
                <span className="font-semibold text-sm text-white">{firstName}</span>

                {/* Chevron Down */}
                <svg
                    className={`w-3 h-3 text-[#C27AFF] transition-transform duration-200 ${
                        showProfileMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-40 bg-[#05033A] border border-[rgba(180,95,242,0.3)] shadow-2xl rounded-xl p-3 flex flex-col gap-2 z-50 animate-in fade-in duration-150 font-['Manrope',sans-serif]">
                    <button
                        type="button"
                        onClick={handleViewProfileClick}
                        className="w-full text-left font-medium text-sm text-white hover:text-[#B45FF2] py-1.5 px-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        View Profile
                    </button>

                    <div className="w-full h-[1px] bg-[rgba(180,95,242,0.16)]" />

                    <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="w-full text-left font-medium text-sm text-[#FF3636] hover:text-red-400 py-1.5 px-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        Log Out
                    </button>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={() => {
                    setIsLogoutModalOpen(false);
                    handleLogout();
                }}
            />
        </div>
    );
}

export default ProfileDropdown;
