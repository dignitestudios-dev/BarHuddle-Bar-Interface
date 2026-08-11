"use client";

import React from "react";
import { EventAnalyticsCard, EventTagConfig } from "./EventAnalyticsCard";
import { EventAttendanceTrendChart } from "@/components/charts/EventAttendanceTrendChart";
import { TopPerformingEventsCard } from "@/components/charts/TopPerformingEventsCard";
import TrafficByTimeChart from "@/components/charts/TrafficByTimeChart";

export interface EventItemData {
    id: string;
    title: string;
    date: string;
    image: string;
    tag: EventTagConfig;
    attendees: number;
    engagement: number;
}

const EVENTS_DATA: EventItemData[] = [
    {
        id: "ladies-night",
        title: "Ladies Night",
        date: "Jun 20",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        tag: { label: "Top", icon: "⭐", variant: "top" },
        attendees: 284,
        engagement: 91,
    },
    {
        id: "live-dj-experience",
        title: "Live DJ Experience",
        date: "Jun 21",
        image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=600&q=80",
        tag: { label: "Sold Out", icon: "🔥", variant: "soldOut" },
        attendees: 512,
        engagement: 87,
    },
    {
        id: "cocktail-tasting-1",
        title: "Cocktail Tasting",
        date: "Jun 22",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
        tag: { label: "Growing", icon: "↗️", variant: "growing" },
        attendees: 96,
        engagement: 78,
    },
    {
        id: "karaoke-night",
        title: "Karaoke Night",
        date: "Jun 26",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
        tag: { label: "Upcoming", icon: "📅", variant: "upcoming" },
        attendees: 148,
        engagement: 83,
    },
    {
        id: "cocktail-tasting-2",
        title: "Cocktail Tasting",
        date: "Jun 22",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
        tag: { label: "Growing", icon: "↗️", variant: "growing" },
        attendees: 96,
        engagement: 78,
    },
];

export function EventsTab() {
    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Cards Section: Loop over EVENTS_DATA */}
            <div className="w-full max-w-[1200px]">
                <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2">
                    {EVENTS_DATA.map((event) => (
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
            </div>

            {/* Lower Charts Row: Event Attendance Trend Chart + Top Performing Events Card */}
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
