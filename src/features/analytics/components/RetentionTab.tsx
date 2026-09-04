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
    useGetVisitorSentimentDashboardQuery,
    useGetOverviewQuery,
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
    const { data: avgDurationResponse, isLoading: isLoadingDuration, isError: isErrorDuration } =
        useGetAvgDurationDashboardQuery(filterParams);
    const { data: sentimentResponse, isLoading: isLoadingSentiment, isError: isErrorSentiment } =
        useGetVisitorSentimentDashboardQuery(filterParams);
    const { data: overviewResponse } =
        useGetOverviewQuery(filterParams);

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

    // Graph Data mapping from GET /analytics/overview/vistors-graph & GET /analytics/retention/retention-dashboard
    const trendsChartData: TrendDataPoint[] | undefined = useMemo(() => {
        const raw = visitorsGraphResponse?.data;
        if (!raw || !Array.isArray(raw) || raw.length === 0) {
            return undefined;
        }

        const retData = retentionDashboardResponse?.data;
        const totalNew = retData?.newCustomers ?? 0;
        const totalRepeat = retData?.repeatCustomers ?? 0;
        const totalLost = retData?.lostCustomers ?? 0;

        const totalVisitorsInGraph = raw.reduce((sum, item) => sum + (item.visitors ?? 0), 0);

        const hasExplicitRepeat = raw.some(
            (item: any) => (item.repeat ?? item.repeatCustomers ?? 0) > 0
        );
        const hasExplicitNew = raw.some(
            (item: any) => (item.new ?? item.newCustomers ?? 0) > 0
        );

        return raw.map((item: any, idx: number) => {
            let label = "Day";
            try {
                const d = new Date(item.date);
                if (!isNaN(d.getTime())) {
                    label = format(d, "MMM dd");
                }
            } catch {
                label = item.date;
            }

            const visitors = item.visitors ?? 0;
            const checkIns = item.checkIns ?? 0;
            const retention = item.retention ?? 0;
            const isLastPoint = idx === raw.length - 1;

            // 1. New Customers
            let pointNew = 0;
            if (hasExplicitNew) {
                pointNew = item.new ?? item.newCustomers ?? visitors;
            } else if (totalVisitorsInGraph > 0 && totalNew > 0) {
                pointNew = Math.round((visitors / totalVisitorsInGraph) * totalNew);
                if (visitors > 0 && pointNew === 0) pointNew = 1;
            } else if (totalVisitorsInGraph === 0 && totalNew > 0 && isLastPoint) {
                pointNew = totalNew;
            } else {
                pointNew = item.new ?? item.newCustomers ?? visitors;
            }

            // 2. Repeat Customers
            let pointRepeat = 0;
            if (hasExplicitRepeat) {
                pointRepeat = item.repeat ?? item.repeatCustomers ?? retention;
            } else if (totalVisitorsInGraph > 0 && totalRepeat > 0) {
                pointRepeat = Math.round((visitors / totalVisitorsInGraph) * totalRepeat);
                if (visitors > 0 && pointRepeat === 0) pointRepeat = 1;
            } else if (retention > 0) {
                pointRepeat = retention;
            } else if (totalVisitorsInGraph === 0 && totalRepeat > 0 && isLastPoint) {
                pointRepeat = totalRepeat;
            } else {
                pointRepeat = item.repeat ?? item.repeatCustomers ?? retention ?? 0;
            }

            // 3. Lost Customers
            let pointLost = 0;
            if (item.lost !== undefined || item.lostCustomers !== undefined) {
                pointLost = item.lost ?? item.lostCustomers ?? 0;
            } else if (totalVisitorsInGraph > 0 && totalLost > 0) {
                pointLost = Math.round((visitors / totalVisitorsInGraph) * totalLost);
            } else if (totalVisitorsInGraph === 0 && totalLost > 0 && isLastPoint) {
                pointLost = totalLost;
            } else {
                pointLost = 0;
            }

            return {
                name: label,
                visitors,
                checkIns,
                retention: pointRepeat,
                new: pointNew,
                repeat: pointRepeat,
                lost: pointLost,
            };
        });
    }, [visitorsGraphResponse, retentionDashboardResponse]);

    // Avg Visit Duration mapping from GET /analytics/retention/avg-duration-dashboard
    const durationFormatted = useMemo(() => {
        const d = (avgDurationResponse as any)?.data?.overall !== undefined
            ? (avgDurationResponse as any).data
            : (avgDurationResponse as any)?.data?.data !== undefined
            ? (avgDurationResponse as any).data.data
            : (avgDurationResponse as any)?.data;

        const overall = d?.overall as any;
        if (overall) {
            const hrs = overall.hours ?? 0;
            const mins = overall.minutes ?? (overall.totalMinutes ? overall.totalMinutes % 60 : 0);
            const totalMins = overall.totalMinutes ?? (hrs * 60 + mins);

            if (hrs > 0 && mins > 0) {
                return `${hrs}h ${mins}m`;
            } else if (hrs > 0) {
                return `${hrs}h`;
            } else if (mins > 0) {
                return `${mins}m`;
            } else if (totalMins > 0) {
                return `${totalMins}m`;
            }
            return "0m";
        }

        // Fallback to overview data if avgStay is available
        const overviewStay = overviewResponse?.data?.avgStay;
        if (overviewStay !== undefined && overviewStay !== null && overviewStay !== 0) {
            return typeof overviewStay === "number" ? `${overviewStay}m` : `${overviewStay}`;
        }
        return "0m";
    }, [avgDurationResponse, overviewResponse]);

    const durationTrendText = useMemo(() => {
        const growth = overviewResponse?.data?.avgStayGrowth;
        if (growth) {
            return `${growth} vs last period`;
        }
        return "+0m vs last period";
    }, [overviewResponse]);

    const durationItems: DurationBarItem[] = useMemo(() => {
        const d = (avgDurationResponse as any)?.data?.overall !== undefined
            ? (avgDurationResponse as any).data
            : (avgDurationResponse as any)?.data?.data !== undefined
            ? (avgDurationResponse as any).data.data
            : (avgDurationResponse as any)?.data;

        const formatSlotDuration = (slot: any) => {
            if (!slot) return "0m";
            const hrs = slot.hours ?? 0;
            const mins = slot.minutes ?? (slot.totalMinutes ? slot.totalMinutes % 60 : 0);
            const total = slot.totalMinutes ?? (hrs * 60 + mins);
            if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
            if (hrs > 0) return `${hrs}h`;
            if (mins > 0) return `${mins}m`;
            if (total > 0) return `${total}m`;
            return "0m";
        };

        if (!d) {
            return [
                { label: "Mon–Thu", percentage: 0, color: "#C4B5FD", durationText: "0m" },
                { label: "Fri", percentage: 0, color: "#7C3AED", durationText: "0m" },
                { label: "Sat", percentage: 0, color: "#E8FF57", durationText: "0m" },
            ];
        }

        const getSlotMin = (slot: any) => {
            if (!slot) return 0;
            if (typeof slot === "number") return slot;
            return slot.totalMinutes ?? ((slot.hours || 0) * 60 + (slot.minutes || 0));
        };

        const monThuMin = getSlotMin(d.monThu);
        const friMin = getSlotMin(d.fri);
        const satMin = getSlotMin(d.sat);
        const sunMin = getSlotMin(d.sun);

        const maxMinutes = Math.max(monThuMin, friMin, satMin, sunMin, 0);

        const calcPct = (min: number) => {
            if (min === 0 || maxMinutes === 0) return 0;
            return Math.min(100, Math.round((min / maxMinutes) * 100));
        };

        const items: DurationBarItem[] = [
            {
                label: "Mon–Thu",
                percentage: calcPct(monThuMin),
                color: "#C4B5FD",
                durationText: formatSlotDuration(d.monThu),
            },
            {
                label: "Fri",
                percentage: calcPct(friMin),
                color: "#7C3AED",
                durationText: formatSlotDuration(d.fri),
            },
            {
                label: "Sat",
                percentage: calcPct(satMin),
                color: "#E8FF57",
                durationText: formatSlotDuration(d.sat),
            },
        ];

        if (d.sun !== undefined && d.sun !== null) {
            items.push({
                label: "Sun",
                percentage: calcPct(sunMin),
                color: "#22D3EE",
                durationText: formatSlotDuration(d.sun),
            });
        }

        return items;
    }, [avgDurationResponse]);

    // Sentiment Scores mapped from GET /analytics/retention/visitor-sentiment-dashboard
    const sentimentItems = useMemo(() => {
        const d = sentimentResponse?.data as any;
        if (!d) return undefined;

        const getPct = (val: any) => {
            if (val === undefined || val === null) return undefined;
            if (typeof val === "number") return Math.round(val);
            if (typeof val.percentage === "number") return Math.round(val.percentage);
            return undefined;
        };

        const worthItPct = getPct(d.worthIt);
        const midPct = getPct(d.mid);
        const notWorthItPct = getPct(d.notWorthIt);

        if (worthItPct === undefined && midPct === undefined && notWorthItPct === undefined) {
            return undefined;
        }

        return [
            {
                name: "Worth It",
                percentage: worthItPct ?? 0,
                color: "#E8FF57",
                bgColor: "rgba(232, 255, 87, 0.03)",
                borderColor: "rgba(232, 255, 87, 0.094)",
                offsetClass: "w-full",
            },
            {
                name: "Check It Out",
                percentage: midPct ?? 0,
                color: "#22D3EE",
                bgColor: "rgba(34, 211, 238, 0.03)",
                borderColor: "rgba(34, 211, 238, 0.094)",
                offsetClass: "w-full",
            },
            {
                name: "Not Worth It",
                percentage: notWorthItPct ?? 0,
                color: "#F472B6",
                bgColor: "rgba(244, 114, 182, 0.03)",
                borderColor: "rgba(244, 114, 182, 0.094)",
                offsetClass: "w-full",
            },
        ];
    }, [sentimentResponse]);

    const sentimentOverallScore = useMemo(() => {
        const d = sentimentResponse?.data as any;
        if (!d) return undefined;
        if (d.score !== undefined && d.score !== null) return Number(d.score);
        if (d.sentimentScore?.score !== undefined) return Number(d.sentimentScore.score);
        if (typeof d.sentimentScore === "number") return d.sentimentScore;
        const w = typeof d.worthIt === "object" ? d.worthIt?.percentage : (typeof d.worthIt === "number" ? d.worthIt : undefined);
        if (w !== undefined) return Math.round(w);
        return undefined;
    }, [sentimentResponse]);

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
                    trendText={durationTrendText}
                    isError={isErrorDuration}
                    className="w-full h-full"
                />
                <VisitorSentimentsChart
                    title="Visitor Sentiment Score"
                    tagText="DEMOGRAPHICS"
                    overallScore={sentimentOverallScore}
                    sentiments={sentimentItems}
                    isError={isErrorSentiment}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

export default RetentionTab;
