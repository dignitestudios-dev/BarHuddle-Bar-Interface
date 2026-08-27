"use client";

import React, { useState } from "react";
import type { VenueCardData } from "./VenueCard";
import { VenueHeader } from "./VenueHeader";
import { VenueStoriesSection, VisitorStory } from "./VenueStoriesSection";
import { StoryViewerModal } from "./StoryViewerModal";
import { VenueCarouselSection } from "./VenueCarouselSection";
import { VenueInfoSection } from "./VenueInfoSection";
import { VenueAttendeesSection } from "./VenueAttendeesSection";
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

    return (
        <div className={`w-full flex flex-col gap-6 font-['Manrope',sans-serif] pb-24 ${className}`}>
            {/* Top Navigation Header Component */}
            <VenueHeader
                venue={venue}
                onBack={onBack}
                onClaim={onClaim}
                onOpenSubscription={() => setShowSubscriptionScreen(true)}
            />

            {/* Hero Image Section */}
            <div className="relative w-full h-[300px] md:h-[450px] rounded-[24px] overflow-hidden bg-[#140E50] border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_40px_rgba(0,0,0,0.5)]">
                {venue.imageUrl ? (
                    <img src={venue.imageUrl} alt={venue.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#9D8FD0] bg-gradient-to-br from-[#2E1065] via-[#1E0B36] to-[#0A0524]">
                        <svg className="w-16 h-16 opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
                        </svg>
                        <span>No Image Available</span>
                    </div>
                )}
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05033A]/95 via-[#05033A]/30 to-transparent pointer-events-none" />
                
                {/* Overlay Text Content */}
                <div className="absolute bottom-0 left-0 p-6 md:p-10 flex flex-col gap-3">
                    <div className="px-3.5 py-1.5 rounded-full bg-[rgba(124,58,237,0.85)] border border-[rgba(124,58,237,0.5)] backdrop-blur-md flex items-center justify-center w-fit">
                        <span className="font-bold text-[12px] leading-[16px] text-white">
                            {venue.category}
                        </span>
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

            {/* Bottom Section: Venue Information */}
            <div className="w-full">
                <VenueInfoSection demographics={venue.demographics} address={venue.address} />
            </div>
        </div>
    );
}

export default VenueDetailView;
