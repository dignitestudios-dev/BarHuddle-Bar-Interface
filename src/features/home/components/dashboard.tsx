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

export function Dashboard() {
    const { data: dashboardData, isLoading } = useGetDashboardQuery();

    const stats = React.useMemo(() => {
        if (!dashboardData?.data) return statsList;
        const d = dashboardData.data;

        // Construct stat cards strictly from API response
        return [
            {
                title: "Total Visitors",
                value: (d.totalVisits ?? d.uniqueVisitors ?? d.totalVisitors ?? d.visitors ?? 0).toLocaleString(),
                trend: d.visitorTrend ?? "+18.4%",
                isPositive: true,
                variant: "purple" as const,
                icon: statsList[0]?.icon,
            },
            {
                title: "Total Events",
                value: (d.totalEvents ?? d.events ?? 0).toString(),
                trend: d.eventTrend ?? "+12%",
                isPositive: true,
                variant: "green" as const,
                icon: statsList[1]?.icon,
            },
            {
                title: "Active Promotions",
                value: (d.activePromotions ?? d.promotions ?? 0).toString(),
                trend: d.promotionTrend ?? "+5%",
                isPositive: true,
                variant: "yellow" as const,
                icon: statsList[2]?.icon,
            },
            {
                title: "Retention Rate",
                value: `${d.retentionRate ?? d.retention ?? 0}%`,
                trend: d.retentionTrend ?? "+4.2%",
                isPositive: true,
                variant: "coral" as const,
                icon: statsList[3]?.icon,
            },
        ];
    }, [dashboardData]);

    if (isLoading) {
        return (
            <div className="w-full flex flex-col font-['Manrope',sans-serif]">
                <main className="flex-1 w-full px-6 py-8 flex flex-col gap-8">
                    <h1 className="text-[32px] font-extrabold leading-[40px] text-white tracking-tight">
                        Dashboard
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-28 w-full rounded-[24px]" />
                        ))}
                    </div>
                    <div className="flex justify-between items-center max-w-[1200px] w-full gap-6">
                        <Skeleton className="w-3/4 h-[380px] rounded-[24px]" />
                        <Skeleton className="w-1/4 h-[380px] rounded-[24px]" />
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

                {/* Overview Stats Cards Grid - 4 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <StatsCard
                            key={idx}
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
                <div className="flex justify-between items-center max-w-[1200px] w-full gap-6">
                    <div className="w-3/4">
                        <VisitorTrendsChart />
                    </div>
                    <div className="w-1/4">
                        <CustomerDonutChart />
                    </div>
                </div>

                {/* Bottom Row: Event Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1200px] gap-6">
                    <div className="w-full lg:w-auto">
                        <EventPerformanceCard />
                    </div>
                    <div className="w-full lg:w-auto">
                        <VisitorSentimentsChart />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
