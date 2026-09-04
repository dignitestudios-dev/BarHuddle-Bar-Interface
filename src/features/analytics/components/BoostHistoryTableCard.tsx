"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    useGetNormalEventsQuery,
    useGetBoostedSentimentEventsQuery,
    useGetBoostedEventsQuery,
    useGetBoostedEventVisitorsQuery,
} from "../api/analytics.queries";
import { useSelectedVenue } from "@/hooks/useSelectedVenue";

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
    sentiment: string;
    status: string;
    statusVariant: "published" | "cancelled" | "draft" | "top";
}

export interface BoostReportRow {
    eventName: string;
    boostDate: string;
    reach: string;
    views: string;
    engagement: string;
    sentiment?: string;
    status: string;
    statusVariant?: "active" | "ended" | "scheduled" | "cancelled";
}

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
    const [visitorsPage, setVisitorsPage] = useState(1);
    const [eventsPage, setEventsPage] = useState(1);
    const [boostPage, setBoostPage] = useState(1);

    const { selectedVenueId } = useSelectedVenue();
    const venueParams = selectedVenueId ? { venueId: selectedVenueId } : undefined;

    const { data: boostedEventVisitorsResponse } = useGetBoostedEventVisitorsQuery({ page: visitorsPage, limit: 10, ...venueParams });
    const { data: normalEventsResponse } = useGetNormalEventsQuery({ page: eventsPage, limit: 10, ...venueParams });
    const { data: boostedSentimentResponse } = useGetBoostedSentimentEventsQuery({ page: boostPage, limit: 10, ...venueParams });
    const { data: boostedEventsResponse } = useGetBoostedEventsQuery({ page: boostPage, limit: 10, ...venueParams });

    // Visitors tab data populated from GET /analytics/boosted/events/visitors
    const visitorsData: VisitorReportRow[] = React.useMemo(() => {
        const boostedVisitors = boostedEventVisitorsResponse?.data;
        if (boostedVisitors && Array.isArray(boostedVisitors) && boostedVisitors.length > 0) {
            return boostedVisitors.map((item) => {
                let dateLabel = item.eventName || "Event";
                if (item.boostedDate) {
                    try {
                        const dStr = format(new Date(item.boostedDate), "MMM dd");
                        dateLabel = `${item.eventName || "Event"} (${dStr})`;
                    } catch {
                        dateLabel = item.eventName || "Event";
                    }
                }

                let avgStayStr = "0m";
                if (item.avgStay) {
                    if (item.avgStay.hours && item.avgStay.hours > 0) {
                        avgStayStr = `${item.avgStay.hours}h ${item.avgStay.minutes || 0}m`;
                    } else {
                        avgStayStr = `${item.avgStay.minutes || item.avgStay.totalMinutes || 0}m`;
                    }
                }

                return {
                    date: dateLabel,
                    checkIns: item.checkIns ?? 0,
                    visitors: item.totalVisitors ?? 0,
                    avgStay: avgStayStr,
                    newCustomers: item.newVisitors ?? 0,
                };
            });
        }

        return [];
    }, [boostedEventVisitorsResponse]);

    // Events tab data populated from GET /analytics/events/normal
    const eventsData: EventReportRow[] = React.useMemo(() => {
        const normalEvents = normalEventsResponse?.data;
        if (normalEvents && Array.isArray(normalEvents) && normalEvents.length > 0) {
            return normalEvents.map((item) => {
                let dateStr = "TBD";
                if (item.date) {
                    try {
                        dateStr = format(new Date(item.date), "MMM dd, yyyy");
                    } catch {
                        dateStr = item.date;
                    }
                }

                return {
                    eventName: item.eventName || "Event",
                    date: dateStr,
                    attendance: item.attendance ?? 0,
                    sentiment: item.sentiment !== null && item.sentiment !== undefined ? `${item.sentiment}%` : "N/A",
                    status: item.status || "published",
                    statusVariant: (item.status === "cancelled" ? "cancelled" : "published") as any,
                };
            });
        }
        return [];
    }, [normalEventsResponse]);

    // Boost tab data populated from GET /analytics/events/boosted-sentiment and GET /analytics/boosted/events
    const boostsData: BoostReportRow[] = React.useMemo(() => {
        const boostedSentiment = boostedSentimentResponse?.data;
        if (boostedSentiment && Array.isArray(boostedSentiment) && boostedSentiment.length > 0) {
            return boostedSentiment.map((item) => {
                let dateStr = "TBD";
                if (item.date) {
                    try {
                        dateStr = format(new Date(item.date), "MMM dd, yyyy");
                    } catch {
                        dateStr = item.date;
                    }
                }

                return {
                    eventName: item.eventName || "Boosted Event",
                    boostDate: dateStr,
                    reach: String(item.attendance ?? 0),
                    views: "N/A",
                    engagement: item.sentiment !== null && item.sentiment !== undefined ? `${item.sentiment}%` : "N/A",
                    sentiment: item.sentiment !== null && item.sentiment !== undefined ? `${item.sentiment}%` : "N/A",
                    status: item.status || "active",
                    statusVariant: (item.status === "active" ? "active" : item.status === "cancelled" ? "cancelled" : "ended") as any,
                };
            });
        }

        const boostedList = boostedEventsResponse?.data;
        if (boostedList && Array.isArray(boostedList) && boostedList.length > 0) {
            return boostedList.map((item: any) => {
                let dateStr = "TBD";
                if (item.boostedDate) {
                    try {
                        dateStr = format(new Date(item.boostedDate), "MMM dd, yyyy");
                    } catch {
                        dateStr = item.boostedDate;
                    }
                }

                return {
                    eventName: item.eventName || "Boosted Event",
                    boostDate: dateStr,
                    reach: item.reach !== null && item.reach !== undefined ? item.reach.toLocaleString() : "0",
                    views: item.views !== null && item.views !== undefined ? item.views.toLocaleString() : (item.trackingPending ? "Pending" : "0"),
                    engagement: item.engagement !== null && item.engagement !== undefined ? `${item.engagement}%` : "0%",
                    sentiment: "N/A",
                    status: item.status || "active",
                    statusVariant: (item.status === "active" ? "active" : "ended") as any,
                };
            });
        }

        return [];
    }, [boostedSentimentResponse, boostedEventsResponse]);

    // Active pagination info
    const paginationInfo = React.useMemo(() => {
        if (selectedFilter === "Visitors") {
            const p = boostedEventVisitorsResponse?.pagination;
            return {
                currentPage: visitorsPage,
                totalPages: p?.totalPages || 1,
                total: p?.total || visitorsData.length,
                setPage: setVisitorsPage,
            };
        }
        if (selectedFilter === "Events") {
            const p = normalEventsResponse?.pagination;
            return {
                currentPage: eventsPage,
                totalPages: p?.totalPages || 1,
                total: p?.total || eventsData.length,
                setPage: setEventsPage,
            };
        }
        // Boost
        const p = boostedSentimentResponse?.pagination || (boostedEventsResponse as any)?.pagination;
        return {
            currentPage: boostPage,
            totalPages: p?.totalPages || 1,
            total: p?.total || boostsData.length,
            setPage: setBoostPage,
        };
    }, [
        selectedFilter,
        visitorsPage,
        eventsPage,
        boostPage,
        boostedEventVisitorsResponse,
        normalEventsResponse,
        boostedSentimentResponse,
        boostedEventsResponse,
        visitorsData.length,
        eventsData.length,
        boostsData.length,
    ]);

    return (
        <div
            className={`w-full max-w-[1200px] min-h-[360px] p-6 flex flex-col justify-between bg-[#0E093C]/76 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[22px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Header Row: Title */}
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
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pl-3">Event / Date</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Check-Ins</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Total Visitors</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Avg Stay</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pr-3">New Visitors</th>
                                </>
                            )}

                            {selectedFilter === "Events" && (
                                <>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pl-3">Event Name</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Date</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Attendance</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pr-3">Status</th>
                                </>
                            )}

                            {selectedFilter === "Boost" && (
                                <>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pl-3">Event Name</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Date</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2">Attendance / Reach</th>
                                    <th className="font-extrabold text-[10px] uppercase tracking-[0.5px] text-[#8B7EC8] pb-2 pr-3">Status</th>
                                </>
                            )}
                        </tr>
                    </thead>

                    {/* Table Body Rows */}
                    <tbody className="divide-y divide-[rgba(124,58,237,0.08)]">
                        {selectedFilter === "Visitors" && (
                            visitorsData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-sm font-medium text-white/50">
                                        No boosted visitor report records found
                                    </td>
                                </tr>
                            ) : (
                                visitorsData.map((row, index) => (
                                    <tr key={index} className="h-[49px] hover:bg-[rgba(124,58,237,0.05)] transition-colors">
                                        <td className="font-bold text-[12px] text-white pl-3 max-w-[280px] truncate">{row.date}</td>
                                        <td className="font-semibold text-[12px] text-[#22D3EE]">{row.checkIns}</td>
                                        <td className="font-semibold text-[12px] text-[#7C3AED]">{row.visitors}</td>
                                        <td className="font-normal text-[12px] text-[#C4B5FD]">{row.avgStay}</td>
                                        <td className="font-semibold text-[12px] text-[#4ADE80] pr-3">{row.newCustomers}</td>
                                    </tr>
                                ))
                            )
                        )}

                        {selectedFilter === "Events" && (
                            eventsData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-sm font-medium text-white/50">
                                        No event report records found
                                    </td>
                                </tr>
                            ) : (
                                eventsData.map((row, index) => (
                                    <tr key={index} className="h-[49px] hover:bg-[rgba(124,58,237,0.05)] transition-colors">
                                        <td className="font-bold text-[12px] text-white pl-3 max-w-[280px] truncate">{row.eventName}</td>
                                        <td className="font-normal text-[12px] text-[#C4B5FD]">{row.date}</td>
                                        <td className="font-semibold text-[12px] text-[#7C3AED]">{row.attendance}</td>
                                        <td className="pr-3">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                                                    row.status === "published"
                                                        ? "bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.25)] text-[#4ADE80]"
                                                        : row.status === "cancelled"
                                                        ? "bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.25)] text-[#F87171]"
                                                        : "bg-[rgba(232,255,87,0.07)] border border-[rgba(232,255,87,0.145)] text-[#E8FF57]"
                                                }`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}

                        {selectedFilter === "Boost" && (
                            boostsData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-sm font-medium text-white/50">
                                        No boosted event records found
                                    </td>
                                </tr>
                            ) : (
                                boostsData.map((row, index) => (
                                    <tr key={index} className="h-[49px] hover:bg-[rgba(124,58,237,0.05)] transition-colors">
                                        <td className="font-bold text-[12px] text-white pl-3 max-w-[280px] truncate">{row.eventName}</td>
                                        <td className="font-normal text-[12px] text-[#C4B5FD]">{row.boostDate}</td>
                                        <td className="font-semibold text-[12px] text-[#22D3EE]">{row.reach}</td>
                                        <td className="pr-3">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                                                    row.status === "active" || row.status === "published"
                                                        ? "bg-[rgba(34,211,238,0.07)] border border-[rgba(34,211,238,0.145)] text-[#22D3EE]"
                                                        : row.status === "cancelled"
                                                        ? "bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.25)] text-[#F87171]"
                                                        : "bg-[rgba(196,181,253,0.07)] border border-[rgba(196,181,253,0.145)] text-[#C4B5FD]"
                                                }`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {paginationInfo.totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[rgba(124,58,237,0.15)] z-10 flex-wrap">
                    <span className="text-xs font-medium text-[#8B7EC8]">
                        Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
                    </span>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => paginationInfo.setPage(Math.max(1, paginationInfo.currentPage - 1))}
                            disabled={paginationInfo.currentPage <= 1}
                            className="px-3 py-1.5 rounded-xl border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.05)] hover:bg-[rgba(124,58,237,0.15)] text-[#8B7EC8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Previous</span>
                        </button>

                        {Array.from({ length: paginationInfo.totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            const isActive = pageNum === paginationInfo.currentPage;
                            return (
                                <button
                                    key={pageNum}
                                    type="button"
                                    onClick={() => paginationInfo.setPage(pageNum)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-md"
                                            : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => paginationInfo.setPage(Math.min(paginationInfo.totalPages, paginationInfo.currentPage + 1))}
                            disabled={paginationInfo.currentPage >= paginationInfo.totalPages}
                            className="px-3 py-1.5 rounded-xl border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.05)] hover:bg-[rgba(124,58,237,0.15)] text-[#8B7EC8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BoostHistoryTableCard;
