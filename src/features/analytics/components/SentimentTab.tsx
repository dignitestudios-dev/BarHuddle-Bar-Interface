"use client";

import React from "react";
import { VisitorSentimentsChart } from "@/components/charts/VisitorSentimentsChart";
import { OverallScoreCard } from "@/components/charts/OverallScoreCard";
import { TopInsightsCard } from "@/components/charts/TopInsightsCard";

export function SentimentTab() {
    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* 3 Columns Row: Feedback Distribution + Overall Score + Top Insights */}
            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Column 1: Feedback Distribution */}
                <VisitorSentimentsChart
                    title="Feedback Distribution"
                    tagText="CUSTOMER SENTIMENT"
                    overallScore={87}
                    className="w-full h-full"
                />

                {/* Column 2: Overall Score */}
                <OverallScoreCard
                    score={87}
                    tagText="SATISFACTION"
                    title="Overall Score"
                    bannerText="Customers are happy · +3.2% vs last month"
                    className="w-full h-full"
                />

                {/* Column 3: Top Insights */}
                <TopInsightsCard
                    tagText="AI INSIGHTS"
                    title="Top Insights"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

export default SentimentTab;
