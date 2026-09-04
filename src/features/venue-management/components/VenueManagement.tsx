"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ClaimVenuesBanner } from "./ClaimVenuesBanner";
import { VenueCard, type VenueCardData } from "./VenueCard";
import { VenueDetailView } from "./VenueDetailView";
import { ClaimFormModal } from "./ClaimFormModal";

import { useMyVenuesQuery, useVenueDetailsQuery } from "../api/venue.queries";
import { useAppSelector } from "@/store";

export function VenueManagement() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = Number(searchParams?.get("page")) || 1;
    const limit = Number(searchParams?.get("limit")) || 10;
    const search = searchParams?.get("search") || "";

    const { user } = useAppSelector((state) => state.auth);

    const [searchInput, setSearchInput] = useState(search);
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [selectedVenueCard, setSelectedVenueCard] = useState<any>(null);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [venueToClaim, setVenueToClaim] = useState<any>(null);

    // Call venue details API (GET /venue-owner/venues/:id) when View Details is clicked
    const {
        data: fetchedVenueDetails,
        isLoading: isLoadingVenueDetails,
        isFetching: isFetchingVenueDetails,
        refetch: refetchVenueDetails,
    } = useVenueDetailsQuery(selectedVenueId || "");

    const handleViewDetails = (v: any) => {
        const id = v._id || v.id || v.placeId || "";
        setSelectedVenueId(id);
        setSelectedVenueCard(v);
    };

    const activeVenue = useMemo(() => {
        if (!selectedVenueId && !selectedVenueCard) return null;

        const base = selectedVenueCard || {};
        const details: any = fetchedVenueDetails;

        if (!details) return base;

        return {
            ...base,
            id: details._id || details.id || base.id,
            _id: details._id || base._id,
            placeId: details.placeId || base.placeId,
            title: details.name || details.title || base.title,
            name: details.name || base.name,
            category: details.category || base.category,
            address: details.address || base.address,
            rating: details.rating !== undefined ? details.rating : base.rating,
            coverImage: details.coverImage || base.coverImage,
            imageUrl: details.coverImage || details.imageUrl || base.imageUrl,
            images: (Array.isArray(details.images) && details.images.length > 0)
                ? details.images
                : (Array.isArray(base.images) && base.images.length > 0)
                ? base.images
                : (details.coverImage ? [details.coverImage] : []),
            operatingHours: (Array.isArray(details.operatingHours) && details.operatingHours.length > 0)
                ? details.operatingHours
                : base.operatingHours || [],
            location: details.location || base.location,
            isClaimed: details.isClaimed !== undefined ? details.isClaimed : base.isClaimed,
            demographics: base.demographics || {
                male: details.gender?.malePercent ?? details.gender?.male ?? 0,
                female: details.gender?.femalePercent ?? details.gender?.female ?? 0,
                nonBinary: details.gender?.nonBinaryPercent ?? details.gender?.nonBinary ?? 0,
            },
            totalGoing: details.totalGoing ?? base.totalGoing,
            capacity: details.capacity || base.capacity,
        };
    }, [selectedVenueId, selectedVenueCard, fetchedVenueDetails]);

    const handleOpenClaim = (v: any) => {
        setVenueToClaim(v);
        setIsClaimModalOpen(true);
    };

    const isFirstLogin = pathname === "/venue-management";

    const {
        data: venues,
        isLoading,
        isError,
        isFetching,
        refetch: refetchVenues,
    } = useMyVenuesQuery(
        page,
        limit,
        search,
        // false // isClaimed = false
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (searchInput.trim()) {
            params.set("search", searchInput.trim());
        } else {
            params.delete("search");
        }
        params.set("page", "1"); // Reset to page 1 on new search
        router.push(`${pathname}?${params.toString()}`);
    };

    const displayVenues: VenueCardData[] = venues && venues.length > 0
        ? venues.map((v: any) => ({
            id: v._id || v.id,
            _id: v._id,
            placeId: v.placeId,
            title: v.name || v.title || "Unnamed Venue",
            name: v.name,
            category: v.category || "venue",
            address: v.address || "Unknown Location",
            capacity: v.totalGoing !== undefined ? `${v.totalGoing} Going` : undefined,
            totalGoing: v.totalGoing ?? 0,
            imageUrl: v.coverImage || (v.images && v.images.length > 0 ? v.images[0] : ""),
            coverImage: v.coverImage,
            images: v.images || [],
            icon: v.icon,
            iconBackgroundColor: v.iconBackgroundColor,
            rating: typeof v.rating === "number" ? v.rating : undefined,
            isClaimed: Boolean(v.isClaimed),
            hasStories: Boolean(v.hasStories),
            storiesCount: v.storiesCount || 0,
            popularityCount: v.popularityCount || 0,
            isFavorite: Boolean(v.isFavorite),
            gender: v.gender,
            demographics: {
                male: v.gender?.malePercent ?? v.gender?.male ?? 0,
                female: v.gender?.femalePercent ?? v.gender?.female ?? 0,
                nonBinary: v.gender?.nonBinaryPercent ?? v.gender?.nonBinary ?? 0,
            },
            friendsGoing: v.friendsGoing || [],
            otherUsersCount: v.otherUsersCount || 0,
            location: v.location,
            operatingHours: v.operatingHours || [],
        }))
        : [];

    return (
        <div className={`w-full min-h-screen flex flex-col items-center justify-start bg-transparent font-['Manrope',sans-serif] animate-in fade-in zoom-in-95 duration-500 ${isFirstLogin ? "pt-8 sm:pt-12" : "pt-4 sm:pt-6"} pb-16 px-4`}>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED] opacity-[0.15] blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E8FF57] opacity-[0.05] blur-[120px] pointer-events-none" />

            <main className="relative w-full max-w-[1200px] flex flex-col gap-8 sm:gap-10 z-10">
                {isFirstLogin ? (
                    <>
                        {/* Header Section for First Login Onboarding */}
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
                    </>
                ) : (
                    /* Top Header for Venue Management Tab */
                    <div className="w-full flex flex-col gap-1">
                        <h1 className="font-extrabold text-[32px] sm:text-[36px] leading-[40px] sm:leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                            Venue Management
                        </h1>
                        <p className="text-[#9D8FD0] text-[14px] sm:text-[15px]">
                            Browse, search, and manage all venues in BarHuddle.
                        </p>
                    </div>
                )}

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
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-white">
                            {search?.trim() ? "Search Results" : "Available Venues"}
                        </h2>
                        {search?.trim() && displayVenues.length > 0 && (
                            <span className="text-xs font-semibold text-[#C4B5FD] bg-[rgba(124,58,237,0.2)] px-3 py-1 rounded-full border border-[rgba(124,58,237,0.3)]">
                                {displayVenues.length} {displayVenues.length === 1 ? "Venue" : "Venues"}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full place-items-center sm:place-items-center">
                        {!search?.trim() ? (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center gap-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex items-center justify-center text-[#7C3AED] mb-2 shadow-[0_0_24px_rgba(124,58,237,0.2)]">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-extrabold text-white tracking-tight">Search to Find Your Venue</h3>
                                <p className="text-[#9D8FD0] text-sm max-w-[420px] leading-relaxed">
                                    Enter the name or location of your venue in the search bar above to view and claim available venues.
                                </p>
                            </div>
                        ) : isLoading || isFetching ? (
                            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-[482px] w-full rounded-[22px] bg-[#140E50]/65 border border-[rgba(124,58,237,0.25)] p-4 flex flex-col gap-4 animate-pulse">
                                        <div className="w-full h-[220px] rounded-xl bg-purple-900/30" />
                                        <div className="h-6 w-3/4 bg-purple-900/40 rounded" />
                                        <div className="h-4 w-1/2 bg-purple-900/30 rounded" />
                                        <div className="mt-auto h-10 w-full bg-purple-900/40 rounded-xl" />
                                    </div>
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="col-span-full py-12 flex items-center justify-center text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20 w-full">
                                Failed to load venues. Please try again.
                            </div>
                        ) : displayVenues.length === 0 ? (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-[rgba(124,58,237,0.1)] flex items-center justify-center text-[#7C3AED] mb-2">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    No Venues Found
                                </h3>
                                <p className="text-[#9D8FD0] text-sm max-w-[400px]">
                                    We couldn't find any unclaimed venues matching "{search}". Try searching for another name or location.
                                </p>
                            </div>
                        ) : (
                            displayVenues.map((venue, idx) => (
                                <VenueCard
                                    key={`${venue.id}-${idx}`}
                                    venue={venue}
                                    onViewDetails={handleViewDetails}
                                    onClaim={handleOpenClaim}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Global Fullscreen Detail Modal */}
            {selectedVenueId && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#05033A] overflow-y-auto animate-in fade-in duration-200">
                    <div className="w-full min-h-screen px-4 py-6 sm:p-10 max-w-[1200px] mx-auto">
                        {isLoadingVenueDetails && !activeVenue ? (
                            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 text-white">
                                <div className="w-12 h-12 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
                                <span className="text-sm font-semibold text-[#9D8FD0]">
                                    Fetching venue details from server...
                                </span>
                            </div>
                        ) : activeVenue ? (
                            <div className="relative w-full">
                                {isFetchingVenueDetails && (
                                    <div className="fixed top-4 right-6 z-[110] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(124,58,237,0.85)] border border-[rgba(124,58,237,0.5)] backdrop-blur-md text-[11px] font-bold text-white shadow-xl animate-in fade-in">
                                        <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        <span>Refreshing live details...</span>
                                    </div>
                                )}
                                <VenueDetailView
                                    venue={activeVenue as any}
                                    onBack={() => {
                                        setSelectedVenueId(null);
                                        setSelectedVenueCard(null);
                                    }}
                                    onClaim={handleOpenClaim}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Global Claim Form Modal */}
            <ClaimFormModal
                isOpen={isClaimModalOpen}
                venue={venueToClaim}
                onClose={() => {
                    setIsClaimModalOpen(false);
                    setVenueToClaim(null);
                }}
                onSubmitted={() => {
                    refetchVenues();
                    if (selectedVenueId) {
                        refetchVenueDetails();
                    }
                    setIsClaimModalOpen(false);
                    setVenueToClaim(null);
                }}
            />
        </div>
    );
}

export default VenueManagement;
