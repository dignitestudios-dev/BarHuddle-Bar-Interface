"use client";

import React from "react";
import { StatsCard } from "@/components/ui";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";
import { CustomerDonutChart } from "@/components/charts/CustomerDonutChart";
import { EventPerformanceCard } from "@/features/events/components";

import { statsList } from "@/utils/constants";
import VisitorSentimentsChart from "@/components/charts/VisitorSentimentsChart";
import { useGetDashboardQuery } from "@/features/analytics/api/analytics.queries";

export function Dashboard() {
    const { data: dashboardData } = useGetDashboardQuery();

    const stats = React.useMemo(() => {
        if (!dashboardData?.data) return statsList;
        // In a real app we map the dashboardData.data to the statsList format
        // For now, if the API succeeds but returns different schema, we safely fallback to UI statsList or merge them
        return statsList.map(stat => {
            if (stat.title === 'Active Promotions' && dashboardData.data.activePromotions !== undefined) {
                return { ...stat, value: dashboardData.data.activePromotions.toString() };
            }
            if (stat.title === 'Total Events' && dashboardData.data.totalEvents !== undefined) {
                return { ...stat, value: dashboardData.data.totalEvents.toString() };
            }
            return stat;
        });
    }, [dashboardData]);

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
