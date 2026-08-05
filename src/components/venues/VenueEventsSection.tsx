"use client";

import React from "react";

export interface VenueEvent {
    id: number;
    title: string;
    dateTime: string;
    imageUrl: string;
}

export interface VenueEventsSectionProps {
    events?: VenueEvent[];
    className?: string;
}

const DEFAULT_EVENTS: VenueEvent[] = [
    {
        id: 1,
        title: "Ladies Night",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 2,
        title: "Ladies Night",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 3,
        title: "Ladies Night",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 4,
        title: "Ladies Night",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 5,
        title: "Ladies Night",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 6,
        title: "Ladies Night",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
    },
];

export function VenueEventsSection({
    events = DEFAULT_EVENTS,
    className = "",
}: VenueEventsSectionProps) {
    return (
        <div
            className={`w-full p-6 flex flex-col gap-4 bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.35),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[20px] font-['Manrope',sans-serif] ${className}`}
        >
            {/* Header Row: EVENTS Tag + Title + View All Button */}
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-[4px] h-[20px] bg-gradient-to-b from-[#7C3AED] to-[#E8FF57] rounded-full shrink-0" />
                        <span className="font-bold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#9D8FD0]">
                            EVENTS
                        </span>
                    </div>
                    <h2 className="font-bold text-[20px] leading-[28px] text-white">
                        Events
                    </h2>
                </div>

                {/* View All Pill Button */}
                <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-[rgba(232,255,87,0.08)] border border-[rgba(232,255,87,0.3)] font-semibold text-[12px] leading-[16px] text-[#E8FF57] hover:bg-[rgba(232,255,87,0.15)] transition-all cursor-pointer"
                >
                    View All
                </button>
            </div>

            {/* Grid of Event Cards (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="w-full h-[209px] rounded-[16px] bg-[#070425] overflow-hidden flex flex-col justify-between border border-purple-900/40 hover:border-purple-600/60 transition-all cursor-pointer group shadow-lg"
                    >
                        {/* Event Top Banner Image */}
                        <div className="relative w-full h-[147px] overflow-hidden bg-[#1E0B36]">
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050332]/50 to-[#070425]" />
                        </div>

                        {/* Event Details Content Below Image */}
                        <div className="p-3 flex flex-col gap-0.5 justify-center flex-1 bg-[#070425]">
                            <h3 className="font-semibold text-[14px] leading-[20px] text-white truncate">
                                {event.title}
                            </h3>

                            <div className="flex items-center gap-1.5 text-[11px] leading-[16px] text-[#C4B5FD]">
                                <svg className="w-3 h-3 text-[#8B7EC8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{event.dateTime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VenueEventsSection;
