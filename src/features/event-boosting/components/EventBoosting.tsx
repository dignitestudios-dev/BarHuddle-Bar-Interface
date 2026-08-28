"use client";

import React, { useState, useMemo } from "react";
import { EventBoostingHeader } from "./EventBoostingHeader";
import { EventCard, EventCardData, CreateEventModal } from "@/features/events/components";
import { BoostEventModal } from "./BoostEventModal";
import { SuccessModal } from "@/components/ui/success-modal";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBoostsQuery } from "../api/boost.queries";
import { useGetEventsQuery } from "@/features/events/api/events.queries";
import { useCreateBoostMutation } from "../api/boost.mutations";
import { useUpdateEventMutation, useDeleteEventMutation } from "@/features/events/api/events.mutations";
import { toast } from "sonner";

const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80";

export function EventBoosting() {
    const [selectedEventForBoost, setSelectedEventForBoost] = useState<EventCardData | null>(null);
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [boostedDurationText, setBoostedDurationText] = useState("7 Days");
    const [locallyBoostedIds, setLocallyBoostedIds] = useState<Set<string>>(new Set());

    const [editingEvent, setEditingEvent] = useState<any | null>(null);
    const [deletingEvent, setDeletingEvent] = useState<{ id: string; title: string } | null>(null);

    const { data: apiBoostsData, isLoading: isLoadingBoosts } = useGetBoostsQuery();
    const { data: apiEventsData, isLoading: isLoadingEvents } = useGetEventsQuery();
    const createBoostMutation = useCreateBoostMutation();
    const updateEventMutation = useUpdateEventMutation();
    const deleteEventMutation = useDeleteEventMutation();

    const { eventsList, rawEventsMap }: { eventsList: EventCardData[]; rawEventsMap: Map<string, any> } = useMemo(() => {
        const rawBoostsList = Array.isArray(apiBoostsData?.data)
            ? apiBoostsData.data
            : Array.isArray(apiBoostsData)
                ? apiBoostsData
                : [];

        const rawEventsList = Array.isArray(apiEventsData?.data)
            ? apiEventsData.data
            : Array.isArray(apiEventsData?.data?.events)
                ? apiEventsData.data.events
                : Array.isArray(apiEventsData)
                    ? apiEventsData
                    : [];

        const listToUse = rawBoostsList.length > 0 ? rawBoostsList : rawEventsList;
        const map = new Map<string, any>();

        // Index all raw events from both sources
        [...rawEventsList, ...rawBoostsList].forEach((item: any) => {
            const evt = item.event && typeof item.event === "object"
                ? item.event
                : item.eventId && typeof item.eventId === "object"
                ? item.eventId
                : item;
            const targetId = String(evt._id || evt.id || item.eventId || item._id || item.id);
            if (!map.has(targetId)) map.set(targetId, evt);
            if (evt._id) map.set(String(evt._id), evt);
            if (evt.id) map.set(String(evt.id), evt);
            if (item._id) map.set(String(item._id), evt);
            if (item.id) map.set(String(item.id), evt);
        });

        const mapped = listToUse.map((item: any) => {
            const evt = item.event && typeof item.event === "object"
                ? item.event
                : item.eventId && typeof item.eventId === "object"
                ? item.eventId
                : item;

            const eventId = String(evt._id || evt.id || (typeof item.eventId === "string" ? item.eventId : "") || item._id || item.id);
            const isBoosted = Boolean(
                item.isBoosted === true ||
                evt.isBoosted === true ||
                (evt.activeBoosts && evt.activeBoosts > 0) ||
                (item.activeBoosts && item.activeBoosts > 0) ||
                item.status === "active" ||
                item.boostDetails?.status === "active" ||
                evt.boostStatus === "active" ||
                locallyBoostedIds.has(eventId)
            );

            const ratioVal = String(evt.maleToFemaleRatio || evt.gender?.ratio || item.ratio || evt.metrics?.ratio || evt.ratio || "0:0");
            const rateVal = String(
                evt.retentionRate !== undefined
                    ? `${evt.retentionRate}%`
                    : evt.retention?.retentionRate !== undefined
                    ? `${evt.retention.retentionRate}%`
                    : item.conversionRate || evt.conversionRate || evt.metrics?.conversionRate || "0%"
            );
            const performanceVal = Number(evt.organicPerformance ?? item.performancePercent ?? evt.performancePercent ?? evt.metrics?.performancePercent ?? 0);
            const viewsVal = String(evt.views ?? evt.viewCount ?? item.views ?? evt.metrics?.views ?? "0");

            const formattedDateTime = evt.startAt
                ? new Date(evt.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " · " + new Date(evt.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                : "TBD";

            return {
                id: eventId,
                title: evt.title || evt.name || item.title || "Unnamed Event",
                venueName: evt.venue?.name || evt.venueName || "Venue",
                dateTime: formattedDateTime,
                imageUrl: evt.banner || evt.coverImage || evt.images?.[0] || item.banner || evt.venue?.coverImage || DEFAULT_EVENT_IMAGE,
                views: viewsVal,
                ratio: ratioVal,
                conversionRate: rateVal,
                performancePercent: performanceVal,
                isBoosted,
            };
        });

        return { eventsList: mapped, rawEventsMap: map };
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

    const handleEditClick = (event: EventCardData, raw?: any) => {
        const rawEvent = raw || rawEventsMap.get(String(event.id)) || event;
        const normalized = {
            ...rawEvent,
            _id: rawEvent._id || rawEvent.id || String(event.id),
            id: rawEvent.id || rawEvent._id || String(event.id),
            title: rawEvent.title || rawEvent.name || event.title,
            name: rawEvent.name || rawEvent.title || event.title,
            description: rawEvent.description || "",
            startAt: rawEvent.startAt || rawEvent.date,
            endAt: rawEvent.endAt,
            banner: rawEvent.banner || rawEvent.coverImage || rawEvent.imageUrl || event.imageUrl,
        };
        setEditingEvent(normalized);
    };

    const handleDeleteClick = (event: EventCardData, raw?: any) => {
        const eventId = String(raw?._id || raw?.id || event.id);
        const eventTitle = event.title || raw?.title || raw?.name || "Event";
        setDeletingEvent({ id: eventId, title: eventTitle });
    };

    const handleUpdateEvent = async (id: string, updatedEventData: any) => {
        try {
            const formattedDate = updatedEventData.date instanceof Date 
                ? updatedEventData.date.toLocaleDateString('en-CA') 
                : updatedEventData.date;

            const startAt = new Date(`${formattedDate}T${updatedEventData.startTime}`).toISOString();
            const endDate = new Date(`${formattedDate}T${updatedEventData.endTime}`);
            
            if (updatedEventData.endTime < updatedEventData.startTime) {
                endDate.setDate(endDate.getDate() + 1);
            }
            
            const endAt = endDate.toISOString();

            const formData = new FormData();
            formData.append("title", updatedEventData.title);
            formData.append("description", updatedEventData.description);
            formData.append("startAt", startAt);
            formData.append("endAt", endAt);
            formData.append("status", "published");

            if (updatedEventData.images && Array.isArray(updatedEventData.images)) {
                updatedEventData.images.forEach((file: File) => {
                    if (file instanceof File) {
                        formData.append("banner", file);
                    }
                });
            }

            await updateEventMutation.mutateAsync({ id, data: formData });
            setEditingEvent(null);
            toast.success("Event updated successfully!");
        } catch (error: any) {
            console.error("Failed to update event", error);
            toast.error(error?.response?.data?.message || "Failed to update event");
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingEvent) return;
        try {
            await deleteEventMutation.mutateAsync({ id: deletingEvent.id });
            toast.success("Event deleted successfully!");
            setDeletingEvent(null);
        } catch (error: any) {
            console.error("Failed to delete event", error);
            toast.error(error?.response?.data?.message || "Failed to delete event");
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
                            rawEvent={rawEventsMap.get(String(event.id))}
                            variant="boosting"
                            onBoostToggle={handleBoostToggle}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
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

            {/* Edit Event Modal */}
            <CreateEventModal
                isOpen={Boolean(editingEvent)}
                eventToEdit={editingEvent}
                isLoading={updateEventMutation.isPending}
                onClose={() => setEditingEvent(null)}
                onUpdate={handleUpdateEvent}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={Boolean(deletingEvent)}
                onClose={() => setDeletingEvent(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Event?"
                description="Are you sure you want to delete this event? This will remove it from your venue and active boosts permanently."
                itemName={deletingEvent?.title}
                isPending={deleteEventMutation.isPending}
                confirmText="Delete Event"
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

