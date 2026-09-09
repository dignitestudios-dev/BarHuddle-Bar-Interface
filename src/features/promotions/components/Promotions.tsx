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
import { useSelectedVenue } from "@/hooks/useSelectedVenue";
import { cleanImageUrl } from "@/utils/image";
import { toast } from "sonner";

const DEFAULT_PROMOTION_IMAGE = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80";

export function Promotions() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<any | null>(null);
    const [deletingPromotion, setDeletingPromotion] = useState<{ id: string; title: string } | null>(null);
    const user = useAppSelector((state) => state.auth.user);
    const { selectedVenueId } = useSelectedVenue();
    const { data: ownerVenuesData } = useGetOwnerVenuesQuery();

    const primaryVenueId = React.useMemo(() => {
        if (selectedVenueId) return selectedVenueId;
        const rawVenues = Array.isArray((ownerVenuesData as any)?.data)
            ? (ownerVenuesData as any).data
            : Array.isArray((ownerVenuesData as any)?.venues)
                ? (ownerVenuesData as any).venues
                : Array.isArray(ownerVenuesData)
                    ? ownerVenuesData
                    : [];
        const first = rawVenues[0];
        return first?.venue?._id || first?.venue?.id || first?._id || first?.id || (user as any)?.venueId || (user as any)?.claimedVenueId || (user as any)?.venue?._id || (user as any)?.venue?.id || "";
    }, [selectedVenueId, ownerVenuesData, user]);

    const effectiveVenueId = selectedVenueId || primaryVenueId;

    const { data: apiPromotionsData, isLoading } = useGetPromotionsQuery({
        page: 1,
        limit: 10,
        ...(effectiveVenueId ? { venueId: effectiveVenueId } : {}),
    });
    const { data: apiAnalyticsData, isLoading: isAnalyticsLoading } = useGetPromotionAnalyticsQuery(effectiveVenueId);

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

            // Date formatting & extraction
            const startRaw = promo.startAt || promo.startDate || promo.validFrom;
            const endRaw = promo.endAt || promo.endDate || promo.validTo;

            let dateRangeStr = "Active";
            if (startRaw && endRaw) {
                const s = new Date(startRaw);
                const e = new Date(endRaw);
                if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
                    if (s.toDateString() === e.toDateString()) {
                        dateRangeStr = s.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        });
                    } else {
                        const sYear = s.getFullYear();
                        const eYear = e.getFullYear();
                        if (sYear === eYear) {
                            dateRangeStr = `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
                        } else {
                            dateRangeStr = `${s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
                        }
                    }
                }
            } else if (startRaw) {
                const s = new Date(startRaw);
                if (!isNaN(s.getTime())) {
                    dateRangeStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                }
            } else if (promo.dateRange) {
                dateRangeStr = promo.dateRange;
            }

            // Calculate active days from actual date range or explicit days
            const standardOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            let computedActiveDays: string[] = standardOrder;

            const explicitDays = promo.activeDays || promo.days || promo.daysOfWeek || promo.validDays;
            if (Array.isArray(explicitDays) && explicitDays.length > 0) {
                const dayMap: Record<string, string> = {
                    sun: "Sun", sunday: "Sun", "0": "Sun",
                    mon: "Mon", monday: "Mon", "1": "Mon",
                    tue: "Tue", tuesday: "Tue", "2": "Tue",
                    wed: "Wed", wednesday: "Wed", "3": "Wed",
                    thu: "Thu", thursday: "Thu", "4": "Thu",
                    fri: "Fri", friday: "Fri", "5": "Fri",
                    sat: "Sat", saturday: "Sat", "6": "Sat",
                };
                const parsed = explicitDays
                    .map((d: any) => dayMap[String(d).toLowerCase()] || String(d))
                    .filter(Boolean);
                if (parsed.length > 0) {
                    computedActiveDays = standardOrder.filter((day) => parsed.includes(day));
                }
            } else if (startRaw) {
                const start = new Date(startRaw);
                const end = endRaw ? new Date(endRaw) : new Date(startRaw);

                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

                    const diffTime = endDate.getTime() - startDate.getTime();
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays >= 6) {
                        computedActiveDays = standardOrder;
                    } else {
                        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                        const activeSet = new Set<string>();
                        const curr = new Date(startDate);
                        while (curr <= endDate) {
                            activeSet.add(dayNames[curr.getDay()]);
                            curr.setDate(curr.getDate() + 1);
                        }
                        computedActiveDays = standardOrder.filter((day) => activeSet.has(day));
                    }
                }
            }

            // Tag & Category
            const rawTag = promo.type || promo.tagText || promo.discountText || promo.offerLabel || "";
            const tag = (rawTag && String(rawTag).toLowerCase() !== "special") ? String(rawTag) : "";
            const venueName = promo.venue?.name || "";
            const venueAddress = promo.venue?.address || "";
            const rawCategory = promo.type || promo.category || venueName || "";
            const categoryName = (rawCategory && String(rawCategory).toLowerCase() !== "special" && String(rawCategory).toLowerCase() !== "special offers") ? String(rawCategory) : "Promotion";

            // Metrics
            const totalViewsVal = promo.totalViews !== undefined
                ? promo.totalViews
                : (promo.views ?? promo.viewCount ?? promo.metrics?.views ?? 0);
            const viewsCount = String(totalViewsVal);
            const visitsCount = promo.visitsDuringPromo !== undefined ? Number(promo.visitsDuringPromo) : undefined;
            const redeemedCount = String(promo.redeemedCount ?? promo.redemptions ?? promo.metrics?.redemptions ?? "0");

            const avgMins = promo.averageTimeBetweenViewsMinutes !== undefined
                ? Number(promo.averageTimeBetweenViewsMinutes)
                : promo.averageRetentionTimeMinutes !== undefined
                ? Number(promo.averageRetentionTimeMinutes)
                : undefined;

            const avgRetentionFormatted = avgMins !== undefined
                ? avgMins >= 60
                    ? `${Math.floor(avgMins / 60)}h ${avgMins % 60 ? `${avgMins % 60}m` : ""}`.trim()
                    : `${avgMins}m`
                : "0m";

            const performancePercentNum = Number(
                promo.performanceRate ?? promo.performancePercent ?? promo.metrics?.performancePercent ?? (promo.redemptionRate ?? 0)
            );
            const redemptionRateStr = `${performancePercentNum}%`;

            // Images: handle array of banners or single string
            const rawBanners = Array.isArray(promo.banner)
                ? promo.banner
                : promo.banners && Array.isArray(promo.banners)
                ? promo.banners
                : promo.banner
                ? [promo.banner]
                : [];
            const bannerUrls = rawBanners
                .map((b: any) => cleanImageUrl(b, ""))
                .filter((url: string) => url && url !== DEFAULT_PROMOTION_IMAGE);
            const primaryBanner = bannerUrls[0] || cleanImageUrl(promo.bannerUrl || promo.imageUrl, DEFAULT_PROMOTION_IMAGE);

            return {
                id,
                title: promo.title || promo.name || "Promotion",
                description: promo.description || "",
                tagText: tag,
                tagVariant: promo.tagVariant || "purple",
                status: promo.status || "active",
                computedStatus: promo.computedStatus || promo.status,
                category: categoryName,
                venueName,
                venueAddress,
                dateRange: dateRangeStr,
                activeDays: computedActiveDays,
                views: viewsCount,
                totalViews: totalViewsVal,
                visitsDuringPromo: visitsCount,
                redemptions: redeemedCount,
                avgRetentionTime: avgRetentionFormatted,
                averageTimeBetweenViewsMinutes: promo.averageTimeBetweenViewsMinutes,
                rate: redemptionRateStr,
                performancePercent: performancePercentNum,
                performanceRate: performancePercentNum,
                imageUrl: primaryBanner,
                bannerImages: bannerUrls.length > 0 ? bannerUrls : [primaryBanner],
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
            const hasNewFiles = updatedPromoData.images && Array.isArray(updatedPromoData.images) && updatedPromoData.images.some((img: any) => img instanceof File);
            // Always use FormData so we can send both keepBannerUrls and new files together
            const formData = new FormData();
            // Explicitly DO NOT append venueId on edit
            formData.append("title", updatedPromoData.title);
            formData.append("description", updatedPromoData.description);
            formData.append("startAt", updatedPromoData.startAt);
            formData.append("endAt", updatedPromoData.endAt);
            formData.append("status", updatedPromoData.status || "active");

            // Append remaining existing banner URLs under 'banner' key as strings (strictly capped to 5)
            const MAX_IMAGES = 5;
            const existingBanners: string[] = (updatedPromoData.existingBanners || []).slice(0, MAX_IMAGES);
            existingBanners.forEach((url: string) => {
                if (typeof url === "string" && url.trim()) {
                    formData.append("banner", String(url).trim());
                }
            });

            // Append newly uploaded File objects under 'banner' key (up to remaining slots)
            const remainingSlots = Math.max(0, MAX_IMAGES - existingBanners.length);
            if (hasNewFiles) {
                const newFiles = updatedPromoData.images
                    .filter((file: any) => file instanceof File)
                    .slice(0, remainingSlots);
                newFiles.forEach((file: File) => {
                    formData.append("banner", file);
                });
            }

            await updatePromotionMutation.mutateAsync({ id, data: formData });

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
        const normalized = {
            ...raw,
            _id: raw._id || raw.id || String(promo.id),
            id: raw.id || raw._id || String(promo.id),
            // Pass raw banners array so the modal shows all existing thumbnails
            banners: raw.banners || raw.banner || raw.bannerUrl || raw.imageUrl,
        };
        setEditingPromotion(normalized);
    };

    const handleDeleteClick = (promo: PromotionData) => {
        setDeletingPromotion({ id: String(promo.id), title: promo.title });
    };

    const analytics = (apiAnalyticsData as any)?.data ?? apiAnalyticsData;

    const activePromotionsCount = promotionsList.filter((p) => (p.computedStatus || p.status)?.toLowerCase() === "active").length;
    const totalViewsCount = promotionsList.reduce((acc, p) => acc + (parseInt(p.views) || 0), 0);
    const totalRedemptionsCount = promotionsList.reduce((acc, p) => acc + (parseInt(p.redemptions) || 0), 0);

    const totalPromotionsVal = analytics?.totalPromotions !== undefined && analytics?.totalPromotions !== null
        ? Number(analytics.totalPromotions).toLocaleString()
        : promotionsList.length.toString();

    const totalActivePromotionsVal = analytics?.totalActivePromotions !== undefined && analytics?.totalActivePromotions !== null
        ? Number(analytics.totalActivePromotions).toLocaleString()
        : analytics?.activePromotions !== undefined && analytics?.activePromotions !== null
        ? Number(analytics.activePromotions).toLocaleString()
        : activePromotionsCount.toString();

    const totalViewsVal = analytics?.totalViews !== undefined && analytics?.totalViews !== null
        ? Number(analytics.totalViews).toLocaleString()
        : totalViewsCount.toLocaleString();

    const totalCustomersVisitedVal = analytics?.totalCustomersVisited !== undefined && analytics?.totalCustomersVisited !== null
        ? Number(analytics.totalCustomersVisited).toLocaleString()
        : analytics?.totalRedemptions !== undefined && analytics?.totalRedemptions !== null
        ? Number(analytics.totalRedemptions).toLocaleString()
        : totalRedemptionsCount.toLocaleString();

    const statsData = [
        {
            id: "total-promotions",
            title: "Total Promotions",
            value: totalPromotionsVal,
            trend: "+0 this month",
            isPositive: true,
            variant: "purple" as const,
            icon: (
                <svg className="w-4 h-4 text-[#9F4FFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
        {
            id: "active-promotions",
            title: "Active Promotions",
            value: totalActivePromotionsVal,
            trend: "+0 this week",
            isPositive: true,
            variant: "yellow" as const,
            icon: (
                <svg className="w-4 h-4 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
        {
            id: "total-views",
            title: "Total Views",
            value: totalViewsVal,
            trend: "+0% this month",
            isPositive: true,
            variant: "cyan" as const,
            icon: (
                <svg className="w-4 h-4 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
        },
        {
            id: "customers-visited",
            title: "Customers Visited",
            value: totalCustomersVisitedVal,
            trend: "+0% this month",
            isPositive: true,
            variant: "green" as const,
            icon: (
                <svg className="w-4 h-4 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                {isAnalyticsLoading && !apiAnalyticsData ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-[134px] w-full rounded-[24px] bg-purple-900/20" />
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
                            rawPromotion={rawPromosMap.get(String(promo.id))}
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
