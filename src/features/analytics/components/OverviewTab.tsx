"use client";

import React from "react";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";
import { TrafficByTimeChart } from "@/components/charts/TrafficByTimeChart";
import { CustomerDonutChart } from "@/components/charts/CustomerDonutChart";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetVisitorAnalyticsQuery,
    useGetRetentionAnalyticsQuery,
    useGetSentimentAnalyticsQuery,
    useGetEventsAnalyticsQuery,
} from "../api/analytics.queries";

export interface AnalyticsCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

const DEFAULT_ANALYTICS_CARDS: AnalyticsCardItem[] = [
    {
        id: "total-check-ins",
        title: "Total Check-Ins",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "purple",
    },
    {
        id: "total-visitors",
        title: "Total Visitors",
        value: "9,300",
        trend: "+12.1%",
        isPositive: true,
        variant: "purple",
    },
    {
        id: "avg-stay-duration-1",
        title: "Avg Stay Duration",
        value: "145m",
        trend: "+5.4%",
        isPositive: true,
        variant: "yellow",
    },
    {
        id: "new-customers",
        title: "New Customers",
        value: "3,441",
        trend: "+18.4%",
        isPositive: true,
        variant: "green",
    },
    {
        id: "repeat-customers",
        title: "Repeat Customers",
        value: "4,557",
        trend: "+49%",
        isPositive: true,
        variant: "purple",
    },
    {
        id: "lost-customers",
        title: "Lost Customers",
        value: "1,302",
        trend: "-2.1%",
        isPositive: false,
        variant: "coral",
    },
    {
        id: "event-attendance",
        title: "Event Attendance",
        value: "12,840",
        trend: "+15.2%",
        isPositive: true,
        variant: "pink",
    },
    {
        id: "avg-rating",
        title: "Avg Rating",
        value: "4.5★",
        trend: "+0.3",
        isPositive: true,
        variant: "orange",
    },
];

export function OverviewTab() {
    const { data: visitorData, isLoading: isLoadingVisitor } = useGetVisitorAnalyticsQuery();
    const { data: retentionData, isLoading: isLoadingRetention } = useGetRetentionAnalyticsQuery();
    const { data: sentimentData, isLoading: isLoadingSentiment } = useGetSentimentAnalyticsQuery();
    const { data: eventsData, isLoading: isLoadingEvents } = useGetEventsAnalyticsQuery();

    const isLoading = isLoadingVisitor || isLoadingRetention || isLoadingSentiment || isLoadingEvents;

    const cards: AnalyticsCardItem[] = React.useMemo(() => {
        const v = visitorData?.data;
        const r = retentionData?.data;
        const s = sentimentData?.data;
        const e = eventsData?.data;

        return [
            {
                id: "total-check-ins",
                title: "Total Check-Ins",
                value: v?.totalVisits !== undefined ? v.totalVisits.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "total-visitors",
                title: "Total Visitors",
                value: v?.uniqueVisitors !== undefined ? v.uniqueVisitors.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "avg-stay-duration-1",
                title: "Avg Stay Duration",
                value: s?.avgDwellMinutes !== undefined ? `${s.avgDwellMinutes}m` : "0m",
                trend: "+0%",
                isPositive: true,
                variant: "yellow",
            },
            {
                id: "new-customers",
                title: "New Customers",
                value: r?.oneTimeUsers !== undefined ? r.oneTimeUsers.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "green",
            },
            {
                id: "repeat-customers",
                title: "Repeat Customers",
                value: r?.returningUsers !== undefined ? r.returningUsers.toLocaleString() : "0",
                trend: r?.retentionRate !== undefined ? `+${r.retentionRate}%` : "0%",
                isPositive: true,
                variant: "purple",
            },
            {
                id: "lost-customers",
                title: "Lost Customers",
                value: r?.lostCustomers !== undefined ? r.lostCustomers.toLocaleString() : "0",
                trend: "0%",
                isPositive: false,
                variant: "coral",
            },
            {
                id: "event-attendance",
                title: "Event Attendance",
                value: e?.eventAttendance !== undefined ? e.eventAttendance.toLocaleString() : "0",
                trend: "+0%",
                isPositive: true,
                variant: "pink",
            },
            {
                id: "avg-rating",
                title: "Avg Rating",
                value: s?.avgRating !== undefined ? `${s.avgRating}★` : "0★",
                trend: "+0.0",
                isPositive: true,
                variant: "orange",
            },
        ];
    }, [visitorData, retentionData, sentimentData, eventsData]);

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
                <VisitorTrendsChart className="max-w-full" />
            </div>

            {/* Traffic by Time & Visitor Breakdown Section */}
            <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                <TrafficByTimeChart className="flex-1 max-w-full" />
                <CustomerDonutChart title="Visitor Breakdown" className="w-full xl:w-[288px] shrink-0" />
            </div>
        </div>
    );
}

export default OverviewTab;
