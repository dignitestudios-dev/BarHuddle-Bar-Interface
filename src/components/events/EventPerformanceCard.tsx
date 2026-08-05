"use client";

import React from "react";
import Image from "next/image";

export interface EventPerformanceItem {
    id: number;
    title: string;
    date: string;
    attendees: number;
    engagement: number;
    imageSrc?: string;
}

export interface EventPerformanceCardProps {
    events?: EventPerformanceItem[];
    className?: string;
}

const DEFAULT_EVENTS: EventPerformanceItem[] = [
    {
        id: 1,
        title: "Ladies Night",
        date: "Fri June, 30",
        attendees: 345,
        engagement: 80,
        imageSrc: "/images/event-ladies-night.png",
    },
    {
        id: 2,
        title: "Ladies Night",
        date: "Fri June, 30",
        attendees: 345,
        engagement: 80,
        imageSrc: "/images/event-ladies-night.png",
    },
    {
        id: 3,
        title: "Ladies Night",
        date: "Fri June, 30",
        attendees: 345,
        engagement: 80,
        imageSrc: "/images/event-ladies-night.png",
    },
    {
        id: 4,
        title: "Ladies Night",
        date: "Fri June, 30",
        attendees: 345,
        engagement: 80,
        imageSrc: "/images/event-ladies-night.png",
    },
];

export function EventPerformanceCard({
    events = DEFAULT_EVENTS,
    className = "",
}: EventPerformanceCardProps) {
    return (
        <div
            className={`relative w-full max-w-[598px] h-[496px] p-6 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Background Glow Orb */}
            <div className="absolute right-[-20px] bottom-[-20px] w-[200px] h-[120px] bg-[radial-gradient(58.31%_97.18%_at_50%_50%,rgba(232,255,87,0.3)_0%,rgba(0,0,0,0)_70%)] opacity-[0.1] rounded-full pointer-events-none z-0" />

            {/* Header Row: Title & View All Button */}
            <div className="flex items-center justify-between w-full relative z-10 mb-4">
                {/* Left Title & Tag */}
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C27AFF] shrink-0">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-extrabold text-[10px] leading-[15px] tracking-[1.4px] text-[#8B7EC8] uppercase">
                            Events
                        </span>
                    </div>

                    <h3 className="font-extrabold text-[16px] leading-[24px] text-white">
                        Event Performance
                    </h3>
                </div>

                {/* Right View All Button */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(232,255,87,0.03)] border border-[rgba(232,255,87,0.157)] text-[#E8FF57] font-bold text-[11px] hover:bg-[rgba(232,255,87,0.1)] transition-all cursor-pointer"
                >
                    <span>View All</span>
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Event Cards Scrollable List */}
            <div className="flex-1 w-full flex flex-col gap-3 overflow-y-auto pr-1 relative z-10 custom-scrollbar">
                {events.map((event, idx) => (
                    <div
                        key={`${event.id}-${idx}`}
                        className="relative w-full min-h-[103px] p-2.5 bg-[rgba(10,6,45,0.6)] border border-[rgba(124,58,237,0.15)] rounded-[18px] flex items-center gap-3 transition-all hover:border-[rgba(124,58,237,0.35)]"
                    >
                        {/* Event Thumbnail */}
                        <div className="relative w-[100px] h-[87px] rounded-[12px] overflow-hidden shrink-0 bg-gradient-to-br from-[#1E0938] to-[#0B0633] flex items-center justify-center">
                            {/* Neon Green Laser Cover Accent */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0633] via-[#009706]/40 to-[#E8FF57]/30 opacity-80" />
                            <div className="relative z-10 text-center flex flex-col items-center">
                                <svg className="w-6 h-6 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                        </div>

                        {/* Event Info & Engagement Progress */}
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0 pr-2">
                            {/* Top Title & Date Row */}
                            <div className="flex flex-col">
                                <h4 className="font-extrabold text-[16px] leading-[22px] text-white capitalize truncate">
                                    {event.title}
                                </h4>
                                <span className="font-normal text-[11px] leading-[18px] text-[#E8C7FF] capitalize">
                                    {event.date}
                                </span>
                            </div>

                            {/* Bottom Attendees & Engagement Progress Row */}
                            <div className="flex items-end justify-between gap-4 mt-2">
                                {/* Attendees Count */}
                                <div className="flex flex-col">
                                    <span className="font-extrabold text-[16px] leading-[20px] text-white">
                                        {event.attendees}
                                    </span>
                                    <span className="font-normal text-[11px] leading-[16px] text-[#E8C7FF] capitalize">
                                        Attendees
                                    </span>
                                </div>

                                {/* Engagement Bar */}
                                <div className="flex-1 flex flex-col gap-1 max-w-[260px]">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="font-normal text-[#E8C7FF]">Engagement</span>
                                        <span className="font-bold text-[#FDF88F]">{event.engagement}%</span>
                                    </div>
                                    <div className="w-full h-[6px] bg-[#0B083C] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-[#C27AFF] to-[#FDF88F] transition-all duration-500"
                                            style={{ width: `${event.engagement}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventPerformanceCard;
