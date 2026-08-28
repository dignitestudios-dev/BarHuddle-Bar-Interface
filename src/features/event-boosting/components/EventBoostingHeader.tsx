"use client";

import React from "react";
import { RadialGlow } from "./RadialGlow";
import { BoostingStatCardsRow } from "./BoostingStatCardsRow";

import { useGetBoostsQuery } from "../api/boost.queries";

export function EventBoostingHeader() {
    const { data: apiBoostsData } = useGetBoostsQuery();

    const avgReach = apiBoostsData?.avgBoostedReach !== undefined && apiBoostsData?.avgBoostedReach !== null
        ? (apiBoostsData.avgBoostedReach >= 1000 ? `${(apiBoostsData.avgBoostedReach / 1000).toFixed(0)}K+` : `${apiBoostsData.avgBoostedReach}`)
        : "0";
    const attendLift = apiBoostsData?.attendRateLift !== undefined && apiBoostsData?.attendRateLift !== null
        ? `${apiBoostsData.attendRateLift}%`
        : "0%";
    const roi = apiBoostsData?.roiVsOrganic !== undefined && apiBoostsData?.roiVsOrganic !== null
        ? `${apiBoostsData.roiVsOrganic}×`
        : "0×";

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Page Title */}
            <h1 className="font-extrabold text-[36px] leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                Event Boosting
            </h1>

            {/* Hero Banner Section */}
           

            {/* Bottom 4 Stat Cards Row */}
            <BoostingStatCardsRow />
        </div>
    );
}

export default EventBoostingHeader;
