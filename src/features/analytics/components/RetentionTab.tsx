"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { VisitorTrendsChart, TrendDataPoint } from "@/components/charts/VisitorTrendsChart";
import { VisitorSentimentsChart, SentimentItem } from "@/components/charts/VisitorSentimentsChart";
import { AvgVisitDurationCard, DurationBarItem } from "@/components/charts/AvgVisitDurationCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetVisitorsGraphQuery,
    useGetRetentionDashboardQuery,
    useGetAvgDurationDashboardQuery,
    useGetSentimentAnalyticsQuery,
} from "../api/analytics.queries";
import { AnalyticsFilterParams } from "../api/analytics.service";

export interface RetentionCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

export interface RetentionTabProps {
    filterParams?: AnalyticsFilterParams;
}

export function RetentionTab({ filterParams }: RetentionTabProps) {
    const { data: visitorsGraphResponse, isLoading: isLoadingVisitorsGraph } =
        useGetVisitorsGraphQuery(filterParams);
    const { data: retentionDashboardResponse, isLoading: isLoadingRetention } =
        useGetRetentionDashboardQuery(filterParams);
    const { data: avgDurationResponse, isLoading: isLoadingDuration } =
        useGetAvgDurationDashboardQuery(filterParams);
    const { data: sentimentAnalyticsResponse, isLoading: isLoadingSentiment } =
        useGetSentimentAnalyticsQuery(filterParams);

    const isLoading =
        isLoadingVisitorsGraph ||
        isLoadingRetention ||
        isLoadingDuration ||
        isLoadingSentiment;

    // Top 3 Retention Metric Cards
    const cards: RetentionCardItem[] = useMemo(() => {
        const d = retentionDashboardResponse?.data;

        return [
            {
                id: "new-customers",
                title: "New Customers",
                value: d?.newCustomers !== undefined ? d.newCustomers.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "green",
            },
            {
                id: "repeat-customers",
                title: "Repeat Customers",
                value: d?.repeatCustomers !== undefined ? d.repeatCustomers.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "lost-customers",
                title: "Lost Customers",
                value: d?.lostCustomers !== undefined ? d.lostCustomers.toLocaleString() : "0",
                trend: "0%",
                isPositive: false,
                variant: "coral",
            },
        ];
    }, [retentionDashboardResponse]);

    // Graph Data mapping from GET /analytics/overview/vistors-graph
    const trendsChartData: TrendDataPoint[] | undefined = useMemo(() => {
        const raw = visitorsGraphResponse?.data;
        if (!raw || !Array.isArray(raw) || raw.length === 0) {
            return undefined;
        }

        return raw.map((item) => {
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
                name: label,
                visitors: item.visitors ?? 0,
                checkIns: item.checkIns ?? 0,
                retention: item.retention ?? 0,
                new: item.visitors ?? 0,
                repeat: item.retention ?? 0,
                lost: 0,
            };
        });
    }, [visitorsGraphResponse]);

    // Avg Visit Duration mapping from GET /analytics/retention/avg-duration-dashboard
    const durationFormatted = useMemo(() => {
        const overall = avgDurationResponse?.data?.overall;
        if (!overall) return "0m";

        if (overall.hours > 0) {
            return `${overall.hours}h ${overall.minutes}m`;
        }
        return `${overall.minutes || overall.totalMinutes || 0}m`;
    }, [avgDurationResponse]);

    const durationItems: DurationBarItem[] = useMemo(() => {
        const d = avgDurationResponse?.data;
        if (!d) {
            return [
                { label: "Mon–Thu", percentage: 0, color: "#C4B5FD" },
                { label: "Fri", percentage: 0, color: "#7C3AED" },
                { label: "Sat", percentage: 0, color: "#E8FF57" },
            ];
        }

        const monThuMin = d.monThu?.totalMinutes || (d.monThu?.hours || 0) * 60 + (d.monThu?.minutes || 0);
        const friMin = d.fri?.totalMinutes || (d.fri?.hours || 0) * 60 + (d.fri?.minutes || 0);
        const satMin = d.sat?.totalMinutes || (d.sat?.hours || 0) * 60 + (d.sat?.minutes || 0);
        const sunMin = d.sun?.totalMinutes || (d.sun?.hours || 0) * 60 + (d.sun?.minutes || 0);

        const maxMinutes = Math.max(monThuMin, friMin, satMin, sunMin, 1);

        const calcPct = (min: number) => {
            if (min === 0) return 0;
            return Math.min(100, Math.round((min / maxMinutes) * 100));
        };

        const items: DurationBarItem[] = [
            { label: "Mon–Thu", percentage: calcPct(monThuMin), color: "#C4B5FD" },
            { label: "Fri", percentage: calcPct(friMin), color: "#7C3AED" },
            { label: "Sat", percentage: calcPct(satMin), color: "#E8FF57" },
        ];

        if (d.sun && sunMin > 0) {
            items.push({ label: "Sun", percentage: calcPct(sunMin), color: "#22D3EE" });
        }

        return items;
    }, [avgDurationResponse]);

    // Visitor Sentiment mapping from GET /venue-owner/analytics/sentiment
    const sentimentOverallScore = useMemo(() => {
        const score = sentimentAnalyticsResponse?.data?.sentimentScore?.score;
        if (score !== undefined && score !== null) {
            return Number(score);
        }
        return 0;
    }, [sentimentAnalyticsResponse]);

    const sentimentItems: SentimentItem[] = useMemo(() => {
        const s = sentimentAnalyticsResponse?.data?.sentimentScore;
        const worthItPct = Math.round(s?.worthIt ?? 0);
        const midPct = Math.round(s?.mid ?? 0);
        const notWorthItPct = Math.round(s?.notWorthIt ?? 0);

        return [
            {
                name: "Worth It",
                percentage: worthItPct,
                color: "#E8FF57",
                bgColor: "rgba(232, 255, 87, 0.04)",
                borderColor: "rgba(232, 255, 87, 0.18)",
                offsetClass: "w-full",
            },
            {
                name: "Mid",
                percentage: midPct,
                color: "#22D3EE",
                bgColor: "rgba(34, 211, 238, 0.04)",
                borderColor: "rgba(34, 211, 238, 0.18)",
                offsetClass: "w-full",
            },
            {
                name: "Not Worth It",
                percentage: notWorthItPct,
                color: "#F472B6",
                bgColor: "rgba(244, 114, 182, 0.04)",
                borderColor: "rgba(244, 114, 182, 0.18)",
                offsetClass: "w-full",
            },
        ];
    }, [sentimentAnalyticsResponse]);

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
                    data={trendsChartData}
                    variant="retention"
                    showRetention={true}
                    className="max-w-full"
                />
            </div>

            {/* Lower Section: Avg Visit Duration & Visitor Sentiment */}
            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <AvgVisitDurationCard
                    duration={durationFormatted}
                    items={durationItems}
                    trendText="+0m vs last period"
                    className="w-full h-full"
                />
                <VisitorSentimentsChart
                    title="Visitor Sentiment Score"
                    tagText="DEMOGRAPHICS"
                    overallScore={sentimentOverallScore}
                    sentiments={sentimentItems}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

export default RetentionTab;
