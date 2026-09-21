"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useProfile } from "@/context/ProfileContext";
import { EditProfileModal } from "@/components/layout/EditProfileModal";
import { useGetEventsQuery } from "@/features/events/api/events.queries";
import { useSelectedVenue } from "@/hooks/useSelectedVenue";

export default function ProfilePage() {
    const { fullName, email, initials, avatarUrl, updateFullName } = useProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fetch all events for the owner without filtering by venueId
    const { data: apiEventsData } = useGetEventsQuery({
        page: 1,
        limit: 100,
    });

    // Get all owner venues without venueId filtering
    const { venues } = useSelectedVenue();

    const eventsCount = useMemo(() => {
        if (typeof apiEventsData?.total === "number") return apiEventsData.total;
        if (typeof apiEventsData?.totalEvents === "number") return apiEventsData.totalEvents;
        if (typeof apiEventsData?.pagination?.total === "number") return apiEventsData.pagination.total;
        if (typeof apiEventsData?.data?.total === "number") return apiEventsData.data.total;
        if (Array.isArray(apiEventsData?.data?.events)) return apiEventsData.data.events.length;
        if (Array.isArray(apiEventsData?.data)) return apiEventsData.data.length;
        if (Array.isArray(apiEventsData?.events)) return apiEventsData.events.length;
        if (Array.isArray(apiEventsData)) return apiEventsData.length;
        return 0;
    }, [apiEventsData]);

    const venuesCount = venues.length;

    return (
        <div className="w-full flex flex-col p-4 sm:p-6 md:p-8 font-['Manrope',sans-serif] min-h-screen text-white">
            {/* Top Title Heading */}
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-white tracking-tight mb-4 sm:mb-6">
                Profile
            </h1>

            {/* Profile Card Container - Centered on Page */}
            <div className="w-full flex justify-center items-center py-2 sm:py-4">
                <div className="relative w-full max-w-[560px] bg-[rgba(14,9,60,0.76)] border border-[rgba(124,58,237,0.2)] shadow-[0px_8px_40px_rgba(0,0,0,0.5),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] sm:rounded-[28px] overflow-hidden select-none flex flex-col items-center pb-6 sm:pb-8">
                    {/* Top Header Banner Gradient */}
                    <div className="relative w-full h-[85px] sm:h-[100px] bg-gradient-to-r from-[rgba(124,58,237,0.55)] via-[rgba(168,85,247,0.4)] to-[rgba(232,255,87,0.1)] rounded-t-[23px] sm:rounded-t-[27px] overflow-hidden">
                        {/* Header Radial Glows */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.5)_0%,_transparent_70%)] pointer-events-none" />
                        <div className="absolute top-0 right-0 w-[140px] h-full bg-[radial-gradient(circle_at_center,_rgba(232,255,87,0.15)_0%,_transparent_70%)] pointer-events-none" />
                    </div>

                    {/* Avatar Section */}
                    <div className="relative flex items-center justify-center -mt-[45px] sm:-mt-[55px]">
                        {/* Glow Container Behind Avatar */}
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#E8FF57] opacity-70 blur-[3px] rounded-full pointer-events-none" />

                        {/* Main Avatar Circle */}
                        <div className="relative w-[115px] h-[115px] sm:w-[145px] sm:h-[145px] bg-gradient-to-br from-[#7C3AED] to-[#F472B6] border-4 border-[#04022E] shadow-[0px_0px_32px_rgba(124,58,237,0.5)] rounded-full flex items-center justify-center overflow-hidden z-10">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt={fullName}
                                    fill
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="font-extrabold text-[30px] sm:text-[36px] leading-[44px] text-[#F0EEFF] text-center tracking-wide">
                                    {initials}
                                </span>
                            )}
                        </div>

                        {/* Yellow Plus Badge Button */}
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="absolute bottom-0 right-0 z-20 w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] bg-[#FDF88F] hover:bg-yellow-300 active:scale-95 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-transform"
                            title="Edit Avatar / Profile"
                        >
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-[#B45FF2]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                    </div>

                    {/* Name Heading */}
                    <div className="mt-3 sm:mt-4 flex flex-col items-center text-center px-4 sm:px-6 w-full">
                        <h2 className="text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-extrabold text-white text-center tracking-[-0.5px] max-w-full truncate">
                            {fullName}
                        </h2>
                        <p className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-semibold text-[#8B7EC8] text-center max-w-full truncate mt-0.5">
                            {email}
                        </p>
                    </div>

                    {/* Stats Container Row */}
                    <div className="mt-4 sm:mt-5 flex flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-6 max-w-[420px]">
                        {/* Stat Card 1: Venues Owned */}
                        <div className="flex-1 min-w-[120px] bg-[rgba(124,58,237,0.06)] border border-[rgba(124,58,237,0.14)] rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-center items-center">
                            <span className="font-extrabold text-[18px] sm:text-[20px] leading-[26px] sm:leading-[28px] text-[#7C3AED] text-center">
                                {venuesCount}
                            </span>
                            <span className="font-semibold text-[10px] sm:text-[11px] leading-[14px] sm:leading-[15px] text-[#8B7EC8] text-center whitespace-nowrap mt-0.5">
                                Venues Owned
                            </span>
                        </div>

                        {/* Stat Card 2: Events Created */}
                        <div className="flex-1 min-w-[120px] bg-[rgba(244,114,182,0.06)] border border-[rgba(244,114,182,0.14)] rounded-[14px] p-2.5 sm:p-3 flex flex-col justify-center items-center">
                            <span className="font-extrabold text-[18px] sm:text-[20px] leading-[26px] sm:leading-[28px] text-[#F472B6] text-center">
                                {eventsCount}
                            </span>
                            <span className="font-semibold text-[10px] sm:text-[11px] leading-[14px] sm:leading-[15px] text-[#8B7EC8] text-center whitespace-nowrap mt-0.5">
                                Events Created
                            </span>
                        </div>
                    </div>

                    {/* User Info Details Cards */}
                    <div className="mt-4 sm:mt-5 w-full px-4 sm:px-8 flex flex-col gap-2.5 sm:gap-3">
                        {/* Full Name Card */}
                        <div className="w-full bg-[rgba(124,58,237,0.07)] border border-[rgba(124,58,237,0.14)] rounded-[14px] p-3 sm:p-3.5 flex items-center gap-3 hover:border-[rgba(124,58,237,0.25)] transition-all">
                            {/* Icon Box */}
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.22)] rounded-[10px] flex items-center justify-center shrink-0">
                                <svg
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            {/* Text Stack */}
                            <div className="flex flex-col justify-center min-w-0 flex-1">
                                <span className="text-[10px] leading-[14px] font-bold text-[#8B7EC8] uppercase tracking-[0.5px]">
                                    FULL NAME
                                </span>
                                <span className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-semibold text-[#F0EEFF] truncate">
                                    {fullName}
                                </span>
                            </div>
                        </div>

                        {/* Email Address Card */}
                        <div className="w-full bg-[rgba(124,58,237,0.07)] border border-[rgba(124,58,237,0.14)] rounded-[14px] p-3 sm:p-3.5 flex items-center gap-3 hover:border-[rgba(124,58,237,0.25)] transition-all">
                            {/* Icon Box */}
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.22)] rounded-[10px] flex items-center justify-center shrink-0">
                                <svg
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </div>
                            {/* Text Stack */}
                            <div className="flex flex-col justify-center min-w-0 flex-1">
                                <span className="text-[10px] leading-[14px] font-bold text-[#8B7EC8] uppercase tracking-[0.5px]">
                                    EMAIL ADDRESS
                                </span>
                                <span className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-semibold text-[#F0EEFF] truncate">
                                    {email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <div className="mt-4 sm:mt-5 w-full px-4 sm:px-8">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="w-full h-[46px] sm:h-[48px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.4),0px_0px_60px_rgba(124,58,237,0.08)] rounded-[16px] flex items-center justify-center gap-2 text-white font-extrabold text-[13.5px] sm:text-[14px] leading-[20px] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                        >
                            <svg
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentFullName={fullName}
                currentEmail={email}
                currentAvatarUrl={avatarUrl}
                onSave={updateFullName}
            />
        </div>
    );
}

