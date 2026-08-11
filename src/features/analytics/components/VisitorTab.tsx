"use client";

import React from "react";
import { VisitorTrendsChart } from "@/components/charts/VisitorTrendsChart";
import { TrafficByTimeChart } from "@/components/charts/TrafficByTimeChart";
import { CustomerDonutChart } from "@/components/charts/CustomerDonutChart";

const VISITOR_BREAKDOWN_SEGMENTS = [
    {
        name: "New",
        value: 4864,
        percentage: 38,
        color: "#4ADE80",
        glowColor: "rgba(74, 222, 128, 0.6)",
    },
    {
        name: "Returning",
        value: 7936,
        percentage: 62,
        color: "#7C3AED",
        glowColor: "rgba(124, 58, 237, 0.6)",
    },
];

export function VisitorTab() {
    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Live Analytics: Visitor Trends 12-Month Area Chart */}
            <div className="max-w-[1200px] w-full">
                <VisitorTrendsChart
                    showRetention={true}
                    className="max-w-full"
                />
            </div>

            {/* Traffic by Time of Day & Visitor Breakdown Row */}
            <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                <TrafficByTimeChart className="flex-1 max-w-full" />
                <CustomerDonutChart
                    title="Visitor Breakdown"
                    tagText="VISITOR SPLIT"
                    showGradientBar={true}
                    totalCustomers="12.8K"
                    totalLabel="Total"
                    segments={VISITOR_BREAKDOWN_SEGMENTS}
                    className="w-full xl:w-[288px] shrink-0"
                />
            </div>
        </div>
    );
}

export default VisitorTab;
