"use client";

import React, { useState } from "react";
import { EventBoostingHeader } from "@/components/boosting/EventBoostingHeader";
import { EventCard, EventCardData } from "@/components/events/EventCard";
import { BoostEventModal } from "@/components/boosting/BoostEventModal";
import { SuccessModal } from "@/components/ui/success-modal";

const SAMPLE_BOOSTING_EVENTS: EventCardData[] = [
    {
        id: 1,
        title: "Ladies Night",
        venueName: "Barcelona Wine Bar",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        views: "4.3K",
        ratio: "788",
        conversionRate: "18.2%",
        performancePercent: 38,
        isBoosted: false,
    },
    {
        id: 2,
        title: "Ladies Night",
        venueName: "Barcelona Wine Bar",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80",
        views: "4.3K",
        ratio: "788",
        conversionRate: "18.2%",
        performancePercent: 38,
        isBoosted: true,
    },
    {
        id: 3,
        title: "Ladies Night",
        venueName: "Barcelona Wine Bar",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
        views: "4.3K",
        ratio: "788",
        conversionRate: "18.2%",
        performancePercent: 38,
        isBoosted: false,
    },
    {
        id: 4,
        title: "Summer Rooftop Special",
        venueName: "Barcelona Wine Bar",
        dateTime: "Sat Jun 28 · 10 PM",
        imageUrl: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=600&q=80",
        views: "6.1K",
        ratio: "890",
        conversionRate: "24.5%",
        performancePercent: 65,
        isBoosted: false,
    },
    {
        id: 5,
        title: "DJ Neon Rave Party",
        venueName: "Barcelona Wine Bar",
        dateTime: "Sun Jun 29 · 11 PM",
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80",
        views: "8.4K",
        ratio: "1.2K",
        conversionRate: "31.0%",
        performancePercent: 82,
        isBoosted: true,
    },
    {
        id: 6,
        title: "Craft Beer Tasting",
        venueName: "Barcelona Wine Bar",
        dateTime: "Wed Jul 02 · 7 PM",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        views: "2.9K",
        ratio: "450",
        conversionRate: "15.8%",
        performancePercent: 42,
        isBoosted: false,
    },
];

export default function EventBoostingPage() {
    const [eventsList, setEventsList] = useState<EventCardData[]>(SAMPLE_BOOSTING_EVENTS);
    const [selectedEventForBoost, setSelectedEventForBoost] = useState<EventCardData | null>(null);
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [boostedDurationText, setBoostedDurationText] = useState("14 Days");

    const handleBoostToggle = (targetEvent: EventCardData) => {
        if (!targetEvent.isBoosted) {
            // Open boost modal for this event
            setSelectedEventForBoost(targetEvent);
            setIsBoostModalOpen(true);
        } else {
            // Un-boost event directly if already boosted
            setEventsList((prev) =>
                prev.map((item) =>
                    item.id === targetEvent.id
                        ? { ...item, isBoosted: false }
                        : item
                )
            );
        }
    };

    const handleConfirmBoost = (targetEvent: EventCardData, duration: string) => {
        setEventsList((prev) =>
            prev.map((item) =>
                item.id === targetEvent.id
                    ? { ...item, isBoosted: true }
                    : item
            )
        );
        setBoostedDurationText(duration);
        setIsSuccessModalOpen(true);
    };

    return (
        <div className="w-full max-w-[1136px] flex flex-col gap-8 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Section */}
            <EventBoostingHeader />

            {/* Event Boosting Cards Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
                {eventsList.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        variant="boosting"
                        onBoostToggle={handleBoostToggle}
                    />
                ))}
            </div>

            {/* Boost Event Modal */}
            <BoostEventModal
                isOpen={isBoostModalOpen}
                onClose={() => setIsBoostModalOpen(false)}
                event={selectedEventForBoost}
                onConfirmBoost={handleConfirmBoost}
            />

            {/* Success Modal on Boost Confirmation */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Event Boosted Successfully!"
                description={`"${selectedEventForBoost?.title || "Event"}" is now actively boosted for ${boostedDurationText} and visible to all BarHuddle users in your area.`}
                actionButton={
                    <button
                        onClick={() => setIsSuccessModalOpen(false)}
                        className="w-full h-12 rounded-[14px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] font-extrabold text-[14px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                        Done
                    </button>
                }
            />
        </div>
    );
}
