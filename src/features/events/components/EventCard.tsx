"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cleanImageUrl } from "@/utils/image";

export interface EventCardData {
    id: number | string;
    title: string;
    venueName: string;
    dateTime: string;
    imageUrl: string;
    views?: string;
    attendees?: string;
    ratio: string;
    conversionRate: string;
    retentionRate?: string;
    performancePercent: number;
    isBoosted?: boolean;
    computedStatus?: "expired" | "active" | "upcoming" | string;
    status?: string;
}

export function getEventStatusConfig(statusVal?: string) {
    const s = (statusVal || "").toLowerCase().trim();
    if (s === "active") {
        return {
            label: "Active",
            badgeClass: "bg-[rgba(74,222,128,0.14)] border-[rgba(74,222,128,0.35)] text-[#4ADE80]",
            dotClass: "bg-[#4ADE80] shadow-[0px_0px_6px_#4ADE80]",
        };
    }
    if (s === "upcoming") {
        return {
            label: "Upcoming",
            badgeClass: "bg-[rgba(232,255,87,0.14)] border-[rgba(232,255,87,0.35)] text-[#E8FF57]",
            dotClass: "bg-[#E8FF57] shadow-[0px_0px_6px_#E8FF57]",
        };
    }
    if (s === "expired") {
        return {
            label: "Expired",
            badgeClass: "bg-[rgba(251,113,133,0.14)] border-[rgba(251,113,133,0.35)] text-[#FB7185]",
            dotClass: "bg-[#FB7185] shadow-[0px_0px_6px_#FB7185]",
        };
    }
    if (!s) return null;
    return {
        label: s.charAt(0).toUpperCase() + s.slice(1),
        badgeClass: "bg-[rgba(139,126,200,0.14)] border-[rgba(139,126,200,0.3)] text-[#8B7EC8]",
        dotClass: "bg-[#8B7EC8] shadow-[0px_0px_6px_#8B7EC8]",
    };
}

export interface EventCardProps {
    event: EventCardData;
    rawEvent?: any;
    variant?: "default" | "boosting";
    onActionClick?: (event: EventCardData) => void;
    onBoostToggle?: (event: EventCardData) => void;
    onEdit?: (event: EventCardData, raw?: any) => void;
    onDelete?: (event: EventCardData, raw?: any) => void;
    className?: string;
}

