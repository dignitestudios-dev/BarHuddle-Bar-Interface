"use client";

import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { VenueSelectionModal } from "./VenueSelectionModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelectedVenue } from "@/hooks/useSelectedVenue";

export function Navbar() {
    const { venues, selectedVenueId, selectedVenueName, selectVenue, isLoading } = useSelectedVenue();
    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

    return (
        <>
            <header className="relative w-full h-16 px-6 bg-[#05033AD9] backdrop-blur-md border-b border-[#7C3AED]/20 flex items-center justify-between sticky top-0 z-30 font-['Manrope',sans-serif]">
                {/* Left Spacer for symmetry */}
                <div className="flex items-center min-w-[40px] md:min-w-[80px]" />

                {/* Center Venue / Bar Name Trigger */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center max-w-[70%] z-40">
                    {isLoading && !selectedVenueName ? (
                        <Skeleton className="h-8 w-40 sm:w-56 rounded-full bg-[rgba(124,58,237,0.15)]" />
                    ) : selectedVenueName ? (
                        <button
                            type="button"
                            onClick={() => setIsVenueModalOpen(true)}
                            className="group flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(124,58,237,0.14)] hover:bg-[rgba(124,58,237,0.25)] border border-[rgba(124,58,237,0.3)] hover:border-[rgba(124,58,237,0.6)] shadow-[0_0_20px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md transition-all cursor-pointer select-none"
                            title="Click to switch active venue"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#E8FF57] shadow-[0_0_8px_#E8FF57] animate-pulse shrink-0" />
                            <span className="font-extrabold text-[14px] sm:text-[16px] leading-[22px] tracking-tight bg-gradient-to-r from-white via-white to-[#E8FF57] bg-clip-text text-transparent truncate max-w-[160px] sm:max-w-[260px] md:max-w-[360px]">
                                {selectedVenueName}
                            </span>
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 group-hover:bg-[#E8FF57]/20 transition-colors">
                                <svg
                                    className="w-3.5 h-3.5 text-[#9D8FD0] group-hover:text-[#E8FF57] transition-colors shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                            </div>
                        </button>
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

            {/* Venue Selection Dialog Box */}
            <VenueSelectionModal
                isOpen={isVenueModalOpen}
                onClose={() => setIsVenueModalOpen(false)}
                venues={venues}
                selectedVenueId={selectedVenueId}
                onSelectVenue={selectVenue}
            />
        </>
    );
}

export default Navbar;
