"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AnalyticsTab } from "./AnalyticsTabs";

export type DateFilterOption = "Weekly" | "Monthly" | "Yearly" | "Custom";

export interface AnalyticsPageHeaderProps {
    dateFilter?: DateFilterOption;
    startDate?: Date;
    endDate?: Date;
    onDateFilterChange?: (filter: DateFilterOption, start?: Date, end?: Date) => void;
    activeTab?: AnalyticsTab;
    onTabChange?: (tab: AnalyticsTab) => void;
    className?: string;
}

const DATE_FILTERS: DateFilterOption[] = ["Weekly", "Monthly", "Yearly", "Custom"];

export function AnalyticsPageHeader({
    dateFilter = "Weekly",
    startDate,
    endDate,
    onDateFilterChange,
    className = "",
}: AnalyticsPageHeaderProps) {
    const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterOption>(dateFilter);
    const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
        startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const [customEndDate, setCustomEndDate] = useState<Date | undefined>(endDate || new Date());
    const [isCustomPopoverOpen, setIsCustomPopoverOpen] = useState(false);
    const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
    const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

    const handleFilterClick = (filter: DateFilterOption) => {
        setSelectedDateFilter(filter);
        if (filter === "Custom") {
            setIsCustomPopoverOpen(true);
            onDateFilterChange?.(filter, customStartDate, customEndDate);
        } else {
            setIsCustomPopoverOpen(false);
            onDateFilterChange?.(filter, undefined, undefined);
        }
    };

    const handleApplyCustomDates = () => {
        setIsCustomPopoverOpen(false);
        onDateFilterChange?.("Custom", customStartDate, customEndDate);
    };

    return (
        <div className={`max-w-[1200px] flex flex-col gap-6 font-['Manrope',sans-serif] ${className}`}>
            {/* Top Row: Gradient Title & Date Filter Pill Group */}
            <div className="w-full flex items-center justify-between min-h-[45px] flex-wrap gap-4">
                {/* Title: Analytics */}
                <h1 className="font-extrabold text-[36px] leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                    Analytics
                </h1>

                {/* DateFilter Pill Container & Custom Range */}
                <div className="flex items-center gap-3 flex-wrap">
                    {selectedDateFilter === "Custom" && customStartDate && customEndDate && (
                        <div className="px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in duration-150">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#E8FF57]" />
                            <span>
                                {format(customStartDate, "MMM dd, yyyy")} – {format(customEndDate, "MMM dd, yyyy")}
                            </span>
                        </div>
                    )}

                    <div className="h-[38.6px] p-1 gap-0.5 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] flex items-center shrink-0">
                        {DATE_FILTERS.map((filter) => {
                            const isActive = selectedDateFilter === filter;

                            if (filter === "Custom") {
                                return (
                                    <Popover
                                        key={filter}
                                        open={isCustomPopoverOpen}
                                        onOpenChange={setIsCustomPopoverOpen}
                                    >
                                        <PopoverTrigger
                                            onClick={() => handleFilterClick(filter)}
                                            className={`h-[29px] px-3.5 flex items-center justify-center rounded-[20px] font-bold text-[11px] leading-[16px] transition-all cursor-pointer ${
                                                isActive
                                                    ? "bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-[0px_0px_14px_rgba(124,58,237,0.45)]"
                                                    : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            {filter}
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-[320px] p-4 bg-[#0E093C] border border-[#7C3AED]/40 rounded-2xl shadow-2xl z-[9999] flex flex-col gap-3 font-['Manrope',sans-serif]"
                                            align="end"
                                        >
                                            <div className="text-sm font-bold text-white border-b border-purple-800/30 pb-2">
                                                Select Custom Date Range
                                            </div>

                                            {/* Start Date */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[11px] font-semibold text-purple-300">
                                                    Start Date
                                                </label>
                                                <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                                                    <PopoverTrigger className="w-full text-left">
                                                        <div className="w-full h-9 px-3 rounded-xl bg-purple-950/40 border border-purple-800/30 text-white text-xs flex items-center justify-between hover:border-purple-600 transition-colors cursor-pointer">
                                                            <span>
                                                                {customStartDate
                                                                    ? format(customStartDate, "MMM dd, yyyy")
                                                                    : "Select start date"}
                                                            </span>
                                                                <CalendarIcon className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-[#0E093C] border border-[#7C3AED]/40 z-[9999]" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={customStartDate}
                                                            onSelect={(date) => {
                                                                setCustomStartDate(date);
                                                                setIsStartCalendarOpen(false);
                                                            }}
                                                            className="bg-[#0E093C] text-white"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            {/* End Date */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[11px] font-semibold text-purple-300">
                                                    End Date
                                                </label>
                                                <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                                                    <PopoverTrigger className="w-full text-left">
                                                        <div className="w-full h-9 px-3 rounded-xl bg-purple-950/40 border border-purple-800/30 text-white text-xs flex items-center justify-between hover:border-purple-600 transition-colors cursor-pointer">
                                                            <span>
                                                                {customEndDate
                                                                    ? format(customEndDate, "MMM dd, yyyy")
                                                                    : "Select end date"}
                                                            </span>
                                                                <CalendarIcon className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-[#0E093C] border border-[#7C3AED]/40 z-[9999]" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={customEndDate}
                                                            onSelect={(date) => {
                                                                setCustomEndDate(date);
                                                                setIsEndCalendarOpen(false);
                                                            }}
                                                            className="bg-[#0E093C] text-white"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            {/* Apply Button */}
                                            <button
                                                type="button"
                                                onClick={handleApplyCustomDates}
                                                className="w-full h-9 mt-1 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#AD46FF] text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-purple-900/40"
                                            >
                                                Apply Range
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                );
                            }

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
            </div>
        </div>
    );
}

export default AnalyticsPageHeader;
