"use client";

import React from "react";
import { cleanImageUrl } from "@/utils/image";

export interface PromotionData {
    id: number | string;
    title: string;
    description: string;
    tagText: string; // "Special", "25% OFF", "BOGO"
    tagVariant: "green" | "yellow" | "purple";
    status: string;
    computedStatus?: "expired" | "active" | "upcoming" | string;
    category: string; // "Special Offers", "Discounts", "Buy One Get One"
    venueName?: string;
    venueAddress?: string;
    dateRange: string;
    activeDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    views: string;
    totalViews?: number | string;
    visitsDuringPromo?: number;
    redemptions: string;
    avgRetentionTime?: string;
    averageTimeBetweenViewsMinutes?: number | string;
    rate: string;
    performancePercent: number;
    performanceRate?: number;
    imageUrl: string;
    bannerImages?: string[];
}

export function getPromotionStatusConfig(statusVal?: string) {
    const s = (statusVal || "").toLowerCase().trim();
    if (s === "active") {
        return {
            label: "Active",
            badgeClass: "bg-[rgba(74,222,128,0.14)] border-[rgba(74,222,128,0.35)] text-[#4ADE80]",
            dotClass: "bg-[#4ADE80] shadow-[0px_0px_6px_#4ADE80]",
        };
    }
    if (s === "upcoming") {
        return {
            label: "Upcoming",
            badgeClass: "bg-[rgba(232,255,87,0.14)] border-[rgba(232,255,87,0.35)] text-[#E8FF57]",
            dotClass: "bg-[#E8FF57] shadow-[0px_0px_6px_#E8FF57]",
        };
    }
    if (s === "expired") {
        return {
            label: "Expired",
            badgeClass: "bg-[rgba(251,113,133,0.14)] border-[rgba(251,113,133,0.35)] text-[#FB7185]",
            dotClass: "bg-[#FB7185] shadow-[0px_0px_6px_#FB7185]",
        };
    }
    if (!s) return null;
    return {
        label: s.charAt(0).toUpperCase() + s.slice(1),
        badgeClass: "bg-[rgba(139,126,200,0.14)] border-[rgba(139,126,200,0.3)] text-[#8B7EC8]",
        dotClass: "bg-[#8B7EC8] shadow-[0px_0px_6px_#8B7EC8]",
    };
}

