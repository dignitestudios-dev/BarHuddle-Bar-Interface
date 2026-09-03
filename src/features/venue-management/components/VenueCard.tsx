"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cleanImageUrl, DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { VenueGender, VenueLocationCoords } from "../api/venue.service";

export interface DemographicsData {
    male: number;
    female: number;
    nonBinary: number;
}

export interface VenueCardData {
    id: string | number;
    _id?: string;
    placeId?: string;
    title: string;
    name?: string;
    category: string;
    address: string;
    capacity?: string;
    imageUrl?: string;
    coverImage?: string;
    images?: string[];
    icon?: string;
    iconBackgroundColor?: string;
    rating?: number;
    isClaimed?: boolean;
    totalGoing?: number;
    gender?: VenueGender;
    demographics?: DemographicsData;
    friendsGoing?: any[];
    otherUsersCount?: number;
    hasStories?: boolean;
    storiesCount?: number;
    popularityCount?: number;
    isFavorite?: boolean;
    isGoing?: boolean;
    location?: string | VenueLocationCoords;
    operatingHours?: any[];
}

export interface VenueCardProps {
    venue?: VenueCardData;
    onClaim?: (venue: VenueCardData) => void;
    onViewDetails?: (venue: VenueCardData) => void;
    className?: string;
}

