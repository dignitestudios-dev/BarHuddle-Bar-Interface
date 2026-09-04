"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { VisitorTrendsChart, TrendDataPoint } from "@/components/charts/VisitorTrendsChart";
import { TrafficByTimeChart, TimeSlotData } from "@/components/charts/TrafficByTimeChart";
import { CustomerDonutChart, CustomerSegment } from "@/components/charts/CustomerDonutChart";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetOverviewQuery,
    useGetVisitorsGraphQuery,
    useGetTimeOfDayGraphQuery,
    useGetCustomerBreakdownGraphQuery,
    useGetVisitorSentimentDashboardQuery,
} from "../api/analytics.queries";
import { AnalyticsFilterParams } from "../api/analytics.service";

export interface AnalyticsCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

export interface OverviewTabProps {
    filterParams?: AnalyticsFilterParams;
}

export function OverviewTab({ filterParams }: OverviewTabProps) {
    const { data: overviewResponse, isLoading: isLoadingOverview } =
        useGetOverviewQuery(filterParams);
    const { data: visitorsGraphResponse, isLoading: isLoadingVisitorsGraph } =
        useGetVisitorsGraphQuery(filterParams);
    const { data: timeOfDayResponse, isLoading: isLoadingTimeOfDay, isError: isErrorTimeOfDay } =
        useGetTimeOfDayGraphQuery(filterParams);
    const { data: customerBreakdownResponse, isLoading: isLoadingCustomerBreakdown, isError: isErrorCustomerBreakdown } =
        useGetCustomerBreakdownGraphQuery(filterParams);
    const { data: sentimentResponse } =
        useGetVisitorSentimentDashboardQuery(filterParams);

    const isLoading =
        isLoadingOverview ||
        isLoadingVisitorsGraph ||
        isLoadingTimeOfDay ||
        isLoadingCustomerBreakdown;

    // 8 Stat Cards mapping from GET /analytics/overview
    const cards: AnalyticsCardItem[] = useMemo(() => {
        const o = overviewResponse?.data;

        return [
            {
                id: "total-check-ins",
                title: "Total Check-Ins",
                value: o?.totalCheckIns !== undefined ? o.totalCheckIns.toLocaleString() : "0",
                trend: o?.totalCheckInsGrowth || "+0%",
                isPositive: !String(o?.totalCheckInsGrowth || "").startsWith("-"),
                variant: "purple",
            },
            {
                id: "total-visitors",
                title: "Total Visitors",
                value: o?.totalVisitors !== undefined ? o.totalVisitors.toLocaleString() : "0",
                trend: o?.totalVisitorsGrowth || "+0%",
                isPositive: !String(o?.totalVisitorsGrowth || "").startsWith("-"),
                variant: "purple",
            },
            {
                id: "avg-stay-duration",
                title: "Avg Stay Duration",
                value: typeof o?.avgStay === "number" ? `${o.avgStay} mins` : (o?.avgStay || "0 mins"),
                trend: o?.avgStayGrowth || "+0%",
                isPositive: !String(o?.avgStayGrowth || "").startsWith("-"),
                variant: "yellow",
            },
            {
                id: "new-customers",
                title: "New Customers",
                value: o?.newCustomers !== undefined ? o.newCustomers.toLocaleString() : "0",
                trend: o?.newCustomersGrowth || "+0%",
                isPositive: !String(o?.newCustomersGrowth || "").startsWith("-"),
                variant: "green",
            },
            {
                id: "repeat-customers",
                title: "Repeat Customers",
                value: o?.repeatCustomers !== undefined ? o.repeatCustomers.toLocaleString() : "0",
                trend: o?.repeatCustomersGrowth || "+0%",
                isPositive: !String(o?.repeatCustomersGrowth || "").startsWith("-"),
                variant: "purple",
            },
            {
                id: "lost-customers",
                title: "Lost Customers",
                value: o?.lostCustomers !== undefined ? o.lostCustomers.toLocaleString() : "0",
                trend: o?.lostCustomersGrowth || "+0%",
                isPositive: !String(o?.lostCustomersGrowth || "").startsWith("-"),
                variant: "coral",
            },
            {
                id: "event-attendance",
                title: "Event Attendance",
                value: o?.eventAttendance !== undefined ? o.eventAttendance.toLocaleString() : "0",
                trend: o?.eventAttendanceGrowth || "+0%",
                isPositive: !String(o?.eventAttendanceGrowth || "").startsWith("-"),
                variant: "pink",
            },
            {
                id: "avg-rating",
                title: "Google Avg Rating",
                value: (() => {
                    if (o?.avgRating !== undefined && o?.avgRating !== null) return o.avgRating.toString();
                    const sData = sentimentResponse?.data as any;
                    if (sData?.score) return (sData.score / 20).toFixed(1);
                    if (sData?.worthIt) {
                        const pct = typeof sData.worthIt === "object" ? sData.worthIt.percentage : sData.worthIt;
                        return (pct / 20).toFixed(1);
                    }
                    return "0";
                })(),
                trend: "+0%",
                isPositive: true,
                variant: "orange",
            },
        ];
    }, [overviewResponse, sentimentResponse]);

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
            };
        });
    }, [visitorsGraphResponse]);

    // Time of Day mapping from GET /analytics/overview/time-of-day-graph
    const timeSlotsData: TimeSlotData[] = useMemo(() => {
        const t = timeOfDayResponse?.data;
        const morningVal = t?.morning ?? 0;
        const afternoonVal = t?.afternoon ?? 0;
        const eveningVal = t?.evening ?? 0;
        const lateNightVal = t?.latenight ?? t?.lateNight ?? 0;

        return [
            {
                id: "morning",
                label: "Morning",
                value: morningVal,
                color: "#22D3EE",
                glowColor: "rgba(34, 211, 238, 0.4)",
            },
            {
                id: "afternoon",
                label: "Afternoon",
                value: afternoonVal,
                color: "#A855F7",
                glowColor: "rgba(168, 85, 247, 0.4)",
            },
            {
                id: "evening",
                label: "Evening",
                value: eveningVal,
                color: "#7C3AED",
                glowColor: "rgba(124, 58, 237, 0.4)",
            },
            {
                id: "late-night",
                label: "Late Night",
                value: lateNightVal,
                color: "#E8FF57",
                glowColor: "rgba(232, 255, 87, 0.4)",
            },
        ];
    }, [timeOfDayResponse]);

    // Customer Breakdown mapping from GET /analytics/overview/customer-breakdown-graph
    const customerSegmentsData: CustomerSegment[] | undefined = useMemo(() => {
        const c = customerBreakdownResponse?.data;
        if (!c) return undefined;

        return [
            {
                name: "New",
                value: c.newCustomers?.count ?? 0,
                percentage: Math.round(c.newCustomers?.percentage ?? 0),
                color: "#4ADE80",
                glowColor: "rgba(74, 222, 128, 0.6)",
            },
            {
                name: "Repeat",
                value: c.repeatCustomers?.count ?? 0,
                percentage: Math.round(c.repeatCustomers?.percentage ?? 0),
                color: "#7C3AED",
                glowColor: "rgba(124, 58, 237, 0.6)",
            },
            {
                name: "Lost",
                value: c.lostCustomers?.count ?? 0,
                percentage: Math.round(c.lostCustomers?.percentage ?? 0),
                color: "#F87171",
                glowColor: "rgba(248, 113, 113, 0.6)",
            },
        ];
    }, [customerBreakdownResponse]);

    const totalCustomersCount = useMemo(() => {
        const c = customerBreakdownResponse?.data;
        if (c?.totalCustomers !== undefined) {
            return c.totalCustomers.toString();
        }
        return undefined;
    }, [customerBreakdownResponse]);

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
                <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-[24px]" />
                    ))}
                </div>
                <Skeleton className="h-[380px] max-w-[1200px] w-full rounded-[24px]" />
                <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                    <Skeleton className="h-[380px] flex-1 w-full rounded-[24px]" />
                    <Skeleton className="h-[380px] w-full xl:w-[288px] rounded-[24px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* 8 Analytics Stat Cards Grid (4 Columns x 2 Rows) */}
            <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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

            {/* Visitor Trends Live Analytics Chart */}
            <div className="max-w-[1200px] w-full">
                <VisitorTrendsChart
                    data={trendsChartData}
                    className="max-w-full"
                />
            </div>

            {/* Traffic by Time & Visitor Breakdown Section */}
            <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                <TrafficByTimeChart
                    slots={timeSlotsData}
                    isError={isErrorTimeOfDay}
                    className="flex-1 max-w-full"
                />
                <CustomerDonutChart
                    title="Visitor Breakdown"
                    segments={customerSegmentsData}
                    totalCustomers={totalCustomersCount}
                    isError={isErrorCustomerBreakdown}
                    className="w-full xl:w-[288px] shrink-0"
                />
            </div>
        </div>
    );
}

export default OverviewTab;
