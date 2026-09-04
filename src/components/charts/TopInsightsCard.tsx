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
    isError?: boolean;
    errorMessage?: string;
}

export function TopInsightsCard({
    className = "",
    title = "Top Insights",
    tagText = "AI INSIGHTS",
    items = [],
    isError,
    errorMessage,
}: TopInsightsCardProps) {
    return (
        <div
            className={`relative w-full max-w-[336px] min-h-[439px] p-4 flex flex-col justify-between bg-[#0E093C]/76 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[18px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* SecLabel & Title */}
            <div className="flex flex-col items-start gap-1 relative z-10 w-full mb-1">
                <h3 className="font-extrabold text-[14px] leading-[20px] text-white pt-1">
                    {title}
                </h3>
            </div>

            {isError ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10 relative z-10 text-center">
                    <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#F87171]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <span className="text-[#F87171] font-semibold text-[12px]">
                        {errorMessage || "Unable to load insights"}
                    </span>
                    <span className="text-[#8B7EC8] text-[10px]">
                        Please try again later
                    </span>
                </div>
            ) : !items || items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10 relative z-10 text-center">
                    <div className="w-9 h-9 rounded-full bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.2)] flex items-center justify-center text-[#8B7EC8]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-white font-medium text-[12px]">
                        No insights available
                    </span>
                    <span className="text-[#8B7EC8] text-[10px] px-4">
                        Insights will be generated as customer visits and events are recorded
                    </span>
                </div>
            ) : (
                /* Insight Items List */
                <div className="flex flex-col gap-2 w-full relative z-10 my-1">
                    {items.map((item , idx) => (
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
                                {idx !== 4
                                    &&

                                    <span
                                        className="font-normal text-[9px] leading-[14px] truncate"
                                        style={{ color: item.subtextColor }}
                                    >
                                        {item.subtext}
                                    </span>}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TopInsightsCard;
