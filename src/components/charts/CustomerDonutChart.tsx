"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useGetRetentionAnalyticsQuery } from "@/features/analytics/api/analytics.queries";

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
}

const DEFAULT_SEGMENTS: CustomerSegment[] = [
    {
        name: "New",
        value: 3441,
        percentage: 37,
        color: "#4ADE80",
        glowColor: "rgba(74, 222, 128, 0.6)",
    },
    {
        name: "Repeat",
        value: 4557,
        percentage: 49,
        color: "#7C3AED",
        glowColor: "rgba(124, 58, 237, 0.6)",
    },
    {
        name: "Lost",
        value: 1302,
        percentage: 14,
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
}: CustomerDonutChartProps) {
    const { data: retentionData } = useGetRetentionAnalyticsQuery();

    const finalTotal = React.useMemo(() => {
        if (totalCustomers) return totalCustomers;
        const total = retentionData?.data?.totalUsers;
        if (total !== undefined && total !== null) {
            return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total.toString();
        }
        return "0";
    }, [totalCustomers, retentionData]);

    const finalSegments = React.useMemo(() => {
        if (segments) return segments;
        const r = retentionData?.data;
        const total = r?.totalUsers || 0;

        const nowPct = r?.customerBreakdown?.now ?? (total ? Math.round(((r?.oneTimeUsers || 0) / total) * 100) : 0);
        const repeatPct = r?.customerBreakdown?.repeat ?? (total ? Math.round(((r?.returningUsers || 0) / total) * 100) : 0);
        const lostPct = r?.customerBreakdown?.lost ?? (total ? Math.round(((r?.lostCustomers || 0) / total) * 100) : 0);

        return [
            {
                name: "New",
                value: r?.oneTimeUsers || 0,
                percentage: nowPct,
                color: "#4ADE80",
                glowColor: "rgba(74, 222, 128, 0.6)",
            },
            {
                name: "Repeat",
                value: r?.returningUsers || 0,
                percentage: repeatPct,
                color: "#7C3AED",
                glowColor: "rgba(124, 58, 237, 0.6)",
            },
            {
                name: "Lost",
                value: r?.lostCustomers || 0,
                percentage: lostPct,
                color: "#F87171",
                glowColor: "rgba(248, 113, 113, 0.6)",
            },
        ];
    }, [segments, retentionData]);
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

            {/* Center Donut Chart Container */}
            <div className="relative w-full h-[210px] flex items-center justify-center z-10">
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
                                    boxShadow: `0px 0px 6px ${seg.color}`,
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
                                    boxShadow: `0px 0px 4px ${seg.color}`,
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
        </div>
    );
}

export default CustomerDonutChart;
