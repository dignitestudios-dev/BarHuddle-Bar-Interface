

"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { EventDetailView, type EventCardData } from "@/features/events/components";


const SAMPLE_EVENTS: Record<string, EventCardData> = {
    "1": {
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
    "2": {
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
    "3": {
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
    "4": {
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
    "5": {
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
    "6": {
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
};

export default function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();

    const event = SAMPLE_EVENTS[resolvedParams.id] || {
        id: Number(resolvedParams.id) || 1,
        title: "Event Details",
        venueName: "Barcelona Wine Bar",
        dateTime: "Fri Jun 27 · 9 PM",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        views: "4.3K",
        ratio: "45/55",
        conversionRate: "18.2%",
        performancePercent: 38,
        isBoosted: false,
    };

    return (
        <main className="w-full min-h-screen px-4 sm:px-6 py-8 flex flex-col gap-8 font-['Manrope',sans-serif]">
            <EventDetailView
                event={event}
                onBack={() => router.push("/app/events")}
            />
        </main>
    );
}
