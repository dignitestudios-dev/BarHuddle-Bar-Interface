"use client";

import React, { useMemo } from "react";
import { VisitorSentimentsChart, SentimentItem } from "@/components/charts/VisitorSentimentsChart";
import { OverallScoreCard, ScoreProgressItem } from "@/components/charts/OverallScoreCard";
import { TopInsightsCard, InsightItem } from "@/components/charts/TopInsightsCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetPerformanceSummaryQuery,
    useGetSentimentAnalyticsQuery,
} from "../api/analytics.queries";
import { AnalyticsFilterParams } from "../api/analytics.service";

export interface SentimentTabProps {
    filterParams?: AnalyticsFilterParams;
}

export function SentimentTab({ filterParams }: SentimentTabProps) {
    const { data: performanceResponse, isLoading: isLoadingPerformance } =
        useGetPerformanceSummaryQuery(filterParams);
    const { data: sentimentResponse, isLoading: isLoadingSentiment } =
        useGetSentimentAnalyticsQuery(filterParams);

    const isLoading = isLoadingPerformance || isLoadingSentiment;

    const perfData = performanceResponse?.data;
    const sentimentData = sentimentResponse?.data;

    // Score from GET /venue-owner/analytics/sentiment
    const overallScore = useMemo(() => {
        const score = sentimentData?.sentimentScore?.score;
        if (score !== undefined && score !== null) {
            return Number(score);
        }
        return 0;
    }, [sentimentData]);

    const sentimentItems: SentimentItem[] = useMemo(() => {
        const s = sentimentData?.sentimentScore;
        const worthItPct = Math.round(s?.worthIt ?? 0);
        const midPct = Math.round(s?.mid ?? 0);
        const notWorthItPct = Math.round(s?.notWorthIt ?? 0);

        return [
            {
                name: "Worth It",
                percentage: worthItPct,
                color: "#E8FF57",
                bgColor: "rgba(232, 255, 87, 0.04)",
                borderColor: "rgba(232, 255, 87, 0.18)",
                offsetClass: "w-full",
            },
            {
                name: "Mid",
                percentage: midPct,
                color: "#22D3EE",
                bgColor: "rgba(34, 211, 238, 0.04)",
                borderColor: "rgba(34, 211, 238, 0.18)",
                offsetClass: "w-full",
            },
            {
                name: "Not Worth It",
                percentage: notWorthItPct,
                color: "#F472B6",
                bgColor: "rgba(244, 114, 182, 0.04)",
                borderColor: "rgba(244, 114, 182, 0.18)",
                offsetClass: "w-full",
            },
        ];
    }, [sentimentData]);

    const scoreProgressItems: ScoreProgressItem[] = useMemo(() => {
        const s = sentimentData?.sentimentScore;
        return [
            {
                label: "Worth It",
                percentage: Math.round(s?.worthIt ?? 0),
                color: "#E8FF57",
            },
            {
                label: "Mid",
                percentage: Math.round(s?.mid ?? 0),
                color: "#22D3EE",
            },
            {
                label: "Not Worth It",
                percentage: Math.round(s?.notWorthIt ?? 0),
                color: "#F472B6",
            },
        ];
    }, [sentimentData]);

    // Top Insights items mapping from GET /analytics/performance-summary
    const insightsList: InsightItem[] = useMemo(() => {
        const bestEvt = perfData?.bestPerformingEvent;
        const peakHrs = perfData?.peakHours;
        const peakDy = perfData?.peakDay;
        const topSeg = perfData?.topSegment;
        const bestDy = perfData?.bestDay;
        const satisf = perfData?.satisfaction;

        return [
            {
                id: "best-event",
                label: "Best Event",
                value: bestEvt?.title || "N/A",
                subtext: bestEvt?.engagementPercentage
                    ? `${bestEvt.engagementPercentage}% engagement`
                    : bestEvt?.attendance
                        ? `${bestEvt.attendance} attendees`
                        : "0% engagement",
                subtextColor: "#E8FF57",
                iconBg: "rgba(232, 255, 87, 0.07)",
                iconBorder: "rgba(232, 255, 87, 0.133)",
                iconSvg: (
                    <svg className="w-3 h-3 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                ),
            },
            {
                id: "peak-hours",
                label: "Peak Hours",
                value: peakHrs || "N/A",
                subtext: peakDy ? `Peak on ${peakDy}` : "Peak traffic",
                subtextColor: "#F472B6",
                iconBg: "rgba(244, 114, 182, 0.07)",
                iconBorder: "rgba(244, 114, 182, 0.133)",
                iconSvg: (
                    <svg className="w-3 h-3 text-[#F472B6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                ),
            },
            {
                id: "top-segment",
                label: "Top Segment",
                value: topSeg?.ageRange ? `Ages ${topSeg.ageRange}` : topSeg?.count ? `${topSeg.count} users` : "N/A",
                subtext: topSeg?.percentage ? `${topSeg.percentage}% of traffic` : "0% of traffic",
                subtextColor: "#7C3AED",
                iconBg: "rgba(124, 58, 237, 0.07)",
                iconBorder: "rgba(124, 58, 237, 0.133)",
                iconSvg: (
                    <svg className="w-3 h-3 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                ),
            },
            {
                id: "best-day",
                label: "Best Day",
                value: bestDy?.day || "N/A",
                subtext: bestDy?.avgVisitors ? `${bestDy.avgVisitors} avg visitors` : "0 avg visitors",
                subtextColor: "#22D3EE",
                iconBg: "rgba(34, 211, 238, 0.07)",
                iconBorder: "rgba(34, 211, 238, 0.133)",
                iconSvg: (
                    <svg className="w-3 h-3 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                ),
            },
            {
                id: "satisfaction",
                label: "Satisfaction",
                value: satisf?.score ? (satisf.score.includes("/") ? satisf.score.replace("/", " / ") : satisf.score) : `${overallScore} / 100`,
                subtext: `${satisf?.totalReviews ?? 0} reviews`,
                subtextColor: "#4ADE80",
                iconBg: "rgba(74, 222, 128, 0.07)",
                iconBorder: "rgba(74, 222, 128, 0.133)",
                iconSvg: (
                    <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
            },
        ];
    }, [perfData, overallScore]);

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
                    overallScore={overallScore}
                    sentiments={sentimentItems}
                    className="w-full h-full"
                />

                {/* Column 2: Overall Score */}
                <OverallScoreCard
                    score={overallScore}
                    items={scoreProgressItems}
                    tagText="SATISFACTION"
                    title="Overall Score"
                    bannerText={
                        overallScore > 0
                            ? "Live sentiment score recorded"
                            : "No sentiment responses recorded for this period"
                    }
                    className="w-full h-full"
                />

                {/* Column 3: Top Insights */}
                <TopInsightsCard
                    items={insightsList}
                    tagText="AI INSIGHTS"
                    title="Top Insights"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

export default SentimentTab;
