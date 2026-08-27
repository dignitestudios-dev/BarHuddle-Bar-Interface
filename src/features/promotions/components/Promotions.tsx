"use client";

import React, { useState } from "react";
import { PromotionsPageHeader } from "./PromotionsPageHeader";
import { StatsCard } from "@/components/ui/stats-card";
import { PromotionCard, PromotionData, CreatePromotionModal } from "./";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { SuccessModal } from "@/components/ui/success-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPromotionsQuery, useGetPromotionAnalyticsQuery } from "../api/promotions.queries";
import { useCreatePromotionMutation, useUpdatePromotionMutation, useDeletePromotionMutation } from "../api/promotions.mutations";
import { useGetOwnerVenuesQuery } from "@/features/venue-management/api/venue.queries";
import { useAppSelector } from "@/store";
import { toast } from "sonner";

const DEFAULT_PROMOTION_IMAGE = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80";

export function Promotions() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<any | null>(null);
    const [deletingPromotion, setDeletingPromotion] = useState<{ id: string; title: string } | null>(null);

    const user = useAppSelector((state) => state.auth.user);
    const { data: apiPromotionsData, isLoading } = useGetPromotionsQuery(1, 20);
    const { data: apiAnalyticsData, isLoading: isAnalyticsLoading } = useGetPromotionAnalyticsQuery();
    const { data: ownerVenuesData } = useGetOwnerVenuesQuery();

    const primaryVenueId = React.useMemo(() => {
        const rawVenues = Array.isArray((ownerVenuesData as any)?.data)
            ? (ownerVenuesData as any).data
            : Array.isArray((ownerVenuesData as any)?.venues)
                ? (ownerVenuesData as any).venues
                : Array.isArray(ownerVenuesData)
                    ? ownerVenuesData
                    : [];
        const first = rawVenues[0];
        return first?.venue?._id || first?.venue?.id || first?._id || first?.id || (user as any)?.venueId || (user as any)?.claimedVenueId || "";
    }, [ownerVenuesData, user]);

    const createPromotionMutation = useCreatePromotionMutation();
    const updatePromotionMutation = useUpdatePromotionMutation();
    const deletePromotionMutation = useDeletePromotionMutation();

    const { promotionsList, rawPromosMap } = React.useMemo(() => {
        const rawPromotions = Array.isArray(apiPromotionsData?.data)
            ? apiPromotionsData.data
            : Array.isArray(apiPromotionsData?.data?.promotions)
                ? apiPromotionsData.data.promotions
                : Array.isArray(apiPromotionsData?.promotions)
                    ? apiPromotionsData.promotions
                    : Array.isArray(apiPromotionsData)
                        ? apiPromotionsData
                        : [];

        if (!rawPromotions || rawPromotions.length === 0) return { promotionsList: [], rawPromosMap: new Map() };

        const map = new Map<string, any>();
        const list: PromotionData[] = rawPromotions.map((promo: any) => {
            const id = String(promo._id || promo.id);
            map.set(id, promo);

            // Date formatting
            let dateRangeStr = "Active";
            if (promo.startAt && promo.endAt) {
                dateRangeStr = `${new Date(promo.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(promo.endAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            } else if (promo.startDate && promo.endDate) {
                dateRangeStr = `${new Date(promo.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(promo.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            } else if (promo.dateRange) {
                dateRangeStr = promo.dateRange;
            }

            // Tag & Category
            const tag = promo.tagText || promo.discountText || promo.offerLabel || promo.promoType || "Special";
            const categoryName = promo.category || promo.promoType || promo.venue?.name || "Special Offers";

            // Metrics
            const viewsCount = String(promo.views ?? promo.viewCount ?? promo.metrics?.views ?? "0");
            const redeemedCount = String(promo.redeemedCount ?? promo.redemptions ?? promo.metrics?.redemptions ?? "0");
            const redemptionRateStr = String(
                promo.redemptionRate !== undefined
                    ? `${promo.redemptionRate}%`
                    : promo.rate !== undefined
                    ? `${promo.rate}%`
                    : promo.metrics?.rate || "0%"
            );
            const performancePercentNum = Number(
                promo.performanceRate ?? promo.performancePercent ?? promo.metrics?.performancePercent ?? (promo.redemptionRate ?? 0)
            );

            // Image
            const img = promo.banner || promo.imageUrl || promo.coverImage || promo.venue?.coverImage || promo.images?.[0] || DEFAULT_PROMOTION_IMAGE;

            return {
                id,
                title: promo.title || promo.name || "Promotion",
                description: promo.description || "",
                tagText: tag,
                tagVariant: promo.tagVariant || "purple",
                status: promo.status || "active",
                category: categoryName,
                dateRange: dateRangeStr,
                activeDays: promo.activeDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                views: viewsCount,
                redemptions: redeemedCount,
                rate: redemptionRateStr,
                performancePercent: performancePercentNum,
                imageUrl: img,
            };
        });

        return { promotionsList: list, rawPromosMap: map };
    }, [apiPromotionsData]);

    const handleCreatePromotion = async (newPromoData: any) => {
        try {
            const venueId = newPromoData.venueId || primaryVenueId;
            const hasFiles = newPromoData.images && Array.isArray(newPromoData.images) && newPromoData.images.some((img: any) => img instanceof File);

            if (hasFiles) {
                const formData = new FormData();
                if (venueId) {
                    formData.append("venueId", venueId);
                }
                formData.append("title", newPromoData.title);
                formData.append("description", newPromoData.description);
                formData.append("startAt", newPromoData.startAt);
                formData.append("endAt", newPromoData.endAt);
                formData.append("status", newPromoData.status || "active");
                newPromoData.images.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append("banner", file);
                    }
                });
                await createPromotionMutation.mutateAsync(formData);
            } else {
                const payload: any = {
                    title: newPromoData.title,
                    description: newPromoData.description,
                    startAt: newPromoData.startAt,
                    endAt: newPromoData.endAt,
                    status: newPromoData.status || "active",
                };
                if (venueId) {
                    payload.venueId = venueId;
                }
                await createPromotionMutation.mutateAsync(payload);
            }

            setIsCreateModalOpen(false);
            setIsSuccessModalOpen(true);
            toast.success("Promotion created successfully!");
        } catch (error: any) {
            console.error("Failed to create promo", error);
            toast.error(error?.response?.data?.message || "Failed to create promotion");
        }
    };

    const handleUpdatePromotion = async (id: string, updatedPromoData: any) => {
        try {
            const hasFiles = updatedPromoData.images && Array.isArray(updatedPromoData.images) && updatedPromoData.images.some((img: any) => img instanceof File);

            if (hasFiles) {
                const formData = new FormData();
                // Explicitly DO NOT append venueId on edit
                formData.append("title", updatedPromoData.title);
                formData.append("description", updatedPromoData.description);
                formData.append("startAt", updatedPromoData.startAt);
                formData.append("endAt", updatedPromoData.endAt);
                formData.append("status", updatedPromoData.status || "active");
                updatedPromoData.images.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append("banner", file);
                    }
                });
                await updatePromotionMutation.mutateAsync({ id, data: formData });
            } else {
                const payload = {
                    // Explicitly DO NOT include venueId on edit
                    title: updatedPromoData.title,
                    description: updatedPromoData.description,
                    startAt: updatedPromoData.startAt,
                    endAt: updatedPromoData.endAt,
                    status: updatedPromoData.status || "active",
                };
                await updatePromotionMutation.mutateAsync({ id, data: payload });
            }

            setEditingPromotion(null);
            toast.success("Promotion updated successfully!");
        } catch (error: any) {
            console.error("Failed to update promo", error);
            toast.error(error?.response?.data?.message || "Failed to update promotion");
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingPromotion) return;
        try {
            await deletePromotionMutation.mutateAsync({ id: deletingPromotion.id });
            toast.success("Promotion deleted successfully!");
            setDeletingPromotion(null);
        } catch (error: any) {
            console.error("Failed to delete promo", error);
            toast.error(error?.response?.data?.message || "Failed to delete promotion");
        }
    };

    const handleEditClick = (promo: PromotionData) => {
        const raw = rawPromosMap.get(String(promo.id)) || promo;
        setEditingPromotion(raw);
    };

    const handleDeleteClick = (promo: PromotionData) => {
        setDeletingPromotion({ id: String(promo.id), title: promo.title });
    };

    const analytics = (apiAnalyticsData as any)?.data;

    const activePromotionsCount = promotionsList.filter((p) => p.status?.toLowerCase() === "active").length;
    const totalViewsCount = promotionsList.reduce((acc, p) => acc + (parseInt(p.views) || 0), 0);
    const totalRedemptionsCount = promotionsList.reduce((acc, p) => acc + (parseInt(p.redemptions) || 0), 0);
    const avgRate = promotionsList.length > 0 
        ? `${(promotionsList.reduce((acc, p) => acc + (parseFloat(p.rate) || 0), 0) / promotionsList.length).toFixed(1)}%`
        : "0%";

    const activePromoCard = analytics?.cards?.find((c: any) => c.id === "active_promotions");
    const totalViewsCard = analytics?.cards?.find((c: any) => c.id === "total_views");
    const totalRedemptionsCard = analytics?.cards?.find((c: any) => c.id === "total_redemptions");
    const avgRedemptionRateCard = analytics?.cards?.find((c: any) => c.id === "avg_redemption_rate");

    const statsData = [
        {
            id: "active-promotions",
            title: activePromoCard?.label || "Active Promotions",
            value: activePromoCard?.formattedValue || (analytics?.activePromotions !== undefined ? String(analytics.activePromotions) : activePromotionsCount.toString()),
            trend: activePromoCard?.subText || analytics?.activePromotionsSubText || "+0 this week",
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
            title: totalViewsCard?.label || "Total Views",
            value: totalViewsCard?.formattedValue || (analytics?.totalViews !== undefined ? Number(analytics.totalViews).toLocaleString() : totalViewsCount.toLocaleString()),
            trend: totalViewsCard?.subText || analytics?.totalViewsSubText || "+0% this month",
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
            title: totalRedemptionsCard?.label || "Total Redemptions",
            value: totalRedemptionsCard?.formattedValue || (analytics?.totalRedemptions !== undefined ? Number(analytics.totalRedemptions).toLocaleString() : totalRedemptionsCount.toLocaleString()),
            trend: totalRedemptionsCard?.subText || analytics?.totalRedemptionsSubText || "+0% this month",
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
            title: avgRedemptionRateCard?.label || "Avg Redemption Rate",
            value: avgRedemptionRateCard?.formattedValue || analytics?.avgRedemptionRateFormatted || (analytics?.avgRedemptionRate !== undefined ? `${analytics.avgRedemptionRate}%` : avgRate),
            trend: avgRedemptionRateCard?.subText || analytics?.avgRedemptionRateSubText || "+0% vs last mo.",
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
                venueId={primaryVenueId}
                isLoading={createPromotionMutation.isPending}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreatePromotion}
            />

            {/* Edit Promotion Modal */}
            <CreatePromotionModal
                isOpen={Boolean(editingPromotion)}
                promotionToEdit={editingPromotion}
                isLoading={updatePromotionMutation.isPending}
                onClose={() => setEditingPromotion(null)}
                onUpdate={handleUpdatePromotion}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={Boolean(deletingPromotion)}
                onClose={() => setDeletingPromotion(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Promotion?"
                description="Are you sure you want to delete this promotion? This action cannot be undone."
                itemName={deletingPromotion?.title}
                isPending={deletePromotionMutation.isPending}
                confirmText="Delete Promotion"
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
                        className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] font-extrabold text-[14px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                        Done
                    </button>
                }
            />

            {/* Stats Cards Grid (Rendered using loop) */}
            <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {isAnalyticsLoading && isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-[120px] w-full rounded-[24px] bg-purple-900/20" />
                    ))
                ) : (
                    statsData.map((stat) => (
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
                    ))
                )}
            </div>

            {/* Promotions Cards Grid (3 Columns) */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-[320px] w-full rounded-[24px]" />
                    ))}
                </div>
            ) : promotionsList.length === 0 ? (
                <div className="w-full py-16 px-4 flex flex-col items-center justify-center gap-3 border border-[rgba(124,58,237,0.2)] rounded-[24px] bg-[#0E093C]/50 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg text-white">
                        No Promotions Found
                    </h3>
                    <p className="text-sm text-purple-200/60 max-w-sm">
                        Create your first promotion to start attracting more customers to your venue.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
                    {promotionsList.map((promo) => (
                        <PromotionCard
                            key={promo.id}
                            promotion={promo}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Promotions;
