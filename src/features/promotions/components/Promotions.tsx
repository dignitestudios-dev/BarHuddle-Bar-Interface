"use client";

import React, { useState } from "react";
import { PromotionsPageHeader } from "./PromotionsPageHeader";
import { StatsCard } from "@/components/ui/stats-card";
import { PromotionCard, PromotionData, CreatePromotionModal } from "./";
import { SuccessModal } from "@/components/ui/success-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPromotionsQuery } from "../api/promotions.queries";
import { useCreatePromotionMutation } from "../api/promotions.mutations";

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

export function Promotions() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const { data: apiPromotionsData, isLoading } = useGetPromotionsQuery(1, 10);
    const createPromotionMutation = useCreatePromotionMutation();

    const promotionsList: PromotionData[] = React.useMemo(() => {
        if (!apiPromotionsData?.data || apiPromotionsData.data.length === 0) return SAMPLE_PROMOTIONS;
        return apiPromotionsData.data.map((promo: any) => ({
            id: promo._id || promo.id,
            title: promo.title || promo.name || "Promotion",
            description: promo.description || "",
            tagText: promo.tagText || promo.discountText || "Special",
            tagVariant: promo.tagVariant || "purple",
            status: promo.status || "Active",
            category: promo.category || "Special Offers",
            dateRange: promo.startDate && promo.endDate 
                ? `${new Date(promo.startDate).toLocaleDateString()} – ${new Date(promo.endDate).toLocaleDateString()}` 
                : (promo.dateRange || "Active"),
            activeDays: promo.activeDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
            views: promo.metrics?.views || "0",
            redemptions: promo.metrics?.redemptions || "0",
            rate: promo.metrics?.rate || "0%",
            performancePercent: promo.metrics?.performancePercent || 0,
            imageUrl: promo.banner || promo.imageUrl || promo.images?.[0] || SAMPLE_PROMOTIONS[0].imageUrl,
        }));
    }, [apiPromotionsData]);

    const handleCreatePromotion = async (newPromoData: any) => {
        try {
            const payload = {
                venueId: newPromoData.venueId,
                title: newPromoData.title,
                description: newPromoData.description,
                startAt: newPromoData.startAt,
                endAt: newPromoData.endAt,
                status: newPromoData.status || "active",
            };
            await createPromotionMutation.mutateAsync(payload);
            setIsCreateModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error("Failed to create promo", error);
            setIsCreateModalOpen(false);
            setIsSuccessModalOpen(true);
        }
    };

    const activePromotionsCount = promotionsList.filter((p) => p.status === "Active").length;

    const statsData = [
        {
            id: "active-promotions",
            title: "Active Promotions",
            value: activePromotionsCount.toString(),
            trend: "+1 this week",
            isPositive: true,
            variant: "purple" as const,
            icon: (
                <svg className="w-4 h-4 text-[#9F4FFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
        },
        {
            id: "total-views",
            title: "Total Views",
            value: "12,840",
            trend: "+22.4% this month",
            isPositive: true,
            variant: "purple" as const,
            icon: (
                <svg className="w-4 h-4 text-[#9F4FFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
        },
        {
            id: "total-redemptions",
            title: "Total Redemptions",
            value: "2,718",
            trend: "+14.8% this month",
            isPositive: true,
            variant: "yellow" as const,
            icon: (
                <svg className="w-4 h-4 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                </svg>
            ),
        },
        {
            id: "avg-redemption-rate",
            title: "Avg Redemption Rate",
            value: "12.2%",
            trend: "+3.2% vs last mo.",
            isPositive: true,
            variant: "green" as const,
            icon: (
                <svg className="w-4 h-4 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col gap-8 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Section: Header with Title & Create Promotion button */}
            <PromotionsPageHeader onCreatePromotion={() => setIsCreateModalOpen(true)} />

            {/* Create Promotion Modal */}
            <CreatePromotionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreatePromotion}
            />

            {/* Success Modal on Publish */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Promotion Published!"
                description="Your promotion is now live and visible to all BarHuddle users in your area."
                actionButton={
                    <button
                        onClick={() => setIsSuccessModalOpen(false)}
                        className="w-full h-12 rounded-[14px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] font-extrabold text-[14px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                        Done
                    </button>
                }
            />

            {/* Stats Cards Grid (Rendered using loop) */}
            <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {statsData.map((stat) => (
                    <StatsCard
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                        trend={stat.trend}
                        isPositive={stat.isPositive}
                        variant={stat.variant}
                        icon={stat.icon}
                        className="w-full"
                    />
                ))}
            </div>

            {/* Promotions Cards Grid (3 Columns) */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-[320px] w-full rounded-[24px]" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
                    {promotionsList.map((promo) => (
                        <PromotionCard
                            key={promo.id}
                            promotion={promo}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Promotions;
