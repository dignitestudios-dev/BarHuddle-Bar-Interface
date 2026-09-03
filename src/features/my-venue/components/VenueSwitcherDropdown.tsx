"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cleanImageUrl, DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";

export interface VenueSwitcherOption {
    _id?: string;
    id?: string;
    name: string;
    address?: string;
    coverImage?: string;
    images?: string[];
    category?: string;
}

interface VenueSwitcherDropdownProps {
    venues: VenueSwitcherOption[];
    activeVenueId: string;
    onSelectVenue: (id: string) => void;
}

export function VenueSwitcherDropdown({
    venues,
    activeVenueId,
    onSelectVenue,
}: VenueSwitcherDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeVenue =
        venues.find((v) => (v._id || v.id) === activeVenueId) || venues[0];

    const activeImage =
        activeVenue?.coverImage ||
        (activeVenue?.images && activeVenue.images.length > 0
            ? activeVenue.images[0]
            : "");

    return (
        <div ref={dropdownRef} className="relative font-['Manrope',sans-serif] z-40">
            {/* Dropdown Trigger Pill */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 px-3.5 bg-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.25)] border border-[rgba(124,58,237,0.35)] rounded-2xl flex items-center gap-2.5 text-white transition-all duration-150 focus:outline-none focus:border-[#7C3AED] shadow-sm cursor-pointer active:scale-95"
            >
                {/* Mini Venue Image or Icon */}
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[rgba(124,58,237,0.4)] bg-[#140E50] flex items-center justify-center">
                    {activeImage ? (
                        <img
                            src={cleanImageUrl(activeImage, DEFAULT_VENUE_IMAGE)}
                            alt=""
                            onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <svg className="w-3.5 h-3.5 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
                        </svg>
                    )}
                </div>

                {/* Selected Venue Name */}
                <span className="font-bold text-xs sm:text-sm text-white max-w-[140px] sm:max-w-[180px] truncate">
                    {activeVenue?.name || "Select Venue"}
                </span>

                {/* Animated Chevron */}
                <svg
                    className={`w-3.5 h-3.5 text-[#C27AFF] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu Panel */}
            {isOpen && (
                <div
                    className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 rounded-2xl p-2 flex flex-col gap-1 shadow-[0px_20px_50px_rgba(0,0,0,0.85)] border border-[rgba(124,58,237,0.35)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50"
                    style={{ background: "rgba(11, 5, 34, 0.96)" }}
                >
                    {/* Header Label */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(124,58,237,0.2)]">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A855F7]">
                            Claimed Establishments
                        </span>
                        <span className="text-[10px] font-mono text-[#8B7EC8] px-2 py-0.5 rounded-full bg-white/5">
                            {venues.length} {venues.length === 1 ? "venue" : "venues"}
                        </span>
                    </div>

                    {/* Venue Items List */}
                    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar py-1">
                        {venues.map((venue) => {
                            const vId = venue._id || venue.id || "";
                            const isSelected = vId === activeVenueId;
                            const vImg =
                                venue.coverImage ||
                                (venue.images && venue.images.length > 0
                                    ? venue.images[0]
                                    : "");

                            return (
                                <button
                                    key={vId}
                                    type="button"
                                    onClick={() => {
                                        onSelectVenue(vId);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                                        isSelected
                                            ? "bg-[rgba(124,58,237,0.25)] border border-[rgba(124,58,237,0.4)] shadow-sm"
                                            : "hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#140E50] border border-white/10 shrink-0 flex items-center justify-center">
                                            {vImg ? (
                                                <img
                                                    src={cleanImageUrl(vImg, DEFAULT_VENUE_IMAGE)}
                                                    alt=""
                                                    onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-[#E8FF57]">
                                                    {venue.name ? venue.name.charAt(0) : "V"}
                                                </span>
                                            )}
                                        </div>

                                        {/* Name & Address */}
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span
                                                className={`text-xs font-bold truncate ${
                                                    isSelected
                                                        ? "text-[#E8FF57]"
                                                        : "text-white group-hover:text-[#C4B5FD]"
                                                }`}
                                            >
                                                {venue.name || "Unnamed Venue"}
                                            </span>
                                            {venue.address && (
                                                <span className="text-[10px] text-[#8B7EC8] truncate">
                                                    {venue.address}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active Indicator Checkmark */}
                                    {isSelected && (
                                        <div className="w-5 h-5 rounded-full bg-[#E8FF57]/20 flex items-center justify-center text-[#E8FF57] shrink-0 ml-2">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer: Claim Another Venue CTA */}
                    <div className="pt-2 border-t border-[rgba(124,58,237,0.2)]">
                        <Link
                            href="/app/venue-management"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[rgba(124,58,237,0.12)] hover:bg-[rgba(124,58,237,0.22)] border border-[rgba(124,58,237,0.25)] text-[#E8FF57] text-xs font-bold transition-all text-center"
                        >
                            <span>＋ Claim Another Venue</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VenueSwitcherDropdown;
