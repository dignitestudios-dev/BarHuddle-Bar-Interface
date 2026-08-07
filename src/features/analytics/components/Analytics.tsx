"use client";

import React, { useState } from "react";
import { AnalyticsPageHeader, DateFilterOption } from "./AnalyticsPageHeader";
import { AnalyticsTabs, AnalyticsTab } from "./AnalyticsTabs";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";

export interface AnalyticsCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

const ANALYTICS_CARDS: AnalyticsCardItem[] = [
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
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "purple",
    },
    {
        id: "avg-stay-duration-1",
        title: "Avg Stay Duration",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "yellow",
    },
    {
        id: "new-customers",
        title: "New Customers",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "green",
    },
    {
        id: "repeat-customers",
        title: "Repeat Customers",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "purple",
    },
    {
        id: "lost-customers",
        title: "Lost Customers",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "coral",
    },
    {
        id: "event-attendance",
        title: "Event Attendance",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "pink",
    },
    {
        id: "avg-stay-duration-2",
        title: "Avg Stay Duration",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "orange",
    },
];

export function Analytics() {
    const [dateFilter, setDateFilter] = useState<DateFilterOption>("Weekly");
    const [activeTab, setActiveTab] = useState<AnalyticsTab>("Overview");

    return (
        <div className="w-full flex flex-col gap-6 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Heading & Date Filter Group */}
            <AnalyticsPageHeader
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
            />

            {/* Selection Tabs Row */}
            <AnalyticsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* 8 Analytics Stat Cards Grid (4 Columns x 2 Rows) */}
            <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {ANALYTICS_CARDS.map((card) => (
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
        </div>
    );
}

export default Analytics;
