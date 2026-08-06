"use client";

import React from "react";
import { useRouter } from "next/navigation";

export interface EventCardData {
    id: number;
    title: string;
    venueName: string;
    dateTime: string;
    imageUrl: string;
    views: string;
    ratio: string;
    conversionRate: string;
    performancePercent: number;
    isBoosted?: boolean;
}

export interface EventCardProps {
    event: EventCardData;
    onActionClick?: (event: EventCardData) => void;
    className?: string;
}

export function EventCard({
    event,
    className = "",
}: EventCardProps) {
    const router = useRouter();

    const handleClick = () => {

        router.push(`/app/events/${event.id}`);

    };

    return (
        <div
            className={`relative w-full max-w-[370px] min-h-[428px] bg-[rgba(10,6,50,0.75)] border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.04)] rounded-[22px] overflow-hidden flex flex-col justify-between font-['Manrope',sans-serif] hover:border-[rgba(124,58,237,0.4)] transition-all duration-300 group ${className}`}
        >
            {/* Top Image Section (176px) */}
            <div className="relative w-full h-[176px] bg-[#3C0366] overflow-hidden shrink-0">
                {/* Event Photo */}
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(5,3,50,0.5)] to-[#050332]" />

                {/* Teal/Green Gradient Touch */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,222,128,0.2)] to-[rgba(34,211,238,0.12)] opacity-50 pointer-events-none" />

                {/* Top Right Options Menu Button (3 Dots) */}
                <button
                    type="button"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[rgba(124,58,237,0.7)] backdrop-blur-md flex items-center justify-center text-white hover:bg-[#7C3AED] transition-colors shadow-md cursor-pointer z-10"
                    aria-label="Event options menu"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>

            {/* Card Body Container */}
            <div className="p-4 sm:p-5 flex flex-col gap-3.5 flex-1 justify-between">
                {/* Title & Date/Time Row */}
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between w-full">
                        <h3 className="font-extrabold text-[16px] leading-[20px] text-white truncate">
                            {event.title}
                        </h3>

                        {/* Date/Time Badge */}
                        <div className="flex items-center gap-1.5 text-[11px] leading-[16px] text-[#C4B5FD] shrink-0">
                            <svg className="w-3 h-3 text-[#C4B5FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{event.dateTime}</span>
                        </div>
                    </div>

                    {/* Venue Location Row */}
                    <div className="flex items-center gap-1.5 text-[11px] leading-[16px] text-[#8B7EC8]">
                        <svg className="w-3 h-3 text-[#8B7EC8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.venueName}</span>
                    </div>
                </div>

                {/* 3 Metric Stat Cards Row */}
                <div className="grid grid-cols-3 gap-2 w-full">
                    {/* Stat 1: Views */}
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-[24px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.12)]">
                        <span className="font-extrabold text-[14px] leading-[20px] text-[#22D3EE]">
                            {event.views}
                        </span>
                        <span className="font-semibold text-[9px] leading-[14px] text-[#8B7EC8]">
                            Views
                        </span>
                    </div>

                    {/* Stat 2: M/F Ratio */}
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-[24px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.12)]">
                        <span className="font-extrabold text-[14px] leading-[20px] text-[#4ADE80]">
                            {event.ratio}
                        </span>
                        <span className="font-semibold text-[9px] leading-[14px] text-[#8B7EC8]">
                            M/F Ratio
                        </span>
                    </div>

                    {/* Stat 3: Rate */}
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-[24px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.12)]">
                        <span className="font-extrabold text-[14px] leading-[20px] text-[#4ADE80]">
                            {event.conversionRate}
                        </span>
                        <span className="font-semibold text-[9px] leading-[14px] text-[#8B7EC8]">
                            Rate
                        </span>
                    </div>
                </div>

                {/* Organic Performance Progress Bar Row */}
                <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8]">
                            Organic Performance
                        </span>
                        <span className="font-extrabold text-[10px] leading-[15px] text-[#F472B6]">
                            {event.performancePercent}%
                        </span>
                    </div>
                    {/* Progress Track */}
                    <div className="w-full h-[6px] rounded-full bg-[rgba(124,58,237,0.12)] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4ADE80] shadow-[0px_0px_6px_rgba(74,222,128,0.44)] transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, event.performancePercent))}%` }}
                        />
                    </div>
                </div>

                {/* Action CTA Button ("View Details" / "Boost Event") */}
                <button
                    type="button"
                    onClick={handleClick}
                    className="w-full h-[46px] rounded-[14px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_22px_rgba(124,58,237,0.4)] flex items-center justify-center font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-1"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default EventCard;
