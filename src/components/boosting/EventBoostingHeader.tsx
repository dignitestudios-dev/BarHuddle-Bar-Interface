"use client";

import React from "react";

export function EventBoostingHeader() {
    const statCardsData = [
        {
            id: "total-events",
            value: "3",
            label: "Total Events",
            iconColor: "text-[#9F4FFA]",
            iconBgShadow: "shadow-[0px_0px_12px_rgba(159,79,250,0.2)]",
        },
        {
            id: "boosted-events",
            value: "3",
            label: "Boosted Events",
            iconColor: "text-[#E8FF57]",
            iconBgShadow: "shadow-[0px_0px_12px_rgba(232,255,87,0.2)]",
        },
        {
            id: "total-reach",
            value: "14K",
            label: "Total Reach",
            iconColor: "text-[#22D3EE]",
            iconBgShadow: "shadow-[0px_0px_12px_rgba(34,211,238,0.2)]",
        },
        {
            id: "avg-engagement",
            value: "44%",
            label: "Avg Engagement",
            iconColor: "text-[#4ADE80]",
            iconBgShadow: "shadow-[0px_0px_12px_rgba(74,222,128,0.2)]",
        },
    ];

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Page Title */}
            <h1 className="font-extrabold text-[36px] leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                Event Boosting
            </h1>

            {/* Hero Banner Section */}
            <div className="relative w-full min-h-[185px] rounded-[24px] bg-gradient-to-br from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.25)] to-[rgba(14,9,60,0.3)] border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_60px_rgba(124,58,237,0.12)] p-7 md:px-[33px] md:py-[29px] overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Radial Glow 1 (Lime Glow Right Side) */}
                <div 
                    className="absolute -right-10 -top-10 w-[256px] h-[256px] pointer-events-none opacity-[0.15] rounded-full"
                    style={{
                        background: "radial-gradient(70.71% 70.71% at 50% 50%, #E8FF57 0%, rgba(0, 0, 0, 0) 70%)"
                    }}
                />

                {/* Radial Glow 2 (Purple Glow Left/Center Side) */}
                <div 
                    className="absolute left-[304px] top-0 w-[192px] h-[192px] pointer-events-none opacity-[0.1] rounded-full"
                    style={{
                        background: "radial-gradient(70.71% 70.71% at 50% 50%, #7C3AED 0%, rgba(0, 0, 0, 0) 70%)"
                    }}
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
                            55K+
                        </span>
                        <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-0.5">
                            Avg Boosted Reach
                        </span>
                    </div>

                    {/* Metric 2 */}
                    <div className="flex flex-col items-center text-center">
                        <span className="font-extrabold text-[26px] sm:text-[30px] leading-[36px] text-white">
                            87%
                        </span>
                        <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-0.5">
                            Attend Rate Lift
                        </span>
                    </div>

                    {/* Metric 3 */}
                    <div className="flex flex-col items-center text-center">
                        <span className="font-extrabold text-[26px] sm:text-[30px] leading-[36px] text-white">
                            3.2×
                        </span>
                        <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-0.5">
                            ROI vs Organic
                        </span>
                    </div>
                </div>

            </div>

            {/* Bottom 4 Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {statCardsData.map((card) => (
                    <div
                        key={card.id}
                        className="w-full h-[80px] rounded-[24px] bg-gradient-to-br from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.2)] to-[rgba(5,3,58,0.1)] border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_60px_rgba(124,58,237,0.15)] px-4 flex items-center gap-3.5"
                    >
                        {/* Icon Box (48x48) */}
                        <div className={`w-[48px] h-[48px] rounded-[10px] bg-[rgba(124,58,237,0.082)] border border-[rgba(124,58,237,0.157)] flex items-center justify-center shrink-0 ${card.iconBgShadow}`}>
                            {/* Four-point Sparkle Icon */}
                            <svg className={`w-5 h-5 ${card.iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 3v3m0 12v3M3 12h3m12 0h3M5.636 5.636l2.122 2.122m8.484 8.484l2.122 2.122M5.636 18.364l2.122-2.122m8.484-8.484l2.122-2.122" 
                                />
                            </svg>
                        </div>

                        {/* Text Container */}
                        <div className="flex flex-col">
                            <span className="font-extrabold text-[20px] leading-[22px] text-white">
                                {card.value}
                            </span>
                            <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-1">
                                {card.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventBoostingHeader;
