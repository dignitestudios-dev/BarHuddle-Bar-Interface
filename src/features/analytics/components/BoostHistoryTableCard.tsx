"use client";

import React, { useState } from "react";

export type ReportFilterOption = "Visitors" | "Events" | "Boost";

export interface VisitorReportRow {
    date: string;
    checkIns: number;
    visitors: number;
    avgStay: string;
    newCustomers: number;
}

export interface EventReportRow {
    eventName: string;
    date: string;
    attendance: number;
    engagement: number;
    sentiment: string;
    status: string;
    statusVariant: "top" | "soldOut" | "growing" | "upcoming";
}

export interface BoostReportRow {
    eventName: string;
    boostDate: string;
    reach: string;
    views: string;
    engagement: number;
    status: string;
    statusVariant?: "active" | "ended" | "scheduled";
}

const VISITORS_MOCK: VisitorReportRow[] = [
    { date: "Jun 20", checkIns: 410, visitors: 580, avgStay: "2h 08m", newCustomers: 142 },
    { date: "Jun 21", checkIns: 520, visitors: 720, avgStay: "2h 45m", newCustomers: 186 },
    { date: "Jun 22", checkIns: 390, visitors: 540, avgStay: "1h 55m", newCustomers: 128 },
    { date: "Jun 23", checkIns: 450, visitors: 610, avgStay: "2h 15m", newCustomers: 154 },
    { date: "Jun 24", checkIns: 680, visitors: 920, avgStay: "3h 10m", newCustomers: 240 },
    { date: "Jun 25", checkIns: 890, visitors: 1240, avgStay: "3h 35m", newCustomers: 310 },
];

const EVENTS_MOCK: EventReportRow[] = [
    { eventName: "Ladies Night", date: "Jun 20", attendance: 284, engagement: 91, sentiment: "87%", status: "⭐ Top", statusVariant: "top" },
    { eventName: "Live DJ Experience", date: "Jun 21", attendance: 512, engagement: 87, sentiment: "84%", status: "🔥 Sold Out", statusVariant: "soldOut" },
    { eventName: "Cocktail Tasting", date: "Jun 22", attendance: 96, engagement: 78, sentiment: "80%", status: "↗️ Growing", statusVariant: "growing" },
    { eventName: "Karaoke Night", date: "Jun 26", attendance: 148, engagement: 83, sentiment: "82%", status: "📅 Upcoming", statusVariant: "upcoming" },
];

const BOOST_MOCK: BoostReportRow[] = [
    { eventName: "Ladies Night", boostDate: "Jun 20", reach: "8.4K", views: "3.2K", engagement: 91, status: "Active", statusVariant: "active" },
    { eventName: "Live DJ Exp.", boostDate: "Jun 21", reach: "14.2K", views: "6.8K", engagement: 87, status: "Active", statusVariant: "active" },
    { eventName: "Cocktail Tasting", boostDate: "Jun 22", reach: "2.1K", views: "890", engagement: 78, status: "Ended", statusVariant: "ended" },
    { eventName: "Karaoke Night", boostDate: "Jun 26", reach: "5.6K", views: "2.1K", engagement: 83, status: "Scheduled", statusVariant: "scheduled" },
];

export interface BoostHistoryTableCardProps {
    className?: string;
    showFilterPills?: boolean;
    initialFilter?: ReportFilterOption;
    tagText?: string;
    title?: string;
}

