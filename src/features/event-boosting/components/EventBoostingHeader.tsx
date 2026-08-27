"use client";

import React from "react";
import { RadialGlow } from "./RadialGlow";
import { BoostingStatCardsRow } from "./BoostingStatCardsRow";

import { useGetBoostsQuery } from "../api/boost.queries";

export function EventBoostingHeader() {
    const { data: apiBoostsData } = useGetBoostsQuery();

    const avgReach = apiBoostsData?.avgBoostedReach 
        ? `${(apiBoostsData.avgBoostedReach / 1000).toFixed(0)}K+` 
        : "55K+";
    const attendLift = apiBoostsData?.attendRateLift 
        ? `${apiBoostsData.attendRateLift}%` 
        : "87%";
    const roi = apiBoostsData?.roiVsOrganic 
        ? `${apiBoostsData.roiVsOrganic}×` 
        : "3.2×";

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Page Title */}
            <h1 className="font-extrabold text-[36px] leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                Event Boosting
            </h1>

            {/* Hero Banner Section */}
            <div className="relative max-w-[1200px] w-full min-h-[185px] rounded-[24px] bg-gradient-to-br from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.25)] to-[rgba(14,9,60,0.3)] border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_60px_rgba(124,58,237,0.12)] p-7 md:px-[33px] md:py-[29px] overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                {/* Radial Glow 1 (Lime Glow Right Side) */}
                <RadialGlow
                    color="#E8FF57"
                    size="w-[256px] h-[256px]"
                    opacity="opacity-[0.15]"
                    positionClass="-right-10 -top-10"
                />

                {/* Radial Glow 2 (Purple Glow Left/Center Side) */}
                <RadialGlow
                    color="#7C3AED"
                    size="w-[192px] h-[192px]"
                    opacity="opacity-[0.1]"
                    positionClass="left-[304px] top-0"
                />

                {/* Left Text Content */}
                <div className="flex flex-col gap-2 max-w-[420px] z-10">
                    <span className="font-extrabold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#E8FF57]">
                        AMPLIFY YOUR EVENTS
                    </span>

                    <h2 className="font-extrabold text-[26px] sm:text-[30px] leading-[34px] sm:leading-[38px] text-white">
                        Reach thousands more local nightlife visitors
                    </h2>

                    <p className="font-normal text-[14px] leading-[20px] text-[rgba(196,181,253,0.8)]">
                        Boost any event for as little as $9.99 and see instant results.
                    </p>
                </div>

                {/* Right Metrics Row */}
                <div className="flex items-center gap-6 sm:gap-8 z-10 shrink-0 self-end md:self-center">
                    {/* Metric 1 */}
                    <div className="flex flex-col items-center text-center">
                        <span className="font-extrabold text-[26px] sm:text-[30px] leading-[36px] text-white">
                            {avgReach}
                        </span>
                        <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-0.5">
                            Avg Boosted Reach
                        </span>
                    </div>

                    {/* Metric 2 */}
                    <div className="flex flex-col items-center text-center">
                        <span className="font-extrabold text-[26px] sm:text-[30px] leading-[36px] text-white">
                            {attendLift}
                        </span>
                        <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-0.5">
                            Attend Rate Lift
                        </span>
                    </div>

                    {/* Metric 3 */}
                    <div className="flex flex-col items-center text-center">
                        <span className="font-extrabold text-[26px] sm:text-[30px] leading-[36px] text-white">
                            {roi}
                        </span>
                        <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-0.5">
                            ROI vs Organic
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom 4 Stat Cards Row */}
            <BoostingStatCardsRow />
        </div>
    );
}

export default EventBoostingHeader;
