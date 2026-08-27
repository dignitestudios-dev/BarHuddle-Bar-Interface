"use client";

import React from "react";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";
import { VisitorSentimentsChart } from "@/components/charts/VisitorSentimentsChart";
import { AvgVisitDurationCard } from "@/components/charts/AvgVisitDurationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRetentionAnalyticsQuery } from "../api/analytics.queries";

export interface RetentionCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

export function RetentionTab() {
    const { data: retentionData, isLoading } = useGetRetentionAnalyticsQuery();
    const data = retentionData?.data;

    const cards: RetentionCardItem[] = React.useMemo(() => {
        return [
            {
                id: "new-customers",
                title: "New Customers",
                value: data?.oneTimeUsers !== undefined ? data.oneTimeUsers.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "green",
            },
            {
                id: "repeat-customers",
                title: "Repeat Customers",
                value: data?.returningUsers !== undefined ? data.returningUsers.toLocaleString() : "0",
                trend: data?.retentionRate !== undefined ? `+${data.retentionRate}%` : "0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "lost-customers",
                title: "Lost Customers",
                value: data?.lostCustomers !== undefined ? data.lostCustomers.toLocaleString() : "0",
                trend: "0%",
                isPositive: false,
                variant: "coral",
            },
        ];
    }, [data]);

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
                <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-[24px]" />
                    ))}
                </div>
                <Skeleton className="h-[380px] max-w-[1200px] w-full rounded-[24px]" />
                <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <Skeleton className="h-[380px] w-full rounded-[24px]" />
                    <Skeleton className="h-[380px] w-full rounded-[24px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Row: 3 Retention Stat Cards Grid */}
            <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {cards.map((card) => (
                    <StatsCard
                        key={card.id}
                        title={card.title}
                        value={card.value}
                        trend={card.trend}
                        isPositive={card.isPositive}
                        variant={card.variant}
                        className="w-full"
                    />
                ))}
            </div>

            {/* Mid Section: Visitor Trends Chart */}
            <div className="max-w-[1200px] w-full">
                <VisitorTrendsChart
                    variant="retention"
                    className="max-w-full"
                />
            </div>

            {/* Lower Section: Avg Visit Duration & Visitor Sentiment */}
            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <AvgVisitDurationCard className="w-full h-full" />
                <VisitorSentimentsChart
                    title="Visitor Sentiment Score"
                    tagText="DEMOGRAPHICS"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

export default RetentionTab;
