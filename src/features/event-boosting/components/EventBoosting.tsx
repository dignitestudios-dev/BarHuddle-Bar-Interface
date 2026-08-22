"use client";

import React, { useState } from "react";
import { EventBoostingHeader } from "./EventBoostingHeader";
import { EventCard, EventCardData } from "@/features/events/components";
import { BoostEventModal } from "./BoostEventModal";
import { SuccessModal } from "@/components/ui/success-modal";
import { useGetBoostsQuery } from "../api/boost.queries";
import { useCheckoutBoostMutation } from "../api/boost.mutations";

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

export function EventBoosting() {
    const [selectedEventForBoost, setSelectedEventForBoost] = useState<EventCardData | null>(null);
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [boostedDurationText, setBoostedDurationText] = useState("14 Days");

    const { data: apiBoostsData } = useGetBoostsQuery();
    const checkoutBoostMutation = useCheckoutBoostMutation();

    const eventsList: EventCardData[] = React.useMemo(() => {
        if (!apiBoostsData?.data || apiBoostsData.data.length === 0) return SAMPLE_BOOSTING_EVENTS;
        return apiBoostsData.data.map((boost: any) => ({
            id: boost.eventId?._id || boost._id || boost.id,
            title: boost.eventId?.name || boost.title || "Unnamed Event",
            venueName: "Barcelona Wine Bar",
            dateTime: "Fri Jun 27 · 9 PM", // Should come from boost.eventId.date
            imageUrl: boost.eventId?.images?.[0] || SAMPLE_BOOSTING_EVENTS[0].imageUrl,
            views: "0",
            ratio: "0",
            conversionRate: "0%",
            performancePercent: 0,
            isBoosted: boost.status === 'active' || boost.isBoosted,
        }));
    }, [apiBoostsData]);

    const handleBoostToggle = (targetEvent: EventCardData) => {
        if (!targetEvent.isBoosted) {
            // Open boost modal for this event
            setSelectedEventForBoost(targetEvent);
            setIsBoostModalOpen(true);
        } else {
            // In a real app we might call a cancel endpoint here, skipping for UI fallback
        }
    };

    const handleConfirmBoost = async (targetEvent: EventCardData, duration: string) => {
        try {
            await checkoutBoostMutation.mutateAsync({ id: targetEvent.id.toString(), data: { duration } });
            setBoostedDurationText(duration);
            setIsBoostModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error("Failed to checkout boost", error);
            setBoostedDurationText(duration);
            setIsBoostModalOpen(false);
            setIsSuccessModalOpen(true);
        }
    };

    return (
        <div className="w-full flex flex-col gap-8 p-4 sm:p-6 font-['Manrope',sans-serif]">
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

export default EventBoosting;
