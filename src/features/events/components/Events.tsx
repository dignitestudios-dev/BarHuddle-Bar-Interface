"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EventsPageHeader } from "./EventsPageHeader";
import { EventCard, EventCardData } from "./EventCard";
import { CreateEventModal } from "./CreateEventModal";
import { useGetEventsQuery } from "../api/events.queries";
import { useCreateEventMutation } from "../api/events.mutations";

const MOCK_EVENTS: EventCardData[] = [
    {
        id: 1,
        title: "Ladies Night",
        venueName: "Barcelona Wine Bar",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        views: "4.3K",
        ratio: "45/55",
        conversionRate: "18.2%",
        performancePercent: 38,
        isBoosted: false,
    },
    {
        id: 2,
        title: "Summer Rooftop Special",
        venueName: "Barcelona Wine Bar",
        dateTime: "Sat Jun 28 · 10 PM",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80",
        views: "6.1K",
        ratio: "50/50",
        conversionRate: "24.5%",
        performancePercent: 65,
        isBoosted: true,
    },
    {
        id: 3,
        title: "DJ Neon Rave Party",
        venueName: "Barcelona Wine Bar",
        dateTime: "Sun Jun 29 · 11 PM",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
        views: "8.4K",
        ratio: "42/58",
        conversionRate: "31.0%",
        performancePercent: 82,
        isBoosted: false,
    },
    {
        id: 4,
        title: "Craft Beer Tasting",
        venueName: "Barcelona Wine Bar",
        dateTime: "Wed Jul 02 · 7 PM",
        imageUrl: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=600&q=80",
        views: "3.2K",
        ratio: "60/40",
        conversionRate: "15.8%",
        performancePercent: 44,
        isBoosted: false,
    },
    {
        id: 5,
        title: "VIP Cocktail Gala",
        venueName: "Barcelona Wine Bar",
        dateTime: "Thu Jul 03 · 8 PM",
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80",
        views: "5.8K",
        ratio: "48/52",
        conversionRate: "28.4%",
        performancePercent: 75,
        isBoosted: true,
    },
    {
        id: 6,
        title: "Retro 80s Disco Night",
        venueName: "Barcelona Wine Bar",
        dateTime: "Fri Jul 04 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        views: "4.9K",
        ratio: "46/54",
        conversionRate: "20.1%",
        performancePercent: 52,
        isBoosted: false,
    },
];

export function Events() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"events" | "boosted">("events");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: apiEventsData, isLoading } = useGetEventsQuery();
    const createEventMutation = useCreateEventMutation();

    // Map API events to EventCardData, fallback to MOCK_EVENTS if empty/loading for UI dev
    const apiEvents: EventCardData[] = useMemo(() => {
        if (!apiEventsData?.data || apiEventsData.data.length === 0) return MOCK_EVENTS;
        return apiEventsData.data.map((evt: any) => ({
            id: evt._id || evt.id,
            title: evt.name || evt.title || "Unnamed Event",
            venueName: evt.venue?.name || "Barcelona Wine Bar",
            dateTime: evt.date ? new Date(evt.date).toLocaleDateString() : "Fri Jun 27 · 9 PM",
            imageUrl: evt.images?.[0] || MOCK_EVENTS[0].imageUrl,
            views: evt.metrics?.views || "0",
            ratio: evt.metrics?.ratio || "0/0",
            conversionRate: evt.metrics?.conversionRate || "0%",
            performancePercent: evt.metrics?.performancePercent || 0,
            isBoosted: !!evt.isBoosted,
        }));
    }, [apiEventsData]);

    const displayedEvents = activeTab === "events"
        ? apiEvents
        : apiEvents.filter((evt) => evt.isBoosted);

    const handleCreateEvent = async (newEventData: any) => {
        try {
            await createEventMutation.mutateAsync(newEventData);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Failed to create event", error);
            // Fallback for local testing if API fails
            setIsCreateModalOpen(false);
        }
    };

    return (
        <div className="w-full  flex flex-col gap-8 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Section: Header with Events Title, + Create button, and Tab Selector */}
            <EventsPageHeader
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
                onCreateEvent={() => setIsCreateModalOpen(true)}
            />

            {/* 3-Column Events Grid Section */}
            <div className="flex flex-col gap-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
                    {displayedEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onActionClick={(evt) => router.push(`/app/events/${evt.id}`)}
                        />
                    ))}
                </div>
            </div>


            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateEvent}
            />
        </div>
    );
}

export default Events;
