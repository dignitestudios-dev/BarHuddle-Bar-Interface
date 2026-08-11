"use client";

import React from "react";
import { StatsCard, StatsColorVariant } from "@/components/ui/stats-card";
import { TrafficByTimeChart } from "@/components/charts/TrafficByTimeChart";
import { BoostHistoryTableCard } from "./BoostHistoryTableCard";

export interface BoostCardItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
}

const BOOST_CARDS: BoostCardItem[] = [
    {
        id: "total-reach",
        title: "Total Reach",
        value: "30.23k",
        trend: "+18.4%",
        isPositive: true,
        variant: "cyan",
    },
    {
        id: "total-views",
        title: "Total Views",
        value: "30.23k",
        trend: "+18.4%",
        isPositive: true,
        variant: "purple",
    },
    {
        id: "avg-engagement",
        title: "Avg Engagement",
        value: "56.98%",
        trend: "+18.4%",
        isPositive: true,
        variant: "yellow",
    },
];

export function BoostTab() {
    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Row: 3 Boost Stat Cards */}
            <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {BOOST_CARDS.map((card) => (
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
