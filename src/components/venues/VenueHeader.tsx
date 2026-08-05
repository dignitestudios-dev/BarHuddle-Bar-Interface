"use client";

import React, { useState } from "react";
import type { VenueCardData } from "./VenueCard";
import { ClaimFormModal } from "./ClaimFormModal";
import { EditDetailsModal } from "./EditDetailsModal";

export interface VenueHeaderProps {
    venue?: VenueCardData;
    onBack?: () => void;
    onClaim?: (venue: VenueCardData) => void;
    className?: string;
}

export function VenueHeader({
    venue,
    onBack,
    onClaim,
    className = "",
}: VenueHeaderProps) {
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleClaimClick = () => {
        if (onClaim && venue) {
            onClaim(venue);
        }
        setIsClaimModalOpen(true);
    };

    return (
        <>
            <div className={`w-full flex items-center justify-between min-h-[57px] font-['Manrope',sans-serif] ${className}`}>
                {/* Left Side: Back Arrow + Bar Detail Screen Title */}
                <div className="flex items-center gap-3">
                    {/* Back Arrow Button */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-12 h-12 flex items-center justify-center p-3 text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
                        aria-label="Go Back"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Gradient Screen Title */}
                    <h1 className="font-extrabold text-[32px] sm:text-[36px] leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                        Bar Detail Screen
                    </h1>
                </div>

                {/* Right Side Action Buttons: Edit Details & Claim Now */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Edit Details Button */}
                    <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="h-[57px] px-5 py-3 rounded-[24px] bg-[rgba(124,58,237,0.25)] hover:bg-[rgba(124,58,237,0.4)] border border-[rgba(124,58,237,0.4)] flex items-center justify-center font-bold text-[15px] text-[#C4B5FD] hover:text-white transition-all cursor-pointer"
                    >
                        Edit Details
                    </button>

                    {/* Claim Now Button */}
                    <button
                        type="button"
                        onClick={handleClaimClick}
                        className="w-[143px] h-[57px] px-[30px] py-3 rounded-[24px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center font-extrabold text-[16px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                        Claim Now
                    </button>
                </div>
            </div>

            {/* Claim Form Modal */}
            <ClaimFormModal
                isOpen={isClaimModalOpen}
                onClose={() => setIsClaimModalOpen(false)}
            />

            {/* Edit Details Modal */}
            <EditDetailsModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </>
    );
}

export default VenueHeader;
