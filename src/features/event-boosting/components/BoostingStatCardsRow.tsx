"use client";

import React from "react";

export interface BoostingStatCardData {
    id: string;
    value: string;
    label: string;
    iconColor: string;
    iconBgShadow: string;
}

export interface BoostingStatCardsRowProps {
    cards?: BoostingStatCardData[];
    className?: string;
}

export const DEFAULT_BOOSTING_STAT_CARDS: BoostingStatCardData[] = [
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

export function BoostingStatCardsRow({
    cards = DEFAULT_BOOSTING_STAT_CARDS,
    className = "",
}: BoostingStatCardsRowProps) {
    return (
        <div className={`max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full ${className}`}>
            {cards.map((card) => (
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
    );
}

export default BoostingStatCardsRow;
