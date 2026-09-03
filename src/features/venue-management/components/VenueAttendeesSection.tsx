"use client";

import React, { useState } from "react";
import { AttendeesModal } from "./AttendeesModal";
import { handleImageError } from "@/utils/image";

export interface Attendee {
    id: number;
    name: string;
    avatarUrl: string;
}

export interface VenueAttendeesSectionProps {
    liveAttendees?: Attendee[];
    pastAttendees?: Attendee[];
    className?: string;
}

const DEFAULT_ATTENDEES: Attendee[] = [
    {
        id: 1,
        name: "Wade Warren",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 2,
        name: "Wade Warren",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 3,
        name: "Wade Warren",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 4,
        name: "Wade Warren",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 5,
        name: "Wade Warren",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 6,
        name: "Wade Warren",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
    },
];

export function VenueAttendeesSection({
    liveAttendees = DEFAULT_ATTENDEES,
    pastAttendees = DEFAULT_ATTENDEES,
    className = "",
}: VenueAttendeesSectionProps) {
    const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    return (
        <>
            <div className={`w-full flex flex-col gap-6 font-['Manrope',sans-serif] ${className}`}>
                {/* Live Attendees Box */}
                <div className="w-full p-6 flex flex-col gap-4 bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.35),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[20px]">
                    {/* Header Row: LIVE Tag + Title + View All Button */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-[4px] h-[20px] bg-gradient-to-b from-[#7C3AED] to-[#E8FF57] rounded-full shrink-0" />
                                <span className="font-bold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#9D8FD0]">
                                    LIVE
                                </span>
                            </div>
                            <h2 className="font-bold text-[20px] leading-[28px] text-white">
                                List of Attendees
                            </h2>
                        </div>

                        {/* View All Pill Button */}
                        <button
                            type="button"
                            onClick={() => setIsLiveModalOpen(true)}
                            className="px-3 py-1.5 rounded-full bg-[rgba(232,255,87,0.08)] border border-[rgba(232,255,87,0.3)] font-semibold text-[12px] leading-[16px] text-[#E8FF57] hover:bg-[rgba(232,255,87,0.15)] transition-all cursor-pointer"
                        >
                            View All
                        </button>
                    </div>

                    {/* Attendee Cards Horizontal Scroll / Grid */}
                    <div className="w-full flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
                        {liveAttendees.map((person) => (
                            <div
                                key={`live-${person.id}`}
                                className="relative w-[102px] h-[114px] shrink-0 rounded-[16px] overflow-hidden group shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
                            >
                                {/* Attendee Image */}
                                <img
                                    src={person.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                                    alt=""
                                    onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80")}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

                                {/* Name Badge Pill (Bottom Center) */}
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-[3px] rounded-[10px] bg-[rgba(132,36,187,0.7)] backdrop-blur-md shadow-[0px_4px_12px_rgba(0,0,0,0.25)] whitespace-nowrap">
                                    <span className="font-medium text-[11px] leading-[14px] text-white capitalize">
                                        {person.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Past Attendees Box */}
                <div className="w-full p-6 flex flex-col gap-4 bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.35),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[20px]">
                    {/* Header Row: HISTORY Tag + Title + Calendar Icon Button */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-[4px] h-[20px] bg-gradient-to-b from-[#7C3AED] to-[#E8FF57] rounded-full shrink-0" />
                                <span className="font-bold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#9D8FD0]">
                                    HISTORY
                                </span>
                            </div>
                            <h2 className="font-bold text-[20px] leading-[28px] text-white">
                                Past Attendees
                            </h2>
                        </div>

                        {/* Calendar Icon Button */}
                        <button
                            type="button"
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="w-9 h-9 rounded-full bg-[rgba(180,95,242,0.15)] flex items-center justify-center text-[#B45FF2] hover:bg-[rgba(180,95,242,0.3)] transition-all cursor-pointer"
                            aria-label="View Past Attendees History Calendar"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>

                    {/* Attendee Cards Horizontal Scroll / Grid */}
                    <div className="w-full flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
                        {pastAttendees.map((person) => (
                            <div
                                key={`past-${person.id}`}
                                className="relative w-[102px] h-[114px] shrink-0 rounded-[16px] overflow-hidden group shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
                            >
                                {/* Attendee Image */}
                                <img
                                    src={person.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                                    alt=""
                                    onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80")}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

                                {/* Name Badge Pill (Bottom Center) */}
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-[3px] rounded-[10px] bg-[rgba(132,36,187,0.7)] backdrop-blur-md shadow-[0px_4px_12px_rgba(0,0,0,0.25)] whitespace-nowrap">
                                    <span className="font-medium text-[11px] leading-[14px] text-white capitalize">
                                        {person.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Of Attendees Modal (Live) */}
            <AttendeesModal
                isOpen={isLiveModalOpen}
                onClose={() => setIsLiveModalOpen(false)}
                title="List Of Attendees"
            />

            {/* Past Attendees Modal (History) */}
            <AttendeesModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                title="Past Attendees"
            />
        </>
    );
}

export default VenueAttendeesSection;