export interface PromotionCardProps {
    promotion: PromotionData;
    rawPromotion?: any;
    onEdit?: (promo: PromotionData) => void;
    onDuplicate?: (promo: PromotionData) => void;
    onDelete?: (promo: PromotionData) => void;
    onToggleActive?: (promo: PromotionData) => void;
    className?: string;
}

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function PromotionCard({
    promotion,
    rawPromotion,
    onEdit,
    onDuplicate,
    onDelete,
    onToggleActive,
    className = "",
}: PromotionCardProps) {
    const isGreenTag = promotion.tagVariant === "green";
    const isYellowTag = promotion.tagVariant === "yellow";

    const [currentImgIndex, setCurrentImgIndex] = React.useState(0);
    const banners = promotion.bannerImages && promotion.bannerImages.length > 0
        ? promotion.bannerImages
        : [promotion.imageUrl];
    const activeImageUrl = banners[currentImgIndex] || promotion.imageUrl;

    const statusConfig = getPromotionStatusConfig(promotion.computedStatus || promotion.status);

    // Extract totalViews, averageTimeBetweenViewsMinutes, performanceRate
    const displayViews = rawPromotion?.totalViews !== undefined && rawPromotion?.totalViews !== null
        ? String(rawPromotion.totalViews)
        : promotion.totalViews !== undefined && promotion.totalViews !== null
        ? String(promotion.totalViews)
        : promotion.views ?? "0";

    const rawAvgMins = rawPromotion?.averageTimeBetweenViewsMinutes !== undefined && rawPromotion?.averageTimeBetweenViewsMinutes !== null
        ? rawPromotion.averageTimeBetweenViewsMinutes
        : promotion.averageTimeBetweenViewsMinutes;

    const displayAvgClick = rawAvgMins !== undefined && rawAvgMins !== null
        ? Number(rawAvgMins) >= 60
            ? `${Math.floor(Number(rawAvgMins) / 60)}h ${Number(rawAvgMins) % 60 ? `${Number(rawAvgMins) % 60}m` : ""}`.trim()
            : `${Number(rawAvgMins)}m`
        : promotion.avgRetentionTime || (promotion.redemptions ? `${promotion.redemptions}m` : "0m");

    const displayPerformanceRate = rawPromotion?.performanceRate !== undefined && rawPromotion?.performanceRate !== null
        ? Number(rawPromotion.performanceRate)
        : promotion.performanceRate !== undefined && promotion.performanceRate !== null
        ? Number(promotion.performanceRate)
        : promotion.performancePercent ?? 0;

    return (
        <div
            className={`relative w-full max-w-[370px] min-h-[472px] bg-[rgba(10,6,50,0.75)] border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.04)] rounded-[22px] overflow-hidden flex flex-col justify-between font-['Manrope',sans-serif] hover:border-[rgba(124,58,237,0.4)] transition-all duration-300 group ${className}`}
        >
            {/* Top Image Section (176px) */}
            <div className="relative w-full h-[176px] bg-[#3C0366] overflow-hidden shrink-0">
                {/* Promo Image */}
                <img
                    src={cleanImageUrl(activeImageUrl, "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80")}
                    alt={promotion.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(5,3,50,0.5)] to-[#050332]" />

                {/* Teal/Green Gradient Touch */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,222,128,0.2)] to-[rgba(34,211,238,0.12)] opacity-50 pointer-events-none" />

                {/* Multi-banner Navigation Chevrons & Counter */}
                {banners.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImgIndex((prev) => (prev > 0 ? prev - 1 : banners.length - 1));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
                            aria-label="Previous image"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImgIndex((prev) => (prev < banners.length - 1 ? prev + 1 : 0));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
                            aria-label="Next image"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-3 right-3.5 flex items-center gap-1 z-20 pointer-events-none">
                            {banners.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === currentImgIndex
                                            ? "w-3.5 bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]"
                                            : "w-1.5 bg-white/40"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Top Left Tag Badge (e.g. 25% OFF / BOGO) */}
                {promotion.tagText &&
                    promotion.tagText.trim() !== "" &&
                    promotion.tagText.trim().toLowerCase() !== "special" && (
                    <div
                        className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-full flex items-center justify-center font-extrabold text-[12px] leading-[16px] tracking-[0.3px] shadow-lg z-10 ${
                            isGreenTag
                                ? "bg-[#4ADE80] text-[#04022E] shadow-[0px_0px_20px_rgba(74,222,128,0.5)]"
                                : isYellowTag
                                ? "bg-[#E8FF57] text-[#04022E] shadow-[0px_0px_20px_rgba(232,255,87,0.5)]"
                                : "bg-[#9F4FFA] text-white shadow-[0px_0px_20px_rgba(159,79,250,0.5)]"
                        }`}
                    >
                        {promotion.tagText}
                    </div>
                )}

                {/* Top Right Status Badge (Active / Upcoming / Expired) */}
                {statusConfig && (
                    <div
                        className={`absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full border flex items-center gap-1.5 backdrop-blur-md text-[10px] font-bold tracking-[0.2px] shadow-sm z-10 transition-all ${statusConfig.badgeClass}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                        <span>{statusConfig.label}</span>
                    </div>
                )}

                {/* Bottom Left Venue / Category Badge */}
                {(promotion.venueName || promotion.category) && (
                    <div className="absolute bottom-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[rgba(5,3,40,0.75)] border border-[rgba(124,58,237,0.35)] backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold text-[#4ADE80] max-w-[210px] shadow-sm z-10">
                        <svg className="w-3 h-3 text-[#4ADE80] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="truncate">{promotion.venueName || promotion.category}</span>
                    </div>
                )}
            </div>

            {/* Card Body Container */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 justify-between">
                {/* Title & Description */}
                <div className="flex flex-col gap-1 w-full">
                    <h3 className="font-extrabold text-[14px] leading-[18px] text-white truncate">
                        {promotion.title}
                    </h3>
                    <p className="font-normal text-[12px] leading-[18px] text-[#8B7EC8] line-clamp-2 min-h-[36px]">
                        {promotion.description}
                    </p>
                </div>

                {/* Date & Active Days Container */}
                <div className="flex flex-col gap-2 w-full">
                    {/* Date Row */}
                    <div className="flex items-center gap-2 text-[11px] text-[#C4B5FD]">
                        <svg className="w-3 h-3 text-[#8B7EC8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{promotion.dateRange}</span>
                    </div>

                    {/* Active Days Row */}
                    <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-[#8B7EC8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex items-center gap-1 flex-wrap">
                            {ALL_DAYS.map((day) => {
                                const isActiveDay = Array.isArray(promotion.activeDays) && promotion.activeDays.includes(day);
                                return (
                                    <span
                                        key={day}
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                                            isActiveDay
                                                ? isGreenTag
                                                    ? "bg-[rgba(74,222,128,0.18)] border border-[rgba(74,222,128,0.4)] text-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.2)]"
                                                    : isYellowTag
                                                    ? "bg-[rgba(232,255,87,0.18)] border border-[rgba(232,255,87,0.4)] text-[#E8FF57] shadow-[0_0_8px_rgba(232,255,87,0.2)]"
                                                    : "bg-[rgba(159,79,250,0.2)] border border-[rgba(159,79,250,0.45)] text-[#C4B5FD] shadow-[0_0_8px_rgba(159,79,250,0.2)]"
                                                : "bg-[rgba(124,58,237,0.03)] border border-[rgba(124,58,237,0.08)] text-[#8B7EC8]/25 opacity-35"
                                        }`}
                                    >
                                        {day}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Metric Stat Cards Row */}
                <div className="grid grid-cols-2 gap-2 w-full">
                    {/* Views (totalViews) */}
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-[16px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.12)]">
                        <span className="font-extrabold text-[13px] leading-[18px] text-[#22D3EE]">
                            {displayViews}
                        </span>
                        <span className="font-semibold text-[9px] leading-[13px] text-[#8B7EC8]">
                            Views
                        </span>
                    </div>

                    {/* Avg Click (averageTimeBetweenViewsMinutes) */}
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-[16px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.12)]">
                        <span className="font-extrabold text-[13px] leading-[18px] text-[#4ADE80]">
                            {displayAvgClick}
                        </span>
                        <span className="font-semibold text-[9px] leading-[13px] text-[#8B7EC8] text-center truncate w-full px-0.5">
                            Avg Click
                        </span>
                    </div>
                </div>

                {/* Performance Progress Bar Row (performanceRate) */}
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8]">
                            Performance
                        </span>
                        <span className="font-extrabold text-[10px] leading-[15px] text-[#4ADE80]">
                            {displayPerformanceRate}%
                        </span>
                    </div>
                    <div className="w-full h-[6px] rounded-full bg-[rgba(124,58,237,0.12)] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4ADE80] shadow-[0px_0px_6px_rgba(74,222,128,0.44)] transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, displayPerformanceRate))}%` }}
                        />
                    </div>
                </div>

                {/* Bottom Action Row */}
                <div className="flex items-center gap-2 w-full pt-1">
                    {/* Edit Button */}
                    <button
                        type="button"
                        onClick={() => onEdit?.(promotion)}
                        className="flex-1 h-[36px] rounded-[100px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_16px_rgba(124,58,237,0.4)] flex items-center justify-center gap-1.5 font-extrabold text-[12px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Edit</span>
                    </button>

                    {/* Delete Icon Button */}
                    <button
                        type="button"
                        onClick={() => onDelete?.(promotion)}
                        className="w-9 h-[36px] rounded-[24px] bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] flex items-center justify-center text-[#F87171] hover:bg-[rgba(248,113,113,0.2)] transition-all cursor-pointer shrink-0"
                        aria-label="Delete"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PromotionCard;
