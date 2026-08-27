"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EventsPageHeader } from "./EventsPageHeader";
import { EventCard, EventCardData } from "./EventCard";
import { CreateEventModal } from "./CreateEventModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEventsQuery, useGetBoostedEventsQuery } from "../api/events.queries";
import { useCreateEventMutation } from "../api/events.mutations";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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

    const { data: apiEventsData, isLoading: isLoadingEvents } = useGetEventsQuery();
    const { data: apiBoostedData, isLoading: isLoadingBoosted } = useGetBoostedEventsQuery(1, 10);
    const createEventMutation = useCreateEventMutation();
    const user = useSelector((state: RootState) => state.auth.user);

    // Map API events from /venue-owner/events
    const regularEvents: EventCardData[] = useMemo(() => {
        if (!apiEventsData?.data || !Array.isArray(apiEventsData.data)) return [];
        return apiEventsData.data.map((evt: any) => ({
            id: evt._id || evt.id,
            title: evt.name || evt.title || "Unnamed Event",
            venueName: evt.venue?.name || "Venue",
            dateTime: evt.startAt 
                ? new Date(evt.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " · " + new Date(evt.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                : "TBD",
            imageUrl: evt.banner || evt.coverImage || evt.images?.[0] || MOCK_EVENTS[0].imageUrl,
            views: evt.metrics?.views || evt.views || "0",
            ratio: evt.metrics?.ratio || "0/0",
            conversionRate: evt.metrics?.conversionRate || "0%",
            performancePercent: evt.metrics?.performancePercent || 0,
            isBoosted: Boolean(evt.isBoosted === true || (evt.activeBoosts && evt.activeBoosts > 0)),
        }));
    }, [apiEventsData]);

    // Map API boosted events from /venue-owner/boosts
    const boostedEventsFromApi: EventCardData[] = useMemo(() => {
        if (!apiBoostedData?.data || !Array.isArray(apiBoostedData.data)) return [];
        return apiBoostedData.data
            .filter((item: any) => {
                const evt = item.event || item;
                return item.isBoosted === true || evt.isBoosted === true || item.status === "active" || (evt.activeBoosts && evt.activeBoosts > 0);
            })
            .map((item: any) => {
                const evt = item.event || item;
                return {
                    id: evt._id || evt.id,
                    title: evt.name || evt.title || "Boosted Event",
                    venueName: evt.venue?.name || "Venue",
                    dateTime: evt.startAt 
                        ? new Date(evt.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " · " + new Date(evt.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                        : "TBD",
                    imageUrl: evt.banner || evt.coverImage || evt.images?.[0] || MOCK_EVENTS[0].imageUrl,
                    views: evt.metrics?.views || item.views || evt.views || "0",
                    ratio: evt.metrics?.ratio || item.ratio || "0/0",
                    conversionRate: evt.metrics?.conversionRate || item.conversionRate || "0%",
                    performancePercent: evt.metrics?.performancePercent || item.performancePercent || 0,
                    isBoosted: true,
                };
            });
    }, [apiBoostedData]);

    // Tab display logic
    const displayedEvents = useMemo(() => {
        if (activeTab === "events") {
            // In Events tab: ONLY show events where isBoosted is FALSE
            const unboosted = regularEvents.filter((evt) => !evt.isBoosted);
            if (apiEventsData?.data) return unboosted;
            return MOCK_EVENTS.filter((evt) => !evt.isBoosted);
        } else {
            // In Boosted Events tab: ONLY show events where isBoosted is TRUE
            const boostedFromRegular = regularEvents.filter((evt) => evt.isBoosted);
            const combinedMap = new Map();
            [...boostedFromRegular, ...boostedEventsFromApi].forEach((item) => {
                if (item.isBoosted === true) {
                    combinedMap.set(item.id, item);
                }
            });
            const result = Array.from(combinedMap.values());
            if (result.length > 0) return result;
            if (!apiEventsData?.data && !apiBoostedData?.data) {
                return MOCK_EVENTS.filter((evt) => evt.isBoosted);
            }
            return [];
        }
    }, [activeTab, regularEvents, boostedEventsFromApi, apiEventsData, apiBoostedData]);

    const isCurrentTabLoading = activeTab === "events" ? isLoadingEvents : isLoadingBoosted;

    const handleCreateEvent = async (newEventData: any) => {
        try {
            // newEventData.date is a Date object from the Shadcn calendar
            // Format it to YYYY-MM-DD to combine with the time picker string (HH:mm)
            const formattedDate = newEventData.date instanceof Date 
                ? newEventData.date.toLocaleDateString('en-CA') // YYYY-MM-DD locally
                : newEventData.date;

            const startAt = new Date(`${formattedDate}T${newEventData.startTime}`).toISOString();
            const endDate = new Date(`${formattedDate}T${newEventData.endTime}`);
            
            // If the end time is numerically smaller than start time (e.g. 22:00 vs 02:00), it's likely the next day
            if (newEventData.endTime < newEventData.startTime) {
                endDate.setDate(endDate.getDate() + 1);
            }
            
            const endAt = endDate.toISOString();

            // The venueId is now guaranteed by the form validation
            const venueId = newEventData.venueId;

            const formData = new FormData();
            formData.append("venueId", venueId);
            formData.append("title", newEventData.title);
            formData.append("description", newEventData.description);
            formData.append("startAt", startAt);
            formData.append("endAt", endAt);
            formData.append("status", "published");

            // Append each file to 'banner' array
            if (newEventData.images && Array.isArray(newEventData.images)) {
                newEventData.images.forEach((file: File) => {
                    formData.append("banner", file);
                });
            }

            await createEventMutation.mutateAsync(formData);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Failed to create event", error);
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
                {isCurrentTabLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-[380px] w-full rounded-[24px]" />
                        ))}
                    </div>
                ) : displayedEvents.length === 0 ? (
                    <div className="w-full py-16 flex flex-col items-center justify-center gap-3 border border-[rgba(124,58,237,0.2)] rounded-[24px] bg-[#0E093C]/50 text-center">
                        <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg text-white capitalize">
                            No {activeTab === "boosted" ? "Boosted Events" : "Events"} Found
                        </h3>
                        <p className="text-sm text-purple-200/60 max-w-sm">
                            {activeTab === "boosted"
                                ? "There are currently no boosted events active for your venue."
                                : "Create your first event or boost an existing event to see it here."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
                        {displayedEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onActionClick={(evt) => router.push(`/app/events/${evt.id}`)}
                            />
                        ))}
                    </div>
                )}
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
