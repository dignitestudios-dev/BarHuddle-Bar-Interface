"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    useGetOwnerVenuesQuery,
    useMyClaimsQuery,
    useVenueDetailsQuery,
    useOperatingHoursQuery,
} from "@/features/venue-management/api/venue.queries";
import { EditVenueModal } from "./EditVenueModal";
import { OperatingHoursModal } from "./OperatingHoursModal";
import { UploadGalleryModal } from "./UploadGalleryModal";
import { DeleteGalleryConfirmModal } from "./DeleteGalleryConfirmModal";
import { VenueSwitcherDropdown } from "./VenueSwitcherDropdown";
import { cleanImageUrl, DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";
import { useAppSelector } from "@/store";
import { toast } from "sonner";

const DAYS_MAP = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseGalleryItem(item: any, index: number): { id: string; url: string } {
    if (!item) return { id: String(index), url: "" };

    if (typeof item === "object") {
        const id = item._id || item.id || item.imageId || item.public_id || String(index);
        const url = item.url || item.imageUrl || item.secure_url || item.path || "";
        return { id, url };
    }

    if (typeof item === "string") {
        if (/^[a-fA-F0-9]{24}$/.test(item)) {
            return { id: item, url: item };
        }
        const googleMatch = item.match(/\/photos\/([^/?]+)/);
        if (googleMatch && googleMatch[1] && googleMatch[1] !== "media") {
            return { id: googleMatch[1], url: item };
        }
        const parts = item.split("/");
        const lastPart = parts[parts.length - 1]?.split("?")[0];
        if (lastPart && lastPart !== "media") {
            return { id: lastPart, url: item };
        }
        if (lastPart === "media" && parts.length >= 2) {
            const prevPart = parts[parts.length - 2]?.split("?")[0];
            if (prevPart) return { id: prevPart, url: item };
        }
        return { id: item, url: item };
    }

    return { id: String(index), url: "" };
}

export function MyVenueView() {
    const { user } = useAppSelector((state) => state.auth);

    // Queries
    const {
        data: rawOwnerVenues,
        isLoading: isLoadingVenues,
        refetch: refetchOwnerVenues,
    } = useGetOwnerVenuesQuery();

    const {
        data: rawClaims,
    } = useMyClaimsQuery();

    // Consolidate list of claimed venues from owner venues API, claims API, and user.venue
    const venuesList = useMemo(() => {
        const list: any[] = [];
        const seen = new Set<string>();

        const addVenue = (v: any) => {
            if (!v) return;
            const id = v._id || v.id;
            if (id && !seen.has(id)) {
                seen.add(id);
                list.push(v);
            }
        };

        // 1. From /venue-owner/venues
        if (Array.isArray(rawOwnerVenues)) {
            rawOwnerVenues.forEach(addVenue);
        } else if (rawOwnerVenues && typeof rawOwnerVenues === "object") {
            const dataArr = (rawOwnerVenues as any).data || (rawOwnerVenues as any).venues;
            if (Array.isArray(dataArr)) dataArr.forEach(addVenue);
            else addVenue(rawOwnerVenues);
        }

        // 2. From /venue-owner/claims
        const claimsArr = Array.isArray(rawClaims) ? rawClaims : (rawClaims as any)?.data || [];
        if (Array.isArray(claimsArr)) {
            claimsArr.forEach((c: any) => {
                if (c.status === "approved" && c.venue) {
                    addVenue(c.venue);
                } else if (c.venueId && typeof c.venueId === "object") {
                    addVenue(c.venueId);
                }
            });
        }

        // 3. From user profile venue in Redux
        if (user?.venue) {
            addVenue(user.venue);
        }

        return list;
    }, [rawOwnerVenues, rawClaims, user]);

    // Active selected venue
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedVenueId && venuesList.length > 0) {
            setSelectedVenueId(venuesList[0]._id || venuesList[0].id);
        }
    }, [venuesList, selectedVenueId]);

    const activeVenueId = selectedVenueId || (venuesList.length > 0 ? (venuesList[0]._id || venuesList[0].id) : "");

    // Query active venue full details
    const {
        data: rawVenueDetails,
        isLoading: isLoadingDetails,
        refetch: refetchDetails,
    } = useVenueDetailsQuery(activeVenueId);

    // Query operating hours
    const {
        data: rawOperatingHours,
        isLoading: isLoadingHours,
        refetch: refetchHours,
    } = useOperatingHoursQuery(activeVenueId);

    // Normalize venue data
    const activeVenue = useMemo(() => {
        if (!activeVenueId) return null;
        const details = (rawVenueDetails as any)?.data || rawVenueDetails;
        if (details && (details._id === activeVenueId || details.id === activeVenueId)) {
            return details;
        }
        return venuesList.find((v) => (v._id || v.id) === activeVenueId) || null;
    }, [rawVenueDetails, activeVenueId, venuesList]);

    // Normalize operating hours
    const operatingHours = useMemo(() => {
        const fromApi = (rawOperatingHours as any)?.data || rawOperatingHours;
        if (Array.isArray(fromApi) && fromApi.length > 0) return fromApi;
        if (Array.isArray(activeVenue?.operatingHours) && activeVenue.operatingHours.length > 0) {
            return activeVenue.operatingHours;
        }
        return [];
    }, [rawOperatingHours, activeVenue]);

    // Gallery Items Parsing
    const galleryItems = useMemo(() => {
        const list: { id: string; url: string; raw: any }[] = [];
        const seenUrls = new Set<string>();

        const addImg = (raw: any, idx: number) => {
            const parsed = parseGalleryItem(raw, idx);
            if (!parsed.url || seenUrls.has(parsed.url)) return;
            seenUrls.add(parsed.url);
            list.push({ ...parsed, raw });
        };

        if (Array.isArray(activeVenue?.gallery)) {
            activeVenue.gallery.forEach((g: any, i: number) => addImg(g, i));
        }
        if (Array.isArray(activeVenue?.images)) {
            activeVenue.images.forEach((g: any, i: number) => addImg(g, i));
        }

        return list;
    }, [activeVenue]);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [previewItem, setPreviewItem] = useState<{ id: string; url: string } | null>(null);
    const [imageToDelete, setImageToDelete] = useState<{ id: string; url: string } | null>(null);

    // Active tab in details view: "overview" | "hours" | "gallery"
    const [activeSection, setActiveSection] = useState<"overview" | "hours" | "gallery">("overview");

    // Loading State
    if (isLoadingVenues && venuesList.length === 0) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-4 text-white font-['Manrope',sans-serif]">
                <div className="w-12 h-12 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
                <span className="text-[#9D8FD0] text-sm font-semibold">Loading your claimed venues...</span>
            </div>
        );
    }

    // Empty State: No Claimed Venues
    if (venuesList.length === 0 && !isLoadingVenues) {
        return (
            <div className="w-full max-w-[900px] mx-auto min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-['Manrope',sans-serif] animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[rgba(124,58,237,0.25)] to-[rgba(232,255,87,0.1)] border border-[rgba(124,58,237,0.4)] flex items-center justify-center text-[#E8FF57] shadow-xl mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">No Claimed Venue Found</h2>
                <p className="text-sm sm:text-base text-[#9D8FD0] max-w-md mb-8">
                    You haven't claimed any venue yet. Search and claim your bar or restaurant in Venue Management to start managing it here.
                </p>
                <Link
                    href="/app/venue-management"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] hover:brightness-110 active:scale-95 text-white font-bold text-sm shadow-[0px_8px_24px_rgba(124,58,237,0.4)] transition-all"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Browse & Claim Venues</span>
                </Link>
            </div>
        );
    }

    const coverImg =
        activeVenue?.coverImage ||
        (activeVenue?.images && activeVenue.images.length > 0 ? activeVenue.images[0] : "") ||
        "";

    const coords = activeVenue?.location?.coordinates || null;
    const ratingVal = typeof activeVenue?.rating === "number" ? activeVenue.rating.toFixed(1) : "4.3";
    const categoryName = activeVenue?.category ? activeVenue.category.toUpperCase() : "BAR";

    return (
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-8 font-['Manrope',sans-serif] pb-24 animate-in fade-in duration-300">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED] opacity-[0.15] blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E8FF57] opacity-[0.05] blur-[120px] pointer-events-none" />

            {/* Top Page Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E8FF57] animate-pulse" />
                        <span className="text-[11px] font-extrabold tracking-widest text-[#E8FF57] uppercase">
                            CLAIMED VENUE PORTAL
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        {activeVenue?.name || "My Venue"}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#9D8FD0]">
                        Manage establishment profile, operating hours schedule, and showcase gallery.
                    </p>
                </div>

                {/* Header Actions */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {/* Custom Venue Switcher Dropdown */}
                    {venuesList.length > 0 && (
                        <VenueSwitcherDropdown
                            venues={venuesList}
                            activeVenueId={activeVenueId}
                            onSelectVenue={setSelectedVenueId}
                        />
                    )}

                    {/* Edit Details Button */}
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.25)] border border-[rgba(124,58,237,0.3)] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
                    >
                        <svg className="w-4 h-4 text-[#C4B5FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Details</span>
                    </button>
                </div>
            </div>

            {/* Hero Banner Card */}
            <div className="relative w-full rounded-[28px] overflow-hidden bg-[#140E50] border border-[rgba(124,58,237,0.3)] shadow-[0px_16px_48px_rgba(0,0,0,0.5)]">
                {/* Hero Cover Image */}
                <div className="relative w-full h-64 sm:h-80 md:h-96">
                    <img
                        src={cleanImageUrl(coverImg, DEFAULT_VENUE_IMAGE)}
                        alt=""
                        onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080318] via-[#080318]/50 to-transparent pointer-events-none" />

                    {/* Badges Top Right */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] backdrop-blur-md flex items-center gap-1.5 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                            Claimed & Active
                        </span>
                        {activeVenue?.placeId && (
                            <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-mono bg-black/40 border border-white/15 text-white/80 backdrop-blur-md">
                                Place ID: {activeVenue.placeId.slice(0, 10)}...
                            </span>
                        )}
                    </div>

                    {/* Information Overlay Bottom Left */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-[#7C3AED]/50 border border-[#7C3AED] text-white">
                                    {categoryName}
                                </span>
                                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] text-xs font-extrabold">
                                    <span>★</span>
                                    <span>{ratingVal}</span>
                                </div>
                                {coords && Array.isArray(coords) && coords.length === 2 && (
                                    <span className="text-[11px] font-mono text-[#C4B5FD]/80 hidden md:inline-block">
                                        📍 {coords[1].toFixed(4)}, {coords[0].toFixed(4)}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                                {activeVenue?.name}
                            </h2>

                            <p className="text-xs sm:text-sm text-[#E2D9F8] flex items-center gap-1.5 drop-shadow">
                                <svg className="w-4 h-4 text-[#A855F7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{activeVenue?.address || "Address not provided"}</span>
                            </p>
                        </div>

                        {/* Quick Stats Pill */}
                        <div className="flex items-center gap-4 bg-[#0E0528]/80 backdrop-blur-md p-3 rounded-2xl border border-[rgba(124,58,237,0.3)] self-start sm:self-auto">
                            <div className="flex flex-col items-center px-3 border-r border-white/10">
                                <span className="text-[10px] text-[#8B7EC8] uppercase font-bold">Gallery</span>
                                <span className="text-base font-extrabold text-white">
                                    {activeVenue?.images?.length || 0}
                                </span>
                            </div>
                            <div className="flex flex-col items-center px-3">
                                <span className="text-[10px] text-[#8B7EC8] uppercase font-bold">Hours</span>
                                <span className="text-base font-extrabold text-[#E8FF57]">
                                    {operatingHours.length > 0 ? "Configured" : "Not Set"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs for Details */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0E0528]/80 border border-[rgba(124,58,237,0.25)] max-w-md backdrop-blur-md">
                <button
                    onClick={() => setActiveSection("overview")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        activeSection === "overview"
                            ? "bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-[0px_4px_16px_rgba(124,58,237,0.4)]"
                            : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                    }`}
                >
                    Overview & Details
                </button>
                <button
                    onClick={() => setActiveSection("hours")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        activeSection === "hours"
                            ? "bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-[0px_4px_16px_rgba(124,58,237,0.4)]"
                            : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                    }`}
                >
                    Operating Hours
                </button>
                <button
                    onClick={() => setActiveSection("gallery")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        activeSection === "gallery"
                            ? "bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-[0px_4px_16px_rgba(124,58,237,0.4)]"
                            : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                    }`}
                >
                    Gallery ({activeVenue?.images?.length || 0})
                </button>
            </div>

            {/* Tab 1: Overview & Details */}
            {activeSection === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Key Venue Attributes */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div
                            className="rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-md border border-[rgba(124,58,237,0.25)] shadow-xl"
                            style={{ background: "rgba(14, 7, 34, 0.85)" }}
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-[rgba(124,58,237,0.2)]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                                    Establishment Profile
                                </h3>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="text-xs font-bold text-[#E8FF57] hover:underline"
                                >
                                    Edit Info
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#140E50]/60 border border-[rgba(124,58,237,0.2)]">
                                    <span className="text-[10px] uppercase font-bold text-[#8B7EC8] tracking-wider">
                                        Venue Name
                                    </span>
                                    <span className="text-sm font-bold text-white truncate">
                                        {activeVenue?.name || "N/A"}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#140E50]/60 border border-[rgba(124,58,237,0.2)]">
                                    <span className="text-[10px] uppercase font-bold text-[#8B7EC8] tracking-wider">
                                        Category
                                    </span>
                                    <span className="text-sm font-bold text-[#E8FF57]">
                                        {categoryName}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#140E50]/60 border border-[rgba(124,58,237,0.2)]">
                                    <span className="text-[10px] uppercase font-bold text-[#8B7EC8] tracking-wider">
                                        Rating
                                    </span>
                                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <span className="text-amber-400">★</span>
                                        <span>{ratingVal} / 5.0</span>
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#140E50]/60 border border-[rgba(124,58,237,0.2)]">
                                    <span className="text-[10px] uppercase font-bold text-[#8B7EC8] tracking-wider">
                                        Place ID
                                    </span>
                                    <span className="text-xs font-mono font-bold text-[#C4B5FD] truncate">
                                        {activeVenue?.placeId || "ChIJ7xoI5YU-sz4R9djkyoxCJx0"}
                                    </span>
                                </div>
                            </div>

                            {/* Full Address */}
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#140E50]/60 border border-[rgba(124,58,237,0.2)]">
                                <span className="text-[10px] uppercase font-bold text-[#8B7EC8] tracking-wider">
                                    Official Address
                                </span>
                                <p className="text-sm font-medium text-white leading-relaxed">
                                    {activeVenue?.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="flex flex-col gap-6">
                        {/* Quick Actions Card */}
                        <div
                            className="rounded-[24px] p-6 flex flex-col gap-4 backdrop-blur-md border border-[rgba(124,58,237,0.25)] shadow-xl"
                            style={{ background: "rgba(14, 7, 34, 0.85)" }}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[rgba(124,58,237,0.25)] border border-[#7C3AED] flex items-center justify-center text-[#E8FF57]">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base">Quick Actions</h3>
                                    <p className="text-[11px] text-[#8B7EC8]">Fast shortcuts to manage your venue</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsHoursModalOpen(true)}
                                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[rgba(124,58,237,0.4)] transition-all text-xs font-semibold text-white group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[#E8FF57]">⏰</span>
                                        <span>Update Operating Hours</span>
                                    </div>
                                    <span className="text-[#A855F7] group-hover:translate-x-0.5 transition-transform">➔</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsGalleryModalOpen(true)}
                                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[rgba(124,58,237,0.4)] transition-all text-xs font-semibold text-white group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[#E8FF57]">📷</span>
                                        <span>Upload to Gallery</span>
                                    </div>
                                    <span className="text-[#A855F7] group-hover:translate-x-0.5 transition-transform">➔</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[rgba(124,58,237,0.4)] transition-all text-xs font-semibold text-white group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[#E8FF57]">✏️</span>
                                        <span>Edit Venue Details</span>
                                    </div>
                                    <span className="text-[#A855F7] group-hover:translate-x-0.5 transition-transform">➔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Operating Hours */}
            {activeSection === "hours" && (
                <div
                    className="w-full rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-md border border-[rgba(124,58,237,0.25)] shadow-xl"
                    style={{ background: "rgba(14, 7, 34, 0.85)" }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(124,58,237,0.2)]">
                        <div>
                            <h3 className="text-xl font-extrabold text-white">Weekly Operating Schedule</h3>
                            <p className="text-xs text-[#8B7EC8]">
                                Hours displayed on customer discovery apps
                            </p>
                        </div>
                        <button
                            onClick={() => setIsHoursModalOpen(true)}
                            className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition-all active:scale-95 self-start sm:self-auto shadow-md"
                        >
                            Edit Hours
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                        {DAYS_MAP.map((dayName, dayIndex) => {
                            const match = operatingHours.find((h: any) => Number(h.day) === dayIndex);
                            const isClosed = match?.isClosed ?? false;
                            const openTime = match?.open || "18:00";
                            const closeTime = match?.close || "02:00";

                            return (
                                <div
                                    key={dayIndex}
                                    className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                                        isClosed
                                            ? "bg-white/[0.02] border-white/10 opacity-70"
                                            : "bg-[#140E50]/80 border-[rgba(124,58,237,0.3)] shadow-sm"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-white">{dayName}</span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${
                                                isClosed
                                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            }`}
                                        >
                                            {isClosed ? "CLOSED" : "OPEN"}
                                        </span>
                                    </div>
                                    <div className="text-xs text-[#C4B5FD] font-mono mt-1">
                                        {isClosed ? (
                                            <span className="text-[#8B7EC8] italic">Closed all day</span>
                                        ) : (
                                            <span>
                                                {openTime} - {closeTime}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tab 3: Gallery */}
            {activeSection === "gallery" && (
                <div
                    className="w-full rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-md border border-[rgba(124,58,237,0.25)] shadow-xl"
                    style={{ background: "rgba(14, 7, 34, 0.85)" }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(124,58,237,0.2)]">
                        <div>
                            <h3 className="text-xl font-extrabold text-white">Venue Photos & Showcase</h3>
                            <p className="text-xs text-[#8B7EC8]">
                                High quality photos displayed on the BarHuddle customer app
                            </p>
                        </div>
                        <button
                            onClick={() => setIsGalleryModalOpen(true)}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
                        >
                            + Upload Image
                        </button>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {/* Upload Tile CTA */}
                        <div
                            onClick={() => setIsGalleryModalOpen(true)}
                            className="aspect-square rounded-2xl border-2 border-dashed border-[rgba(124,58,237,0.4)] bg-[#140E50]/40 hover:bg-[#140E50]/70 hover:border-[#7C3AED] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-[rgba(124,58,237,0.2)] flex items-center justify-center text-[#E8FF57] group-hover:scale-110 transition-transform">
                                ＋
                            </div>
                            <span className="text-xs font-bold text-[#C4B5FD]">Add Photo</span>
                        </div>

                        {/* Gallery Images */}
                        {galleryItems && galleryItems.length > 0 ? (
                            galleryItems.map((item, idx: number) => (
                                <div
                                    key={item.id || idx}
                                    onClick={() => setPreviewItem(item)}
                                    className="group relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 hover:border-[#7C3AED] transition-all cursor-pointer shadow-md"
                                >
                                    <img
                                        src={cleanImageUrl(item.url, DEFAULT_VENUE_IMAGE)}
                                        alt=""
                                        onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Top-Right Trash Delete Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageToDelete({ id: item.id, url: item.url });
                                        }}
                                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-lg transition-all duration-150 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 z-10"
                                        title="Delete photo"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
                                        <span className="text-[11px] font-semibold text-white/90">Click to view</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-xs text-[#8B7EC8]">
                                No gallery photos added yet. Click "Upload Image" to showcase your venue!
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Lightbox / Preview Modal for Gallery */}
            {previewItem && (
                <div
                    className="fixed inset-0 z-[150] bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in"
                    onClick={() => setPreviewItem(null)}
                >
                    {/* Header Bar */}
                    <div
                        className="w-full max-w-4xl flex items-center justify-between pb-3 text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                                {activeVenue?.name}
                            </span>
                            <span className="text-xs text-[#8B7EC8]">• Photo Viewer</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setImageToDelete({ id: previewItem.id, url: previewItem.url });
                                }}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete Photo</span>
                            </button>
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div
                        className="relative max-w-4xl max-h-[82vh] rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={cleanImageUrl(previewItem.url, DEFAULT_VENUE_IMAGE)}
                            alt=""
                            onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                            className="max-w-full max-h-[82vh] object-contain rounded-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Modals */}
            <EditVenueModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                venueId={activeVenueId}
                initialName={activeVenue?.name || ""}
                initialAddress={activeVenue?.address || ""}
                onSuccess={() => {
                    refetchDetails();
                    refetchOwnerVenues();
                }}
            />

            <OperatingHoursModal
                isOpen={isHoursModalOpen}
                onClose={() => setIsHoursModalOpen(false)}
                venueId={activeVenueId}
                currentHours={operatingHours}
                onSuccess={() => {
                    refetchHours();
                    refetchDetails();
                }}
            />

            <UploadGalleryModal
                isOpen={isGalleryModalOpen}
                onClose={() => setIsGalleryModalOpen(false)}
                venueId={activeVenueId}
                onSuccess={() => {
                    refetchDetails();
                }}
            />

            <DeleteGalleryConfirmModal
                isOpen={!!imageToDelete}
                onClose={() => setImageToDelete(null)}
                venueId={activeVenue?._id || activeVenue?.id || activeVenueId}
                imageId={imageToDelete?.id || ""}
                imageUrl={imageToDelete?.url || ""}
                onSuccess={() => {
                    if (previewItem?.url === imageToDelete?.url) {
                        setPreviewItem(null);
                    }
                    refetchDetails();
                }}
            />
        </div>
    );
}

export default MyVenueView;
