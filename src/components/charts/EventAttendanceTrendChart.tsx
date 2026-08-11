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

export interface AttendanceDataPoint {
    name: string;
    attendance: number;
}

export interface EventAttendanceTrendChartProps {
    data?: AttendanceDataPoint[];
    className?: string;
}

const DEFAULT_ATTENDANCE_DATA: AttendanceDataPoint[] = [
    { name: "Jan", attendance: 120 },
    { name: "Feb", attendance: 180 },
    { name: "Mar", attendance: 220 },
    { name: "Apr", attendance: 480 },
    { name: "May", attendance: 350 },
    { name: "Jun", attendance: 410 },
    { name: "Jul", attendance: 780 },
    { name: "Aug", attendance: 1100 },
    { name: "Sep", attendance: 750 },
    { name: "Oct", attendance: 1180 },
    { name: "Nov", attendance: 850 },
    { name: "Dec", attendance: 410 },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const attendanceVal = payload[0]?.value || 456;

        return (
            <div className="bg-[#0C0854]/95 backdrop-blur-md border border-[#F472B6]/40 rounded-xl p-3 shadow-[0px_8px_32px_rgba(0,0,0,0.6)] flex items-center gap-2.5 min-w-[130px] font-['Manrope',sans-serif] z-50">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F472B6] shrink-0" />
                <div className="flex items-center justify-between w-full gap-3">
                    <span className="text-xs font-medium text-[#C4B5FD]">Attendance</span>
                    <span className="text-xs font-extrabold text-white">{attendanceVal}</span>
                </div>
            </div>
        );
    }
    return null;
};

export function EventAttendanceTrendChart({
    data = DEFAULT_ATTENDANCE_DATA,
    className = "",
}: EventAttendanceTrendChartProps) {
    return (
        <div
            className={`relative w-full max-w-[833px] min-h-[420px] p-6 sm:p-7 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Ambient Pink Glow Orbs */}
            <div className="absolute right-[-40px] top-[-40px] w-[300px] h-[200px] bg-[radial-gradient(57.2%_102.96%_at_50%_50%,rgba(244,114,182,0.25)_0%,rgba(0,0,0,0)_70%)] opacity-[0.2] rounded-full pointer-events-none z-0" />

            {/* Header Section */}
            <div className="flex flex-col gap-1 relative z-10 w-full mb-4">
                {/* Tag */}
                <div className="flex items-center gap-2 h-[14px]">
                    <div
                        className="w-[4px] h-[14px] rounded-full shrink-0"
                        style={{
                            background: "linear-gradient(180deg, #7C3AED 0%, #E8FF57 100%)",
                        }}
                    />
                    <span className="font-extrabold text-[9px] leading-[14px] tracking-[1.35px] text-[#8B7EC8] uppercase">
                        Event Analytics
                    </span>
                </div>

                {/* Title */}
                <h2 className="font-extrabold text-[20px] leading-[28px] tracking-[-0.5px] text-white pt-0.5">
                    Event Attendance Trend
                </h2>

                {/* Subtitle */}
                <p className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                    Monthly attendance growth across all events
                </p>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-[270px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {/* Pink Area Gradient */}
                            <linearGradient id="attendancePinkGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F472B6" stopOpacity={0.35} />
                                <stop offset="75%" stopColor="#F472B6" stopOpacity={0.01} />
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

                        {/* Pink Dashed Attendance Area Curve */}
                        <Area
                            type="monotone"
                            dataKey="attendance"
                            stroke="#F472B6"
                            strokeWidth={2.5}
                            strokeDasharray="4 4"
                            fill="url(#attendancePinkGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default EventAttendanceTrendChart;
