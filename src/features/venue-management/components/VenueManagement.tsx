"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ClaimVenuesBanner } from "./ClaimVenuesBanner";
import { VenueCard, type VenueCardData } from "./VenueCard";

const SAMPLE_VENUES: VenueCardData[] = [
    {
        id: 1,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 60, female: 25, nonBinary: 15 },
    },
    {
        id: 2,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 60, female: 25, nonBinary: 15 },
    },
    {
        id: 3,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 60, female: 25, nonBinary: 15 },
    },
    {
        id: 4,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 40, female: 45, nonBinary: 15 },
    },
    {
        id: 5,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 60, female: 25, nonBinary: 15 },
    },
    {
        id: 6,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        address: "1622 14th St NW, Washington, DC",
        capacity: "~ 25",
        imageUrl: "/images/venue-barcelona.png",
        demographics: { male: 60, female: 25, nonBinary: 15 },
    },
];

import { useMyVenuesQuery } from "../api/venue.queries";

export function VenueManagement() {
    const router = useRouter();
    const { data: venues, isLoading, isError } = useMyVenuesQuery();

    const displayVenues = venues && venues.length > 0 
        ? venues.map((v, i) => ({
            id: v.id,
            title: v.name,
            category: "Venue", // fallback if no category in schema
            address: v.location || "Unknown Location",
            capacity: "~ 50", // fallback
            imageUrl: "/images/venue-barcelona.png",
            demographics: { male: 50, female: 50, nonBinary: 0 },
        })) 
        : SAMPLE_VENUES; // fallback to sample if no data yet

    return (
        <div className="w-full flex flex-col font-['Manrope',sans-serif]">
            <main className="w-full min-h-screen px-6 py-8 flex flex-col gap-8 font-['Manrope',sans-serif]">
                {/* Top Claim Your Venues Banner */}
                <ClaimVenuesBanner />

                {/* Venues Grid - 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ">
                    {isLoading ? (
                        <div className="text-white">Loading venues...</div>
                    ) : isError ? (
                        <div className="text-red-400">Failed to load venues.</div>
                    ) : (
                        displayVenues.map((venue, idx) => (
                            <VenueCard
                                key={`${venue.id}-${idx}`}
                                venue={venue as any}
                                onViewDetails={(v) => router.push(`/app/venue-management/${v.id}`)}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default VenueManagement;
