"use client";

import React from "react";
import { useGetVisitorSentimentDashboardQuery } from "@/features/analytics/api/analytics.queries";

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
    isError?: boolean;
    errorMessage?: string;
}

const DEFAULT_SENTIMENTS: SentimentItem[] = [
    {
        name: "Worth It",
        percentage: 0,
        color: "#E8FF57",
        bgColor: "rgba(232, 255, 87, 0.04)",
        borderColor: "rgba(232, 255, 87, 0.18)",
        offsetClass: "w-full",
    },
    {
        name: "Check It Out",
        percentage: 0,
        color: "#22D3EE",
        bgColor: "rgba(34, 211, 238, 0.04)",
        borderColor: "rgba(34, 211, 238, 0.18)",
        offsetClass: "w-full",
    },
    {
        name: "Not Worth It",
        percentage: 0,
        color: "#F472B6",
        bgColor: "rgba(244, 114, 182, 0.04)",
        borderColor: "rgba(244, 114, 182, 0.18)",
        offsetClass: "w-full",
    },
];

export function VisitorSentimentsChart({
    title = "Visitor Sentiment Score",
    tagText = "DEMOGRAPHICS",
    overallScore,
    sentiments,
    className = "",
    isError,
    errorMessage,
}: VisitorSentimentsChartProps) {
    const { data: apiSentimentData, isError: internalIsError } = useGetVisitorSentimentDashboardQuery();

    const hasExplicitData = (overallScore !== undefined && overallScore > 0) || (sentiments && sentiments.length > 0 && sentiments.some(s => s.percentage > 0));
    const showError = isError || (internalIsError && !hasExplicitData);

    const finalScore = React.useMemo(() => {
        if (overallScore !== undefined) return overallScore;
        const d = apiSentimentData?.data as any;
        if (d?.score !== undefined && d?.score !== null) return Number(d.score);
        if (d?.sentimentScore?.score !== undefined) return Number(d.sentimentScore.score);
        if (typeof d?.sentimentScore === "number") return d.sentimentScore;
        const w = typeof d?.worthIt === "object" ? d?.worthIt?.percentage : (typeof d?.worthIt === "number" ? d?.worthIt : undefined);
        if (w !== undefined) return Math.round(w);
        return 0;
    }, [overallScore, apiSentimentData]);

    const finalSentiments = React.useMemo<SentimentItem[]>(() => {
        if (sentiments && sentiments.length > 0) return sentiments;
        const d = apiSentimentData?.data as any;
        const getPct = (val: any) => {
            if (val === undefined || val === null) return undefined;
            if (typeof val === "number") return Math.round(val);
            if (typeof val.percentage === "number") return Math.round(val.percentage);
            return undefined;
        };
        const w = getPct(d?.worthIt);
        const m = getPct(d?.mid);
        const nw = getPct(d?.notWorthIt);
        if (w !== undefined || m !== undefined || nw !== undefined) {
            return [
                {
                    name: "Worth It",
                    percentage: w ?? 0,
                    color: "#E8FF57",
                    bgColor: "rgba(232, 255, 87, 0.04)",
                    borderColor: "rgba(232, 255, 87, 0.18)",
                    offsetClass: "w-full",
                },
                {
                    name: "Check It Out",
                    percentage: m ?? 0,
                    color: "#22D3EE",
                    bgColor: "rgba(34, 211, 238, 0.04)",
                    borderColor: "rgba(34, 211, 238, 0.18)",
                    offsetClass: "w-full",
                },
                {
                    name: "Not Worth It",
                    percentage: nw ?? 0,
                    color: "#F472B6",
                    bgColor: "rgba(244, 114, 182, 0.04)",
                    borderColor: "rgba(244, 114, 182, 0.18)",
                    offsetClass: "w-full",
                },
            ];
        }
        return DEFAULT_SENTIMENTS;
    }, [sentiments, apiSentimentData]);

    // Calculate dynamic arc stroke lengths
    // Semi-circle length = Math.PI * radius
    const worthItPct = finalSentiments.find((s) => s.name.toLowerCase().includes("worth") && !s.name.toLowerCase().includes("not"))?.percentage ?? 0;
    const midPct = finalSentiments.find((s) => s.name.toLowerCase() === "mid" || s.name.toLowerCase().includes("check"))?.percentage ?? 0;
    const notWorthItPct = finalSentiments.find((s) => s.name.toLowerCase().includes("not"))?.percentage ?? 0;

    const r1 = 100;
    const len1 = Math.PI * r1;
    const dash1 = (Math.max(0, Math.min(100, worthItPct)) / 100) * len1;

    const r2 = 75;
    const len2 = Math.PI * r2;
    const dash2 = (Math.max(0, Math.min(100, midPct)) / 100) * len2;

    const r3 = 50;
    const len3 = Math.PI * r3;
    const dash3 = (Math.max(0, Math.min(100, notWorthItPct)) / 100) * len3;

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

            {showError ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#F87171]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <span className="text-[#F87171] font-semibold text-[13px]">
                        {errorMessage || "Unable to load sentiment data"}
                    </span>
                    <span className="text-[#8B7EC8] text-[11px]">
                        Please try again or check your filter settings
                    </span>
                </div>
            ) : (
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
                        <path d="M 20 130 A 100 100 0 0 1 220 130" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="13" strokeLinecap="round" />
                        <path d="M 45 130 A 75 75 0 0 1 195 130" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="13" strokeLinecap="round" />
                        <path d="M 70 130 A 50 50 0 0 1 170 130" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="13" strokeLinecap="round" />

                        {/* Outer Dynamic Arc (Worth It) */}
                        <path
                            d="M 20 130 A 100 100 0 0 1 220 130"
                            stroke="url(#gaugeYellowGrad)"
                            strokeWidth="13"
                            strokeLinecap="round"
                            strokeDasharray={`${dash1} ${len1}`}
                            className="transition-all duration-700 ease-out"
                        />

                        {/* Middle Dynamic Arc (Mid) */}
                        <path
                            d="M 45 130 A 75 75 0 0 1 195 130"
                            stroke="url(#gaugeCyanGrad)"
                            strokeWidth="13"
                            strokeLinecap="round"
                            strokeDasharray={`${dash2} ${len2}`}
                            className="transition-all duration-700 ease-out"
                        />

                        {/* Inner Dynamic Arc (Not Worth It) */}
                        <path
                            d="M 70 130 A 50 50 0 0 1 170 130"
                            stroke="url(#gaugePinkGrad)"
                            strokeWidth="13"
                            strokeLinecap="round"
                            strokeDasharray={`${dash3} ${len3}`}
                            className="transition-all duration-700 ease-out"
                        />
                    </svg>

                    {/* Score Overlay Text */}
                    <div className="absolute inset-0 top-24 flex flex-col items-center justify-center pointer-events-none">
                        <span className="font-extrabold text-[32px] leading-[32px] text-[#E8FF57] tracking-tight">
                            {finalScore}
                        </span>
                        <span className="font-bold text-[10px] leading-[15px] text-[#8B7EC8] mt-1">
                            / 100 Score
                        </span>
                    </div>
                </div>

                {/* Right Sentiment Category Bars with Integrated Progress Track */}
                <div className="flex flex-col gap-2.5 flex-1 w-full max-w-[290px]">
                    {finalSentiments.map((item) => (
                        <div
                            key={item.name}
                            className="h-[46px] px-3.5 rounded-[20px] flex items-center justify-between border transition-all w-full relative overflow-hidden"
                            style={{
                                backgroundColor: item.bgColor,
                                borderColor: item.borderColor,
                            }}
                        >
                            {/* Dot & Name */}
                            <div className="flex items-center gap-2 min-w-[90px] shrink-0">
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{
                                        backgroundColor: item.color,
                                        boxShadow: `0px 0px 6px ${item.color}`,
                                    }}
                                />
                                <span className="font-semibold text-[12px] leading-[16px] text-[#C4B5FD] whitespace-nowrap">
                                    {item.name}
                                </span>
                            </div>

                            {/* Embedded Progress Bar */}
                            <div className="flex-1 h-[6px] bg-[rgba(124,58,237,0.15)] rounded-full overflow-hidden mx-2.5">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                                        backgroundColor: item.color,
                                        boxShadow: `0px 0px 4px ${item.color}`,
                                    }}
                                />
                            </div>

                            {/* Percentage */}
                            <span
                                className="font-extrabold text-[12px] leading-[16px] text-right shrink-0 min-w-[34px]"
                                style={{ color: item.color }}
                            >
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    );
}

export default VisitorSentimentsChart;
