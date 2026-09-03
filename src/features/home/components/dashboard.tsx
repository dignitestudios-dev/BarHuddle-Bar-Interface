"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { StatsCard } from "@/components/ui";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";
import { CustomerDonutChart } from "@/components/charts/CustomerDonutChart";
import { EventPerformanceCard } from "@/features/events/components";
import { Skeleton } from "@/components/ui/skeleton";
import { statsList } from "@/utils/constants";
import VisitorSentimentsChart from "@/components/charts/VisitorSentimentsChart";
import {
    useGetOverviewQuery,
    useGetVisitorsGraphQuery,
    useGetCustomerBreakdownGraphQuery,
    useGetSentimentAnalyticsQuery,
} from "@/features/analytics/api/analytics.queries";
import { useSelectedVenue } from "@/hooks/useSelectedVenue";
import { cleanImageUrl } from "@/utils/image";

interface DashboardCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: "purple" | "cyan" | "yellow" | "green" | "coral" | "pink" | "orange";
    icon?: React.ReactNode;
}

export function Dashboard() {
    const { selectedVenueId, selectedVenue } = useSelectedVenue();

    const filterParams = useMemo(() => {
        return {
            filter: "monthly",
            ...(selectedVenueId ? { venueId: selectedVenueId } : {}),
        };
    }, [selectedVenueId]);

    // Replaced legacy /venue-owner/dashboard API with analytics APIs
    const { data: overviewResponse, isLoading: isLoadingOverview } = useGetOverviewQuery(filterParams);
    const { data: visitorsGraphResponse, isLoading: isLoadingVisitors } = useGetVisitorsGraphQuery(filterParams);
    const { data: customerBreakdownResponse, isLoading: isLoadingCustomers } = useGetCustomerBreakdownGraphQuery(filterParams);
    const { data: sentimentResponse, isLoading: isLoadingSentiment } = useGetSentimentAnalyticsQuery(filterParams);

    const isLoading = isLoadingOverview && isLoadingVisitors;

    const o = overviewResponse?.data;

    // Map 8 Overview Stats Cards from GET /analytics/overview
    const stats = useMemo<DashboardCardItem[]>(() => {
        const data = (o as any) || {};

        return [
            {
                id: "total_visitors",
                title: "Total Visitors",
                value: (data.totalVisitors ?? data.totalVisits ?? 0).toLocaleString(),
                trend: data.totalVisitorsGrowth || data.growth || "+0%",
                isPositive: !String(data.totalVisitorsGrowth || data.growth || "").startsWith("-"),
                variant: "purple" as const,
                icon: statsList[0]?.icon,
            },
            {
                id: "total_check_ins",
                title: "Total Check-Ins",
                value: (data.totalCheckIns ?? 0).toLocaleString(),
                trend: data.totalCheckInsGrowth || "+0%",
                isPositive: !String(data.totalCheckInsGrowth || "").startsWith("-"),
                variant: "cyan" as const,
                icon: statsList[1]?.icon,
            },
            {
                id: "avg_stay_duration",
                title: "Avg Stay Duration",
                value: typeof data.avgStay === "number" ? `${data.avgStay} mins` : (data.avgStay || "0 mins"),
                trend: data.avgStayGrowth || "+0%",
                isPositive: !String(data.avgStayGrowth || "").startsWith("-"),
                variant: "yellow" as const,
                icon: statsList[2]?.icon,
            },
            {
                id: "new_customers",
                title: "New Customers",
                value: (data.newCustomers ?? 0).toLocaleString(),
                trend: data.newCustomersGrowth || "+0%",
                isPositive: !String(data.newCustomersGrowth || "").startsWith("-"),
                variant: "green" as const,
                icon: statsList[3]?.icon,
            },
            {
                id: "repeat_customers",
                title: "Repeat Customers",
                value: (data.repeatCustomers ?? 0).toLocaleString(),
                trend: data.repeatCustomersGrowth || "+0%",
                isPositive: !String(data.repeatCustomersGrowth || "").startsWith("-"),
                variant: "purple" as const,
                icon: statsList[4]?.icon,
            },
            {
                id: "lost_customers",
                title: "Lost Customers",
                value: (data.lostCustomers ?? 0).toLocaleString(),
                trend: data.lostCustomersGrowth || "+0%",
                isPositive: !String(data.lostCustomersGrowth || "").startsWith("-"),
                variant: "coral" as const,
                icon: statsList[5]?.icon,
            },
            {
                id: "event_attendance",
                title: "Event Attendance",
                value: (data.eventAttendance ?? 0).toLocaleString(),
                trend: data.eventAttendanceGrowth || "+0%",
                isPositive: !String(data.eventAttendanceGrowth || "").startsWith("-"),
                variant: "pink" as const,
                icon: statsList[6]?.icon,
            },
            {
                id: "avg_rating",
                title: "Google Avg Rating",
                value: (data.avgRating ?? (sentimentResponse?.data?.sentimentScore?.score ? (sentimentResponse.data.sentimentScore.score / 20).toFixed(1) : "0")).toString(),
                trend: "+0%",
                isPositive: true,
                variant: "orange" as const,
                icon: statsList[7]?.icon,
            },
        ];
    }, [o, sentimentResponse]);

    // Visitor trends mapped from GET /analytics/overview/vistors-graph
    const visitorTrendsData = useMemo(() => {
        const raw = visitorsGraphResponse?.data;
        if (!raw || !Array.isArray(raw) || raw.length === 0) return undefined;

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return raw.map((item: any) => {
            let label = "Day";
            if (item.month !== undefined && item.month !== null) {
                const mNum = Number(item.month);
                label = monthNames[(mNum - 1) % 12] || `M${item.month}`;
            } else if (item.date) {
                try {
                    const d = new Date(item.date);
                    if (!isNaN(d.getTime())) {
                        label = format(d, "MMM dd");
                    }
                } catch {
                    label = String(item.date);
                }
            } else if (item.name) {
                label = item.name;
            }

            return {
                name: label,
                visitors: item.visitors ?? 0,
                checkIns: item.checkIns ?? 0,
                retention: 0,
                new: item.new ?? 0,
                repeat: item.repeat ?? 0,
                lost: item.lost ?? 0,
            };
        });
    }, [visitorsGraphResponse]);

    // Customer Breakdown mapped from GET /analytics/overview/customer-breakdown-graph
    const customerSegments = useMemo(() => {
        const cb = customerBreakdownResponse?.data as any;
        if (!cb) return undefined;

        const newCount = typeof cb.newCustomers === "object" ? (cb.newCustomers?.count ?? 0) : (cb.newCustomers ?? 0);
        const newPct = typeof cb.newCustomers === "object" ? (cb.newCustomers?.percentage ?? 0) : (cb.new ?? cb.now ?? 0);

        const repeatCount = typeof cb.repeatCustomers === "object" ? (cb.repeatCustomers?.count ?? 0) : (cb.repeatCustomers ?? 0);
        const repeatPct = typeof cb.repeatCustomers === "object" ? (cb.repeatCustomers?.percentage ?? 0) : (cb.repeat ?? 0);

        const lostCount = typeof cb.lostCustomers === "object" ? (cb.lostCustomers?.count ?? 0) : (cb.lostCustomers ?? 0);
        const lostPct = typeof cb.lostCustomers === "object" ? (cb.lostCustomers?.percentage ?? 0) : (cb.lost ?? 0);

        return [
            {
                name: "New",
                value: newCount,
                percentage: Math.round(newPct),
                color: "#4ADE80",
                glowColor: "rgba(74, 222, 128, 0.6)",
            },
            {
                name: "Repeat",
                value: repeatCount,
                percentage: Math.round(repeatPct),
                color: "#7C3AED",
                glowColor: "rgba(124, 58, 237, 0.6)",
            },
            {
                name: "Lost",
                value: lostCount,
                percentage: Math.round(lostPct),
                color: "#F87171",
                glowColor: "rgba(248, 113, 113, 0.6)",
            },
        ];
    }, [customerBreakdownResponse]);

    const totalCustomersFormatted = useMemo(() => {
        const total = customerBreakdownResponse?.data?.totalCustomers;
        if (total !== undefined && total !== null) {
            return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total.toString();
        }
        return undefined;
    }, [customerBreakdownResponse]);

    // Sentiment Scores mapped from GET /venue-owner/analytics/sentiment
    const sentimentItems = useMemo(() => {
        const s = sentimentResponse?.data?.sentimentScore;
        if (!s) return undefined;

        return [
            {
                name: "Worth It",
                percentage: Math.round(s.worthIt ?? 0),
                color: "#E8FF57",
                bgColor: "rgba(232, 255, 87, 0.03)",
                borderColor: "rgba(232, 255, 87, 0.094)",
                offsetClass: "w-full",
            },
            {
                name: "Mid",
                percentage: Math.round(s.mid ?? 0),
                color: "#22D3EE",
                bgColor: "rgba(34, 211, 238, 0.03)",
                borderColor: "rgba(34, 211, 238, 0.094)",
                offsetClass: "w-full",
            },
            {
                name: "Not Worth It",
                percentage: Math.round(s.notWorthIt ?? 0),
                color: "#F472B6",
                bgColor: "rgba(244, 114, 182, 0.03)",
                borderColor: "rgba(244, 114, 182, 0.094)",
                offsetClass: "w-full",
            },
        ];
    }, [sentimentResponse]);

    const overallSentimentScore = sentimentResponse?.data?.sentimentScore?.score;

    if (isLoading) {
        return (
            <div className="w-full flex flex-col font-['Manrope',sans-serif]">
                <main className="flex-1 w-full px-6 py-8 flex flex-col gap-8">
                    <h1 className="text-[32px] font-extrabold leading-[40px] text-white tracking-tight">
                        Dashboard
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-28 w-full rounded-[24px]" />
                        ))}
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between items-center max-w-[1200px] w-full gap-6">
                        <Skeleton className="w-full lg:w-3/4 h-[380px] rounded-[24px]" />
                        <Skeleton className="w-full lg:w-1/4 h-[380px] rounded-[24px]" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1200px] gap-6">
                        <Skeleton className="w-full h-[400px] rounded-[24px]" />
                        <Skeleton className="w-full h-[400px] rounded-[24px]" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col font-['Manrope',sans-serif]">
            {/* Main Content Area */}
            <main className="flex-1 w-full px-6 py-8 flex flex-col gap-8">
                {/* Dashboard Page Header & Active Venue Card */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[32px] font-extrabold leading-[40px] text-white tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-[#9D8FD0] text-[14px]">
                            Real-time overview and analytics for your active venue.
                        </p>
                    </div>

                    {selectedVenue && (
                        <div
                            className="group flex items-center gap-3.5 p-2.5 pr-5 rounded-2xl bg-[#140E50]/75 hover:bg-[#140E50] border border-[rgba(124,58,237,0.3)] hover:border-[rgba(124,58,237,0.6)] backdrop-blur-xl shadow-lg transition-all"
                        >
                            {selectedVenue.coverImage ? (
                                <img
                                    src={cleanImageUrl(selectedVenue.coverImage)}
                                    alt={selectedVenue.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-purple-900/50 shrink-0 group-hover:scale-105 transition-transform"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-[#C27AFF] shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-[14px] text-white truncate max-w-[160px] sm:max-w-[220px] group-hover:text-[#E8FF57] transition-colors">
                                        {selectedVenue.name}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                                        Claimed
                                    </span>
                                </div>
                                {selectedVenue.address && (
                                    <span className="text-[11px] text-[#9D8FD0] truncate max-w-[200px] sm:max-w-[240px]">
                                        {selectedVenue.address}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Overview Stats Cards Grid - 8 Cards (4 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <StatsCard
                            key={stat.id || idx}
                            title={stat.title}
                            value={stat.value}
                            trend={stat.trend}
                            isPositive={stat.isPositive}
                            variant={stat.variant}
                            icon={stat.icon}
                        />
                    ))}
                </div>

                {/* Charts Row: Visitor Trends (Area) + Customer Breakdown (Donut) */}
                <div className="flex flex-col lg:flex-row justify-between items-stretch max-w-[1200px] w-full gap-6">
                    <div className="flex-1 min-w-0">
                        <VisitorTrendsChart data={visitorTrendsData} />
                    </div>
                    <div className="w-full lg:w-[288px] shrink-0">
                        <CustomerDonutChart
                            segments={customerSegments}
                            totalCustomers={totalCustomersFormatted}
                        />
                    </div>
                </div>

                {/* Bottom Row: Event Performance + Visitor Sentiments */}
                <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1200px] gap-6">
                    <div className="w-full min-w-0">
                        <EventPerformanceCard />
                    </div>
                    <div className="w-full min-w-0">
                        <VisitorSentimentsChart
                            overallScore={overallSentimentScore}
                            sentiments={sentimentItems}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
