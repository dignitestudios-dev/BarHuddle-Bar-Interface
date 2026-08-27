"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ClaimVenuesBanner } from "./ClaimVenuesBanner";
import { VenueCard, type VenueCardData } from "./VenueCard";
import { VenueDetailView } from "./VenueDetailView";
import { ClaimFormModal } from "./ClaimFormModal";

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
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAppSelector } from "@/store";

export function VenueManagement() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams?.get("page")) || 1;
    const limit = Number(searchParams?.get("limit")) || 10;
    const search = searchParams?.get("search") || "";
    
    const { user } = useAppSelector((state) => state.auth);

    const [searchInput, setSearchInput] = useState(search);
    const [selectedVenue, setSelectedVenue] = useState<any>(null);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [venueToClaim, setVenueToClaim] = useState<any>(null);

    const handleOpenClaim = (v: any) => {
        setVenueToClaim(v);
        setIsClaimModalOpen(true);
    };

    const { data: venues, isLoading, isError, isFetching } = useMyVenuesQuery(page, limit, search);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (searchInput.trim()) {
            params.set("search", searchInput.trim());
        } else {
            params.delete("search");
        }
        params.set("page", "1"); // Reset to page 1 on new search
        router.push(`/venue-management?${params.toString()}`);
    };

    const displayVenues = venues && venues.length > 0
        ? venues.map((v: any, i) => ({
            id: v._id || v.id,
            title: v.name,
            category: v.category?.replace("_", " ") || "Venue",
            address: v.address || "Unknown Location",
            capacity: "~ 50", // fallback
            imageUrl: v.coverImage,
            demographics: { male: 50, female: 50, nonBinary: 0 },
        }))
        : [];

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start bg-transparent font-['Manrope',sans-serif] animate-in fade-in zoom-in-95 duration-500 pt-8 sm:pt-12 pb-16 px-4">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED] opacity-[0.15] blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E8FF57] opacity-[0.05] blur-[120px] pointer-events-none" />

            <main className="relative w-full max-w-[1200px] flex flex-col gap-10 z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center gap-3 w-full">
                    <h1 className="font-extrabold text-[40px] sm:text-[48px] leading-[48px] sm:leading-[56px] text-white tracking-tight drop-shadow-md">
                        Let's Get Started
                    </h1>
                    <p className="text-[#9D8FD0] text-[15px] sm:text-[16px] max-w-[600px] mx-auto">
                        Welcome to BarHuddle! Find and claim your venues below to unlock your exclusive dashboard and management tools.
                    </p>
                </div>

                {/* Top Claim Your Venues Banner */}
                <ClaimVenuesBanner className="mx-auto w-full" />

                {/* Search Bar Section */}
                <form onSubmit={handleSearch} className="w-full max-w-[600px] mx-auto relative flex items-center">
                    <div className="absolute left-4 text-[#9D8FD0]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for your venue by name or location..."
                        className="w-full h-14 pl-12 pr-32 rounded-full bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.3)] text-white placeholder:text-[#9D8FD0]/60 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 h-10 px-6 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white font-semibold text-sm hover:brightness-110 active:scale-95 transition-all"
                    >
                        Search
                    </button>
                </form>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.3)] to-transparent" />

                {/* Venues Grid */}
                <div className="flex flex-col  gap-4">
                    <h2 className="text-xl font-bold text-white mb-2">Available Venues</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full place-items-center sm:place-items-center">
                        {!search ? (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-[rgba(124,58,237,0.1)] flex items-center justify-center text-[#7C3AED] mb-2">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Search to Find Your Venue</h3>
                                <p className="text-[#9D8FD0] text-sm max-w-[400px]">
                                    Enter the name or location of your venue in the search bar above to claim it.
                                </p>
                            </div>
                        ) : isLoading || isFetching ? (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4">
                                <div className="w-10 h-10 border-4 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
                                <span className="text-[#9D8FD0] font-medium">Discovering venues...</span>
                            </div>
                        ) : isError ? (
                            <div className="col-span-full py-12 flex items-center justify-center text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20 w-full">
                                Failed to load venues. Please try again.
                            </div>
                        ) : displayVenues.length === 0 ? (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 text-center">
                                <h3 className="text-xl font-bold text-white">No Venues Found</h3>
                                <p className="text-[#9D8FD0] text-sm max-w-[400px]">
                                    We couldn't find any venues matching "{search}". Try a different name or location.
                                </p>
                            </div>
                        ) : (
                            displayVenues.map((venue, idx) => (
                                <VenueCard
                                    key={`${venue.id}-${idx}`}
                                    venue={venue as any}
                                    onViewDetails={(v) => setSelectedVenue(v)}
                                    onClaim={handleOpenClaim}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Global Fullscreen Detail Modal */}
            {selectedVenue && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#05033A] overflow-y-auto animate-in fade-in duration-200">
                    <div className="w-full min-h-screen px-4 py-6 sm:p-10 max-w-[1200px] mx-auto">
                        <VenueDetailView
                            venue={selectedVenue as any}
                            onBack={() => setSelectedVenue(null)}
                            onClaim={handleOpenClaim}
                        />
                    </div>
                </div>
            )}

            {/* Global Claim Form Modal */}
            <ClaimFormModal
                isOpen={isClaimModalOpen}
                venue={venueToClaim}
                onClose={() => setIsClaimModalOpen(false)}
                onSubmitted={() => {
                    // Navigate to pending screen if claim is pending
                    if (user?.isClaimed === "pending" || !user?.isClaimed) {
                        router.push("/auth/pending-approval");
                    } else if (user?.isClaimed === "approved") {
                        router.push("/app/dashboard");
                    } else {
                        router.push("/auth/pending-approval");
                    }
                }}
            />
        </div>
    );
}

export default VenueManagement;
