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
        <div className={`w-full max-w-[1200px] flex flex-col gap-6 font-['Manrope',sans-serif] ${className}`}>
            {/* Top Row: Title + Create Button */}
            <div className="w-full flex items-center justify-between min-h-[45px]">
                {/* Events Gradient Heading */}
                <h1 className="font-extrabold text-[36px] leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                    Events
                </h1>

                {/* + Create Button */}
                <button
                    type="button"
                    onClick={onCreateEvent}
                    className="w-[135px] h-[45px] px-[30px] py-3 rounded-[100px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center gap-1 font-extrabold text-[16px] leading-[45px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                    <span>+ Create</span>
                </button>
            </div>

            {/* Tab Filter Container Bar */}
            <div className="relative w-[376px] h-[57px] p-[5px] rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex items-center justify-between">
                {/* Events Tab */}
                <button
                    type="button"
                    onClick={() => onTabChange?.("events")}
                    className={`w-[182px] h-[46px] rounded-[100px] flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] text-[16px] leading-[20px] transition-all cursor-pointer ${activeTab === "events"
                            ? "bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] font-semibold text-white"
                            : "font-normal text-white/70 hover:text-white"
                        }`}
                >
                    Events
                </button>

                {/* Boosted Events Tab */}
                <button
                    type="button"
                    onClick={() => onTabChange?.("boosted")}
                    className={`w-[182px] h-[46px] rounded-[100px] flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] text-[16px] leading-[20px] transition-all cursor-pointer ${activeTab === "boosted"
                            ? "bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] font-semibold text-white"
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