export function BoostHistoryTableCard({
    className = "",
    showFilterPills = true,
    initialFilter = "Boost",
    tagText = "BOOST HISTORY",
    title = "Boost History",
}: BoostHistoryTableCardProps) {
    const [selectedFilter, setSelectedFilter] = useState<ReportFilterOption>(initialFilter);

    const handleExport = () => {
        alert(`Exporting ${selectedFilter} report as CSV...`);
    };

    return (
        <div
            className={`w-full max-w-[1200px] min-h-[360px] p-6 flex flex-col justify-between bg-[#0E093C]/76 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[22px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Header Row: Title & Export Button */}
            <div className="flex items-center justify-between gap-4 w-full mb-4 z-10">
                {/* SecLabel & Title */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 h-[14px]">
                        <div
                            className="w-[4px] h-[14px] rounded-full shrink-0"
                            style={{
                                background: "linear-gradient(180deg, #7C3AED 0%, #E8FF57 100%)",
                            }}
                        />
                        <span className="font-extrabold text-[9px] leading-[14px] tracking-[1.35px] text-[#8B7EC8] uppercase">
                            {tagText}
                        </span>
                    </div>
                    <h3 className="font-extrabold text-[16px] leading-[24px] text-white pt-0.5">
                        {title}
                    </h3>
                </div>

                {/* Export Button */}
                <button
                    type="button"
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(232,255,87,0.03)] border border-[rgba(232,255,87,0.157)] hover:bg-[rgba(232,255,87,0.1)] text-[#E8FF57] font-bold text-[11px] leading-[16px] transition-all cursor-pointer"
                >
                    <svg className="w-3 h-3 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Export</span>
                </button>
            </div>

            {/* Optional Filter Pills Container */}
            {showFilterPills && (
                <div className="flex items-center gap-1 p-1 w-fit rounded-full bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] mb-4 z-10">
                    {(["Visitors", "Events", "Boost"] as ReportFilterOption[]).map((tab) => {
                        const isActive = selectedFilter === tab;
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setSelectedFilter(tab)}
                                className={`px-4 py-1.5 rounded-[20px] font-bold text-[11px] leading-[16px] transition-all cursor-pointer ${
                                    isActive
                                        ? "bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-md"
                                        : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Table Container */}
            <div className="w-full flex-1 overflow-x-auto z-10">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    {/* Table Headers */}
                    <thead>
                        <tr className="border-b border-[rgba(124,58,237,0.15)] h-[35px]">
                            {selectedFilter === "Visitors" && (
                                <>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pl-3">Date</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Check-Ins</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Visitors</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Avg Stay</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pr-3">New Customers</th>
                                </>
                            )}

                            {selectedFilter === "Events" && (
                                <>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pl-3">Event Name</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Date</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Attendance</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Engagement</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Sentiment</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pr-3">Status</th>
                                </>
                            )}

                            {selectedFilter === "Boost" && (
                                <>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pl-3">Event Name</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Boost Date</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Reach</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Views</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Engagement</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pr-3">Status</th>
                                </>
                            )}
                        </tr>
                    </thead>

                    {/* Table Body Rows */}
                    <tbody className="divide-y divide-[rgba(124,58,237,0.08)]">
                        {selectedFilter === "Visitors" &&
                            VISITORS_MOCK.map((row, index) => (
                                <tr key={index} className="h-[49px] hover:bg-[rgba(124,58,237,0.05)] transition-colors">
                                    <td className="font-bold text-[12px] text-white pl-3">{row.date}</td>
                                    <td className="font-semibold text-[12px] text-[#22D3EE]">{row.checkIns}</td>
                                    <td className="font-semibold text-[12px] text-[#7C3AED]">{row.visitors}</td>
                                    <td className="font-normal text-[12px] text-[#C4B5FD]">{row.avgStay}</td>
                                    <td className="font-semibold text-[12px] text-[#4ADE80] pr-3">{row.newCustomers}</td>
                                </tr>
                            ))}

                        {selectedFilter === "Events" &&
                            EVENTS_MOCK.map((row, index) => (
                                <tr key={index} className="h-[49px] hover:bg-[rgba(124,58,237,0.05)] transition-colors">
                                    <td className="font-bold text-[12px] text-white pl-3">{row.eventName}</td>
                                    <td className="font-normal text-[12px] text-[#C4B5FD]">{row.date}</td>
                                    <td className="font-semibold text-[12px] text-[#7C3AED]">{row.attendance}</td>
                                    <td className="py-2">
                                        <div className="flex items-center gap-2 max-w-[120px]">
                                            <div className="w-[44px] h-[6px] bg-[rgba(124,58,237,0.15)] rounded-full overflow-hidden shrink-0">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${row.engagement}%`,
                                                        background: "linear-gradient(90deg, #7C3AED 0%, #E8FF57 100%)",
                                                    }}
                                                />
                                            </div>
                                            <span className="font-bold text-[12px] text-[#E8FF57]">{row.engagement}%</span>
                                        </div>
                                    </td>
                                    <td className="font-semibold text-[12px] text-[#4ADE80]">{row.sentiment}</td>
                                    <td className="pr-3">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[rgba(232,255,87,0.07)] border border-[rgba(232,255,87,0.145)] text-[#E8FF57]">
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                        {selectedFilter === "Boost" &&
                            BOOST_MOCK.map((row, index) => (
                                <tr key={index} className="h-[49px] hover:bg-[rgba(124,58,237,0.05)] transition-colors">
                                    <td className="font-bold text-[12px] text-white pl-3">{row.eventName}</td>
                                    <td className="font-normal text-[12px] text-[#C4B5FD]">{row.boostDate}</td>
                                    <td className="font-semibold text-[12px] text-[#22D3EE]">{row.reach}</td>
                                    <td className="font-semibold text-[12px] text-[#C4B5FD]">{row.views}</td>
                                    <td className="font-bold text-[12px] text-[#E8FF57]">{row.engagement}%</td>
                                    <td className="pr-3">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                row.status === "Active"
                                                    ? "bg-[rgba(34,211,238,0.07)] border border-[rgba(34,211,238,0.145)] text-[#22D3EE]"
                                                    : row.status === "Scheduled"
                                                    ? "bg-[rgba(232,255,87,0.07)] border border-[rgba(232,255,87,0.145)] text-[#E8FF57]"
                                                    : "bg-[rgba(196,181,253,0.07)] border border-[rgba(196,181,253,0.145)] text-[#C4B5FD]"
                                            }`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BoostHistoryTableCard;
