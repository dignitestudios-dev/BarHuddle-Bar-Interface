"use client";

import React, { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { EditProfileModal } from "@/components/layout/EditProfileModal";
import { useGetEventsQuery } from "@/features/events/api/events.queries";
import { useMyVenuesQuery } from "@/features/venue-management/api/venue.queries";
import { useSelectedVenue } from "@/hooks/useSelectedVenue";

export default function ProfilePage() {
    const { fullName, email, initials, avatarUrl, bio, updateFullName } = useProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { selectedVenueId } = useSelectedVenue();
    const { data: apiEventsData } = useGetEventsQuery({
        page: 1,
        limit: 10,
        ...(selectedVenueId ? { venueId: selectedVenueId } : {}),
    });
    const { data: myVenuesData } = useMyVenuesQuery(1, 10);

    const eventsCount = Array.isArray(apiEventsData?.data)
        ? apiEventsData.data.length
        : Array.isArray(apiEventsData?.data?.events)
            ? apiEventsData.data.events.length
            : Array.isArray(apiEventsData)
                ? apiEventsData.length
                : 0;

    const venuesCount = Array.isArray(myVenuesData) ? myVenuesData.length : 1;

    return (
        <div className="w-full flex flex-col p-6 sm:p-8 font-['Manrope',sans-serif] min-h-screen">
            {/* Top Title Heading */}
            <h1 className="text-[28px] font-extrabold text-white tracking-tight mb-6">
                Profile
            </h1>

            {/* Profile Card Container - Centered on Page */}
            <div className="w-full flex justify-center items-center py-4">
                <div className="relative w-[591px] h-[666px] max-w-[95vw] bg-[rgba(14,9,60,0.76)] border border-[rgba(124,58,237,0.2)] shadow-[0px_8px_40px_rgba(0,0,0,0.5),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[28px] overflow-hidden select-none">
                    {/* Top Header Banner Gradient */}
                    <div className="absolute top-[0.8px] left-[0.8px] right-[0.8px] h-[96px] bg-gradient-to-r from-[rgba(124,58,237,0.55)] via-[rgba(168,85,247,0.4)] to-[rgba(232,255,87,0.1)] rounded-t-[27px]">
                        {/* Header Radial Glow 1 */}
                        <div className="absolute left-[159.46px] top-0 w-[192px] h-[96px] bg-[radial-gradient(70.71%_70.71%_at_50%_50%,rgba(124,58,237,0.5)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
                        {/* Header Radial Glow 2 */}
                        <div className="absolute left-[310.4px] top-0 w-[128px] h-[96px] bg-[radial-gradient(70.71%_70.71%_at_50%_50%,rgba(232,255,87,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
                    </div>

                    {/* Avatar Section */}
                    {/* Glow Container Behind Avatar */}
                    <div className="absolute left-[210px] top-[67px] w-[171px] h-[171px] bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#E8FF57] opacity-70 blur-[2px] rounded-full pointer-events-none" />

                    {/* Main Avatar Circle */}
                    <div className="absolute left-[217px] top-[74px] w-[157px] h-[157px] bg-gradient-to-br from-[#7C3AED] to-[#F472B6] border-4 border-[#04022E] shadow-[0px_0px_32px_rgba(124,58,237,0.5)] rounded-full flex items-center justify-center overflow-hidden z-10">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="font-extrabold text-[36px] leading-[44px] text-[#F0EEFF] text-center tracking-wide">
                                {initials}
                            </span>
                        )}
                    </div>

                    {/* Yellow Plus Badge Button */}
                    <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute left-[315px] top-[188px] z-20 w-[36px] h-[36px] bg-[#FDF88F] rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
                        title="Edit Avatar / Profile"
                    >
                        <svg
                            className="w-5 h-5 text-[#B45FF2]"
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

                    {/* Name Heading */}
                    <div className="absolute left-[33px] right-[33px] top-[248px] h-[36px] flex flex-col items-center justify-center z-10 px-4">
                        <h2 className="w-full max-w-[400px] text-[24px] leading-[32px] font-extrabold text-white text-center tracking-[-0.6px] truncate">
                            {fullName}
                        </h2>
                    </div>

                    {/* Email Paragraph */}
                    <div className="absolute left-[33px] right-[33px] top-[284px] h-[20px] flex flex-col items-center justify-center z-10 px-4">
                        <p className="w-full max-w-[400px] text-[14px] leading-[20px] font-semibold text-[#8B7EC8] text-center truncate">
                            {email}
                        </p>
                    </div>

                    {/* Stats Container Row */}
                    <div className="absolute left-[129px] top-[324px] w-[332.36px] h-[70.6px] flex flex-row items-center justify-center gap-[16px] z-10">
                        {/* Stat Card 1: Venues Owned */}
                        <div className="w-[104.18px] h-[70.6px] bg-[rgba(124,58,237,0.04)] border border-[rgba(124,58,237,0.118)] rounded-[14px] p-[12px_16px] flex flex-col justify-center items-center">
                            <span className="font-extrabold text-[20px] leading-[28px] text-[#7C3AED] text-center">
                                {venuesCount}
                            </span>
                            <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8] text-center whitespace-nowrap mt-0.5">
                                Venues Owned
                            </span>
                        </div>

                        {/* Stat Card 2: Events Created */}
                        <div className="w-[106.79px] h-[70.6px] bg-[rgba(244,114,182,0.04)] border border-[rgba(244,114,182,0.118)] rounded-[14px] p-[12px_16px] flex flex-col justify-center items-center">
                            <span className="font-extrabold text-[20px] leading-[28px] text-[#F472B6] text-center">
                                {eventsCount}
                            </span>
                            <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8] text-center whitespace-nowrap mt-0.5">
                                Events Created
                            </span>
                        </div>

                        {/* Stat Card 3: Total Reach */}
                        {/* <div className="w-[89.4px] h-[70.6px] bg-[rgba(34,211,238,0.04)] border border-[rgba(34,211,238,0.118)] rounded-[14px] p-[12px_16px] flex flex-col justify-center items-center">
                            <span className="font-extrabold text-[20px] leading-[28px] text-[#22D3EE] text-center">
                                0
                            </span>
                            <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8] text-center whitespace-nowrap mt-0.5">
                                Total Reach
                            </span>
                        </div> */}
                    </div>

                    {/* User Info Details Cards */}
                    <div className="absolute left-[33px] top-[415px] w-[526px] h-[145.2px] flex flex-col gap-[12px] z-10">
                        {/* Full Name Card */}
                        <div className="w-[526px] h-[66.6px] bg-[rgba(124,58,237,0.07)] border border-[rgba(124,58,237,0.14)] rounded-[14px] p-[14px_16px] flex items-center gap-[12px]">
                            {/* Icon Box */}
                            <div className="w-[32px] h-[32px] bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.22)] rounded-[10px] flex items-center justify-center shrink-0">
                                <svg
                                    className="w-3.5 h-3.5 text-[#A855F7]"
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
                            <div className="flex flex-col justify-center">
                                <span className="text-[10px] leading-[15px] font-bold text-[#8B7EC8] uppercase tracking-[0.5px]">
                                    FULL NAME
                                </span>
                                <span className="text-[14px] leading-[20px] font-semibold text-[#F0EEFF] truncate">
                                    {fullName}
                                </span>
                            </div>
                        </div>

                        {/* Email Address Card */}
                        <div className="w-[526px] h-[66.6px] bg-[rgba(124,58,237,0.07)] border border-[rgba(124,58,237,0.14)] rounded-[14px] p-[14px_16px] flex items-center gap-[12px]">
                            {/* Icon Box */}
                            <div className="w-[32px] h-[32px] bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.22)] rounded-[10px] flex items-center justify-center shrink-0">
                                <svg
                                    className="w-3.5 h-3.5 text-[#A855F7]"
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
                            <div className="flex flex-col justify-center">
                                <span className="text-[10px] leading-[15px] font-bold text-[#8B7EC8] uppercase tracking-[0.5px]">
                                    EMAIL ADDRESS
                                </span>
                                <span className="text-[14px] leading-[20px] font-semibold text-[#F0EEFF] truncate">
                                    {email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <div className="absolute left-[33px] top-[588px] w-[526px] h-[48px] z-10">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="w-full h-full bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_28px_rgba(124,58,237,0.4),0px_0px_60px_rgba(124,58,237,0.08)] rounded-[16px] flex items-center justify-center gap-2 text-white font-extrabold text-[14px] leading-[20px] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                        >
                            <svg
                                className="w-3.5 h-3.5 text-white"
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
