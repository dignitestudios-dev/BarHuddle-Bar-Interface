"use client";

import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

export interface TrendDataPoint {
    name: string;
    visitors?: number;
    checkIns?: number;
    retention?: number;
    new?: number;
    repeat?: number;
    lost?: number;
}

export interface VisitorTrendsChartProps {
    data?: TrendDataPoint[];
    className?: string;
    showRetention?: boolean;
    variant?: "default" | "retention";
}

const CustomTooltip = ({ active, payload, label, isRetentionVariant, showRetention }: any) => {
    if (active && payload && payload.length) {
        if (isRetentionVariant) {
            const newVal = payload.find((p: any) => p.dataKey === "new")?.value ?? 0;
            const repeatVal = payload.find((p: any) => p.dataKey === "repeat")?.value ?? 0;
            const lostVal = payload.find((p: any) => p.dataKey === "lost")?.value ?? 0;

            return (
                <div className="bg-[#0C0854]/95 backdrop-blur-md border border-[#7C3AED]/40 rounded-xl p-3 shadow-[0px_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-2 min-w-[140px] font-['Manrope',sans-serif] z-50">
                    {label && (
                        <span className="text-[10px] font-bold text-[#8B7EC8] uppercase tracking-wider">
                            {label}
                        </span>
                    )}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#E8FF57] shrink-0" />
                            <span className="text-xs font-medium text-[#C4B5FD]">New</span>
                        </div>
                        <span className="text-xs font-extrabold text-white">{newVal}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#9448F2] shrink-0" />
                            <span className="text-xs font-medium text-[#C4B5FD]">Repeat</span>
                        </div>
                        <span className="text-xs font-extrabold text-white">{repeatVal}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#F87171] shrink-0" />
                            <span className="text-xs font-medium text-[#C4B5FD]">Lost</span>
                        </div>
                        <span className="text-xs font-extrabold text-white">{lostVal}</span>
                    </div>
                </div>
            );
        }

        const visitorsVal = payload.find((p: any) => p.dataKey === "visitors")?.value ?? 0;
        const checkInsVal = payload.find((p: any) => p.dataKey === "checkIns")?.value ?? 0;
        const retentionVal = payload.find((p: any) => p.dataKey === "retention")?.value ?? 0;

        return (
            <div className="bg-[#0C0854]/95 backdrop-blur-md border border-[#7C3AED]/40 rounded-xl p-3 shadow-[0px_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-2 min-w-[140px] font-['Manrope',sans-serif] z-50">
                {label && (
                    <span className="text-[10px] font-bold text-[#8B7EC8] uppercase tracking-wider">
                        {label}
                    </span>
                )}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#9448F2] shrink-0" />
                        <span className="text-xs font-medium text-[#C4B5FD]">Visitors</span>
                    </div>
                    <span className="text-xs font-extrabold text-white">{visitorsVal}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#E8FF57] shrink-0" />
                        <span className="text-xs font-medium text-[#C4B5FD]">Check-Ins</span>
                    </div>
                    <span className="text-xs font-extrabold text-white">{checkInsVal}</span>
                </div>
                {showRetention && payload.some((p: any) => p.dataKey === "retention") && (
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#22D3EE] shrink-0" />
                            <span className="text-xs font-medium text-[#C4B5FD]">Retention</span>
                        </div>
                        <span className="text-xs font-extrabold text-white">{retentionVal}</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export function VisitorTrendsChart({
    data,
    className = "",
    showRetention = false,
    variant = "default",
}: VisitorTrendsChartProps) {
    const chartData = useMemo(() => {
        if (data && Array.isArray(data) && data.length > 0) return data;
        return [
            { name: "Day 1", visitors: 0, checkIns: 0, retention: 0, new: 0, repeat: 0, lost: 0 },
            { name: "Day 2", visitors: 0, checkIns: 0, retention: 0, new: 0, repeat: 0, lost: 0 },
            { name: "Day 3", visitors: 0, checkIns: 0, retention: 0, new: 0, repeat: 0, lost: 0 },
            { name: "Day 4", visitors: 0, checkIns: 0, retention: 0, new: 0, repeat: 0, lost: 0 },
            { name: "Day 5", visitors: 0, checkIns: 0, retention: 0, new: 0, repeat: 0, lost: 0 },
        ];
    }, [data]);

    const isRetentionVariant = variant === "retention";

    // Dynamically calculate Y-Axis domain and ticks based on actual data
    const { yDomain, yTicks } = useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return { yDomain: [0, 10], yTicks: [0, 2, 4, 6, 8, 10] };
        }

        let maxVal = 0;
        chartData.forEach((d) => {
            if (isRetentionVariant) {
                maxVal = Math.max(maxVal, d.new || 0, d.repeat || 0, d.lost || 0);
            } else {
                maxVal = Math.max(
                    maxVal,
                    d.visitors || 0,
                    d.checkIns || 0,
                    showRetention ? d.retention || 0 : 0
                );
            }
        });

        if (maxVal <= 0) {
            return { yDomain: [0, 10], yTicks: [0, 2, 4, 6, 8, 10] };
        }
        if (maxVal <= 4) {
            return { yDomain: [0, 4], yTicks: [0, 1, 2, 3, 4] };
        }
        if (maxVal <= 10) {
            const ceil = Math.ceil(maxVal / 2) * 2;
            const step = ceil / 4;
            return { yDomain: [0, ceil], yTicks: [0, step, step * 2, step * 3, ceil] };
        }
        if (maxVal <= 25) {
            const ceil = Math.ceil(maxVal / 5) * 5;
            const step = ceil / 5;
            return { yDomain: [0, ceil], yTicks: [0, step, step * 2, step * 3, step * 4, ceil] };
        }
        if (maxVal <= 100) {
            const ceil = Math.ceil(maxVal / 10) * 10;
            const step = ceil / 4;
            return { yDomain: [0, ceil], yTicks: [0, step, step * 2, step * 3, ceil] };
        }
        if (maxVal <= 500) {
            const ceil = Math.ceil(maxVal / 50) * 50;
            const step = ceil / 4;
            return { yDomain: [0, ceil], yTicks: [0, step, step * 2, step * 3, ceil] };
        }

        const power = Math.pow(10, Math.floor(Math.log10(maxVal)));
        const magnitude = maxVal / power;
        let factor = 1;
        if (magnitude <= 2) factor = 2;
        else if (magnitude <= 5) factor = 5;
        else factor = 10;

        const ceiling = factor * power;
        const step = ceiling / 4;
        return {
            yDomain: [0, ceiling],
            yTicks: [0, Math.round(step), Math.round(step * 2), Math.round(step * 3), ceiling],
        };
    }, [chartData, isRetentionVariant, showRetention]);

    return (
        <div
            className={`relative w-full max-w-[1200px] min-h-[420px] p-6 sm:p-7 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Ambient Background Glow Orbs */}
            <div className="absolute left-[186px] -top-[79px] w-[360px] h-[200px] bg-[radial-gradient(57.2%_102.96%_at_50%_50%,rgba(124,58,237,0.4)_0%,rgba(0,0,0,0)_70%)] opacity-[0.18] rounded-full pointer-events-none z-0" />
            <div className="absolute right-[100px] bottom-[-40px] w-[240px] h-[150px] bg-[radial-gradient(58.31%_97.18%_at_50%_50%,rgba(248,113,113,0.2)_0%,rgba(0,0,0,0)_70%)] opacity-[0.15] rounded-full pointer-events-none z-0" />

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 w-full mb-4">
                {/* Left Title & Tag */}
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C27AFF]">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="font-extrabold text-[10px] leading-[15px] tracking-[1.4px] text-[#8B7EC8] uppercase">
                            Live Analytics
                        </span>
                    </div>

                    <h2 className="font-extrabold text-[22px] leading-[28px] tracking-[-0.5px] text-white">
                        Visitor Trends
                    </h2>

                    <p className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                        Track visitor growth and check-in activity over time
                    </p>
                </div>

                {/* Right Legend */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    {isRetentionVariant ? (
                        <>
                            {/* Legend: New */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-[2px] border-b-2 border-dashed border-[#E8FF57]" />
                                <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8]">New</span>
                            </div>

                            {/* Legend: Repeat */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-[3px] bg-[#9448F2] rounded-full" />
                                <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8]">Repeat</span>
                            </div>

                            {/* Legend: Lost */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-[3px] bg-[#F87171] rounded-full" />
                                <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8]">Lost</span>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Legend: Check-Ins */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-[2px] border-b-2 border-dashed border-[#E8FF57]" />
                                <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8]">Check-Ins</span>
                            </div>

                            {/* Legend: Visitors */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-[3px] bg-[#9448F2] rounded-full" />
                                <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8]">Visitors</span>
                            </div>

                            {/* Legend: Retention */}
                            {showRetention && (
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-[3px] bg-[#22D3EE] rounded-full" />
                                    <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8]">Retention</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-[270px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.35} />
                                <stop offset="75%" stopColor="#22D3EE" stopOpacity={0.02} />
                            </linearGradient>

                            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                                <stop offset="75%" stopColor="#7C3AED" stopOpacity={0.02} />
                            </linearGradient>

                            <linearGradient id="checkInsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#E8FF57" stopOpacity={0.25} />
                                <stop offset="75%" stopColor="#E8FF57" stopOpacity={0.01} />
                            </linearGradient>

                            <linearGradient id="lostGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F87171" stopOpacity={0.35} />
                                <stop offset="75%" stopColor="#F87171" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.1)" vertical={false} />

                        <XAxis
                            dataKey="name"
                            stroke="#8B7EC8"
                            fontSize={10}
                            fontFamily="Inter"
                            fontWeight={700}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />

                        <YAxis
                            stroke="#8B7EC8"
                            fontSize={10}
                            fontFamily="Inter"
                            fontWeight={400}
                            tickLine={false}
                            axisLine={false}
                            domain={yDomain}
                            ticks={yTicks}
                            allowDecimals={false}
                        />

                        <Tooltip content={<CustomTooltip isRetentionVariant={isRetentionVariant} showRetention={showRetention} />} />

                        {isRetentionVariant ? (
                            <>
                                {/* Lost Curve (Coral/Pink) */}
                                <Area
                                    type="monotone"
                                    dataKey="lost"
                                    stroke="#F87171"
                                    strokeWidth={2.5}
                                    fill="url(#lostGradient)"
                                    dot={{ r: 3, fill: "#0E093C", stroke: "#F87171", strokeWidth: 1.5 }}
                                    activeDot={{ r: 5, fill: "#F87171", stroke: "#0E093C", strokeWidth: 2 }}
                                />

                                {/* Repeat Curve (Purple) */}
                                <Area
                                    type="monotone"
                                    dataKey="repeat"
                                    stroke="#9448F2"
                                    strokeWidth={3}
                                    fill="url(#visitorsGradient)"
                                    dot={{ r: 3, fill: "#0E093C", stroke: "#9448F2", strokeWidth: 1.5 }}
                                    activeDot={{ r: 5, fill: "#9448F2", stroke: "#0E093C", strokeWidth: 2 }}
                                />

                                {/* New Curve (Yellow Dashed) */}
                                <Area
                                    type="monotone"
                                    dataKey="new"
                                    stroke="#E8FF57"
                                    strokeWidth={2.5}
                                    strokeDasharray="4 4"
                                    fill="url(#checkInsGradient)"
                                    dot={{ r: 3, fill: "#0E093C", stroke: "#E8FF57", strokeWidth: 1.5 }}
                                    activeDot={{ r: 5, fill: "#E8FF57", stroke: "#0E093C", strokeWidth: 2 }}
                                />
                            </>
                        ) : (
                            <>
                                {showRetention && (
                                    <Area
                                        type="monotone"
                                        dataKey="retention"
                                        stroke="#22D3EE"
                                        strokeWidth={2.5}
                                        fill="url(#retentionGradient)"
                                        dot={{ r: 3, fill: "#0E093C", stroke: "#22D3EE", strokeWidth: 1.5 }}
                                        activeDot={{ r: 5, fill: "#22D3EE", stroke: "#0E093C", strokeWidth: 2 }}
                                    />
                                )}
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#9448F2"
                                    strokeWidth={3}
                                    fill="url(#visitorsGradient)"
                                    dot={{ r: 3, fill: "#0E093C", stroke: "#9448F2", strokeWidth: 1.5 }}
                                    activeDot={{ r: 5, fill: "#9448F2", stroke: "#0E093C", strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="checkIns"
                                    stroke="#E8FF57"
                                    strokeWidth={2.5}
                                    strokeDasharray="4 4"
                                    fill="url(#checkInsGradient)"
                                    dot={{ r: 3, fill: "#0E093C", stroke: "#E8FF57", strokeWidth: 1.5 }}
                                    activeDot={{ r: 5, fill: "#E8FF57", stroke: "#0E093C", strokeWidth: 2 }}
                                />
                            </>
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default VisitorTrendsChart;
