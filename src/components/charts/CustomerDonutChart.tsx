"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export interface CustomerSegment {
    name: string;
    value: number;
    percentage: number;
    color: string;
    glowColor: string;
}

export interface CustomerDonutChartProps {
    title?: string;
    tagText?: string;
    showGradientBar?: boolean;
    totalCustomers?: string;
    totalLabel?: string;
    segments?: CustomerSegment[];
    className?: string;
    isError?: boolean;
    errorMessage?: string;
}

const DEFAULT_SEGMENTS: CustomerSegment[] = [
    {
        name: "New",
        value: 0,
        percentage: 0,
        color: "#4ADE80",
        glowColor: "rgba(74, 222, 128, 0.6)",
    },
    {
        name: "Repeat",
        value: 0,
        percentage: 0,
        color: "#7C3AED",
        glowColor: "rgba(124, 58, 237, 0.6)",
    },
    {
        name: "Lost",
        value: 0,
        percentage: 0,
        color: "#F87171",
        glowColor: "rgba(248, 113, 113, 0.6)",
    },
];

export function CustomerDonutChart({
    title = "Customer Breakdown",
    tagText = "Demographics",
    showGradientBar = false,
    totalCustomers,
    totalLabel = "Customers",
    segments,
    className = "",
    isError,
    errorMessage,
}: CustomerDonutChartProps) {
    const finalTotal = React.useMemo(() => {
        if (totalCustomers !== undefined && totalCustomers !== null) return totalCustomers;
        return "0";
    }, [totalCustomers]);

    const finalSegments = React.useMemo(() => {
        if (segments && segments.length > 0) return segments;
        return DEFAULT_SEGMENTS;
    }, [segments]);

    const totalPct = finalSegments.reduce((sum, seg) => sum + (seg.percentage || 0), 0);

    return (
        <div
            className={`relative w-full max-w-[288px] h-[420px] p-6 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Subtle Glow Orb */}
            <div className="absolute right-[-49px] top-[-49px] w-[180px] h-[180px] bg-[radial-gradient(70.71%_70.71%_at_50%_50%,#7C3AED_0%,rgba(0,0,0,0)_70%)] opacity-[0.12] rounded-full pointer-events-none z-0" />

            {/* Header Tag & Title */}
            <div className="flex flex-col items-start gap-1 relative z-10 w-full">
                <div className="flex items-center gap-2">
                    {showGradientBar ? (
                        <div
                            className="w-[4px] h-[14px] rounded-full shrink-0"
                            style={{
                                background: "linear-gradient(180deg, #7C3AED 0%, #E8FF57 100%)",
                            }}
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C27AFF] shrink-0">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    )}
                    <span className="font-extrabold text-[10px] leading-[15px] tracking-[1.4px] text-[#8B7EC8] uppercase">
                        {tagText}
                    </span>
                </div>

                <h3 className="font-extrabold text-[16px] leading-[24px] text-white pt-0.5">
                    {title}
                </h3>
            </div>

            {isError ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#F87171]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <span className="text-[#F87171] font-semibold text-[13px]">
                        {errorMessage || "Unable to load breakdown"}
                    </span>
                    <span className="text-[#8B7EC8] text-[11px]">
                        Please try again later
                    </span>
                </div>
            ) : (
                <>
                    {/* Center Donut Chart Container */}
                    <div className="relative w-full h-[210px] flex items-center justify-center z-10">
                        {totalPct === 0 ? (
                            <div className="relative w-[176px] h-[176px] rounded-full border-[12px] border-[rgba(124,58,237,0.15)] flex items-center justify-center">
                                <div className="flex flex-col items-center justify-center pointer-events-none">
                                    <span className="font-extrabold text-[28px] leading-[28px] text-[#F0EEFF]">
                                        {finalTotal}
                                    </span>
                                    <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8] mt-1">
                                        {totalLabel}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={finalSegments}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={68}
                                            outerRadius={88}
                                            paddingAngle={3}
                                            dataKey="percentage"
                                            stroke="#0E093C"
                                            strokeWidth={2}
                                        >
                                            {finalSegments.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Donut Center Overlay Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="font-extrabold text-[28px] leading-[28px] text-[#F0EEFF]">
                                        {finalTotal}
                                    </span>
                                    <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8] mt-1">
                                        {totalLabel}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom Progress Bars Section */}
                    <div className="flex flex-col gap-2.5 w-full relative z-10 pt-2 border-t border-[rgba(124,58,237,0.15)]">
                        {finalSegments.map((seg) => (
                            <div key={seg.name} className="flex items-center justify-between gap-3 w-full">
                                {/* Dot & Label */}
                                <div className="flex items-center gap-2 min-w-[75px]">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: seg.color,
                                            boxShadow: seg.percentage > 0 ? `0px 0px 6px ${seg.color}` : "none",
                                        }}
                                    />
                                    <span className="font-semibold text-[12px] leading-[16px] text-[#C4B5FD]">
                                        {seg.name}
                                    </span>
                                </div>

                                {/* Progress Bar Track & Fill */}
                                <div className="flex-1 h-[6px] bg-[rgba(124,58,237,0.12)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${seg.percentage}%`,
                                            backgroundColor: seg.color,
                                            boxShadow: seg.percentage > 0 ? `0px 0px 4px ${seg.color}` : "none",
                                        }}
                                    />
                                </div>

                                {/* Percentage */}
                                <span
                                    className="font-extrabold text-[12px] leading-[16px] text-right w-[32px] shrink-0"
                                    style={{ color: seg.color }}
                                >
                                    {seg.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default CustomerDonutChart;