export function formatCategory(category?: string): string {
    if (!category) return "Venue";
    return category
        .replace(/[_-]+/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

const DEFAULT_VENUE: VenueCardData = {
    id: 1,
    title: "Barcelona Wine Bar",
    category: "wine_bar",
    address: "1622 14th St NW, Washington, DC",
    capacity: "25 Going",
    totalGoing: 25,
    rating: 4.8,
    isClaimed: false,
    imageUrl: "/images/venue-barcelona.png",
    demographics: {
        male: 60,
        female: 25,
        nonBinary: 15,
    },
};

export function VenueCard({
    venue = DEFAULT_VENUE,
    onClaim,
    onViewDetails,
    className = "",
}: VenueCardProps) {
    const [imgError, setImgError] = useState(false);

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(venue);
        }
    };

    // Determine primary image
    const rawImage = venue.coverImage || venue.imageUrl || (venue.images && venue.images.length > 0 ? venue.images[0] : "");
    const finalImageUrl = cleanImageUrl(rawImage);

    // Audience demographics
    const malePercent = venue.gender?.malePercent ?? venue.gender?.male ?? venue.demographics?.male ?? 0;
    const femalePercent = venue.gender?.femalePercent ?? venue.gender?.female ?? venue.demographics?.female ?? 0;
    const nonBinaryPercent = venue.gender?.nonBinaryPercent ?? venue.gender?.nonBinary ?? venue.demographics?.nonBinary ?? 0;
    const totalDemographics = malePercent + femalePercent + nonBinaryPercent;

    const hasDemographics = totalDemographics > 0;

    const pieData = hasDemographics
        ? [
            { name: "Male", value: malePercent, color: "#4FC3F7" },
            { name: "Female", value: femalePercent, color: "#FD78C7" },
            { name: "Non-Binary", value: nonBinaryPercent, color: "#FBF595" },
        ]
        : [{ name: "No Data", value: 100, color: "rgba(124, 58, 237, 0.22)" }];

    const formattedCategory = formatCategory(venue.category);
    const displayTitle = venue.name || venue.title || "Unnamed Venue";
    const totalGoingCount = venue.totalGoing ?? 0;
    const displayGoing = venue.capacity ? venue.capacity : `${totalGoingCount} Going`;

    return (
        <div
            className={`group relative w-full max-w-[372px] h-[482px] flex flex-col justify-between bg-[#140E50]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.25)] shadow-[0px_8px_32px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[22px] overflow-hidden select-none font-['Manrope',sans-serif] transition-all duration-300 hover:border-[rgba(124,58,237,0.6)] hover:shadow-[0px_12px_40px_rgba(124,58,237,0.25)] ${className}`}
        >
            {/* Top Image Section with Category, Rating, Stories & Claim Badges */}
            <div className="relative w-full h-[220px] overflow-hidden bg-[#2E1065]">
                <div className="relative w-full h-full">
                    {/* Image with automatic dummy fallback on load failure */}
                    <img
                        src={!imgError && finalImageUrl ? finalImageUrl : DEFAULT_VENUE_IMAGE}
                        alt=""
                        onError={(e) => {
                            setImgError(true);
                            handleImageError(e, DEFAULT_VENUE_IMAGE);
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Top-Left Category Badge */}
                <div className="absolute top-3 left-3.5 z-20 px-2.5 py-1 bg-[#F2CA54] shadow-[0px_0px_10px_rgba(242,202,84,0.5)] rounded-full flex items-center gap-1.5 max-w-[65%]">
                    {venue.icon && (
                        <img
                            src={venue.icon}
                            alt=""
                            className="w-3.5 h-3.5 object-contain shrink-0"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    )}
                    <span className="font-bold text-[11px] capitalize leading-[15px] text-black truncate">
                        {formattedCategory}
                    </span>
                </div>

                {/* Top-Right Rating Badge */}
                {venue.rating !== undefined && venue.rating !== null && (
                    <div className="absolute top-3 right-3.5 z-20 px-2.5 py-1 bg-black/65 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-1 shadow-lg">
                        <svg className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24] shrink-0" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-extrabold text-[12px] text-white leading-none">
                            {typeof venue.rating === "number" ? venue.rating.toFixed(1) : venue.rating}
                        </span>
                    </div>
                )}

                {/* Bottom-Left Claimed Status Indicator */}
                <div className="absolute bottom-3 left-3.5 z-20 flex items-center gap-2">
                    {venue.isClaimed ? (
                        <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/85 border border-emerald-400/50 backdrop-blur-md flex items-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-bold text-[10px] uppercase tracking-wider text-white">
                                Claimed
                            </span>
                        </div>
                    ) : (
                        <div className="px-2.5 py-0.5 rounded-full bg-[rgba(124,58,237,0.7)] border border-[rgba(124,58,237,0.5)] backdrop-blur-md flex items-center gap-1 shadow-[0_0_10px_rgba(124,58,237,0.25)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF57] animate-pulse" />
                            <span className="font-semibold text-[10px] uppercase tracking-wider text-[#E8FF57]">
                                Available
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom-Right Stories Count Badge (if venue has stories) */}
                {(venue.hasStories || (venue.storiesCount && venue.storiesCount > 0)) && (
                    <div className="absolute bottom-3 right-3.5 z-20 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/80 to-purple-600/80 border border-pink-400/40 backdrop-blur-md flex items-center gap-1 shadow-md">
                        <span className="text-[10px]">📸</span>
                        <span className="font-bold text-[10px] text-white">
                            {venue.storiesCount || 1} {venue.storiesCount === 1 ? "Story" : "Stories"}
                        </span>
                    </div>
                )}
            </div>

            {/* Bottom Content Info Section */}
            <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                {/* Title, Address & Going Count Row */}
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-[16px] leading-[20px] text-white truncate group-hover:text-[#E8FF57] transition-colors" title={displayTitle}>
                            {displayTitle}
                        </h3>

                        {/* Going Count Badge */}
                        <div className="px-2.5 py-0.5 rounded-full bg-[rgba(180,95,242,0.15)] border border-[rgba(180,95,242,0.3)] text-[#E8C7FF] text-[11px] sm:text-[12px] font-semibold shrink-0">
                            {displayGoing}
                        </div>
                    </div>

                    {/* Address Line */}
                    <div className="flex items-center gap-1.5 text-[#9D8FD0]">
                        <svg className="w-3.5 h-3.5 text-[#C27AFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-normal text-[11px] leading-[16px] truncate" title={venue.address}>
                            {venue.address || "Location unavailable"}
                        </span>
                    </div>
                </div>

                {/* Audience Demographics Chart & Legend */}
                <div className="flex items-center justify-between gap-3 w-full py-1">
                    {/* Mini Pie Chart (76x76) */}
                    <div className="w-[76px] h-[76px] shrink-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={18}
                                    outerRadius={34}
                                    paddingAngle={hasDemographics ? 2 : 0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Demographics Legend Rows */}
                    <div className="flex flex-col gap-1 flex-1">
                        {/* Male */}
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#4FC3F7] shrink-0" />
                                <span className="text-[#9D8FD0]">Male</span>
                            </div>
                            <span className="font-semibold text-white">{malePercent}%</span>
                        </div>

                        {/* Female */}
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#FD78C7] shrink-0" />
                                <span className="text-[#9D8FD0]">Female</span>
                            </div>
                            <span className="font-semibold text-white">{femalePercent}%</span>
                        </div>

                        {/* Non-Binary */}
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#FBF595] shrink-0" />
                                <span className="text-[#9D8FD0]">Non-Binary</span>
                            </div>
                            <span className="font-semibold text-white">{nonBinaryPercent}%</span>
                        </div>
                    </div>

                    {/* User Avatars Cluster */}
                    <div className="flex items-center -space-x-2 shrink-0 pl-1">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border border-[#140E50]" />
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 border border-[#140E50]" />
                        <div className="w-7 h-7 rounded-full bg-black/80 border border-[#140E50] flex items-center justify-center font-bold text-[10px] text-white">
                            {totalGoingCount > 0 ? `${totalGoingCount}` : "0"}
                        </div>
                    </div>
                </div>

                {/* Bottom Action Buttons Row */}
                <div className="flex items-center gap-2.5 w-full pt-1">
                    {/* Claim Venue Button */}
                    {venue.isClaimed ? (
                        <button
                            type="button"
                            disabled
                            className="flex-1 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[12px] text-white/40 cursor-not-allowed select-none"
                            title="This venue has already been claimed"
                        >
                            Claimed
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onClaim?.(venue)}
                            className="flex-1 h-9 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_20px_rgba(124,58,237,0.5)] flex items-center justify-center font-bold text-[12px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                            Claim Venue
                        </button>
                    )}

                    {/* View Details Button */}
                    <button
                        type="button"
                        onClick={handleViewDetails}
                        className="flex-1 h-9 rounded-full bg-[rgba(124,58,237,0.25)] hover:bg-[rgba(124,58,237,0.45)] border border-[rgba(124,58,237,0.35)] flex items-center justify-center font-semibold text-[12px] text-[#C4B5FD] hover:text-white transition-all cursor-pointer"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VenueCard;
