"use client";

import React from "react";
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
    visitors: number;
    checkIns: number;
}

export interface VisitorTrendsChartProps {
    data?: TrendDataPoint[];
    className?: string;
}

const DEFAULT_DATA: TrendDataPoint[] = [
    { name: "Mon", visitors: 330, checkIns: 140 },
    { name: "Tue", visitors: 410, checkIns: 220 },
    { name: "Wed", visitors: 390, checkIns: 200 },
    { name: "Thu", visitors: 580, checkIns: 340 },
    { name: "Fri", visitors: 980, checkIns: 720 },
    { name: "Sat", visitors: 1320, checkIns: 1100 },
    { name: "Sun", visitors: 520, checkIns: 310 },
];

// Custom Hover Tooltip matching Figma CSS Group 1597885183
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const visitorsVal = payload.find((p: any) => p.dataKey === "visitors")?.value || 0;
        const checkInsVal = payload.find((p: any) => p.dataKey === "checkIns")?.value || 0;

        return (
            <div className="bg-[#0C0854]/95 backdrop-blur-md border border-[#0A00AB] rounded-lg p-3 shadow-[0px_4px_24px_rgba(0,0,0,0.5)] flex flex-col gap-2 min-w-[127px] font-['Manrope',sans-serif] z-50">
                {/* Visitors Row */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9448F2] border border-[#0B083C] shrink-0" />
                        <span className="text-xs font-normal text-[#E8C7FF]">Visitors:</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{visitorsVal}</span>
                </div>

                {/* Check-Ins Row */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF57] border border-[#0B083C] shadow-[0px_0px_4.7px_#E8FF57] shrink-0" />
                        <span className="text-xs font-normal text-[#E8C7FF]">Check-Ins:</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{checkInsVal}</span>
                </div>
            </div>
        );
    }
    return null;
};

export function VisitorTrendsChart({
    data = DEFAULT_DATA,
    className = "",
}: VisitorTrendsChartProps) {
    return (
        <div
            className={`relative w-full max-w-[833px] min-h-[420px] p-7 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Subtle Glow Orbs */}
            <div className="absolute left-[186px] -top-[79px] w-[360px] h-[200px] bg-[radial-gradient(57.2%_102.96%_at_50%_50%,rgba(124,58,237,0.4)_0%,rgba(0,0,0,0)_70%)] opacity-[0.18] rounded-full pointer-events-none z-0" />
            <div className="absolute left-[325px] top-[441px] w-[200px] h-[120px] bg-[radial-gradient(58.31%_97.18%_at_50%_50%,rgba(232,255,87,0.3)_0%,rgba(0,0,0,0)_70%)] opacity-[0.1] rounded-full pointer-events-none z-0" />

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 w-full mb-4">
                {/* Left Title & Tag */}
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C27AFF]">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="font-extrabold text-[10px] leading-[15px] tracking-[1.4px] text-[#8B7EC8] uppercase">
                            Live Analytics
                        </span>
                    </div>

                    <h2 className="font-extrabold text-[20px] leading-[28px] tracking-[-0.5px] text-white">
                        Visitor Trends
                    </h2>

                    <p className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                        Track visitor growth and check-in activity over time
                    </p>
                </div>

                {/* Right Legend & Trend Pill */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Legend: Visitors */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-[3px] bg-[#7C3AED] rounded-full" />
                        <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8]">Visitors</span>
                    </div>

                    {/* Legend: Check-Ins */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-[2px] border-b-2 border-dashed border-[#E8FF57]" />
                        <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8]">Check-Ins</span>
                    </div>

                    {/* Trend Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.2)] text-[#4ADE80] font-bold text-[11px]">
                        <svg className="w-2.5 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>+18.4% vs last period</span>
                    </div>
                </div>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-[270px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {/* Visitors Purple Area Gradient */}
                            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.33} />
                                <stop offset="75%" stopColor="#7C3AED" stopOpacity={0.024} />
                            </linearGradient>

                            {/* CheckIns Yellow Area Gradient */}
                            <linearGradient id="checkInsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#E8FF57" stopOpacity={0.24} />
                                <stop offset="75%" stopColor="#E8FF57" stopOpacity={0.012} />
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

                        <Tooltip content={<CustomTooltip />} />

                        {/* Visitors Curve */}
                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#9448F2"
                            strokeWidth={3}
                            fill="url(#visitorsGradient)"
                        />

                        {/* Check-Ins Curve */}
                        <Area
                            type="monotone"
                            dataKey="checkIns"
                            stroke="#E8FF57"
                            strokeWidth={2.5}
                            strokeDasharray="4 4"
                            fill="url(#checkInsGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default VisitorTrendsChart;
