"use client";

import React from "react";

export interface SentimentItem {
    name: string;
    percentage: number;
    color: string;
    bgColor: string;
    borderColor: string;
    offsetClass?: string;
}

export interface VisitorSentimentsChartProps {
    overallScore?: number;
    sentiments?: SentimentItem[];
    className?: string;
}

const DEFAULT_SENTIMENTS: SentimentItem[] = [
    {
        name: "Worth It",
        percentage: 62,
        color: "#E8FF57",
        bgColor: "rgba(232, 255, 87, 0.03)",
        borderColor: "rgba(232, 255, 87, 0.094)",
        offsetClass: "w-[80%] self-start",
    },
    {
        name: "Mid",
        percentage: 25,
        color: "#22D3EE",
        bgColor: "rgba(34, 211, 238, 0.03)",
        borderColor: "rgba(34, 211, 238, 0.094)",
        offsetClass: "w-[80%] self-center ml-12",
    },
    {
        name: "Not Worth It",
        percentage: 13,
        color: "#F472B6",
        bgColor: "rgba(244, 114, 182, 0.03)",
        borderColor: "rgba(244, 114, 182, 0.094)",
        offsetClass: "w-[80%] self-start",
    },
];

export function VisitorSentimentsChart({
    overallScore = 47,
    sentiments = DEFAULT_SENTIMENTS,
    className = "",
}: VisitorSentimentsChartProps) {
    return (
        <div
            className={`relative w-full max-w-[598px] h-[496px] p-6 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Background Glow Orb */}
            <div className="absolute left-[206px] top-[-49px] w-[180px] h-[180px] bg-[radial-gradient(70.71%_70.71%_at_50%_50%,#7C3AED_0%,rgba(0,0,0,0)_70%)] opacity-[0.12] rounded-full pointer-events-none z-0" />

            {/* Header Tag & Title */}
            <div className="flex flex-col items-start gap-1 relative z-10 w-full">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C27AFF] shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-extrabold text-[10px] leading-[15px] tracking-[1.4px] text-[#8B7EC8] uppercase">
                        Demographics
                    </span>
                </div>

                <h3 className="font-extrabold text-[16px] leading-[24px] text-white">
                    Visitor Sentiments
                </h3>
            </div>

            {/* Center Concentric Semi-Circle Gauge */}
            <div className="relative w-full h-[180px] flex items-center justify-center relative z-10 my-2">
                <svg className="w-[240px] h-[150px]" viewBox="0 0 240 150" fill="none">
                    <defs>
                        {/* Outer Arc Gradient (Yellow) */}
                        <linearGradient id="gaugeYellowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#E8FF57" />
                            <stop offset="100%" stopColor="#F0A500" />
                        </linearGradient>

                        {/* Middle Arc Gradient (Cyan) */}
                        <linearGradient id="gaugeCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22D3EE" />
                            <stop offset="100%" stopColor="#818CF8" />
                        </linearGradient>

                        {/* Inner Arc Gradient (Pink) */}
                        <linearGradient id="gaugePinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F472B6" />
                            <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                    </defs>

                    {/* Background Dark Tracks */}
                    <path d="M 20 130 A 100 100 0 0 1 220 130" stroke="rgba(124, 58, 237, 0.12)" strokeWidth="14" strokeLinecap="round" />
                    <path d="M 45 130 A 75 75 0 0 1 195 130" stroke="rgba(124, 58, 237, 0.12)" strokeWidth="14" strokeLinecap="round" />
                    <path d="M 70 130 A 50 50 0 0 1 170 130" stroke="rgba(124, 58, 237, 0.12)" strokeWidth="14" strokeLinecap="round" />

                    {/* Outer Arc (Worth It 62%) */}
                    <path
                        d="M 20 130 A 100 100 0 0 1 202 65"
                        stroke="url(#gaugeYellowGrad)"
                        strokeWidth="14"
                        strokeLinecap="round"
                    />

                    {/* Middle Arc (Mid 25%) */}
                    <path
                        d="M 45 130 A 75 75 0 0 1 120 55"
                        stroke="url(#gaugeCyanGrad)"
                        strokeWidth="14"
                        strokeLinecap="round"
                    />

                    {/* Inner Arc (Not Worth It 13%) */}
                    <path
                        d="M 70 130 A 50 50 0 0 1 95 90"
                        stroke="url(#gaugePinkGrad)"
                        strokeWidth="14"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Score Overlay Text */}
                <div className="absolute inset-0 top-12 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-extrabold text-[32px] leading-[32px] text-[#E8FF57]">
                        {overallScore}
                    </span>
                    <span className="font-bold text-[10px] leading-[15px] text-[#8B7EC8] mt-1">
                        / 100 Score
                    </span>
                </div>
            </div>

            {/* Bottom Sentiment Category Bars */}
            <div className="flex flex-col gap-2.5 w-full relative z-10 custom-scrollbar overflow-y-auto max-h-[190px] pr-1">

                {sentiments.map((item) => (
                    <div
                        key={item.name}
                        className={`h-[48px] px-4 rounded-[24px] flex items-center justify-between border transition-all ${item.offsetClass || "w-full"}`}
                        style={{
                            backgroundColor: item.bgColor,
                            borderColor: item.borderColor,
                        }}
                    >
                        {/* Dot & Name */}
                        <div className="flex items-center gap-2.5">
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                    backgroundColor: item.color,
                                    boxShadow: `0px 0px 5px ${item.color}`,
                                }}
                            />
                            <span className="font-semibold text-[12px] leading-[16px] text-[#C4B5FD]">
                                {item.name}
                            </span>
                        </div>

                        {/* Percentage */}
                        <span
                            className="font-extrabold text-[12px] leading-[16px] text-right"
                            style={{ color: item.color }}
                        >
                            {item.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VisitorSentimentsChart;
