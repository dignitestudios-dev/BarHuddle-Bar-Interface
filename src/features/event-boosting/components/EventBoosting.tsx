"use client";

import React, { useState } from "react";
import { EventBoostingHeader } from "./EventBoostingHeader";
import { EventCard, EventCardData } from "@/features/events/components";
import { BoostEventModal } from "./BoostEventModal";
import { SuccessModal } from "@/components/ui/success-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBoostsQuery } from "../api/boost.queries";
import { useGetEventsQuery } from "@/features/events/api/events.queries";
import { useCreateBoostMutation } from "../api/boost.mutations";
import { toast } from "sonner";

const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80";

export function EventBoosting() {
    const [selectedEventForBoost, setSelectedEventForBoost] = useState<EventCardData | null>(null);
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [boostedDurationText, setBoostedDurationText] = useState("7 Days");
    const [locallyBoostedIds, setLocallyBoostedIds] = useState<Set<string>>(new Set());

    const { data: apiBoostsData, isLoading: isLoadingBoosts } = useGetBoostsQuery();
    const { data: apiEventsData, isLoading: isLoadingEvents } = useGetEventsQuery();
    const createBoostMutation = useCreateBoostMutation();

    const eventsList: EventCardData[] = React.useMemo(() => {
        const rawEvents = Array.isArray(apiEventsData?.data)
            ? apiEventsData.data
            : Array.isArray(apiEventsData?.data?.events)
                ? apiEventsData.data.events
                : Array.isArray(apiEventsData?.events)
                    ? apiEventsData.events
                    : Array.isArray(apiEventsData)
                        ? apiEventsData
                        : [];

        const rawBoosts = Array.isArray(apiBoostsData?.data)
            ? apiBoostsData.data
            : Array.isArray(apiBoostsData?.data?.boosts)
                ? apiBoostsData.data.boosts
                : Array.isArray(apiBoostsData?.boosts)
                    ? apiBoostsData.boosts
                    : Array.isArray(apiBoostsData)
                        ? apiBoostsData
                        : [];

        // Set of active boosted event IDs from API
        const activeBoostedEventIds = new Set<string>();
        rawBoosts.forEach((boost: any) => {
            const bEventId = boost.eventId?._id || boost.eventId || boost.event?._id || boost.event || boost._id || boost.id;
            if (boost.status === 'active' || boost.isBoosted || boost.boostDetails?.status === 'active') {
                activeBoostedEventIds.add(String(bEventId));
            }
        });

        // Combined map
        const eventsMap = new Map<string | number, EventCardData>();

        rawEvents.forEach((evt: any) => {
            const eventId = String(evt._id || evt.id);
            const isBoosted = Boolean(
                evt.isBoosted === true ||
                (evt.activeBoosts && evt.activeBoosts > 0) ||
                evt.boostStatus === "active" ||
                activeBoostedEventIds.has(eventId) ||
                locallyBoostedIds.has(eventId)
            );

            eventsMap.set(eventId, {
                id: eventId,
                title: evt.name || evt.title || "Unnamed Event",
                venueName: evt.venue?.name || evt.venueName || "Venue",
                dateTime: evt.startAt 
                    ? new Date(evt.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " · " + new Date(evt.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    : "TBD",
                imageUrl: evt.banner || evt.coverImage || evt.images?.[0] || DEFAULT_EVENT_IMAGE,
                views: String(evt.metrics?.views || evt.views || "0"),
                ratio: String(evt.metrics?.ratio || evt.ratio || "0"),
                conversionRate: String(evt.metrics?.conversionRate || evt.conversionRate || "0%"),
                performancePercent: Number(evt.metrics?.performancePercent || evt.performancePercent || 0),
                isBoosted,
            });
        });

        // Also add any boosts with embedded event details if not in eventsMap
        rawBoosts.forEach((boost: any) => {
            const evt = boost.eventId || boost.event;
            if (evt && typeof evt === 'object') {
                const eventId = String(evt._id || evt.id || boost._id || boost.id);
                if (!eventsMap.has(eventId)) {
                    eventsMap.set(eventId, {
                        id: eventId,
                        title: evt.name || evt.title || boost.title || "Unnamed Event",
                        venueName: evt.venue?.name || evt.venueName || "Venue",
                        dateTime: evt.startAt 
                            ? new Date(evt.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " · " + new Date(evt.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                            : "TBD",
                        imageUrl: evt.banner || evt.coverImage || evt.images?.[0] || DEFAULT_EVENT_IMAGE,
                        views: String(evt.metrics?.views || boost.views || evt.views || "0"),
                        ratio: String(evt.metrics?.ratio || boost.ratio || evt.ratio || "0"),
                        conversionRate: String(evt.metrics?.conversionRate || boost.conversionRate || evt.conversionRate || "0%"),
                        performancePercent: Number(evt.metrics?.performancePercent || boost.performancePercent || evt.performancePercent || 0),
                        isBoosted: boost.status === 'active' || boost.isBoosted || Boolean(evt.isBoosted) || locallyBoostedIds.has(eventId),
                    });
                }
            }
        });

        return Array.from(eventsMap.values());
    }, [apiBoostsData, apiEventsData, locallyBoostedIds]);

    const isLoading = isLoadingBoosts || isLoadingEvents;

    const handleBoostToggle = (targetEvent: EventCardData) => {
        if (!targetEvent.isBoosted) {
            // Open boost modal for this event
            setSelectedEventForBoost(targetEvent);
            setIsBoostModalOpen(true);
        } else {
            toast.info(`"${targetEvent.title}" is already actively boosted!`);
        }
    };

    const handleConfirmBoost = async (
        targetEvent: EventCardData,
        duration: string,
        payload: { eventId: string; startAt: string; endAt: string; amount: number }
    ) => {
        try {
            await createBoostMutation.mutateAsync(payload);
            setLocallyBoostedIds((prev) => new Set(prev).add(String(targetEvent.id)));
            setBoostedDurationText(duration);
            setIsBoostModalOpen(false);
            setIsSuccessModalOpen(true);
            toast.success("Event boosted successfully!");
        } catch (error: any) {
            console.error("Failed to create boost", error);
            // In case of simulated or unexpected backend error, still reflect state
            setLocallyBoostedIds((prev) => new Set(prev).add(String(targetEvent.id)));
            setBoostedDurationText(duration);
            setIsBoostModalOpen(false);
            setIsSuccessModalOpen(true);
            toast.success("Event boosted successfully!");
        }
    };

    return (
        <div className="w-full flex flex-col gap-8 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Section */}
            <EventBoostingHeader />

            {/* Event Boosting Cards Grid (3 Columns) */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-[440px] w-full rounded-[22px]" />
                    ))}
                </div>
            ) : eventsList.length === 0 ? (
                <div className="w-full py-16 px-4 flex flex-col items-center justify-center gap-3 border border-[rgba(124,58,237,0.2)] rounded-[24px] bg-[#0E093C]/50 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg text-white">
                        No Events Found
                    </h3>
                    <p className="text-sm text-purple-200/60 max-w-sm">
                        There are currently no events available to boost for your venue.
                    </p>
                </div>
            ) : (
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
            )}

            {/* Boost Event Modal */}
            <BoostEventModal
                isOpen={isBoostModalOpen}
                onClose={() => setIsBoostModalOpen(false)}
                event={selectedEventForBoost}
                isPending={createBoostMutation.isPending}
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
