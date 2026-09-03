"use client";

import React from "react";

export interface ScoreProgressItem {
    label: string;
    percentage: number;
    color: string;
}

export interface OverallScoreCardProps {
    className?: string;
    score?: number;
    tagText?: string;
    title?: string;
    bannerText?: string;
    items?: ScoreProgressItem[];
}

const DEFAULT_SCORE_ITEMS: ScoreProgressItem[] = [
    { label: "Worth It", percentage: 62, color: "#E8FF57" },
    { label: "Mid", percentage: 25, color: "#22D3EE" },
    { label: "Not Worth It", percentage: 13, color: "#F472B6" },
];

export function OverallScoreCard({
    className = "",
    score = 87,
    tagText = "SATISFACTION",
    title = "Overall Score",
    bannerText = "Customers are happy · +3.2% vs last month",
    items = DEFAULT_SCORE_ITEMS,
}: OverallScoreCardProps) {
    return (
        <div
            className={`relative w-full max-w-[380px] min-h-[439px] p-6 flex flex-col justify-between bg-[#0E093C]/76 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[22px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Ambient Background Glow */}
            <div className="absolute right-[-20px] top-[-20px] w-[180px] h-[180px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(124,58,237,0.15)_0%,rgba(0,0,0,0)_100%)] pointer-events-none z-0" />

            {/* SecLabel & Title */}
            <div className="flex flex-col items-start gap-1 relative z-10 w-full mb-2">
                <div className="flex items-center gap-2 h-[14px]">
                    <div
                        className="w-[4px] h-[14px] rounded-full shrink-0"
                        style={{
                            background: "linear-gradient(180deg, #7C3AED 0%, #E8FF57 100%)",
                        }}
                    />
                    <span className="font-extrabold text-[9px] leading-[14px] tracking-[1.35px] text-[#8B7EC8] uppercase">
                        {tagText}
                    </span>
                </div>

                <h3 className="font-extrabold text-[16px] leading-[24px] text-white pt-1">
                    {title}
                </h3>
            </div>

            {/* Circular Gauge Ring with Score */}
            <div className="relative w-full h-[120px] flex items-center justify-center relative z-10 my-2">
                <svg className="w-[120px] h-[120px]" viewBox="0 0 100 100">
                    {/* Background Track Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="rgba(124, 58, 237, 0.15)"
                        strokeWidth="8"
                    />
                    {/* Progress Circle Arc */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="url(#overallScoreGradient)"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - score / 100)}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                    />
                    <defs>
                        <linearGradient id="overallScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E8FF57" />
                            <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Score Number inside Donut */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="font-extrabold text-[28px] leading-[28px] text-white">
                        {score}%
                    </span>
                </div>
            </div>

            {/* Middle Progress Bars */}
            <div className="flex flex-col gap-3 w-full relative z-10 my-2">
                {items.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between font-['Manrope'] text-[11px] leading-[16px]">
                            <span className="font-normal text-[#8B7EC8]">{item.label}</span>
                            <span className="font-extrabold" style={{ color: item.color }}>
                                {item.percentage}%
                            </span>
                        </div>
                        <div className="w-full h-[6px] bg-[rgba(124,58,237,0.12)] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: item.color,
                                    boxShadow: `0px 0px 6px ${item.color}`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Status Banner Pill */}
            {/* <div className="w-full relative z-10 pt-2">
                <div className="w-full px-3.5 py-2.5 rounded-full bg-[rgba(74,222,128,0.06)] border border-[rgba(74,222,128,0.2)] flex items-center gap-2 justify-center">
                    <svg className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-[11px] leading-[15px] text-[#4ADE80] truncate">
                        {bannerText}
                    </span>
                </div>
            </div> */}
        </div>
    );
}

export default OverallScoreCard;
