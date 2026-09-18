"use client";

import React, { useState } from "react";

export interface EventsPageHeaderProps {
    activeTab?: "events" | "boosted";
    onTabChange?: (tab: "events" | "boosted") => void;
    onCreateEvent?: () => void;
    className?: string;
}

export function EventsPageHeader({
    activeTab = "events",
    onTabChange,
    onCreateEvent,
    className = "",
}: EventsPageHeaderProps) {
    return (
        <div className={`w-full max-w-[1200px] flex flex-col gap-5 sm:gap-6 font-['Manrope',sans-serif] ${className}`}>
            {/* Top Row: Title + Create Button */}
            <div className="w-full flex items-center justify-between min-h-[45px] gap-3">
                {/* Events Gradient Heading */}
                <h1 className="font-extrabold text-[28px] sm:text-[36px] leading-[36px] sm:leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                    Events
                </h1>

                {/* + Create Button */}
                <button
                    type="button"
                    onClick={onCreateEvent}
                    className="h-[40px] sm:h-[45px] px-5 sm:px-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center gap-1 font-extrabold text-xs sm:text-[15px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                    <span>+ Create</span>
                </button>
            </div>

            {/* Tab Filter Container Bar */}
            <div className="relative w-full max-w-[376px] h-[48px] sm:h-[57px] p-1 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex items-center justify-between gap-1">
                {/* Events Tab */}
                <button
                    type="button"
                    onClick={() => onTabChange?.("events")}
                    className={`flex-1 h-[40px] sm:h-[46px] rounded-full flex items-center justify-center font-semibold text-xs sm:text-[15px] leading-[20px] transition-all cursor-pointer ${activeTab === "events"
                            ? "bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] text-white"
                            : "font-normal text-white/70 hover:text-white"
                        }`}
                >
                    Events
                </button>

                {/* Boosted Events Tab */}
                <button
                    type="button"
                    onClick={() => onTabChange?.("boosted")}
                    className={`flex-1 h-[40px] sm:h-[46px] rounded-full flex items-center justify-center font-semibold text-xs sm:text-[15px] leading-[20px] transition-all cursor-pointer ${activeTab === "boosted"
                            ? "bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] text-white"
                            : "font-normal text-white/70 hover:text-white"
                        }`}
                >
                    Boosted Events
                </button>
            </div>
        </div>
    );
}

export default EventsPageHeader;
