"use client";

import React from "react";

export interface DurationBarItem {
    label: string;
    percentage: number;
    color: string;
    durationText?: string;
}

export interface AvgVisitDurationCardProps {
    className?: string;
    duration?: string;
    trendText?: string;
    items?: DurationBarItem[];
    isError?: boolean;
    errorMessage?: string;
}

const DEFAULT_ITEMS: DurationBarItem[] = [
    { label: "Mon–Thu", percentage: 0, color: "#C4B5FD", durationText: "0m" },
    { label: "Fri", percentage: 0, color: "#7C3AED", durationText: "0m" },
    { label: "Sat", percentage: 0, color: "#E8FF57", durationText: "0m" },
];

export function AvgVisitDurationCard({
    className = "",
    duration = "0m",
    trendText = "+0m vs last period",
    items = DEFAULT_ITEMS,
    isError,
    errorMessage,
}: AvgVisitDurationCardProps) {
    const isNegative = trendText.trim().startsWith("-");
    const trendColor = isNegative ? "text-[#EF4444]" : "text-[#4ADE80]";

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

            {isError ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 relative z-10">
                    <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#F87171]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <span className="text-[#F87171] font-semibold text-[13px]">
                        {errorMessage || "Unable to load visit duration data"}
                    </span>
                    <span className="text-[#8B7EC8] text-[11px]">
                        Please try again later
                    </span>
                </div>
            ) : (
            /* Main Content Container (padding 16px 0 0, gap 24px) */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10 pt-4 w-full">
                {/* Left Column: 0m + Trend */}
                <div className="flex flex-col justify-center items-start shrink-0 min-w-[138px]">
                    <span className="font-extrabold text-[36px] leading-[40px] text-white tracking-tight">
                        {duration}
                    </span>

                    {/* Trend Row */}
                    <div className={`flex items-center gap-[6px] pt-1 ${trendColor}`}>
                        <svg className={`w-[13px] h-[13px] shrink-0 ${trendColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={isNegative ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" : "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"}
                            />
                        </svg>
                        <span className={`font-['Manrope'] font-semibold text-[12px] leading-[16px] ${trendColor}`}>
                            {trendText}
                        </span>
                    </div>
                </div>

                {/* Right Column: Horizontal Progress Bars */}
                <div className="flex flex-col justify-between gap-3 flex-1 w-full max-w-[469px]">
                    {items.map((item) => (
                        <div key={item.label} className="flex flex-col gap-1 w-full">
                            {/* Label & Duration/Percentage Row */}
                            <div className="flex items-center justify-between font-['Manrope'] text-[11px] leading-[16px]">
                                <span className="font-normal text-[#8B7EC8]">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    {item.durationText && (
                                        <span className="font-semibold text-white/80 text-[11px]">
                                            {item.durationText}
                                        </span>
                                    )}
                                    <span className="font-bold text-right" style={{ color: item.color }}>
                                        {item.percentage}%
                                    </span>
                                </div>
                            </div>

                            {/* Bar Track & Fill */}
                            <div className="w-full h-[8px] bg-[rgba(124,58,237,0.12)] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${item.percentage}%`,
                                        backgroundColor: item.color,
                                        boxShadow: item.percentage > 0 ? `0px 0px 4px ${item.color}` : "none",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    );
}

export default AvgVisitDurationCard;
