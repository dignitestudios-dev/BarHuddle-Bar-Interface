"use client";

import React from "react";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";
import { TrafficByTimeChart } from "@/components/charts/TrafficByTimeChart";
import { CustomerDonutChart } from "@/components/charts/CustomerDonutChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetVisitorAnalyticsQuery, useGetRetentionAnalyticsQuery } from "../api/analytics.queries";

export function VisitorTab() {
    const { data: visitorData, isLoading: isLoadingVisitor } = useGetVisitorAnalyticsQuery();
    const { isLoading: isLoadingRetention } = useGetRetentionAnalyticsQuery();

    const isLoading = isLoadingVisitor || isLoadingRetention;

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
                <Skeleton className="h-[380px] max-w-[1200px] w-full rounded-[24px]" />
                <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                    <Skeleton className="h-[380px] flex-1 w-full rounded-[24px]" />
                    <Skeleton className="h-[380px] w-full xl:w-[288px] rounded-[24px]" />
                </div>
            </div>
        );
    }

    const analytics = visitorData?.data;
    const totalVisits = analytics?.totalVisits ?? 0;
    const totalVisitorsStr = totalVisits >= 1000 ? `${(totalVisits / 1000).toFixed(1)}K` : totalVisits.toString();

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Live Analytics: Visitor Trends Area Chart */}
            <div className="max-w-[1200px] w-full">
                <VisitorTrendsChart
                    showRetention={true}
                    className="max-w-full"
                />
            </div>

            {/* Traffic by Time of Day & Visitor Breakdown Row */}
            <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                <TrafficByTimeChart className="flex-1 max-w-full" />
                <CustomerDonutChart
                    title="Visitor Breakdown"
                    tagText="VISITOR SPLIT"
                    showGradientBar={true}
                    totalCustomers={totalVisitorsStr}
                    totalLabel="Total"
                    className="w-full xl:w-[288px] shrink-0"
                />
            </div>
        </div>
    );
}

export default VisitorTab;
