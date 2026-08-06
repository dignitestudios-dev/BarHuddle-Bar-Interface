"use client";

import React, { useState } from "react";

export type DateFilterOption = "Daily" | "Weekly" | "Monthly" | "Custom";
export type AnalyticsTab = "Overview" | "Visitor" | "Retention" | "Events" | "Sentiment" | "Boost" | "Reports";

export interface AnalyticsPageHeaderProps {
    dateFilter?: DateFilterOption;
    onDateFilterChange?: (filter: DateFilterOption) => void;
    activeTab?: AnalyticsTab;
    onTabChange?: (tab: AnalyticsTab) => void;
    className?: string;
}

const DATE_FILTERS: DateFilterOption[] = ["Daily", "Weekly", "Monthly", "Custom"];
const TABS: AnalyticsTab[] = ["Overview", "Visitor", "Retention", "Events", "Sentiment", "Boost", "Reports"];

export function AnalyticsPageHeader({
    dateFilter = "Weekly",
    onDateFilterChange,
    activeTab = "Overview",
    onTabChange,
    className = "",
}: AnalyticsPageHeaderProps) {
    const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterOption>(dateFilter);
    const [selectedTab, setSelectedTab] = useState<AnalyticsTab>(activeTab);

    const handleFilterClick = (filter: DateFilterOption) => {
        setSelectedDateFilter(filter);
        onDateFilterChange?.(filter);
    };

    const handleTabClick = (tab: AnalyticsTab) => {
        setSelectedTab(tab);
        onTabChange?.(tab);
    };

    return (
        <div className={`w-full flex flex-col gap-6 font-['Manrope',sans-serif] ${className}`}>
            {/* Top Row: Gradient Title & Date Filter Pill Group */}
            <div className="w-full flex items-center justify-between min-h-[45px] flex-wrap gap-4">
                {/* Title: Analytics */}
                <h1 className="font-extrabold text-[36px] leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                    Analytics
                </h1>

                {/* DateFilter Pill Container */}
                <div className="h-[38.6px] p-1 gap-0.5 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] flex items-center shrink-0">
                    {DATE_FILTERS.map((filter) => {
                        const isActive = selectedDateFilter === filter;
                        return (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => handleFilterClick(filter)}
                                className={`h-[29px] px-3.5 flex items-center justify-center rounded-[20px] font-bold text-[11px] leading-[16px] transition-all cursor-pointer ${
                                    isActive
                                        ? "bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-[0px_0px_14px_rgba(124,58,237,0.45)]"
                                        : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {filter}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sub-Navigation Tabs Row */}
            <div className="w-full flex items-center gap-2 overflow-x-auto scrollbar-none py-1 border-b border-[rgba(124,58,237,0.15)]">
                {TABS.map((tab) => {
                    const isActive = selectedTab === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => handleTabClick(tab)}
                            className={`relative px-4 py-2 rounded-full font-bold text-[13px] leading-[18px] transition-all cursor-pointer shrink-0 ${
                                isActive
                                    ? "bg-[rgba(124,58,237,0.25)] text-white border border-[rgba(124,58,237,0.4)] shadow-[0px_0px_12px_rgba(124,58,237,0.2)]"
                                    : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {tab}
                            {/* Active Tab Accent Line */}
                            {isActive && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#E8FF57] shadow-[0px_0px_8px_#E8FF57]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default AnalyticsPageHeader;
