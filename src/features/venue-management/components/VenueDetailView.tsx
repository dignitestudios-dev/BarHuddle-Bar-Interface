"use client";

import React, { useState } from "react";
import { VenueCardData, formatCategory } from "./VenueCard";
import { VenueHeader } from "./VenueHeader";
import { VenueStoriesSection, VisitorStory } from "./VenueStoriesSection";
import { StoryViewerModal } from "./StoryViewerModal";
import { VenueCarouselSection } from "./VenueCarouselSection";
import { VenueInfoSection } from "./VenueInfoSection";
import { VenueAttendeesSection } from "./VenueAttendeesSection";
import { cleanImageUrl, DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";
import { VenueEventsSection } from "./VenueEventsSection";
import { SubscriptionPlansScreen } from "./SubscriptionPlansScreen";

export interface VenueDetailViewProps {
    venue?: VenueCardData;
    onBack?: () => void;
    onClaim?: (venue: VenueCardData) => void;
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

export function VenueDetailView({
    venue = DEFAULT_VENUE,
    onBack,
    onClaim,
    className = "",
}: VenueDetailViewProps) {
    const [activeStory, setActiveStory] = useState<VisitorStory | null>(null);
    const [showSubscriptionScreen, setShowSubscriptionScreen] = useState(false);

    if (showSubscriptionScreen) {
        return (
            <SubscriptionPlansScreen
                onBack={() => setShowSubscriptionScreen(false)}
                className={className}
            />
        );
    }

    const carouselSlides = venue.images && venue.images.length > 1
        ? venue.images.map((img, i) => ({
            id: i + 1,
            title: venue.title || venue.name || "Venue",
            category: formatCategory(venue.category),
            locationCity: venue.address?.split(",")?.[1]?.trim() || "Location",
            fullAddress: venue.address || "",
            isOpen: true,
            imageUrl: img,
        }))
        : null;

    const formattedCategory = formatCategory(venue.category);
    const heroImage = venue.coverImage || venue.imageUrl || (venue.images && venue.images.length > 0 ? venue.images[0] : "");

    return (
        <div className={`w-full flex flex-col gap-6 font-['Manrope',sans-serif] pb-24 ${className}`}>
            {/* Top Navigation Header Component */}
            <VenueHeader
                venue={venue}
                onBack={onBack}
                onClaim={onClaim}
                onOpenSubscription={() => setShowSubscriptionScreen(true)}
            />

            {/* If venue has multiple images, render the interactive Carousel Section, else Hero Image */}
            {carouselSlides ? (
                <VenueCarouselSection slides={carouselSlides} />
            ) : (
                /* Hero Image Section */
                <div className="relative w-full h-[300px] md:h-[450px] rounded-[24px] overflow-hidden bg-[#140E50] border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_40px_rgba(0,0,0,0.5)]">
                    <img
                        src={cleanImageUrl(heroImage, DEFAULT_VENUE_IMAGE)}
                        alt=""
                        onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05033A]/95 via-[#05033A]/30 to-transparent pointer-events-none" />
                    
                    {/* Overlay Text Content */}
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 flex flex-col gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="px-3.5 py-1.5 rounded-full bg-[rgba(124,58,237,0.85)] border border-[rgba(124,58,237,0.5)] backdrop-blur-md flex items-center gap-1.5 w-fit">
                                {venue.icon && (
                                    <img src={venue.icon} alt="" className="w-3.5 h-3.5 object-contain" />
                                )}
                                <span className="font-bold text-[12px] leading-[16px] text-white">
                                    {formattedCategory}
                                </span>
                            </div>

                            {venue.rating !== undefined && venue.rating !== null && (
                                <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center gap-1 text-white shadow-lg">
                                    <svg className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-extrabold text-[13px] text-white">
                                        {typeof venue.rating === "number" ? venue.rating.toFixed(1) : venue.rating}
                                    </span>
                                </div>
                            )}

                            {venue.isClaimed ? (
                                <div className="px-3 py-1.5 rounded-full bg-emerald-500/80 border border-emerald-400/40 backdrop-blur-md flex items-center gap-1 text-white text-[11px] font-bold">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Claimed</span>
                                </div>
                            ) : (
                                <div className="px-3 py-1.5 rounded-full bg-[rgba(124,58,237,0.6)] border border-[rgba(124,58,237,0.4)] backdrop-blur-md flex items-center gap-1 text-[#E8FF57] text-[11px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF57] animate-pulse" />
                                    <span>Available to Claim</span>
                                </div>
                            )}

                            {venue.totalGoing !== undefined && (
                                <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-[12px] font-semibold">
                                    {venue.totalGoing} Going
                                </div>
                            )}
                        </div>

                        <h1 className="font-extrabold text-[36px] sm:text-[48px] text-white drop-shadow-[0px_2px_8px_rgba(0,0,0,0.8)] leading-tight">
                            {venue.title}
                        </h1>
                        <div className="flex items-center gap-2 text-[#9D8FD0] pt-1">
                            <svg className="w-5 h-5 text-[#C27AFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-normal text-[16px]">{venue.address}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Section: Venue Information */}
            <div className="w-full">
                <VenueInfoSection
                    demographics={
                        venue.demographics || {
                            male: venue.gender?.malePercent ?? venue.gender?.male ?? 0,
                            female: venue.gender?.femalePercent ?? venue.gender?.female ?? 0,
                            nonBinary: venue.gender?.nonBinaryPercent ?? venue.gender?.nonBinary ?? 0,
                        }
                    }
                    address={venue.address}
                    operatingHours={venue.operatingHours}
                />
            </div>
        </div>
    );
}

export default VenueDetailView;
