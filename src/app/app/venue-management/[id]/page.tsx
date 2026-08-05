"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { VenueDetailView } from "@/components/venues/VenueDetailView";
import { type VenueCardData } from "@/components/venues/VenueCard";

const SAMPLE_VENUES: Record<string, VenueCardData> = {
    "1": {
        id: 1,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 60, female: 25, nonBinary: 15 },
    },
    "2": {
        id: 2,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 60, female: 25, nonBinary: 15 },
    },
};

export default function VenueDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();

    const venue = SAMPLE_VENUES[resolvedParams.id] || {
        id: Number(resolvedParams.id) || 1,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 60, female: 25, nonBinary: 15 },
    };

    return (
        <main className="w-full min-h-screen px-6 py-8 flex flex-col gap-8 font-['Manrope',sans-serif]">
            <VenueDetailView
                venue={venue}
                onBack={() => router.push("/app/venue-management")}
            />
        </main>
    );
}
