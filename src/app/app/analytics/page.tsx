"use client";

import React, { useState } from "react";
import { AnalyticsPageHeader, DateFilterOption, AnalyticsTab } from "@/components/analytics/AnalyticsPageHeader";

interface AnalyticsCardData {
    id: string;
    title: string;
    value: string;
    trend: string;
    colorVariant: "purple" | "cyan" | "yellow" | "green" | "pink" | "coral";
    strokeColor: string;
}

const ANALYTICS_CARDS: AnalyticsCardData[] = [
    {
        id: "checkins",
        title: "Total Check-Ins",
        value: "12,840",
        trend: "+18.4%",
        colorVariant: "cyan",
        strokeColor: "#22D3EE",
    },
    {
        id: "visitors",
        title: "Total Visitors",
        value: "12,840",
        trend: "+18.4%",
        colorVariant: "purple",
        strokeColor: "#9F4FFA",
    },
    {
        id: "duration-1",
        title: "Avg Stay Duration",
        value: "12,840",
        trend: "+18.4%",
        colorVariant: "yellow",
        strokeColor: "#E8FF57",
    },
    {
        id: "new-cust",
        title: "New Customers",
        value: "12,840",
        trend: "+18.4%",
        colorVariant: "green",
        strokeColor: "#4ADE80",
    },
    {
        id: "repeat-cust",
        title: "Repeat Customers",
        value: "12,840",
        trend: "+18.4%",
        colorVariant: "purple",
        strokeColor: "#9F4FFA",
    },
    {
        id: "lost-cust",
        title: "Lost Customers",
        value: "12,840",
        trend: "+18.4%",
        colorVariant: "coral",
        strokeColor: "#F43F5E",
    },
    {
        id: "attendance",
        title: "Event Attendance",
        value: "12,840",
        trend: "+18.4%",
        colorVariant: "pink",
        strokeColor: "#F472B6",
    },
    {
        id: "duration-2",
        title: "Avg Stay Duration",
        value: "12,840",
        trend: "+18.4%",
        colorVariant: "yellow",
        strokeColor: "#E8FF57",
    },
];

export default function AnalyticsPage() {
    const [dateFilter, setDateFilter] = useState<DateFilterOption>("Weekly");
    const [activeTab, setActiveTab] = useState<AnalyticsTab>("Overview");

    return (
        <div className="w-full max-w-[1136px] flex flex-col gap-8 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Heading & Navigation Tabs */}
            <AnalyticsPageHeader
                dateFilter={dateFilter}
                onDateFilterChange={(filter) => setDateFilter(filter)}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
            />

            {/* 8 Analytics Stat Cards Grid (4 Columns x 2 Rows) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {ANALYTICS_CARDS.map((card) => (
                    <div
                        key={card.id}
                        className="relative w-full h-[140px] rounded-[24px] bg-[rgba(10,6,50,0.75)] border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.3)] p-5 flex flex-col justify-between overflow-hidden group hover:border-[rgba(124,58,237,0.4)] transition-all"
                    >
                        {/* Card Header: Icon & Trend Pill */}
                        <div className="flex items-center justify-between w-full z-10">
                            {/* Icon Box */}
                            <div className="w-9 h-9 rounded-full bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.25)] flex items-center justify-center text-white">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>

                            {/* Trend Pill */}
                            <div className="px-2.5 py-0.5 rounded-full bg-[rgba(74,222,128,0.12)] border border-[rgba(74,222,128,0.25)] flex items-center gap-1">
                                <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="font-semibold text-[11px] leading-[16px] text-[#4ADE80]">
                                    {card.trend}
                                </span>
                            </div>
                        </div>

                        {/* Card Value & Title */}
                        <div className="flex flex-col z-10">
                            <span className="font-extrabold text-[22px] leading-[28px] text-white tracking-tight">
                                {card.value}
                            </span>
                            <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-0.5">
                                {card.title}
                            </span>
                        </div>

                        {/* Wave Graph SVG background accent */}
                        <svg
                            className="absolute bottom-0 right-0 left-0 w-full h-[60px] pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity"
                            viewBox="0 0 200 60"
                            fill="none"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 45 Q 50 15, 100 35 T 200 15 L 200 60 L 0 60 Z"
                                fill={`url(#grad-${card.id})`}
                            />
                            <path
                                d="M0 45 Q 50 15, 100 35 T 200 15"
                                stroke={card.strokeColor}
                                strokeWidth="2.5"
                            />
                            <defs>
                                <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={card.strokeColor} stopOpacity="0.4" />
                                    <stop offset="100%" stopColor={card.strokeColor} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                ))}
            </div>

            {/* Live Analytics Section Preview Card */}
            <div className="w-full min-h-[320px] rounded-[24px] bg-[rgba(10,6,50,0.75)] border border-[rgba(124,58,237,0.2)] p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between w-full flex-wrap gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#9F4FFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-extrabold text-[11px] leading-[16px] tracking-[1.2px] uppercase text-[#9F4FFA]">
                                LIVE ANALYTICS
                            </span>
                        </div>
                        <h2 className="font-extrabold text-[22px] leading-[28px] text-white">
                            Visitor Trends
                        </h2>
                        <p className="font-normal text-[13px] leading-[18px] text-[#8B7EC8]">
                            Track visitor growth and check-in activity over time
                        </p>
                    </div>

                    {/* Chart Legend Filter */}
                    <div className="flex items-center gap-4 text-[12px] font-semibold text-[#8B7EC8]">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E8FF57]" /> Check-Ins</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#9F4FFA]" /> Visitors</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#22D3EE]" /> Retention</span>
                    </div>
                </div>

                {/* Simulated Wave Line Chart Illustration */}
                <div className="w-full h-[180px] mt-6 relative flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 800 180" fill="none" preserveAspectRatio="none">
                        <path d="M0 160 Q 200 40, 400 120 T 800 20 L 800 180 L 0 180 Z" fill="url(#mainChartGrad)" opacity="0.3" />
                        <path d="M0 160 Q 200 40, 400 120 T 800 20" stroke="#7C3AED" strokeWidth="3" />
                        <path d="M0 140 Q 200 70, 400 100 T 800 50" stroke="#22D3EE" strokeWidth="2.5" />
                        <defs>
                            <linearGradient id="mainChartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
    );
}
