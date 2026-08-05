"use client";

import React from "react";

export interface ClaimVenuesBannerProps {
    title?: string;
    description?: string;
    className?: string;
}

export function ClaimVenuesBanner({
    title = "Claim Your Venues",
    description = "Search and claim bars, lounges, nightclubs, and entertainment venues to unlock management tools and analytics.",
    className = "",
}: ClaimVenuesBannerProps) {
    return (
        <div
            className={`relative w-full max-w-[1136px] min-h-[159px] p-8 sm:px-10 sm:py-8 flex flex-col justify-center overflow-hidden select-none font-['Manrope',sans-serif] bg-gradient-to-br from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.2)] to-[rgba(5,3,58,0.1)] border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_60px_rgba(124,58,237,0.15)] rounded-[24px] ${className}`}
        >
            {/* Background Glow Orb */}
            <div className="absolute right-[-40px] top-[-40px] w-[300px] h-[200px] bg-[radial-gradient(57.2%_102.96%_at_50%_50%,rgba(124,58,237,0.35)_0%,rgba(0,0,0,0)_70%)] opacity-[0.25] rounded-full pointer-events-none z-0" />

            {/* Content Section */}
            <div className="relative z-10 flex flex-col gap-2 max-w-[672px]">
                {/* Title */}
                <h1 className="font-extrabold text-[32px] sm:text-[36px] leading-[40px] sm:leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                    {title}
                </h1>

                {/* Description */}
                <p className="font-normal text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#9D8FD0] max-w-[512px]">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default ClaimVenuesBanner;
