"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ClaimVenuesBanner } from "./ClaimVenuesBanner";
import { VenueCard, type VenueCardData } from "./VenueCard";
import { VenueDetailView } from "./VenueDetailView";
import { ClaimFormModal } from "./ClaimFormModal";
import { ClaimPendingDialog } from "./ClaimPendingDialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { useMyVenuesQuery, useVenueDetailsQuery, useMyClaimsQuery } from "../api/venue.queries";
import { useAppSelector } from "@/store";
import { addPendingClaimId, getPendingClaimIds, recordVenueClaimed } from "../utils/claims";

export function VenueManagement() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = Number(searchParams?.get("page")) || 1;
    const limit = Number(searchParams?.get("limit")) || 12;
    const search = searchParams?.get("search") || "";

    const { user } = useAppSelector((state) => state.auth);

    const [searchInput, setSearchInput] = useState(search);
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [selectedVenueCard, setSelectedVenueCard] = useState<any>(null);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [venueToClaim, setVenueToClaim] = useState<any>(null);
    const [pendingSuccessVenue, setPendingSuccessVenue] = useState<any>(null);
    const [claimsVersion, setClaimsVersion] = useState(0);

    // Listen to local claim submission events and storage changes so status updates instantly across components
    React.useEffect(() => {
        const handleClaimsChange = () => setClaimsVersion((prev) => prev + 1);
        window.addEventListener("barhuddle_claim_submitted", handleClaimsChange);
        window.addEventListener("storage", handleClaimsChange);
        return () => {
            window.removeEventListener("barhuddle_claim_submitted", handleClaimsChange);
            window.removeEventListener("storage", handleClaimsChange);
        };
    }, []);

    // Call venue details API (GET /venue-owner/venues/:id) when View Details is clicked
    const {
        data: fetchedVenueDetails,
        isLoading: isLoadingVenueDetails,
        isFetching: isFetchingVenueDetails,
        refetch: refetchVenueDetails,
    } = useVenueDetailsQuery(selectedVenueId || "");

    const { data: rawClaims, refetch: refetchClaims } = useMyClaimsQuery();

    // Track both pending and approved claims from /venue-owner/claims and local storage
    const { pendingVenueIds, approvedVenueIds } = useMemo(() => {
        const pendingSet = new Set<string>(getPendingClaimIds());
        const approvedSet = new Set<string>();

        const claimsArr = Array.isArray(rawClaims) ? rawClaims : (rawClaims as any)?.data || [];
        if (Array.isArray(claimsArr)) {
            claimsArr.forEach((c: any) => {
                const status = String(c?.status || "").toLowerCase();
                const targetId = String(
                    typeof c?.venueId === "string"
                        ? c.venueId
                        : c?.venueId?._id || c?.venueId?.id || c?.venue?._id || c?.venue?.id || c?.placeId || c?.venue?.placeId || ""
                );
                const venueName = c?.venue?.name || c?.venue?.title || c?.name;
                const nameKey = (venueName && typeof venueName === "string" && venueName.trim())
                    ? `name:${venueName.trim().toLowerCase()}`
                    : "";

                if (status === "approved" || status === "claimed") {
                    if (targetId) approvedSet.add(targetId);
                    if (c?.venue?._id) approvedSet.add(String(c.venue._id));
                    if (c?.venue?.id) approvedSet.add(String(c.venue.id));
                    if (c?.placeId) approvedSet.add(String(c.placeId));
                    if (c?.venue?.placeId) approvedSet.add(String(c.venue.placeId));
                    if (nameKey) approvedSet.add(nameKey);
                } else if (status === "pending" || status === "under_review" || status === "submitted" || !status) {
                    if (targetId) pendingSet.add(targetId);
                    if (c?.venue?._id) pendingSet.add(String(c.venue._id));
                    if (c?.venue?.id) pendingSet.add(String(c.venue.id));
                    if (c?.placeId) pendingSet.add(String(c.placeId));
                    if (c?.venue?.placeId) pendingSet.add(String(c.venue.placeId));
                    if (nameKey) pendingSet.add(nameKey);
                }
            });
        }

        // If a venue is in approvedSet, ensure it is not treated as pending
        approvedSet.forEach((id) => pendingSet.delete(id));

        return { pendingVenueIds: pendingSet, approvedVenueIds: approvedSet };
    }, [rawClaims, claimsVersion]);

    const handleViewDetails = (v: any) => {
        const id = v._id || v.id || v.placeId || "";
        setSelectedVenueId(id);
        setSelectedVenueCard(v);
    };

    const activeVenue = useMemo(() => {
        if (!selectedVenueId && !selectedVenueCard) return null;

        const base = selectedVenueCard || {};
        const details: any = fetchedVenueDetails;

        const vId = String(details?._id || details?.id || base?._id || base?.id || base?.placeId || "");
        const baseName = (details?.name || details?.title || base?.name || base?.title || "").trim().toLowerCase();

        const isApproved = Boolean(
            approvedVenueIds.has(vId) ||
            (base?._id && approvedVenueIds.has(String(base._id))) ||
            (base?.id && approvedVenueIds.has(String(base.id))) ||
            (base?.placeId && approvedVenueIds.has(String(base.placeId))) ||
            (baseName && approvedVenueIds.has(`name:${baseName}`)) ||
            base?.isClaimed ||
            base?.claimStatus === "approved" ||
            base?.status === "approved" ||
            details?.isClaimed ||
            details?.claimStatus === "approved" ||
            details?.status === "approved"
        );

        const isPending = !isApproved && Boolean(
            pendingVenueIds.has(vId) ||
            (base?._id && pendingVenueIds.has(String(base._id))) ||
            (base?.id && pendingVenueIds.has(String(base.id))) ||
            (base?.placeId && pendingVenueIds.has(String(base.placeId))) ||
            (baseName && pendingVenueIds.has(`name:${baseName}`)) ||
            base?.isPending ||
            base?.claimStatus === "pending" ||
            details?.status === "pending" ||
            details?.claimStatus === "pending"
        );

        const claimStatus = isApproved ? "approved" : isPending ? "pending" : (details?.claimStatus || base?.claimStatus || (isApproved ? "approved" : undefined));

        if (!details) {
            return {
                ...base,
                isClaimed: isApproved,
                isPending,
                claimStatus,
            };
        }

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
            isClaimed: isApproved || Boolean(details.isClaimed),
            isPending,
            claimStatus,
            demographics: base.demographics || {
                male: details.gender?.malePercent ?? details.gender?.male ?? 0,
                female: details.gender?.femalePercent ?? details.gender?.female ?? 0,
                nonBinary: details.gender?.nonBinaryPercent ?? details.gender?.nonBinary ?? 0,
            },
            totalGoing: details.totalGoing ?? base.totalGoing,
            capacity: details.capacity || base.capacity,
        };
    }, [selectedVenueId, selectedVenueCard, fetchedVenueDetails, pendingVenueIds, approvedVenueIds]);

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
        "list"
        // false // isClaimed = false
    );

    // Sync local searchInput if search param changes (e.g. browser navigation)
    React.useEffect(() => {
        setSearchInput(search);
    }, [search]);

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

    const handleClearSearch = () => {
        setSearchInput("");
        if (search) {
            const params = new URLSearchParams(searchParams?.toString() || "");
            params.delete("search");
            params.set("page", "1");
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const venueList: any[] = useMemo(() => {
        if (!venues) return [];
        if (Array.isArray(venues)) return venues;
        if (Array.isArray(venues.data)) return venues.data;
        if (Array.isArray(venues.venues)) return venues.venues;
        return [];
    }, [venues]);

    const paginationData = useMemo(() => {
        const rawTotal =
            venues?.pagination?.totalItems ??
            venues?.pagination?.total ??
            venues?.pagination?.totalCount ??
            venues?.pagination?.count ??
            venues?.totalItems ??
            venues?.totalCount ??
            venues?.count;

        const rawPages =
            venues?.pagination?.pages ??
            venues?.pagination?.totalPages ??
            venues?.totalPages ??
            venues?.pages;

        const totalPages = rawPages
            ? Number(rawPages)
            : rawTotal
            ? Math.max(1, Math.ceil(Number(rawTotal) / limit))
            : 1;

        const total = rawTotal
            ? Number(rawTotal)
            : totalPages > 1
            ? (venues?.total && venues.total > venueList.length ? venues.total : totalPages * limit)
            : (venues?.total ?? venueList.length);

        const currentPage = Number(venues?.pagination?.page ?? venues?.page ?? page) || 1;
        return { total, totalPages, currentPage };
    }, [venues, venueList.length, limit, page]);

    // Truncate pagination buttons to prevent horizontal overflow on large page counts (e.g. 1 2 3 ... 355)
    const visiblePages = useMemo(() => {
        const total = paginationData.totalPages;
        const current = paginationData.currentPage;

        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        if (current <= 4) {
            return [1, 2, 3, 4, 5, "...", total];
        }

        if (current >= total - 3) {
            return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
        }

        return [1, "...", current - 1, current, current + 1, "...", total];
    }, [paginationData.totalPages, paginationData.currentPage]);

    const displayVenues: VenueCardData[] = venueList && venueList.length > 0
        ? venueList.map((v: any) => {
            const vId = String(v._id || v.id || v.placeId || "");
            const vName = (v.name || v.title || "").trim().toLowerCase();

            const isApproved = Boolean(
                approvedVenueIds.has(vId) ||
                (v._id && approvedVenueIds.has(String(v._id))) ||
                (v.id && approvedVenueIds.has(String(v.id))) ||
                (v.placeId && approvedVenueIds.has(String(v.placeId))) ||
                (vName && approvedVenueIds.has(`name:${vName}`)) ||
                v.isClaimed === true ||
                v.claimStatus === "approved" ||
                v.status === "approved"
            );

            const isPending = !isApproved && Boolean(
                pendingVenueIds.has(vId) ||
                (v._id && pendingVenueIds.has(String(v._id))) ||
                (v.id && pendingVenueIds.has(String(v.id))) ||
                (v.placeId && pendingVenueIds.has(String(v.placeId))) ||
                (vName && pendingVenueIds.has(`name:${vName}`)) ||
                v.status === "pending" ||
                v.claimStatus === "pending" ||
                v.isPending === true
            );

            const claimStatus = isApproved ? "approved" : isPending ? "pending" : (v.claimStatus || (v.isClaimed ? "approved" : undefined));

            return {
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
                isClaimed: isApproved,
                claimStatus,
                status: isApproved ? "approved" : isPending ? "pending" : v.status,
                isPending,
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
            };
        })
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
                    <div className="absolute left-4 text-[#9D8FD0] pointer-events-none">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for your venue by name or location..."
                        className={`w-full h-14 pl-12 ${searchInput ? "pr-36" : "pr-32"} rounded-full bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.3)] text-white placeholder:text-[#9D8FD0]/60 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all`}
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-28 p-1.5 rounded-full text-[#9D8FD0] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all flex items-center justify-center"
                            title="Clear search"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
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
                                {paginationData.total} {paginationData.total === 1 ? "Venue" : "Venues"}
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

                    {/* Pagination Controls */}
                    {paginationData.totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 pt-6 mt-4 border-t border-[rgba(124,58,237,0.2)] flex-wrap w-full">
                            <span className="text-xs font-medium text-[#8B7EC8]">
                                Page {paginationData.currentPage} of {paginationData.totalPages}
                                {paginationData.total > 0 && ` (${paginationData.total} ${paginationData.total === 1 ? "venue" : "venues"})`}
                            </span>

                            <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(Math.max(1, paginationData.currentPage - 1))}
                                    disabled={paginationData.currentPage <= 1}
                                    className="px-3 py-1.5 rounded-xl border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.05)] hover:bg-[rgba(124,58,237,0.15)] text-[#8B7EC8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition-all"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Previous</span>
                                </button>

                                {visiblePages.map((item, i) => {
                                    if (item === "...") {
                                        return (
                                            <span
                                                key={`ellipsis-${i}`}
                                                className="w-8 h-8 flex items-center justify-center text-[#8B7EC8] text-xs font-bold select-none"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    const pageNum = Number(item);
                                    const isActive = pageNum === paginationData.currentPage;

                                    return (
                                        <button
                                            key={`page-${pageNum}`}
                                            type="button"
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                                isActive
                                                    ? "bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-md ring-1 ring-[#A78BFA]/50"
                                                    : "text-[#8B7EC8] hover:text-white hover:bg-white/10"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={() => handlePageChange(Math.min(paginationData.totalPages, paginationData.currentPage + 1))}
                                    disabled={paginationData.currentPage >= paginationData.totalPages}
                                    className="px-3 py-1.5 rounded-xl border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.05)] hover:bg-[rgba(124,58,237,0.15)] text-[#8B7EC8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition-all"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
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
                                    onClaimSubmitted={(submittedVenue?: any) => {
                                        const targetVenue = submittedVenue || activeVenue || selectedVenueCard;
                                        if (targetVenue) {
                                            recordVenueClaimed(targetVenue);
                                        }
                                        if (selectedVenueId) {
                                            addPendingClaimId(selectedVenueId);
                                        }
                                        setIsClaimModalOpen(false);
                                        setVenueToClaim(null);
                                        setPendingSuccessVenue(targetVenue);
                                    }}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Global Claim Form Modal */}
            <ClaimFormModal
                isOpen={isClaimModalOpen}
                venue={venueToClaim || selectedVenueCard || activeVenue}
                onClose={() => {
                    setIsClaimModalOpen(false);
                    setVenueToClaim(null);
                }}
                onSubmitted={(submittedVenue?: any) => {
                    const targetVenue = submittedVenue || venueToClaim || selectedVenueCard || activeVenue;
                    if (targetVenue) {
                        recordVenueClaimed(targetVenue);
                    }
                    if (selectedVenueId) {
                        addPendingClaimId(selectedVenueId);
                    }
                    setIsClaimModalOpen(false);
                    setVenueToClaim(null);
                    setPendingSuccessVenue(targetVenue);
                }}
            />

            {/* Global Claim Pending Confirmation Dialog */}
            <ClaimPendingDialog
                isOpen={Boolean(pendingSuccessVenue)}
                venueName={pendingSuccessVenue?.title || pendingSuccessVenue?.name || "your bar"}
                onOk={() => {
                    setPendingSuccessVenue(null);
                    setSelectedVenueId(null);
                    setSelectedVenueCard(null);
                    refetchVenues();
                    refetchClaims();
                }}
            />
        </div>
    );
}

export default VenueManagement;
