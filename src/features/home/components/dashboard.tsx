"use client";

import React from "react";
import { StatsCard } from "@/components/ui";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";
import { CustomerDonutChart } from "@/components/charts/CustomerDonutChart";
import { EventPerformanceCard } from "@/features/events/components";
import { Skeleton } from "@/components/ui/skeleton";
import { statsList } from "@/utils/constants";
import VisitorSentimentsChart from "@/components/charts/VisitorSentimentsChart";
import { useGetDashboardQuery } from "@/features/analytics/api/analytics.queries";

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
    const { data: dashboardData, isLoading } = useGetDashboardQuery();

    const d = dashboardData?.data || {};

    const stats = React.useMemo<DashboardCardItem[]>(() => {
        if (Array.isArray(d.cards) && d.cards.length > 0) {
            const variantMap: Record<string, "purple" | "cyan" | "yellow" | "green" | "coral" | "pink" | "orange"> = {
                total_visitors: "purple",
                total_check_ins: "cyan",
                avg_stay_duration: "yellow",
                new_customers: "green",
                repeat_customers: "purple",
                lost_customers: "coral",
                event_attendance: "pink",
                avg_stay_duration_2: "orange",
            };

            const defaultVariants: ("purple" | "cyan" | "yellow" | "green" | "coral" | "pink" | "orange")[] = [
                "purple",
                "cyan",
                "yellow",
                "green",
                "purple",
                "coral",
                "pink",
                "orange",
            ];

            return d.cards.map((card: any, idx: number) => {
                const growthStr = card.growth || (card.growthPercent !== undefined ? `${card.growthPercent >= 0 ? "+" : ""}${card.growthPercent}%` : "");
                const isPositive = card.growthPercent !== undefined ? card.growthPercent >= 0 : !String(card.growth || "").startsWith("-");
                const matchedIcon = statsList.find((s) => s.title.toLowerCase() === card.label?.toLowerCase())?.icon || statsList[idx % statsList.length]?.icon;
                const variant = (card.id && variantMap[card.id]) || defaultVariants[idx % defaultVariants.length];

                return {
                    id: card.id || String(idx),
                    title: card.label || "Metric",
                    value: card.formattedValue || (typeof card.value === "number" ? card.value.toLocaleString() : String(card.value ?? 0)),
                    trend: growthStr,
                    isPositive,
                    variant,
                    icon: matchedIcon,
                };
            });
        }

        // Fallback if cards array is not present
        return [
            {
                id: "total_visitors",
                title: "Total Visitors",
                value: (d.totalVisitors ?? d.totalVisits ?? d.visitors ?? 0).toLocaleString(),
                trend: d.totalVisitorsGrowth ?? d.visitorTrend ?? "+18.4%",
                isPositive: !String(d.totalVisitorsGrowth || d.visitorTrend || "").startsWith("-"),
                variant: "purple" as const,
                icon: statsList[0]?.icon,
            },
            {
                id: "total_check_ins",
                title: "Total Check-Ins",
                value: (d.totalCheckIns ?? 0).toLocaleString(),
                trend: d.totalCheckInsGrowth ?? "+18.4%",
                isPositive: !String(d.totalCheckInsGrowth || "").startsWith("-"),
                variant: "cyan" as const,
                icon: statsList[1]?.icon,
            },
            {
                id: "avg_stay_duration",
                title: "Avg Stay Duration",
                value: typeof d.avgStayDuration === "number" ? `${d.avgStayDuration} mins` : (d.avgStayDuration || "45.5 mins"),
                trend: d.avgStayDurationGrowth ?? "+18.4%",
                isPositive: !String(d.avgStayDurationGrowth || "").startsWith("-"),
                variant: "yellow" as const,
                icon: statsList[2]?.icon,
            },
            {
                id: "new_customers",
                title: "New Customers",
                value: (d.newCustomers ?? 0).toLocaleString(),
                trend: d.newCustomersGrowth ?? "+18.4%",
                isPositive: !String(d.newCustomersGrowth || "").startsWith("-"),
                variant: "green" as const,
                icon: statsList[3]?.icon,
            },
            {
                id: "repeat_customers",
                title: "Repeat Customers",
                value: (d.repeatCustomers ?? 0).toLocaleString(),
                trend: d.repeatCustomersGrowth ?? "+18.4%",
                isPositive: !String(d.repeatCustomersGrowth || "").startsWith("-"),
                variant: "purple" as const,
                icon: statsList[4]?.icon,
            },
            {
                id: "lost_customers",
                title: "Lost Customers",
                value: (d.lostCustomers ?? 0).toLocaleString(),
                trend: d.lostCustomersGrowth ?? "+18.4%",
                isPositive: !String(d.lostCustomersGrowth || "").startsWith("-"),
                variant: "coral" as const,
                icon: statsList[5]?.icon,
            },
            {
                id: "event_attendance",
                title: "Event Attendance",
                value: (d.eventAttendance ?? 0).toLocaleString(),
                trend: d.eventAttendanceGrowth ?? "+18.4%",
                isPositive: !String(d.eventAttendanceGrowth || "").startsWith("-"),
                variant: "pink" as const,
                icon: statsList[6]?.icon,
            },
            {
                id: "avg_stay_duration_2",
                title: "Avg Rating",
                value: (d.avgRating ?? 4.8).toString(),
                trend: "+18.4%",
                isPositive: true,
                variant: "orange" as const,
                icon: statsList[7]?.icon,
            },
        ];
    }, [d]);

    const visitorTrendsData = React.useMemo(() => {
        const rawTrends = d.visitorTrends?.trends;
        if (rawTrends && Array.isArray(rawTrends) && rawTrends.length > 0) {
            return rawTrends.map((t: any) => ({
                name: t.month || t.name || t.date || "Month",
                visitors: t.visitors ?? 0,
                checkIns: t.checkIns ?? 0,
                retention: t.retention ?? 0,
                new: t.new ?? 0,
                repeat: t.repeat ?? t.retention ?? 0,
                lost: t.lost ?? 0,
            }));
        }
        return undefined;
    }, [d.visitorTrends]);

    const customerSegments = React.useMemo(() => {
        const cb = d.customerBreakdown;
        if (!cb) return undefined;
        const newPct = cb.new ?? cb.now ?? 0;
        const repeatPct = cb.repeat ?? 0;
        const lostPct = cb.lost ?? 0;
        return [
            {
                name: "New",
                value: cb.newCustomers ?? 0,
                percentage: newPct,
                color: "#4ADE80",
                glowColor: "rgba(74, 222, 128, 0.6)",
            },
            {
                name: "Repeat",
                value: cb.repeatCustomers ?? 0,
                percentage: repeatPct,
                color: "#7C3AED",
                glowColor: "rgba(124, 58, 237, 0.6)",
            },
            {
                name: "Lost",
                value: cb.lostCustomers ?? 0,
                percentage: lostPct,
                color: "#F87171",
                glowColor: "rgba(248, 113, 113, 0.6)",
            },
        ];
    }, [d.customerBreakdown]);

    const totalCustomersFormatted = React.useMemo(() => {
        const total = d.customerBreakdown?.totalCustomers;
        if (total !== undefined && total !== null) {
            return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total.toString();
        }
        return undefined;
    }, [d.customerBreakdown]);

    const sentimentItems = React.useMemo(() => {
        const s = d.sentimentScore;
        if (!s) return undefined;
        return [
            {
                name: "Worth It",
                percentage: s.worthIt ?? 0,
                color: "#E8FF57",
                bgColor: "rgba(232, 255, 87, 0.03)",
                borderColor: "rgba(232, 255, 87, 0.094)",
                offsetClass: "w-full",
            },
            {
                name: "Mid",
                percentage: s.mid ?? 0,
                color: "#22D3EE",
                bgColor: "rgba(34, 211, 238, 0.03)",
                borderColor: "rgba(34, 211, 238, 0.094)",
                offsetClass: "w-full",
            },
            {
                name: "Not Worth It",
                percentage: s.notWorthIt ?? 0,
                color: "#F472B6",
                bgColor: "rgba(244, 114, 182, 0.03)",
                borderColor: "rgba(244, 114, 182, 0.094)",
                offsetClass: "w-full",
            },
        ];
    }, [d.sentimentScore]);

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
                {/* Dashboard Page Title */}
                <h1 className="text-[32px] font-extrabold leading-[40px] text-white tracking-tight">
                    Dashboard
                </h1>

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
                        <EventPerformanceCard events={d.eventPerformance} />
                    </div>
                    <div className="w-full min-w-0">
                        <VisitorSentimentsChart
                            overallScore={d.sentimentScore?.score}
                            sentiments={sentimentItems}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
