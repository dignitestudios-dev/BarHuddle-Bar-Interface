"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { DemographicsData } from "./VenueCard";

export interface VenueInfoSectionProps {
    demographics?: DemographicsData;
    address?: string;
    operatingHours?: any[];
    className?: string;
}

const DEFAULT_DEMOGRAPHICS: DemographicsData = {
    male: 60,
    female: 25,
    nonBinary: 15,
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(timeStr?: string) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h)) return timeStr;
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m || 0).padStart(2, "0")} ${period}`;
}

export function VenueInfoSection({
    demographics = DEFAULT_DEMOGRAPHICS,
    address = "Unknown Address",
    operatingHours = [],
    className = "",
}: VenueInfoSectionProps) {
    const total = (demographics.male || 0) + (demographics.female || 0) + (demographics.nonBinary || 0);
    const hasData = total > 0;

    const pieData = hasData
        ? [
            { name: "Male", value: demographics.male || 0, color: "#7C3AED" },
            { name: "Female", value: demographics.female || 0, color: "#F472B6" },
            { name: "Non-Binary", value: demographics.nonBinary || 0, color: "#E8FF57" },
        ]
        : [{ name: "No Data", value: 100, color: "rgba(124, 58, 237, 0.22)" }];

    return (
        <div
            className={`w-full p-6 flex flex-col gap-4 bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.35),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[20px] font-['Manrope',sans-serif] ${className}`}
        >
            {/* Top Section Label */}
            <div className="flex items-center gap-2">
                <div className="w-[4px] h-[20px] bg-gradient-to-b from-[#7C3AED] to-[#E8FF57] rounded-full shrink-0" />
                <span className="font-bold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#9D8FD0]">
                    VENUE INFORMATION
                </span>
            </div>

            {/* Inner Content Grid: Demographics Box (Left) + Operating Hours & Address (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Left Inner Box: Demographics & Audience Breakdown */}
                <div className="relative p-5 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] flex items-center justify-between gap-4 overflow-hidden min-h-[178px]">
                    {/* Overlapping Avatars Pill (Top Right) */}
                    {/* <div className="absolute top-3 right-4 flex items-center -space-x-2 shrink-0 drop-shadow-[0px_4px_7px_rgba(254,243,128,0.1)]">
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                            alt="User 1"
                            className="w-[36.77px] h-[36.77px] rounded-full object-cover border border-purple-900"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                            alt="User 2"
                            className="w-[36.77px] h-[36.77px] rounded-full object-cover border border-purple-900"
                        />
                        <div className="w-[36.77px] h-[36.77px] rounded-full bg-black/70 border border-purple-900 flex items-center justify-center font-medium text-[10px] text-white">
                            15+
                        </div>
                    </div> */}

                    {/* Donut Chart (80x80) */}
                    <div className="w-[80px] h-[80px] shrink-0 relative mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={20}
                                    outerRadius={38}
                                    paddingAngle={hasData ? 3 : 0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Demographics Legend Rows */}
                    <div className="flex flex-col gap-2 flex-1 mt-4">
                        {/* Male */}
                        <div className="flex items-center justify-between text-[12px]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0" />
                                <span className="text-[#9D8FD0]">Male</span>
                            </div>
                            <span className="font-semibold text-white">{demographics.male}%</span>
                        </div>

                        {/* Female */}
                        <div className="flex items-center justify-between text-[12px]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#F472B6] shrink-0" />
                                <span className="text-[#9D8FD0]">Female</span>
                            </div>
                            <span className="font-semibold text-white">{demographics.female}%</span>
                        </div>

                        {/* Non-Binary */}
                        <div className="flex items-center justify-between text-[12px]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#E8FF57] shrink-0" />
                                <span className="text-[#9D8FD0]">Non-Binary</span>
                            </div>
                            <span className="font-semibold text-white">{demographics.nonBinary}%</span>
                        </div>
                    </div>
                </div>

                {/* Right Inner Box: Operating Hours & Map Address Link */}
                <div className="flex flex-col gap-3">
                    {/* Operating Hours Block */}
                    <div className="p-4 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] flex flex-col gap-2 flex-1 justify-center max-h-[220px] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-[14px] leading-[19px] text-white capitalize tracking-tight">
                                    Operating Hours
                                </h3>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/90 border border-white/15">
                                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    </svg>
                                    From Google
                                </span>
                            </div>
                            {operatingHours.length > 0 && (
                                <span className="text-[10px] text-[#A855F7] font-semibold">Weekly</span>
                            )}
                        </div>

                        {operatingHours && operatingHours.length > 0 ? (
                            <div className="flex flex-col gap-1.5 pt-1">
                                {operatingHours.map((h: any, idx: number) => {
                                    const dayName =
                                        h.dayName ||
                                        (typeof h.day === "number" && DAY_LABELS[h.day]) ||
                                        h.day ||
                                        DAY_LABELS[idx] ||
                                        `Day ${idx + 1}`;
                                    const isClosed = Boolean(h.isClosed);
                                    const openStr = formatTime(h.open || h.openTime);
                                    const closeStr = formatTime(h.close || h.closeTime);

                                    return (
                                        <div key={idx} className="flex items-center justify-between text-[12px] leading-[17px]">
                                            <span className="text-[#E8C7FF] font-medium">{dayName}</span>
                                            {isClosed ? (
                                                <span className="text-[#D14249] font-semibold">Closed</span>
                                            ) : openStr && closeStr ? (
                                                <span className="text-white font-medium">{openStr} - {closeStr}</span>
                                            ) : (
                                                <span className="text-white/70">Open</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between text-[13px] leading-[18px]">
                                    <span className="text-[#E8C7FF]">Mon - Sat</span>
                                    <span className="text-white">6:00 PM - 5:00 AM</span>
                                </div>
                                <div className="flex items-center justify-between text-[13px] leading-[18px]">
                                    <span className="text-[#E8C7FF]">Sunday</span>
                                    <span className="text-[#D14249] font-medium">Closed</span>
                                </div>
                            </>
                        )}
                        <span className="text-[10px] text-[#9D8FD0]/70 pt-1 border-t border-white/5">
                            * Hours are automatically retrieved from Google Places
                        </span>
                    </div>

                    {/* Address Link Pill */}
                    <div className="p-3 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] flex items-center justify-between gap-2">
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[12px] leading-[16px] text-white underline capitalize truncate hover:text-[#E8FF57] transition-colors"
                        >
                            {address}
                        </a>

                        <svg className="w-[18px] h-[18px] text-[#DAB2FF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VenueInfoSection;
