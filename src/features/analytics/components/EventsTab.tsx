"use client";

import React from "react";
import { EventAnalyticsCard, EventTagConfig } from "./EventAnalyticsCard";
import { EventAttendanceTrendChart } from "@/components/charts/EventAttendanceTrendChart";
import { TopPerformingEventsCard } from "@/components/charts/TopPerformingEventsCard";
import TrafficByTimeChart from "@/components/charts/TrafficByTimeChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEventsAnalyticsQuery } from "../api/analytics.queries";

export interface EventItemData {
    id: string;
    title: string;
    date: string;
    image: string;
    tag: EventTagConfig;
    attendees: number;
    engagement: number;
}

export function EventsTab() {
    const { data: eventsAnalytics, isLoading } = useGetEventsAnalyticsQuery();
    const data = eventsAnalytics?.data;

    const eventsList: EventItemData[] = React.useMemo(() => {
        if (!data?.eventPerformance || !Array.isArray(data.eventPerformance) || data.eventPerformance.length === 0) {
            return [];
        }
        return data.eventPerformance.map((item: any, idx: number) => ({
            id: item._id || item.id || `evt-${idx}`,
            title: item.title || "Event",
            date: item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "TBD",
            image: item.image || "/images/event-ladies-night.png",
            tag: { label: "Top", icon: "⭐", variant: "top" },
            attendees: item.attendees || 0,
            engagement: item.engagement || 0,
        }));
    }, [data]);

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
                <div className="w-full max-w-[1200px] flex gap-4 overflow-x-auto pb-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="w-[320px] h-[180px] rounded-[24px] shrink-0" />
                    ))}
                </div>
                <div className="max-w-[1200px] w-full flex flex-col lg:flex-row gap-6 items-stretch">
                    <Skeleton className="h-[380px] flex-1 w-full rounded-[24px]" />
                    <Skeleton className="h-[380px] w-full lg:w-[340px] rounded-[24px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Cards Section */}
            <div className="w-full max-w-[1200px]">
                {eventsList.length === 0 ? (
                    <div className="w-full py-12 flex flex-col items-center justify-center gap-2 border border-dashed border-[rgba(124,58,237,0.2)] rounded-[24px] bg-[#0E093C]/50 text-center">
                        <span className="font-semibold text-white/70">No event analytics available</span>
                        <span className="text-xs text-white/40">Events created will show analytics cards here.</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2">
                        {eventsList.map((event) => (
                            <EventAnalyticsCard
                                key={event.id}
                                title={event.title}
                                date={event.date}
                                image={event.image}
                                tag={event.tag}
                                attendees={event.attendees}
                                engagement={event.engagement}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Lower Charts Row */}
            <div className="max-w-[1200px] w-full flex flex-col lg:flex-row gap-6 items-stretch">
                <EventAttendanceTrendChart className="flex-1 max-w-full" />
                <TopPerformingEventsCard className="w-full lg:w-[320px] xl:w-[340px] shrink-0" />
            </div>
            <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                <TrafficByTimeChart className="flex-1 max-w-full" />
            </div>
        </div>
    );
}

export default EventsTab;
