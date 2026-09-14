"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { OwnerVenueItem } from "@/hooks/useSelectedVenue";
import { cleanImageUrl } from "@/utils/image";
import { formatCategory, getCategoryIcon } from "@/features/venue-management/components/VenueCard";
import { Martini } from "lucide-react";

export interface VenueSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    venues: OwnerVenueItem[];
    selectedVenueId: string;
    onSelectVenue: (venue: OwnerVenueItem) => void;
}

export function VenueSelectionModal({
    isOpen,
    onClose,
    venues,
    selectedVenueId,
    onSelectVenue,
}: VenueSelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter venues based on search
    const filteredVenues = useMemo(() => {
        if (!searchTerm.trim()) return venues;
        const q = searchTerm.toLowerCase();
        return venues.filter(
            (v) =>
                v.name.toLowerCase().includes(q) ||
                (v.address && v.address.toLowerCase().includes(q)) ||
                (v.category && v.category.toLowerCase().includes(q))
        );
    }, [venues, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-[600px] max-w-[95vw] max-h-[88vh] flex flex-col bg-[#05033A] border border-[rgba(124,58,237,0.35)] shadow-[0px_8px_32px_rgba(0,0,0,0.6),0px_0px_40px_rgba(124,58,237,0.3)] rounded-[26px] p-6 sm:p-7 z-10 text-white select-none overflow-hidden animate-in zoom-in-95 duration-150">
                {/* Close Button (X) */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer border border-white/10 shrink-0"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Modal Header */}
                <div className="flex items-center gap-3.5 mb-5 pr-8">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C3AED]/40 to-[#E8FF57]/20 border border-[rgba(124,58,237,0.4)] flex items-center justify-center text-[#E8FF57] shadow-inner shrink-0">
                        <Martini className="w-5 h-5 text-[#E8FF57]" strokeWidth={2.2} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[20px] sm:text-[22px] font-extrabold text-white tracking-tight leading-tight">
                                Switch Active Venue
                            </h2>
                            <span className="text-[11px] font-bold text-[#E8FF57] bg-[#E8FF57]/10 border border-[#E8FF57]/30 px-2 py-0.5 rounded-full">
                                {venues.length} {venues.length === 1 ? "Venue" : "Venues"}
                            </span>
                        </div>
                        <p className="text-[13px] text-[#9D8FD0] mt-0.5">
                            Select the venue you want to view analytics and manage.
                        </p>
                    </div>
                </div>

                {/* Search Bar (if more than 2 venues) */}
                {venues.length > 2 && (
                    <div className="relative mb-4">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9D8FD0]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search venues by name, category, location..."
                            className="w-full h-11 pl-10 pr-4 bg-[#140E50]/70 border border-[rgba(124,58,237,0.3)] rounded-2xl text-white placeholder-[#9D8FD0]/60 text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                        />
                    </div>
                )}

                {/* Venues Scrollable List */}
                <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[50vh] pr-1 custom-scrollbar my-1">
                    {filteredVenues.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center text-[#9D8FD0]">
                            <p className="text-sm">No venues found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        filteredVenues.map((venue) => {
                            const isSelected = venue.id === selectedVenueId;
                            const imgUrl = cleanImageUrl(venue.coverImage || (venue as any).imageUrl, "");
                            const ItemCategoryIcon = getCategoryIcon(venue.category, venue.name);

                            return (
                                <button
                                    key={venue.id}
                                    type="button"
                                    onClick={() => {
                                        onSelectVenue(venue);
                                        onClose();
                                    }}
                                    className={`w-full p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left group cursor-pointer ${isSelected
                                        ? "bg-[rgba(124,58,237,0.3)] border-[#7C3AED] shadow-[0px_0px_20px_rgba(124,58,237,0.3)]"
                                        : "bg-[#140E50]/50 hover:bg-[#140E50]/80 border-[rgba(124,58,237,0.2)] hover:border-[rgba(124,58,237,0.4)]"
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                        {/* Venue Avatar */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0A0524] border border-[rgba(124,58,237,0.3)] shrink-0 relative flex items-center justify-center">
                                            {imgUrl ? (
                                                <Image
                                                    src={imgUrl}
                                                    alt={venue.name}
                                                    fill
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLElement).style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#150D3A] via-[#0E0729] to-[#070318]">
                                                    <div className="absolute w-8 h-8 rounded-full bg-[#F5E188]/25 blur-md pointer-events-none" />
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,225,136,0.22)_0%,_rgba(124,58,237,0.08)_40%,_transparent_70%)] pointer-events-none" />
                                                    <ItemCategoryIcon className="w-5 h-5 text-[#F5E188] relative z-10 drop-shadow-[0_0_8px_rgba(245,225,136,0.5)]" strokeWidth={2.2} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3
                                                    className={`font-extrabold text-[15px] truncate ${isSelected ? "text-[#E8FF57]" : "text-white group-hover:text-white"
                                                        }`}
                                                >
                                                    {venue.name}
                                                </h3>

                                                {venue.category && (
                                                    <span className="px-2 py-0.5 rounded-full bg-[#F2CA54] text-black text-[10px] font-bold uppercase tracking-wider shrink-0">
                                                        {formatCategory(venue.category)}
                                                    </span>
                                                )}

                                                {venue.rating !== undefined && venue.rating !== null && (
                                                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#FBBF24]">
                                                        ★ {typeof venue.rating === "number" ? venue.rating.toFixed(1) : venue.rating}
                                                    </span>
                                                )}
                                            </div>

                                            {venue.address && (
                                                <p className="text-[12px] text-[#9D8FD0] truncate mt-0.5" title={venue.address}>
                                                    {venue.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Selected Checkmark / Select Pill */}
                                    <div className="shrink-0 flex items-center pl-2">
                                        {isSelected ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8FF57]/20 border border-[#E8FF57]/50 text-[#E8FF57] text-[11px] font-bold shadow-[0_0_12px_rgba(232,255,87,0.3)]">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Active</span>
                                            </div>
                                        ) : (
                                            <span className="text-[12px] font-semibold text-[#9D8FD0] group-hover:text-white px-3 py-1 rounded-full border border-transparent group-hover:border-[rgba(124,58,237,0.4)] group-hover:bg-[rgba(124,58,237,0.15)] transition-all">
                                                Select
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Modal Footer */}
                <div className="mt-5 pt-4 border-t border-[rgba(124,58,237,0.2)] flex items-center justify-between gap-3">
                    <Link
                        href="/app/venue-management"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-[#C4B5FD] hover:text-[#E8FF57] flex items-center gap-1.5 transition-colors"
                    >
                        <span>+ Manage or Claim More Venues</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-[rgba(124,58,237,0.2)] hover:bg-[rgba(124,58,237,0.35)] text-white text-[13px] font-semibold transition-all cursor-pointer"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VenueSelectionModal;
