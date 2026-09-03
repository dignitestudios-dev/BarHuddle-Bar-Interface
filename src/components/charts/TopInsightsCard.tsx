"use client";

import React from "react";

export interface InsightItem {
    id: string;
    label: string;
    value: string;
    subtext: string;
    subtextColor: string;
    iconSvg: React.ReactNode;
    iconBg: string;
    iconBorder: string;
}

export interface TopInsightsCardProps {
    className?: string;
    title?: string;
    tagText?: string;
    items?: InsightItem[];
}

const DEFAULT_INSIGHTS: InsightItem[] = [
    {
        id: "best-event",
        label: "Best Event",
        value: "Ladies Night",
        subtext: "91% engagement",
        subtextColor: "#E8FF57",
        iconBg: "rgba(232, 255, 87, 0.07)",
        iconBorder: "rgba(232, 255, 87, 0.133)",
        iconSvg: (
            <svg className="w-3 h-3 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
    },
    {
        id: "peak-hours",
        label: "Peak Hours",
        value: "10 PM – 1 AM",
        subtext: "Fri & Sat",
        subtextColor: "#F472B6",
        iconBg: "rgba(244, 114, 182, 0.07)",
        iconBorder: "rgba(244, 114, 182, 0.133)",
        iconSvg: (
            <svg className="w-3 h-3 text-[#F472B6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
        ),
    },
    {
        id: "top-segment",
        label: "Top Segment",
        value: "Ages 25–34",
        subtext: "48% of traffic",
        subtextColor: "#7C3AED",
        iconBg: "rgba(124, 58, 237, 0.07)",
        iconBorder: "rgba(124, 58, 237, 0.133)",
        iconSvg: (
            <svg className="w-3 h-3 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        id: "best-day",
        label: "Best Day",
        value: "Saturday",
        subtext: "1,320 avg visitors",
        subtextColor: "#22D3EE",
        iconBg: "rgba(34, 211, 238, 0.07)",
        iconBorder: "rgba(34, 211, 238, 0.133)",
        iconSvg: (
            <svg className="w-3 h-3 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: "satisfaction",
        label: "Satisfaction",
        value: "87 / 100",
        subtext: "284 reviews",
        subtextColor: "#4ADE80",
        iconBg: "rgba(74, 222, 128, 0.07)",
        iconBorder: "rgba(74, 222, 128, 0.133)",
        iconSvg: (
            <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

export function TopInsightsCard({
    className = "",
    title = "Top Insights",
    tagText = "AI INSIGHTS",
    items = DEFAULT_INSIGHTS,
}: TopInsightsCardProps) {
    return (
        <div
            className={`relative w-full max-w-[336px] min-h-[439px] p-4 flex flex-col justify-between bg-[#0E093C]/76 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[18px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* SecLabel & Title */}
            <div className="flex flex-col items-start gap-1 relative z-10 w-full mb-1">
                {/* <div className="flex items-center gap-1.5 h-[15px]">
                    <svg className="w-3 h-3 text-[#C27AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-extrabold text-[10px] leading-[15px] tracking-[1px] text-[#8B7EC8] uppercase">
                        {tagText}
                    </span>
                </div> */}

                <h3 className="font-extrabold text-[14px] leading-[20px] text-white pt-1">
                    {title}
                </h3>
            </div>

            {/* 5 Insight Items List */}
            <div className="flex flex-col gap-2 w-full relative z-10 my-1">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="w-[302px] max-w-full h-[66px] bg-[rgba(10,6,48,0.6)] border border-[rgba(124,58,237,0.14)] rounded-[12px] p-2.5 flex items-center gap-2.5 transition-all hover:border-[rgba(124,58,237,0.35)]"
                    >
                        {/* Circular Icon Badge */}
                        <div
                            className="w-7 h-7 rounded-[20px] flex items-center justify-center shrink-0"
                            style={{
                                backgroundColor: item.iconBg,
                                border: `0.8px solid ${item.iconBorder}`,
                            }}
                        >
                            {item.iconSvg}
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col justify-center gap-0.5 truncate flex-1">
                            <span className="font-semibold text-[9px] leading-[14px] text-[#8B7EC8]">
                                {item.label}
                            </span>
                            <span className="font-extrabold text-[11px] leading-[16px] text-white truncate">
                                {item.value}
                            </span>
                            <span
                                className="font-normal text-[9px] leading-[14px] truncate"
                                style={{ color: item.subtextColor }}
                            >
                                {item.subtext}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopInsightsCard;
