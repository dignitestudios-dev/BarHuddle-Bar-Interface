"use client";
import React, { useState } from "react";
import { PromotionsPageHeader } from "@/components/promotions/PromotionsPageHeader";
import { StatsCard } from "@/components/ui/stats-card";
import { PromotionCard, PromotionData } from "@/components/promotions/PromotionCard";
const SAMPLE_PROMOTIONS: PromotionData[] = [
    {
        id: 1,
        title: "Summer Rooftop Special",
        description: "Exclusive summer cocktail bundles on the rooftop — limited seats.",
        tagText: "Special",
        tagVariant: "green",
        status: "Expired",
        category: "Special Offers",
        dateRange: "May 1 – May 31",
        activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        views: "4.3K",
        redemptions: "788",
        rate: "18.2%",
        performancePercent: 38,
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        title: "Weekend Brunch Discount",
        description: "Enjoy 25% off our exclusive brunch menu every weekend morning.",
        tagText: "25% OFF",
        tagVariant: "yellow",
        status: "Active",
        category: "Discounts",
        dateRange: "May 1 – May 31",
        activeDays: ["Sat", "Sun"],
        views: "1.8K",
        redemptions: "241",
        rate: "13.5%",
        performancePercent: 45,
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        title: "Buy One Get One Shots",
        description: "Order any shot and get one free — all night long on selected spirits.",
        tagText: "BOGO",
        tagVariant: "purple",
        status: "Active",
        category: "Buy One Get One",
        dateRange: "May 1 – May 31",
        activeDays: ["Thu", "Fri", "Sat"],
        views: "5.1K",
        redemptions: "894",
        rate: "17.5%",
        performancePercent: 65,
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        title: "Weekend Brunch Discount",
        description: "Enjoy 25% off our exclusive brunch menu every weekend morning.",
        tagText: "25% OFF",
        tagVariant: "yellow",
        status: "Active",
        category: "Discounts",
        dateRange: "May 1 – May 31",
        activeDays: ["Sat", "Sun"],
        views: "1.8K",
        redemptions: "241",
        rate: "13.5%",
        performancePercent: 45,
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 5,
        title: "Buy One Get One Shots",
        description: "Order any shot and get one free — all night long on selected spirits.",
        tagText: "BOGO",
        tagVariant: "purple",
        status: "Active",
        category: "Buy One Get One",
        dateRange: "May 1 – May 31",
        activeDays: ["Thu", "Fri", "Sat"],
        views: "5.1K",
        redemptions: "894",
        rate: "17.5%",
        performancePercent: 65,
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 6,
        title: "Summer Rooftop Special",
        description: "Exclusive summer cocktail bundles on the rooftop — limited seats.",
        tagText: "Special",
        tagVariant: "green",
        status: "Expired",
        category: "Special Offers",
        dateRange: "May 1 – May 31",
        activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        views: "4.3K",
        redemptions: "788",
        rate: "18.2%",
        performancePercent: 38,
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    },
];
export default function PromotionsPage() {
    const [promotionsList, setPromotionsList] = useState<PromotionData[]>(SAMPLE_PROMOTIONS);
    return (
        <div className="w-full max-w-[1136px] flex flex-col gap-8 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Section: Promotions Header with Title & Create Promotion button */}
            {/* Top Section: Header with Title & Create Promotion button */}
            <PromotionsPageHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* Stat 1: Active Promotions */}
                <StatsCard
                    title="Active Promotions"
                    value="3"
                    trend="+1 this week"
                    isPositive={true}
                    variant="purple"
                    className="w-full"
                    icon={
                        <svg className="w-4 h-4 text-[#9F4FFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                    }
                />
                {/* Stat 2: Total Views */}
                <StatsCard
                    title="Total Views"
                    value="12,840"
                    trend="+22.4% this month"
                    isPositive={true}
                    variant="purple"
                    className="w-full"
                    icon={
                        <svg className="w-4 h-4 text-[#9F4FFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    }
                />
                {/* Stat 3: Total Redemptions */}
                <StatsCard
                    title="Total Redemptions"
                    value="2,718"
                    trend="+14.8% this month"
                    isPositive={true}
                    variant="yellow"
                    className="w-full"
                    icon={
                        <svg className="w-4 h-4 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                        </svg>
                    }
                />
                {/* Stat 4: Avg Redemption Rate */}
                <StatsCard
                    title="Avg Redemption Rate"
                    value="12.2%"
                    trend="+3.2% vs last mo."
                    isPositive={true}
                    variant="green"
                    className="w-full"
                    icon={
                        <svg className="w-4 h-4 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                />
            </div>
            {/* Promotions Cards Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
                {promotionsList.map((promo) => (
                    <PromotionCard
                        key={promo.id}
                        promotion={promo}
                    />
                ))}
            </div>
        </div>

    );
}
