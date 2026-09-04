"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { EventsPageHeader } from "./EventsPageHeader";
import { EventCard, EventCardData } from "./EventCard";
import { CreateEventModal } from "./CreateEventModal";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEventsQuery, useGetBoostedEventsQuery } from "../api/events.queries";
import { useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from "../api/events.mutations";
import { useGetOwnerVenuesQuery } from "@/features/venue-management/api/venue.queries";
import { useAppSelector } from "@/store";
import { useSelectedVenue } from "@/hooks/useSelectedVenue";
import { cleanImageUrl } from "@/utils/image";
import { toast } from "sonner";

const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80";

export function Events() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get("tab")?.toLowerCase();
    const activeTab: "events" | "boosted" = tabParam === "boosted" || tabParam === "boost" ? "boosted" : "events";

    const handleTabChange = (newTab: "events" | "boosted") => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("tab", newTab);
        const queryStr = params.toString();
        router.push(`${pathname}?${queryStr}`);
    };


    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any | null>(null);
    const [deletingEvent, setDeletingEvent] = useState<{ id: string; title: string } | null>(null);
    const user = useAppSelector((state) => state.auth.user);
    const { selectedVenueId } = useSelectedVenue();
    const { data: apiEventsData, isLoading: isLoadingEvents } = useGetEventsQuery({
        page: 1,
        limit: 10,
        ...(selectedVenueId ? { venueId: selectedVenueId } : {}),
    });
    const { data: apiBoostedData, isLoading: isLoadingBoosted } = useGetBoostedEventsQuery({
        page: 1,
        limit: 10,
        ...(selectedVenueId ? { venueId: selectedVenueId } : {}),
    });
    const { data: ownerVenuesData } = useGetOwnerVenuesQuery();

    const primaryVenueId = useMemo(() => {
        if (selectedVenueId) return selectedVenueId;
        const rawVenues = Array.isArray((ownerVenuesData as any)?.data)
            ? (ownerVenuesData as any).data
            : Array.isArray((ownerVenuesData as any)?.venues)
                ? (ownerVenuesData as any).venues
                : Array.isArray(ownerVenuesData)
                    ? ownerVenuesData
                    : [];
        const first = rawVenues[0];
        return first?.venue?._id || first?.venue?.id || first?._id || first?.id || (user as any)?.venueId || (user as any)?.claimedVenueId || "";
    }, [selectedVenueId, ownerVenuesData, user]);

    const createEventMutation = useCreateEventMutation();
    const updateEventMutation = useUpdateEventMutation();
    const deleteEventMutation = useDeleteEventMutation();

    // Map regular events from API
    const { regularEvents, rawEventsMap } = useMemo(() => {
        const rawEvents = Array.isArray(apiEventsData?.data) 
            ? apiEventsData.data 
            : Array.isArray(apiEventsData?.events) 
                ? apiEventsData.events 
                : Array.isArray(apiEventsData) 
                    ? apiEventsData 
                    : [];

        const map = new Map<string, any>();
        const mappedList: EventCardData[] = rawEvents.map((evt: any) => {
            const id = String(evt._id || evt.id);
            map.set(id, evt);
            if (evt._id) map.set(String(evt._id), evt);
            if (evt.id) map.set(String(evt.id), evt);

            const ratioVal = String(evt.maleToFemaleRatio || evt.gender?.ratio || evt.metrics?.ratio || evt.ratio || "0:0");
            const rateVal = String(
                evt.retentionRate !== undefined
                    ? `${evt.retentionRate}%`
                    : evt.retention?.retentionRate !== undefined
                    ? `${evt.retention.retentionRate}%`
                    : evt.conversionRate || evt.metrics?.conversionRate || "0%"
            );
            const performanceVal = Number(evt.organicPerformance ?? evt.performancePercent ?? evt.metrics?.performancePercent ?? 0);
            const attendeesVal = String(
                evt.retention?.totalAttendees ??
                evt.attendance ??
                evt.attendees ??
                evt.attendeeCount ??
                evt.views ??
                evt.viewCount ??
                evt.metrics?.attendance ??
                evt.metrics?.attendees ??
                evt.metrics?.views ??
                "0"
            );

            return {
                id,
                title: evt.name || evt.title || "Unnamed Event",
                venueName: evt.venue?.name || evt.venueName || "Venue",
                dateTime: evt.startAt 
                    ? new Date(evt.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " · " + new Date(evt.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    : "TBD",
                imageUrl: cleanImageUrl(evt.banner || evt.bannerUrl || evt.banners?.[0] || evt.imageUrl, DEFAULT_EVENT_IMAGE),
                views: attendeesVal,
                attendees: attendeesVal,
                ratio: ratioVal,
                conversionRate: rateVal,
                retentionRate: rateVal,
                performancePercent: performanceVal,
                isBoosted: Boolean(evt.isBoosted === true || (evt.activeBoosts && evt.activeBoosts > 0) || evt.boostStatus === "active"),
                computedStatus: evt.computedStatus || evt.status,
                status: evt.status,
            };
        });

        // Also index boosted events from apiBoostedData
        const rawBoosts = Array.isArray(apiBoostedData?.data)
            ? apiBoostedData.data
            : Array.isArray(apiBoostedData?.data?.boosts)
                ? apiBoostedData.data.boosts
                : Array.isArray(apiBoostedData?.boosts)
                    ? apiBoostedData.boosts
                    : Array.isArray(apiBoostedData)
                        ? apiBoostedData
                        : [];

        rawBoosts.forEach((item: any) => {
            const evt = item.event && typeof item.event === "object"
                ? item.event
                : item.eventId && typeof item.eventId === "object"
                ? item.eventId
                : item;

            const targetId = String(evt._id || evt.id || item.eventId || item._id || item.id);
            if (!map.has(targetId)) {
                map.set(targetId, evt);
            }
            if (evt._id) map.set(String(evt._id), evt);
            if (evt.id) map.set(String(evt.id), evt);
            if (item._id) map.set(String(item._id), evt);
            if (item.id) map.set(String(item.id), evt);
        });

        return { regularEvents: mappedList, rawEventsMap: map };
    }, [apiEventsData, apiBoostedData]);

    // Map API boosted events from /venue-owner/boosts
    const boostedEventsFromApi: EventCardData[] = useMemo(() => {
        const rawBoosts = Array.isArray(apiBoostedData?.data)
            ? apiBoostedData.data
            : Array.isArray(apiBoostedData?.data?.boosts)
                ? apiBoostedData.data.boosts
                : Array.isArray(apiBoostedData?.boosts)
                    ? apiBoostedData.boosts
                    : Array.isArray(apiBoostedData)
                        ? apiBoostedData
                        : [];

        if (!rawBoosts || rawBoosts.length === 0) return [];

        return rawBoosts
            .map((item: any) => {
                const evt = item.event && typeof item.event === "object"
                    ? item.event
                    : item.eventId && typeof item.eventId === "object"
                    ? item.eventId
                    : item;

                const isItemBoosted = item.isBoosted === true || evt.isBoosted === true || item.status === "active" || (evt.activeBoosts && evt.activeBoosts > 0);
                if (!isItemBoosted && item.status !== undefined && item.status !== "active") return null;

                const eventRealId = String(evt._id || evt.id || (typeof item.eventId === "string" ? item.eventId : "") || item._id || item.id);

                const ratioVal = String(evt.maleToFemaleRatio || evt.gender?.ratio || item.ratio || evt.metrics?.ratio || evt.ratio || "0:0");
                const rateVal = String(
                    evt.retentionRate !== undefined
                        ? `${evt.retentionRate}%`
                        : evt.retention?.retentionRate !== undefined
                        ? `${evt.retention.retentionRate}%`
                        : item.conversionRate || evt.conversionRate || evt.metrics?.conversionRate || "0%"
                );
                const performanceVal = Number(evt.organicPerformance ?? item.performancePercent ?? evt.performancePercent ?? evt.metrics?.performancePercent ?? 0);
                const attendeesVal = String(
                    evt.retention?.totalAttendees ??
                    item.retention?.totalAttendees ??
                    evt.attendance ??
                    evt.attendees ??
                    item.attendance ??
                    item.attendees ??
                    evt.views ??
                    evt.viewCount ??
                    item.views ??
                    evt.metrics?.views ??
                    "0"
                );

                return {
                    id: eventRealId,
                    title: evt.name || evt.title || item.title || "Boosted Event",
                    venueName: evt.venue?.name || evt.venueName || "Venue",
                    dateTime: evt.startAt 
                        ? new Date(evt.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " · " + new Date(evt.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                        : "TBD",
                    imageUrl: cleanImageUrl(evt.banner || item.banner || evt.bannerUrl || evt.imageUrl, DEFAULT_EVENT_IMAGE),
                    views: attendeesVal,
                    attendees: attendeesVal,
                    ratio: ratioVal,
                    conversionRate: rateVal,
                    retentionRate: rateVal,
                    performancePercent: performanceVal,
                    isBoosted: true,
                    computedStatus: evt.computedStatus || item.computedStatus || evt.status || item.status,
                    status: evt.status || item.status,
                };
            })
            .filter((item: any): item is EventCardData => item !== null);
    }, [apiBoostedData]);

    // Tab display logic
    const displayedEvents = useMemo(() => {
        if (activeTab === "events") {
            return regularEvents.filter((evt) => !evt.isBoosted);
        } else {
            const boostedFromRegular = regularEvents.filter((evt) => evt.isBoosted);
            const combinedMap = new Map<string | number, EventCardData>();
            [...boostedFromRegular, ...boostedEventsFromApi].forEach((item) => {
                if (item.isBoosted === true) {
                    combinedMap.set(item.id, item);
                }
            });
            return Array.from(combinedMap.values());
        }
    }, [activeTab, regularEvents, boostedEventsFromApi]);

    const isCurrentTabLoading = activeTab === "events" ? isLoadingEvents : (isLoadingBoosted || isLoadingEvents);

    const handleCreateEvent = async (newEventData: any) => {
        try {
            const venueId = newEventData.venueId || primaryVenueId;
            const formattedDate = newEventData.date instanceof Date 
                ? newEventData.date.toLocaleDateString('en-CA') 
                : newEventData.date;

            const startAt = new Date(`${formattedDate}T${newEventData.startTime}`).toISOString();
            const endDate = new Date(`${formattedDate}T${newEventData.endTime}`);
            
            if (newEventData.endTime < newEventData.startTime) {
                endDate.setDate(endDate.getDate() + 1);
            }
            
            const endAt = endDate.toISOString();

            const formData = new FormData();
            if (venueId) {
                formData.append("venueId", venueId);
            }
            formData.append("title", newEventData.title);
            formData.append("description", newEventData.description);
            formData.append("startAt", startAt);
            formData.append("endAt", endAt);
            formData.append("status", "published");

            if (newEventData.images && Array.isArray(newEventData.images)) {
                newEventData.images.forEach((file: File) => {
                    if (file instanceof File) {
                        formData.append("banner", file);
                    }
                });
            }

            await createEventMutation.mutateAsync(formData);
            setIsCreateModalOpen(false);
            toast.success("Event created successfully!");
        } catch (error: any) {
            console.error("Failed to create event", error);
            toast.error(error?.response?.data?.message || "Failed to create event");
            throw error;
        }
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
            // Explicitly DO NOT append venueId on edit
            formData.append("title", updatedEventData.title);
            formData.append("description", updatedEventData.description);
            formData.append("startAt", startAt);
            formData.append("endAt", endAt);
            formData.append("status", "published");

            // Append remaining existing banner URLs under 'banner' key as strings (strictly capped to 5)
            const MAX_IMAGES = 5;
            const existingBanners: string[] = (updatedEventData.existingBanners || []).slice(0, MAX_IMAGES);
            existingBanners.forEach((url: string) => {
                if (typeof url === "string" && url.trim()) {
                    formData.append("banner", String(url).trim());
                }
            });

            // Append newly uploaded File objects under 'banner' key (up to remaining slots)
            const remainingSlots = Math.max(0, MAX_IMAGES - existingBanners.length);
            if (updatedEventData.images && Array.isArray(updatedEventData.images)) {
                const newFiles = updatedEventData.images
                    .filter((file: any) => file instanceof File)
                    .slice(0, remainingSlots);
                newFiles.forEach((file: File) => {
                    formData.append("banner", file);
                });
            }

            await updateEventMutation.mutateAsync({ id, data: formData });
            setEditingEvent(null);
            toast.success("Event updated successfully!");
        } catch (error: any) {
            console.error("Failed to update event", error);
            toast.error(error?.response?.data?.message || "Failed to update event");
            throw error;
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
            // Pass raw banners array so the modal shows all existing thumbnails
            banners: rawEvent.banners || rawEvent.banner || rawEvent.bannerUrl || rawEvent.imageUrl,
        };
        setEditingEvent(normalized);
    };

    const handleDeleteClick = (event: EventCardData, raw?: any) => {
        const eventId = String(raw?._id || raw?.id || event.id);
        const eventTitle = event.title || raw?.title || raw?.name || "Event";
        setDeletingEvent({ id: eventId, title: eventTitle });
    };

    return (
        <div className="w-full flex flex-col gap-8 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Section: Header with Events Title, + Create button, and Tab Selector */}
            <EventsPageHeader
                activeTab={activeTab}
                onTabChange={handleTabChange}
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
                    <div className="w-full py-16 px-4 flex flex-col items-center justify-center gap-3 border border-[rgba(124,58,237,0.2)] rounded-[24px] bg-[#0E093C]/50 text-center">
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
                                rawEvent={rawEventsMap.get(String(event.id))}
                                onActionClick={(evt) => router.push(`/app/events/${evt.id}`)}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={isCreateModalOpen}
                venueId={primaryVenueId}
                isLoading={createEventMutation.isPending}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateEvent}
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
                description="Are you sure you want to delete this event? This will remove it from your venue and search listings permanently."
                itemName={deletingEvent?.title}
                isPending={deleteEventMutation.isPending}
                confirmText="Delete Event"
            />
        </div>
    );
}

export default Events;
