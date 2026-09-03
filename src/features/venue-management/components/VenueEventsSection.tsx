"use client";

import React from "react";
import { cleanImageUrl, DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";

export interface VenueEvent {
    id: number;
    title: string;
    dateTime: string;
    imageUrl: string;
}

export interface VenueEventsSectionProps {
    title?: string;
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
    title = "Events",
    events = [],
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
                        {title}
                    </h2>
                </div>

                {/* View All Pill Button */}
                {events.length > 0 && (
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-full bg-[rgba(232,255,87,0.08)] border border-[rgba(232,255,87,0.3)] font-semibold text-[12px] leading-[16px] text-[#E8FF57] hover:bg-[rgba(232,255,87,0.15)] transition-all cursor-pointer"
                    >
                        View All
                    </button>
                )}
            </div>

            {/* Event Cards Grid */}
            {events.length === 0 ? (
                <div className="w-full py-8 flex flex-col items-center justify-center gap-2 text-center">
                    <span className="font-semibold text-sm text-white/70">No events listed</span>
                    <span className="text-xs text-[#9D8FD0]">Events for this venue will appear here.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-1">
                    {events.map((evt) => (
                        <div
                            key={evt.id}
                            className="relative w-full h-[220px] rounded-[16px] overflow-hidden group shadow-[0px_4px_16px_rgba(0,0,0,0.3)] border border-[rgba(124,58,237,0.3)] bg-purple-950/40"
                        >
                            {/* Event Image */}
                            <img
                                src={cleanImageUrl(evt.imageUrl, DEFAULT_VENUE_IMAGE)}
                                alt=""
                                onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />

                            {/* Event Details Card (Bottom Overlay) */}
                            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-[12px] bg-[rgba(20,14,80,0.7)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] flex flex-col gap-0.5">
                                <h3 className="font-bold text-[15px] leading-[20px] text-white truncate">
                                    {evt.title}
                                </h3>
                                <span className="font-medium text-[12px] leading-[16px] text-[#E8FF57]">
                                    {evt.dateTime}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VenueEventsSection;
