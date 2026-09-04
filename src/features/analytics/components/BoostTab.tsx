"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { TrafficByTimeChart, OrganicBoostedGroup } from "@/components/charts/TrafficByTimeChart";
import { BoostHistoryTableCard } from "./BoostHistoryTableCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetBoostedOverviewQuery,
    useGetOrganicVsBoostedQuery,
} from "../api/analytics.queries";
import { AnalyticsFilterParams } from "../api/analytics.service";

export interface BoostCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

export interface BoostTabProps {
    filterParams?: AnalyticsFilterParams;
}

export function BoostTab({ filterParams }: BoostTabProps) {
    const { data: boostedOverviewResponse, isLoading: isLoadingOverview } =
        useGetBoostedOverviewQuery(filterParams);
    const { data: organicVsBoostedResponse, isLoading: isLoadingChart, isError: isErrorChart } =
        useGetOrganicVsBoostedQuery(filterParams);

    const isLoading = isLoadingOverview || isLoadingChart;

    const overview = boostedOverviewResponse?.data;

    const cards: BoostCardItem[] = useMemo(() => {
        const reachVal =
            overview?.totalReach !== undefined && overview?.totalReach !== null
                ? overview.totalReach.toLocaleString()
                : "0";

        const viewsVal =
            overview?.totalViews !== undefined && overview?.totalViews !== null
                ? overview.totalViews.toLocaleString()
                : "0";

        const engagementVal =
            overview?.avgEngagement !== undefined && overview?.avgEngagement !== null
                ? `${overview.avgEngagement}%`
                : "0%";

        return [
            {
                id: "total-reach",
                title: "Total Reach",
                value: reachVal,
                trend: "+0%",
                isPositive: true,
                variant: "cyan",
            },
            {
                id: "total-views",
                title: "Total Check-ins during Events",
                value: viewsVal,
                trend: "+0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "avg-engagement",
                title: "Avg Engagement",
                value: engagementVal,
                trend: "+0%",
                isPositive: true,
                variant: "yellow",
            },
        ];
    }, [overview]);

    // Map Organic vs Boosted Groups from GET /analytics/boosted/organic-vs-boosted
    const organicBoostedGroups: OrganicBoostedGroup[] = useMemo(() => {
        const raw = organicVsBoostedResponse?.data;
        if (!raw || !Array.isArray(raw) || raw.length === 0) return [];

        return raw.map((item, idx) => {
            let label = "Day";
            try {
                const d = new Date(item.date);
                if (!isNaN(d.getTime())) {
                    label = format(d, "MMM dd");
                }
            } catch {
                label = item.date;
            }

            return {
                id: `grp-${idx}`,
                label,
                organicValue: item.organic ?? 0,
                boostedValue: item.boosted ?? 0,
            };
        });
    }, [organicVsBoostedResponse]);

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

            {/* Main Section: Organic vs Boosted Bar Chart */}
            <div className="max-w-[1200px] w-full">
                <TrafficByTimeChart
                    variant="organicVsBoosted"
                    groups={organicBoostedGroups}
                    isError={isErrorChart}
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
