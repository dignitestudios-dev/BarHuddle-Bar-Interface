"use client";

import React from "react";
import { VisitorSentimentsChart } from "@/components/charts/VisitorSentimentsChart";
import { OverallScoreCard } from "@/components/charts/OverallScoreCard";
import { TopInsightsCard } from "@/components/charts/TopInsightsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSentimentAnalyticsQuery } from "../api/analytics.queries";

export function SentimentTab() {
    const { data: sentimentResponse, isLoading } = useGetSentimentAnalyticsQuery();
    const sentiment = sentimentResponse?.data;
    const score = sentiment?.sentimentScore?.score ?? 0;

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
                <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    <Skeleton className="h-[420px] w-full rounded-[24px]" />
                    <Skeleton className="h-[420px] w-full rounded-[24px]" />
                    <Skeleton className="h-[420px] w-full rounded-[24px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* 3 Columns Row: Feedback Distribution + Overall Score + Top Insights */}
            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Column 1: Feedback Distribution */}
                <VisitorSentimentsChart
                    title="Feedback Distribution"
                    tagText="CUSTOMER SENTIMENT"
                    overallScore={score}
                    className="w-full h-full"
                />

                {/* Column 2: Overall Score */}
                <OverallScoreCard
                    score={score}
                    tagText="SATISFACTION"
                    title="Overall Score"
                    bannerText={score > 0 ? "Live sentiment score recorded" : "No sentiment data recorded"}
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
