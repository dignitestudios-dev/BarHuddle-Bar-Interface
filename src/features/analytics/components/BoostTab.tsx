"use client";

import React from "react";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { TrafficByTimeChart } from "@/components/charts/TrafficByTimeChart";
import { BoostHistoryTableCard } from "./BoostHistoryTableCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEventsAnalyticsQuery } from "../api/analytics.queries";

export interface BoostCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

export function BoostTab() {
    const { data: eventsResponse, isLoading } = useGetEventsAnalyticsQuery();
    const data = eventsResponse?.data;

    const cards: BoostCardItem[] = React.useMemo(() => {
        return [
            {
                id: "total-reach",
                title: "Total Reach",
                value: data?.totalReach ? (data.totalReach >= 1000 ? `${(data.totalReach / 1000).toFixed(1)}k` : data.totalReach.toString()) : "0",
                trend: "+0%",
                isPositive: true,
                variant: "cyan",
            },
            {
                id: "total-views",
                title: "Total Views",
                value: data?.eventAttendance ? (data.eventAttendance >= 1000 ? `${(data.eventAttendance / 1000).toFixed(1)}k` : data.eventAttendance.toString()) : "0",
                trend: "+0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "avg-engagement",
                title: "Avg Engagement",
                value: data?.avgBoostedReach ? `${data.avgBoostedReach}%` : "0%",
                trend: "+0%",
                isPositive: true,
                variant: "yellow",
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
                <Skeleton className="h-[360px] max-w-[1200px] w-full rounded-[24px]" />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Row: 3 Boost Stat Cards */}
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

            {/* Main Section: Organic vs Boosted Bar Chart using TrafficByTimeChart */}
            <div className="max-w-[1200px] w-full">
                <TrafficByTimeChart
                    variant="organicVsBoosted"
                    className="max-w-full"
                />
            </div>

            {/* Lower Section: Boost History Table */}
            <div className="max-w-[1200px] w-full">
                <BoostHistoryTableCard
                    showFilterPills={false}
                    initialFilter="Boost"
                    tagText="BOOST HISTORY"
                    title="Boost History"
                    className="max-w-full"
                />
            </div>
        </div>
    );
}

export default BoostTab;
