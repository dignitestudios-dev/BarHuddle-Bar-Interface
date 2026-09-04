"use client";

import React from "react";
import { cleanImageUrl } from "@/utils/image";

export interface EventTagConfig {
    label: string;
    icon?: string;
    variant: "top" | "soldOut" | "growing" | "upcoming";
}

export interface EventAnalyticsCardProps {
    id?: string;
    title: string;
    date: string;
    image: string;
    tag: EventTagConfig;
    attendees?: number | string;
    attendance?: number | string;
    engagement?: number;
    retentionRate?: number;
    className?: string;
}

const TAG_VARIANT_STYLES: Record<EventTagConfig["variant"], { bg: string; border: string; text: string }> = {
    top: {
        bg: "rgba(232, 255, 87, 0.094)",
        border: "rgba(232, 255, 87, 0.19)",
        text: "#E8FF57",
    },
    soldOut: {
        bg: "rgba(248, 113, 113, 0.12)",
        border: "rgba(248, 113, 113, 0.25)",
        text: "#F87171",
    },
    growing: {
        bg: "rgba(34, 211, 238, 0.12)",
        border: "rgba(34, 211, 238, 0.25)",
        text: "#22D3EE",
    },
    upcoming: {
        bg: "rgba(194, 122, 255, 0.12)",
        border: "rgba(194, 122, 255, 0.25)",
        text: "#C27AFF",
    },
};

export function EventAnalyticsCard({
    title,
    date,
    image,
    tag,
    attendees,
    attendance,
    engagement = 0,
    retentionRate,
    className = "",
}: EventAnalyticsCardProps) {
    const style = TAG_VARIANT_STYLES[tag.variant] || TAG_VARIANT_STYLES.top;
    const displayAttendance = attendance !== undefined ? attendance : (attendees !== undefined ? attendees : 0);
    const displayRate = retentionRate !== undefined ? retentionRate : engagement;
    const numericRate = Math.min(100, Math.max(0, Number(displayRate) || 0));

    return (
        <div
            className={`relative w-[239.5px] min-w-[239.5px] h-[222.09px] bg-[rgba(10,6,48,0.7)] border border-[rgba(124,58,237,0.2)] rounded-[18px] overflow-hidden select-none font-['Manrope',sans-serif] flex flex-col justify-between transition-all hover:border-[rgba(124,58,237,0.5)] hover:shadow-[0px_4px_20px_rgba(124,58,237,0.2)] ${className}`}
        >
            {/* Top Banner Image Section */}
            <div className="relative w-[237.9px] h-[112px] bg-[#3C0366] shrink-0 overflow-hidden">
                {/* Image */}
                <img
                    src={cleanImageUrl(image, "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80")}
                    alt={title}
                    className="w-full h-full object-cover opacity-80 transition-transform duration-300 hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(0deg, rgba(5, 3, 58, 0.95) 0%, rgba(0, 0, 0, 0) 60%)",
                    }}
                />

                {/* Tag Pill (Top Left) */}
                <div
                    className="absolute top-[8px] left-[8px] px-2 py-[2px] rounded-full flex items-center gap-1 z-10"
                    style={{
                        backgroundColor: style.bg,
                        border: `0.8px solid ${style.border}`,
                    }}
                >
                    {tag.icon && <span className="text-[9px]">{tag.icon}</span>}
                    <span
                        className="font-extrabold text-[9px] leading-[14px] uppercase tracking-wide"
                        style={{ color: style.text }}
                    >
                        {tag.label}
                    </span>
                </div>
            </div>

            {/* Bottom Content Body */}
            <div className="w-[237.9px] h-[108.99px] p-[14px] flex flex-col justify-between flex-1">
                {/* Title & Date */}
                <div className="flex flex-col gap-0.5">
                    <h4 className="font-extrabold text-[12px] leading-[16px] text-white truncate">
                        {title}
                    </h4>
                    <span className="font-normal text-[10px] leading-[15px] text-[#8B7EC8]">
                        {date}
                    </span>
                </div>

                {/* Bottom Stats Container */}
                <div className="flex items-end gap-2 w-full pt-[10px] pb-[8px]">
                    {/* Left Column: Attendance */}
                    <div className="flex flex-col shrink-0 min-w-[50px]">
                        <span className="font-extrabold text-[16px] leading-[16px] text-white">
                            {displayAttendance}
                        </span>
                        <span className="font-normal text-[9px] leading-[14px] text-[#8B7EC8]">
                            Attendance
                        </span>
                    </div>

                    {/* Right Column: Retention Rate Progress Bar */}
                    <div className="flex flex-col flex-1 gap-1">
                        <div className="flex items-center justify-between text-[9px] leading-[14px]">
                            <span className="font-normal text-[#8B7EC8]">Retention Rate</span>
                            <span className="font-bold text-[#E8FF57]">{Math.round(numericRate)}%</span>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="w-full h-[4px] bg-[rgba(124,58,237,0.15)] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${numericRate}%`,
                                    background: "linear-gradient(90deg, #7C3AED 0%, #E8FF57 100%)",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventAnalyticsCard;
