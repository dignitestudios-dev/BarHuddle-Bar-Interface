"use client";

import React from "react";
import { useGetSentimentAnalyticsQuery } from "@/features/analytics/api/analytics.queries";

export interface SentimentItem {
    name: string;
    percentage: number;
    color: string;
    bgColor: string;
    borderColor: string;
    offsetClass?: string;
}

export interface VisitorSentimentsChartProps {
    title?: string;
    tagText?: string;
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
        offsetClass: "w-full",
    },
    {
        name: "Mid",
        percentage: 25,
        color: "#22D3EE",
        bgColor: "rgba(34, 211, 238, 0.03)",
        borderColor: "rgba(34, 211, 238, 0.094)",
        offsetClass: "w-full",
    },
    {
        name: "Not Worth It",
        percentage: 13,
        color: "#F472B6",
        bgColor: "rgba(244, 114, 182, 0.03)",
        borderColor: "rgba(244, 114, 182, 0.094)",
        offsetClass: "w-full",
    },
];

export function VisitorSentimentsChart({
    title = "Visitor Sentiment Score",
    tagText = "DEMOGRAPHICS",
    overallScore,
    sentiments,
    className = "",
}: VisitorSentimentsChartProps) {
    const { data: apiSentimentData } = useGetSentimentAnalyticsQuery();

    const finalScore = React.useMemo(() => {
        if (overallScore !== undefined) return overallScore;
        return apiSentimentData?.data?.sentimentScore?.score ?? 0;
    }, [overallScore, apiSentimentData]);

    const finalSentiments = React.useMemo(() => {
        if (sentiments) return sentiments;
        const s = apiSentimentData?.data?.sentimentScore;
        return [
            {
                name: "Worth It",
                percentage: s?.worthIt ?? 0,
                color: "#E8FF57",
                bgColor: "rgba(232, 255, 87, 0.03)",
                borderColor: "rgba(232, 255, 87, 0.094)",
                offsetClass: "w-full",
            },
            {
                name: "Mid",
                percentage: s?.mid ?? 0,
                color: "#22D3EE",
                bgColor: "rgba(34, 211, 238, 0.03)",
                borderColor: "rgba(34, 211, 238, 0.094)",
                offsetClass: "w-full",
            },
            {
                name: "Not Worth It",
                percentage: s?.notWorthIt ?? 0,
                color: "#F472B6",
                bgColor: "rgba(244, 114, 182, 0.03)",
                borderColor: "rgba(244, 114, 182, 0.094)",
                offsetClass: "w-full",
            },
        ];
    }, [sentiments, apiSentimentData]);
    return (
        <div
            className={`relative w-full max-w-[598px] min-h-[420px] p-6 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Background Glow Orb */}
            <div className="absolute right-[-20px] top-[-49px] w-[180px] h-[180px] bg-[radial-gradient(70.71%_70.71%_at_50%_50%,#7C3AED_0%,rgba(0,0,0,0)_70%)] opacity-[0.12] rounded-full pointer-events-none z-0" />

            {/* Header Tag & Title */}
            <div className="flex flex-col items-start gap-1 relative z-10 w-full">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C27AFF] shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-extrabold text-[10px] leading-[15px] tracking-[1.4px] text-[#8B7EC8] uppercase">
                        {tagText}
                    </span>
                </div>

                <h3 className="font-extrabold text-[16px] leading-[24px] text-white">
                    {title}
                </h3>
            </div>

            {/* Center Concentric Semi-Circle Gauge & Right Legend Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 my-4">
                {/* Concentric Gauge */}
                <div className="relative w-[220px] h-[140px] flex items-center justify-center shrink-0">
                    <svg className="w-[220px] h-[140px]" viewBox="0 0 240 150" fill="none">
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
                    <div className="absolute inset-0 top-8 flex flex-col items-center justify-center pointer-events-none">
                        <span className="font-extrabold text-[32px] leading-[32px] text-[#E8FF57]">
                            {finalScore}
                        </span>
                        <span className="font-bold text-[10px] leading-[15px] text-[#8B7EC8] mt-1">
                            / 100 Score
                        </span>
                    </div>
                </div>

                {/* Right Sentiment Category Bars */}
                <div className="flex flex-col gap-2.5 flex-1 w-full max-w-[280px]">
                    {finalSentiments.map((item) => (
                        <div
                            key={item.name}
                            className="h-[44px] px-4 rounded-[20px] flex items-center justify-between border transition-all w-full"
                            style={{
                                backgroundColor: item.bgColor,
                                borderColor: item.borderColor,
                            }}
                        >
                            {/* Dot & Name */}
                            <div className="flex items-center gap-2.5">
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{
                                        backgroundColor: item.color,
                                        boxShadow: `0px 0px 6px ${item.color}`,
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
        </div>
    );
}

export default VisitorSentimentsChart;
