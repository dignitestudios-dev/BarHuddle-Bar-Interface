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
        <div className={`w-full max-w-[1200px] flex flex-col gap-6 font-['Manrope',sans-serif] ${className}`}>
            {/* Top Navigation Header Component */}
            <VenueHeader
                venue={venue}
                onBack={onBack}
                onClaim={onClaim}
                onOpenSubscription={() => setShowSubscriptionScreen(true)}
            />

            {/* Top Live Stories Component */}
            <VenueStoriesSection onSelectStory={(story) => setActiveStory(story)} />

            {/* Hero Carousel Section */}
            <VenueCarouselSection />

            {/* Bottom 2-Column Section: Left (Venue Info & Attendees) + Right (Events) */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (7 cols): Venue Information + List of Attendees & Past Attendees */}
                <div className="lg:col-span-7 flex flex-col gap-6 w-full">
                    <VenueInfoSection demographics={venue.demographics} />
                    <VenueAttendeesSection />
                </div>

                {/* Right Column (5 cols): Events Section */}
                <div className="lg:col-span-5 w-full">
                    <VenueEventsSection />
                </div>
            </div>

            {/* Visitor Story Viewer Modal Component */}
            <StoryViewerModal story={activeStory} onClose={() => setActiveStory(null)} />
        </div>
    );
}

export default VenueDetailView;
