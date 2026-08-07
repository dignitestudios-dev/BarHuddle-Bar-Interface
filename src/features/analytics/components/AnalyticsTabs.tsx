"use client";

import React from "react";

export type AnalyticsTab =
    | "Overview"
    | "Visitor"
    | "Retention"
    | "Events"
    | "Sentiment"
    | "Boost"
    | "Reports";

export interface AnalyticsTabsProps {
    activeTab?: AnalyticsTab;
    onTabChange?: (tab: AnalyticsTab) => void;
    className?: string;
}

const TABS: AnalyticsTab[] = [
    "Overview",
    "Visitor",
    "Retention",
    "Events",
    "Sentiment",
    "Boost",
    "Reports",
];

export function AnalyticsTabs({
    activeTab = "Overview",
    onTabChange,
    className = "",
}: AnalyticsTabsProps) {
    return (
        <div className={`w-full max-w-[1200px] flex items-center gap-2 overflow-x-auto scrollbar-none py-1 ${className}`}>
            {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabChange?.(tab)}
                        className={`relative px-4 py-2 rounded-[24px] font-['Manrope',sans-serif] font-bold text-[12px] leading-[18px] transition-all cursor-pointer shrink-0 text-center flex flex-col items-center justify-center ${isActive
                                ? "bg-[rgba(124,58,237,0.18)] text-[#F0EEFF]"
                                : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <span>{tab}</span>
                        {/* Gradient Underline Bar for Active Tab */}
                        {isActive && (
                            <span className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#7C3AED] to-[#E8FF57]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default AnalyticsTabs;