export function EventCard({
    event,
    rawEvent,
    variant = "default",
    onActionClick,
    onBoostToggle,
    onEdit,
    onDelete,
    className = "",
}: EventCardProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const statusConfig = getEventStatusConfig(event.computedStatus || event.status);

    // Close menu on click outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (variant === "boosting") {
            onBoostToggle?.(event);
        } else if (onActionClick) {
            onActionClick(event);
        } else {
            router.push(`/app/events/${event.id}`);
        }
    };

    const isBoostingMode = variant === "boosting";

    return (
        <div
            className={`relative w-full max-w-[370px] min-h-[440px] bg-[rgba(10,6,50,0.75)] border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.04)] rounded-[22px] overflow-hidden flex flex-col justify-between font-['Manrope',sans-serif] hover:border-[rgba(124,58,237,0.4)] transition-all duration-300 group ${className}`}
        >
            {/* Top Image Section (176px) */}
            <div className="relative w-full h-[176px] bg-[#3C0366] overflow-hidden shrink-0">
                {/* Actively Boosted Top Banner */}
                {isBoostingMode && event.isBoosted && (
                    <div className="absolute top-0 inset-x-0 h-7 bg-gradient-to-r from-[#7C3AED] via-[#9F4FFA] to-[#7C3AED] flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold tracking-[1.2px] uppercase text-[#E8FF57] z-20 shadow-md">
                        <span>⚡</span>
                        <span>ACTIVELY BOOSTED</span>
                        <span>⚡</span>
                    </div>
                )}

                {/* Event Photo */}
                <img
                    src={cleanImageUrl(event.imageUrl, "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80")}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(5,3,50,0.5)] to-[#050332]" />

                {/* Teal/Green Gradient Touch */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,222,128,0.2)] to-[rgba(34,211,238,0.12)] opacity-50 pointer-events-none" />

                {/* Status Badge (Active / Upcoming / Expired) - not shown on boosted events or in boosting mode */}
                {!isBoostingMode && !event.isBoosted && statusConfig && (
                    <div
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border flex items-center gap-1.5 backdrop-blur-md text-[10px] font-bold tracking-[0.2px] shadow-sm z-20 transition-all ${statusConfig.badgeClass}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                        <span>{statusConfig.label}</span>
                    </div>
                )}

                {/* Top Right Options Menu Button (3 Dots) & Dropdown */}
                <div ref={menuRef} className="absolute top-3 right-3 z-30">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className="w-8 h-8 rounded-full bg-[rgba(124,58,237,0.7)] hover:bg-[#7C3AED] backdrop-blur-md flex items-center justify-center text-white transition-colors shadow-md cursor-pointer"
                        aria-label="Event options menu"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>

                    {/* Options Dropdown Menu */}
                    {isMenuOpen && (
                        <div
                            className="absolute right-0 mt-2 w-36 bg-[#080530] border border-[rgba(124,58,237,0.3)] shadow-[0px_8px_32px_rgba(0,0,0,0.6)] rounded-[14px] p-1.5 flex flex-col gap-1 z-40 animate-in fade-in zoom-in-95 duration-150 text-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Edit Option */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onEdit?.(event, rawEvent);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                            >
                                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span>Edit Event</span>
                            </button>

                            {/* Delete Option */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onDelete?.(event, rawEvent);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                            >
                                <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete Event</span>
                            </button>
                        </div>
                    )}
                </div>
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
                    {/* Stat 1: Attendees */}
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-[24px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.12)]">
                        <span className="font-extrabold text-[14px] leading-[20px] text-[#22D3EE]">
                            {event.attendees ?? event.views ?? "0"}
                        </span>
                        <span className="font-semibold text-[9px] leading-[14px] text-[#8B7EC8]">
                            Attendees
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

                    {/* Stat 3: Retention Rate */}
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-[24px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.12)]">
                        <span className="font-extrabold text-[14px] leading-[20px] text-[#4ADE80]">
                            {event.retentionRate || event.conversionRate}
                        </span>
                        <span className="font-semibold text-[9px] leading-[14px] text-[#8B7EC8] text-center truncate w-full px-0.5">
                            Retention Rate
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

                {/* Action CTA Button */}
                {isBoostingMode ? (
                    event.isBoosted ? (
                        /* Currently Boosted Button State */
                        <button
                            type="button"
                            onClick={handleClick}
                            className="w-full h-[52px] rounded-[14px] bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.28)] flex items-center justify-center gap-2 font-bold text-[12px] sm:text-[13px] leading-[16px] text-[#4ADE80] hover:bg-[rgba(74,222,128,0.18)] transition-all cursor-pointer mt-1"
                        >
                            {/* Checkmark Icon */}
                            <svg className="w-4 h-4 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Currently Boosted</span>
                        </button>
                    ) : (
                        /* Boost Event Button State */
                        <button
                            type="button"
                            onClick={handleClick}
                            className="w-full h-[52px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_22px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-1"
                        >
                            {/* Lightning Bolt Icon */}
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Boost Event</span>
                        </button>
                    )
                ) : (
                    /* Default Mode Button ("View Details") */
                    <button
                        type="button"
                        onClick={handleClick}
                        className="w-full h-[46px] rounded-[14px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_22px_rgba(124,58,237,0.4)] flex items-center justify-center font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-1"
                    >
                        View Details
                    </button>
                )}
            </div>
        </div>
    );
}

export default EventCard;
