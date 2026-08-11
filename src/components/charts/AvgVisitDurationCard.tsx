"use client";

import React from "react";

export interface DurationBarItem {
    label: string;
    percentage: number;
    color: string;
}

export interface AvgVisitDurationCardProps {
    className?: string;
    duration?: string;
    trendText?: string;
    items?: DurationBarItem[];
}

const DEFAULT_ITEMS: DurationBarItem[] = [
    { label: "Mon–Thu", percentage: 65, color: "#C4B5FD" },
    { label: "Fri", percentage: 82, color: "#7C3AED" },
    { label: "Sat", percentage: 95, color: "#E8FF57" },
];

export function AvgVisitDurationCard({
    className = "",
    duration = "2h 14m",
    trendText = "+12min vs last month",
    items = DEFAULT_ITEMS,
}: AvgVisitDurationCardProps) {
    return (
        <div
            className={`relative w-full max-w-[681px] min-h-[217px] p-6 flex flex-col justify-between bg-[#0E093C]/76 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[22px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Ambient Glow */}
            <div className="absolute left-[-20px] bottom-[-20px] w-[180px] h-[180px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(124,58,237,0.15)_0%,rgba(0,0,0,0)_100%)] pointer-events-none z-0" />

            {/* SecLabel & Heading 3 Container */}
            <div className="flex flex-col items-start gap-1 relative z-10 w-full">
                {/* SecLabel */}
                <div className="flex items-center gap-2 h-[14px]">
                    <div
                        className="w-[4px] h-[14px] rounded-full shrink-0"
                        style={{
                            background: "linear-gradient(180deg, #7C3AED 0%, #E8FF57 100%)",
                        }}
                    />
                    <span className="font-extrabold text-[9px] leading-[14px] tracking-[1.35px] text-[#8B7EC8] uppercase">
                        Duration
                    </span>
                </div>

                {/* Heading 3: Avg Visit Duration */}
                <h3 className="font-extrabold text-[16px] leading-[24px] text-white pt-1">
                    Avg Visit Duration
                </h3>
            </div>

            {/* Main Content Container (padding 16px 0 0, gap 24px) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10 pt-4 w-full">
                {/* Left Column: 2h 14m + Trend */}
                <div className="flex flex-col justify-center items-start shrink-0 w-[138px]">
                    <span className="font-extrabold text-[36px] leading-[40px] text-white tracking-tight">
                        {duration}
                    </span>

                    {/* Trend Row */}
                    <div className="flex items-center gap-[6px] pt-1 text-[#4ADE80]">
                        <svg className="w-[13px] h-[13px] text-[#4ADE80] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-['Manrope'] font-semibold text-[12px] leading-[16px] text-[#4ADE80]">
                            {trendText}
                        </span>
                    </div>
                </div>

                {/* Right Column: 3 Horizontal Progress Bars */}
                <div className="flex flex-col justify-between gap-3 flex-1 w-full max-w-[469px]">
                    {items.map((item) => (
                        <div key={item.label} className="flex flex-col gap-1 w-full">
                            {/* Label & Percentage Row */}
                            <div className="flex items-center justify-between font-['Manrope'] text-[11px] leading-[16px]">
                                <span className="font-normal text-[#8B7EC8]">{item.label}</span>
                                <span className="font-bold text-right" style={{ color: item.color }}>
                                    {item.percentage}%
                                </span>
                            </div>

                            {/* Bar Track & Fill */}
                            <div className="w-full h-[8px] bg-[rgba(124,58,237,0.12)] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${item.percentage}%`,
                                        backgroundColor: item.color,
                                        boxShadow: `0px 0px 4px ${item.color}`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AvgVisitDurationCard;
