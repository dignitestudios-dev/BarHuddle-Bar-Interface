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
    const { data: timeOfDayResponse, isLoading: isLoadingTimeOfDay } =
        useGetTimeOfDayGraphQuery(filterParams);
    const { data: customerBreakdownResponse, isLoading: isLoadingCustomerBreakdown } =
        useGetCustomerBreakdownGraphQuery(filterParams);

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
                trend: "+0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "total-visitors",
                title: "Total Visitors",
                value: o?.totalVisitors !== undefined ? o.totalVisitors.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "avg-stay-duration",
                title: "Avg Stay Duration",
                value: o?.avgStay !== undefined ? `${o.avgStay}m` : "0m",
                trend: "+0%",
                isPositive: true,
                variant: "yellow",
            },
            {
                id: "new-customers",
                title: "New Customers",
                value: o?.newCustomers !== undefined ? o.newCustomers.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "green",
            },
            {
                id: "repeat-customers",
                title: "Repeat Customers",
                value: o?.repeatCustomers !== undefined ? o.repeatCustomers.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "lost-customers",
                title: "Lost Customers",
                value: o?.lostCustomers !== undefined ? o.lostCustomers.toLocaleString() : "0",
                trend: "0%",
                isPositive: false,
                variant: "coral",
            },
            {
                id: "event-attendance",
                title: "Event Attendance",
                value: o?.eventAttendance !== undefined ? o.eventAttendance.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "pink",
            },
            {
                id: "avg-rating",
                title: "Avg Rating",
                value: o?.avgRating !== undefined ? `${o.avgRating}★` : "0★",
                trend: "+0.0",
                isPositive: true,
                variant: "orange",
            },
        ];
    }, [overviewResponse]);

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

        const maxVal = Math.max(morningVal, afternoonVal, eveningVal, lateNightVal, 1);
        const MAX_HEIGHT = 241;

        const calcHeight = (val: number) => {
            if (val === 0) return 4;
            return Math.max(12, Math.round((val / maxVal) * MAX_HEIGHT));
        };

        return [
            {
                id: "morning",
                label: "Morning",
                value: morningVal,
                heightPx: calcHeight(morningVal),
                color: "#22D3EE",
                glowColor: "rgba(34, 211, 238, 0.4)",
            },
            {
                id: "afternoon",
                label: "Afternoon",
                value: afternoonVal,
                heightPx: calcHeight(afternoonVal),
                color: "#A855F7",
                glowColor: "rgba(168, 85, 247, 0.4)",
            },
            {
                id: "evening",
                label: "Evening",
                value: eveningVal,
                heightPx: calcHeight(eveningVal),
                color: "#7C3AED",
                glowColor: "rgba(124, 58, 237, 0.4)",
            },
            {
                id: "late-night",
                label: "Late Night",
                value: lateNightVal,
                heightPx: calcHeight(lateNightVal),
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
                    className="flex-1 max-w-full"
                />
                <CustomerDonutChart
                    title="Visitor Breakdown"
                    segments={customerSegmentsData}
                    totalCustomers={totalCustomersCount}
                    className="w-full xl:w-[288px] shrink-0"
                />
            </div>
        </div>
    );
}

export default OverviewTab;
