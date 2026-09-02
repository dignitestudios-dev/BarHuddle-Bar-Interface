"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cleanImageUrl } from "@/utils/image";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { VenueDetailView } from "./VenueDetailView";

export interface DemographicsData {
    male: number;
    female: number;
    nonBinary: number;
}

export interface VenueCardData {
    id: number;
    title: string;
    category: string;
    address: string;
    capacity: string;
    imageUrl: string;
    demographics: DemographicsData;
}

export interface VenueCardProps {
    venue?: VenueCardData;
    onClaim?: (venue: VenueCardData) => void;
    onViewDetails?: (venue: VenueCardData) => void;
    className?: string;
}

const DEFAULT_VENUE: VenueCardData = {
    id: 1,
    title: "Barcelona Wine Bar",
    category: "Wine Bar",
    address: "1622 14th St NW, Washington, DC",
    capacity: "~ 25",
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
    const router = useRouter();
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(venue);
        } else {
            setShowDetailModal(true);
        }
    };
    const pieData = [
        { name: "Male", value: venue.demographics.male, color: "#4FC3F7" },
        { name: "Female", value: venue.demographics.female, color: "#FD78C7" },
        { name: "Non-Binary", value: venue.demographics.nonBinary, color: "#FBF595" },
    ];

    return (
        <div
            className={`relative w-full max-w-[372px] h-[472px] flex flex-col justify-between bg-[#140E50]/65 backdrop-blur-xl border border-[rgba(124,58,237,0.25)] shadow-[0px_8px_32px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[20px] overflow-hidden select-none font-['Manrope',sans-serif] transition-all hover:border-[rgba(124,58,237,0.5)] ${className}`}
        >
            {/* Top Image Section with Category Badge & Action Icon */}
            <div className="relative w-full h-[220px] overflow-hidden bg-[#3C0366]">
                {/* Image / Fallback Background */}
                <div className="relative w-full h-full">
                    {/* Dark Ambient Gradient Cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140E50] via-transparent to-black/30 z-10" />
                    
                    {venue.imageUrl ? (
                        <Image 
                            src={cleanImageUrl(venue.imageUrl)} 
                            alt={venue.title} 
                            fill 
                            className="object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2E1065] via-[#1E0B36] to-[#0A0524] flex items-center justify-center">
                            <svg className="w-12 h-12 text-[#C27AFF]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Yellow Category Badge (Top Left) */}
                <div className="absolute top-3 left-3.5 z-20 px-2.5 py-1 bg-[#F2CA54] shadow-[0px_0px_9.8px_2px_#F2CA54] rounded-full flex items-center justify-center">
                    <span className="font-semibold text-[11px] capitalize leading-[16px] text-black">
                        {venue.category}
                    </span>
                </div>

                {/* Glass Bookmark / Option Icon (Top Right) */}
                {/* <button
                    type="button"
                    className="absolute top-3 right-3.5 z-20 w-8 h-8 rounded-full bg-[rgba(5,3,58,0.6)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button> */}
            </div>

            {/* Bottom Content Info Section */}
            <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                {/* Title, Address & Capacity Row */}
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-[16px] leading-[20px] text-white truncate">
                            {venue.title}
                        </h3>

                        {/* Capacity Badge */}
                        <div className="px-2.5 py-0.5 rounded-full bg-[rgba(180,95,242,0.14)] text-white text-[13px] font-medium font-['Inter'] shrink-0">
                            {venue.capacity}
                        </div>
                    </div>

                    {/* Address Line */}
                    <div className="flex items-center gap-1.5 text-[#9D8FD0]">
                        <svg className="w-3 h-3 text-[#C27AFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-normal text-[11px] leading-[16px] truncate">
                            {venue.address}
                        </span>
                    </div>
                </div>

                {/* Audience Demographics Chart & Legend */}
                <div className="flex items-center justify-between gap-3 w-full py-1">
                    {/* Mini Pie Chart (80x80) */}
                    <div className="w-[80px] h-[80px] shrink-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={20}
                                    outerRadius={36}
                                    paddingAngle={2}
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
                        <div className="flex items-center justify-between text-[12px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#4FC3F7] shrink-0" />
                                <span className="text-[#9D8FD0]">Male</span>
                            </div>
                            <span className="font-semibold text-white">{venue.demographics.male}%</span>
                        </div>

                        {/* Female */}
                        <div className="flex items-center justify-between text-[12px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#FD78C7] shrink-0" />
                                <span className="text-[#9D8FD0]">Female</span>
                            </div>
                            <span className="font-semibold text-white">{venue.demographics.female}%</span>
                        </div>

                        {/* Non-Binary */}
                        <div className="flex items-center justify-between text-[12px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#FBF595] shrink-0" />
                                <span className="text-[#9D8FD0]">Non-Binary</span>
                            </div>
                            <span className="font-semibold text-white">{venue.demographics.nonBinary}%</span>
                        </div>
                    </div>

                    {/* Overlapping User Avatars Pill */}
                    <div className="flex items-center -space-x-2 shrink-0 pl-1">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border border-[#140E50]" />
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 border border-[#140E50]" />
                        <div className="w-7 h-7 rounded-full bg-black/70 border border-[#140E50] flex items-center justify-center font-medium text-[10px] text-white">
                            15+
                        </div>
                    </div>
                </div>

                {/* Bottom Action Buttons Row */}
                <div className="flex items-center gap-3 w-full pt-1">
                    {/* Claim Venue Button */}
                    <button
                        type="button"
                        onClick={() => onClaim?.(venue)}
                        className="flex-1 h-9 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_20px_rgba(124,58,237,0.5),0px_0px_40px_rgba(232,255,87,0.1)] flex items-center justify-center font-bold text-[12px] text-white hover:brightness-110 transition-all cursor-pointer"
                    >
                        Claim Venue
                    </button>

                    {/* View Details Button */}
                    <button
                        type="button"
                        onClick={handleViewDetails}
                        className="flex-1 h-9 rounded-full bg-[rgba(124,58,237,0.31)] hover:bg-[rgba(124,58,237,0.45)] flex items-center justify-center font-semibold text-[12px] text-[#C4B5FD] hover:text-white transition-all cursor-pointer"
                    >
                        View Details
                    </button>
                </div>
            </div>

            {/* Standalone Detail Modal removed, now handled by parent to prevent clipping */}
        </div>
    );
}

export default VenueCard;
