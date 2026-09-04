"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { VisitorTrendsChart, TrendDataPoint } from "@/components/charts/VisitorTrendsChart";
import { TrafficByTimeChart, TimeSlotData } from "@/components/charts/TrafficByTimeChart";
import { CustomerDonutChart, CustomerSegment } from "@/components/charts/CustomerDonutChart";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetVisitorsGraphQuery,
    useGetTimeOfDayGraphQuery,
    useGetCustomerBreakdownGraphQuery,
} from "../api/analytics.queries";
import { AnalyticsFilterParams } from "../api/analytics.service";

export interface VisitorTabProps {
    filterParams?: AnalyticsFilterParams;
}

export function VisitorTab({ filterParams }: VisitorTabProps) {
    const { data: visitorsGraphResponse, isLoading: isLoadingVisitorsGraph } =
        useGetVisitorsGraphQuery(filterParams);
    const { data: timeOfDayResponse, isLoading: isLoadingTimeOfDay, isError: isErrorTimeOfDay } =
        useGetTimeOfDayGraphQuery(filterParams);
    const { data: customerBreakdownResponse, isLoading: isLoadingCustomerBreakdown, isError: isErrorCustomerBreakdown } =
        useGetCustomerBreakdownGraphQuery(filterParams);

    const isLoading =
        isLoadingVisitorsGraph ||
        isLoadingTimeOfDay ||
        isLoadingCustomerBreakdown;

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
            {/* Live Analytics: Visitor Trends Area Chart */}
            <div className="max-w-[1200px] w-full">
                <VisitorTrendsChart
                    data={trendsChartData}
                    showRetention={true}
                    className="max-w-full"
                />
            </div>

            {/* Traffic by Time of Day & Visitor Breakdown Row */}
            <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                <TrafficByTimeChart
                    slots={timeSlotsData}
                    isError={isErrorTimeOfDay}
                    className="flex-1 max-w-full"
                />
                <CustomerDonutChart
                    title="Visitor Breakdown"
                    tagText="VISITOR SPLIT"
                    showGradientBar={true}
                    segments={customerSegmentsData}
                    totalCustomers={totalCustomersCount}
                    isError={isErrorCustomerBreakdown}
                    totalLabel="Total"
                    className="w-full xl:w-[288px] shrink-0"
                />
            </div>
        </div>
    );
}

export default VisitorTab;
