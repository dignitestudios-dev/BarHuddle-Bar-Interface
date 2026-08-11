"use client";

import React from "react";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";
import { VisitorSentimentsChart } from "@/components/charts/VisitorSentimentsChart";
import { AvgVisitDurationCard } from "@/components/charts/AvgVisitDurationCard";

export interface RetentionCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

const RETENTION_CARDS: RetentionCardItem[] = [
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
];

export function RetentionTab() {
    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Row: 3 Retention Stat Cards Grid */}
            <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {RETENTION_CARDS.map((card) => (
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

            {/* Mid Section: Visitor Trends Chart (Retention Mode with New, Repeat, Lost) */}
            <div className="max-w-[1200px] w-full">
                <VisitorTrendsChart
                    variant="retention"
                    className="max-w-full"
                />
            </div>

            {/* Lower Section: 2 Columns (Avg Visit Duration & Visitor Sentiment Score) */}
            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <AvgVisitDurationCard className="w-full h-full" />
                <VisitorSentimentsChart
                    title="Visitor Sentiment Score"
                    tagText="DEMOGRAPHICS"
                    overallScore={87}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

export default RetentionTab;
