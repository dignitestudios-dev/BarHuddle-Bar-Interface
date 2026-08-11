"use client";

import React from "react";

export interface RankedEventItem {
    id: string;
    title: string;
    attendees: string | number;
    engagement: number;
    image: string;
}

export interface TopPerformingEventsCardProps {
    className?: string;
    title?: string;
    tagText?: string;
    items?: RankedEventItem[];
}

const DEFAULT_RANKED_EVENTS: RankedEventItem[] = [
    {
        id: "1",
        title: "Ladies Night",
        attendees: "512 attendees",
        engagement: 87,
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80",
    },
    {
        id: "2",
        title: "Ladies Night",
        attendees: "512 attendees",
        engagement: 87,
        image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=200&q=80",
    },
    {
        id: "3",
        title: "Ladies Night",
        attendees: "512 attendees",
        engagement: 87,
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80",
    },
    {
        id: "4",
        title: "Ladies Night",
        attendees: "512 attendees",
        engagement: 87,
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80",
    },
    {
        id: "5",
        title: "Ladies Night",
        attendees: "512 attendees",
        engagement: 87,
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80",
    },
];

export function TopPerformingEventsCard({
    className = "",
    title = "Top Performing Events",
    tagText = "RANKINGS",
    items = DEFAULT_RANKED_EVENTS,
}: TopPerformingEventsCardProps) {
    return (
        <div
            className={`relative w-full max-w-[340px] min-h-[420px] p-6 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Ambient Background Glow */}
            <div className="absolute right-[-40px] top-[-40px] w-[180px] h-[180px] bg-[radial-gradient(70.71%_70.71%_at_50%_50%,#7C3AED_0%,rgba(0,0,0,0)_70%)] opacity-[0.15] rounded-full pointer-events-none z-0" />

            {/* Header Tag & Title */}
            <div className="flex flex-col items-start gap-1 relative z-10 w-full mb-3">
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#C27AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="font-extrabold text-[10px] leading-[15px] tracking-[1.4px] text-[#8B7EC8] uppercase">
                        {tagText}
                    </span>
                </div>

                <h3 className="font-extrabold text-[16px] leading-[24px] text-white">
                    {title}
                </h3>
            </div>

            {/* List of 5 Ranked Items */}
            <div className="flex flex-col gap-2.5 w-full relative z-10">
                {items.map((item, idx) => (
                    <div
                        key={`${item.id}-${idx}`}
                        className="bg-[rgba(14,9,60,0.8)] border border-[rgba(124,58,237,0.15)] hover:border-[rgba(124,58,237,0.35)] rounded-[16px] p-2.5 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                    >
                        {/* Left: Thumbnail & Details */}
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-10 h-10 rounded-[12px] object-cover shrink-0 border border-[rgba(124,58,237,0.2)]"
                            />
                            <div className="flex flex-col truncate">
                                <span className="font-bold text-[12px] leading-[16px] text-white truncate group-hover:text-[#E8FF57] transition-colors">
                                    {item.title}
                                </span>
                                <span className="font-normal text-[11px] leading-[15px] text-[#8B7EC8] truncate">
                                    {item.attendees}
                                </span>
                            </div>
                        </div>

                        {/* Right: Engagement Percentage */}
                        <div className="flex flex-col items-end shrink-0">
                            <span className="font-extrabold text-[14px] leading-[16px] text-[#E8FF57]">
                                {item.engagement}%
                            </span>
                            <span className="font-normal text-[9px] leading-[12px] text-[#8B7EC8]">
                                engagement
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopPerformingEventsCard;
