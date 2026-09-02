"use client";

import { useState, useRef, useEffect } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelectedVenue } from "@/hooks/useSelectedVenue";

export function Navbar() {
    const { venues, selectedVenueId, selectedVenueName, selectVenue, isLoading } = useSelectedVenue();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="relative w-full h-16 px-6 bg-[#05033AD9] backdrop-blur-md border-b border-[#7C3AED]/20 flex items-center justify-between sticky top-0 z-30 font-['Manrope',sans-serif]">
            {/* Left Spacer for symmetry */}
            <div className="flex items-center min-w-[40px] md:min-w-[80px]" />

            {/* Center Venue / Bar Name Dropdown */}
            <div ref={dropdownRef} className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center max-w-[70%] z-40">
                {isLoading && !selectedVenueName ? (
                    <Skeleton className="h-8 w-40 sm:w-56 rounded-full bg-[rgba(124,58,237,0.15)]" />
                ) : selectedVenueName ? (
                    <div className="relative">
                        {/* Venue Trigger Pill Button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="group flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(124,58,237,0.12)] hover:bg-[rgba(124,58,237,0.22)] border border-[rgba(124,58,237,0.3)] hover:border-[rgba(124,58,237,0.5)] shadow-[0_0_20px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md transition-all cursor-pointer select-none"
                            title="Switch Active Venue"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#E8FF57] shadow-[0_0_8px_#E8FF57] animate-pulse shrink-0" />
                            <span className="font-extrabold text-[14px] sm:text-[16px] leading-[22px] tracking-tight bg-gradient-to-r from-white via-white to-[#E8FF57] bg-clip-text text-transparent truncate max-w-[160px] sm:max-w-[260px] md:max-w-[360px]">
                                {selectedVenueName}
                            </span>
                            <svg
                                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                                    isOpen ? "rotate-180 text-[#E8FF57]" : "text-[#9D8FD0] group-hover:text-white"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Venue Selection Dropdown Menu */}
                        {isOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 sm:w-80 bg-[#05033A] border border-[rgba(124,58,237,0.35)] shadow-2xl rounded-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl font-['Manrope',sans-serif]">
                                <div className="px-2 py-1.5 mb-1 flex items-center justify-between border-b border-[rgba(124,58,237,0.2)]">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9D8FD0]">
                                        Your Venues
                                    </span>
                                    <span className="text-[11px] font-semibold text-[#E8FF57]">
                                        {venues.length} {venues.length === 1 ? "venue" : "venues"}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto custom-scrollbar">
                                    {venues.length === 0 ? (
                                        <div className="p-3 text-center text-xs text-[#9D8FD0]">
                                            No venues found.
                                        </div>
                                    ) : (
                                        venues.map((venue) => {
                                            const isSelected = venue.id === selectedVenueId;
                                            return (
                                                <button
                                                    key={venue.id}
                                                    type="button"
                                                    onClick={() => {
                                                        selectVenue(venue);
                                                        setIsOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                                        isSelected
                                                            ? "bg-[rgba(124,58,237,0.25)] border border-[rgba(124,58,237,0.4)] text-white shadow-sm"
                                                            : "hover:bg-white/5 border border-transparent text-[#9D8FD0] hover:text-white"
                                                    }`}
                                                >
                                                    <div className="flex flex-col min-w-0 truncate">
                                                        <span className={`text-[13px] sm:text-[14px] font-bold truncate ${
                                                            isSelected ? "text-[#E8FF57]" : "text-white"
                                                        }`}>
                                                            {venue.name}
                                                        </span>
                                                        {venue.address && (
                                                            <span className="text-[11px] text-[#9D8FD0] truncate">
                                                                {venue.address}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {isSelected && (
                                                        <span className="shrink-0 w-5 h-5 rounded-full bg-[#E8FF57]/20 border border-[#E8FF57]/40 flex items-center justify-center text-[#E8FF57]">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Right Action Dropdowns */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notification Dropdown Component */}
                <NotificationDropdown />

                {/* Profile Dropdown Component */}
                <ProfileDropdown />
            </div>
        </header>
    );
}

export default Navbar;

