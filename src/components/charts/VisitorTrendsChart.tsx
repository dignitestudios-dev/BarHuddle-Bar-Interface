"use client";

import React, { useState } from "react";
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
    timeframeOptions?: string[];
    defaultTimeframe?: string;
}

const DEFAULT_MONTHLY_DATA: TrendDataPoint[] = [
    { name: "Jan", visitors: 480, checkIns: 200, retention: 410, new: 200, repeat: 320, lost: 450 },
    { name: "Feb", visitors: 520, checkIns: 240, retention: 450, new: 240, repeat: 360, lost: 490 },
    { name: "Mar", visitors: 550, checkIns: 250, retention: 460, new: 250, repeat: 380, lost: 510 },
    { name: "Apr", visitors: 540, checkIns: 260, retention: 450, new: 260, repeat: 370, lost: 500 },
    { name: "May", visitors: 560, checkIns: 280, retention: 470, new: 280, repeat: 390, lost: 520 },
    { name: "Jun", visitors: 620, checkIns: 320, retention: 500, new: 320, repeat: 430, lost: 560 },
    { name: "Jul", visitors: 780, checkIns: 450, retention: 600, new: 450, repeat: 580, lost: 720 },
    { name: "Aug", visitors: 1100, checkIns: 880, retention: 950, new: 680, repeat: 890, lost: 1080 },
    { name: "Sep", visitors: 1250, checkIns: 1020, retention: 1120, new: 920, repeat: 1150, lost: 1320 },
    { name: "Oct", visitors: 1320, checkIns: 1080, retention: 1180, new: 980, repeat: 1220, lost: 1390 },
    { name: "Nov", visitors: 980, checkIns: 720, retention: 850, new: 650, repeat: 880, lost: 1020 },
    { name: "Dec", visitors: 600, checkIns: 350, retention: 520, new: 300, repeat: 450, lost: 620 },
];

const CustomTooltip = ({ active, payload, isRetentionVariant }: any) => {
    if (active && payload && payload.length) {
        if (isRetentionVariant) {
            const newVal = payload.find((p: any) => p.dataKey === "new")?.value || 456;
            const repeatVal = payload.find((p: any) => p.dataKey === "repeat")?.value || 540;
            const lostVal = payload.find((p: any) => p.dataKey === "lost")?.value || 456;

            return (
                <div className="bg-[#0C0854]/95 backdrop-blur-md border border-[#7C3AED]/40 rounded-xl p-3 shadow-[0px_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-2 min-w-[140px] font-['Manrope',sans-serif] z-50">
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

        const visitorsVal = payload.find((p: any) => p.dataKey === "visitors")?.value || 456;
        const checkInsVal = payload.find((p: any) => p.dataKey === "checkIns")?.value || 540;
        const retentionVal = payload.find((p: any) => p.dataKey === "retention")?.value || 456;

        return (
            <div className="bg-[#0C0854]/95 backdrop-blur-md border border-[#7C3AED]/40 rounded-xl p-3 shadow-[0px_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-2 min-w-[140px] font-['Manrope',sans-serif] z-50">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#E8FF57] shrink-0" />
                        <span className="text-xs font-medium text-[#C4B5FD]">Visitors</span>
                    </div>
                    <span className="text-xs font-extrabold text-white">{visitorsVal}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#9448F2] shrink-0" />
                        <span className="text-xs font-medium text-[#C4B5FD]">Check-Ins</span>
                    </div>
                    <span className="text-xs font-extrabold text-white">{checkInsVal}</span>
                </div>
                {payload.some((p: any) => p.dataKey === "retention") && (
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
    data = DEFAULT_MONTHLY_DATA,
    className = "",
    showRetention = true,
    variant = "default",
    timeframeOptions = ["Monthly", "Weekly", "Yearly"],
    defaultTimeframe = "Monthly",
}: VisitorTrendsChartProps) {
    const [selectedTimeframe, setSelectedTimeframe] = useState(defaultTimeframe);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isRetentionVariant = variant === "retention";

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

                {/* Right Legend & Timeframe Filter Dropdown */}
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

                    {/* Monthly Timeframe Filter Pill */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(14,9,60,0.8)] border border-[rgba(124,58,237,0.3)] hover:border-[#7C3AED] text-white font-semibold text-[12px] leading-[16px] transition-all"
                        >
                            <span>{selectedTimeframe}</span>
                            <svg className={`w-3 h-3 text-[#8B7EC8] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-[120px] bg-[#0E093C] border border-[rgba(124,58,237,0.3)] rounded-xl shadow-xl overflow-hidden z-50">
                                {timeframeOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setSelectedTimeframe(option);
                                            setDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[rgba(124,58,237,0.2)] transition-colors ${selectedTimeframe === option ? "text-[#E8FF57]" : "text-[#8B7EC8]"}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-[270px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                            domain={[0, 1400]}
                            ticks={[0, 350, 700, 1050, 1400]}
                        />

                        <Tooltip content={<CustomTooltip isRetentionVariant={isRetentionVariant} />} />

                        {isRetentionVariant ? (
                            <>
                                {/* Lost Curve (Coral/Pink) */}
                                <Area
                                    type="monotone"
                                    dataKey="lost"
                                    stroke="#F87171"
                                    strokeWidth={2.5}
                                    fill="url(#lostGradient)"
                                />

                                {/* Repeat Curve (Purple) */}
                                <Area
                                    type="monotone"
                                    dataKey="repeat"
                                    stroke="#9448F2"
                                    strokeWidth={3}
                                    fill="url(#visitorsGradient)"
                                />

                                {/* New Curve (Yellow Dashed) */}
                                <Area
                                    type="monotone"
                                    dataKey="new"
                                    stroke="#E8FF57"
                                    strokeWidth={2.5}
                                    strokeDasharray="4 4"
                                    fill="url(#checkInsGradient)"
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
                                    />
                                )}
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#9448F2"
                                    strokeWidth={3}
                                    fill="url(#visitorsGradient)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="checkIns"
                                    stroke="#E8FF57"
                                    strokeWidth={2.5}
                                    strokeDasharray="4 4"
                                    fill="url(#checkInsGradient)"
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
