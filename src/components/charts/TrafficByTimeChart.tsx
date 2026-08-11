"use client";

import React, { useState } from "react";

export interface TimeSlotData {
    id: string;
    label: string;
    value: number;
    heightPx: number; // exact Figma height (max 241px)
    color: string;
    glowColor: string;
}

export interface OrganicBoostedGroup {
    id: string;
    label: string;
    organicValue: number;
    organicHeightPx: number;
    boostedValue: number;
    boostedHeightPx: number;
}

export interface TrafficByTimeChartProps {
    className?: string;
    slots?: TimeSlotData[];
    variant?: "default" | "organicVsBoosted";
    title?: string;
    tagText?: string;
    subtitle?: string;
    groups?: OrganicBoostedGroup[];
}

const DEFAULT_SLOTS: TimeSlotData[] = [
    {
        id: "morning",
        label: "Morning",
        value: 200,
        heightPx: 48,
        color: "#22D3EE",
        glowColor: "rgba(34, 211, 238, 0.4)",
    },
    {
        id: "afternoon",
        label: "Afternoon",
        value: 415,
        heightPx: 100,
        color: "#A855F7",
        glowColor: "rgba(168, 85, 247, 0.4)",
    },
    {
        id: "evening",
        label: "Evening",
        value: 720,
        heightPx: 174,
        color: "#7C3AED",
        glowColor: "rgba(124, 58, 237, 0.4)",
    },
    {
        id: "late-night",
        label: "Late Night",
        value: 1000,
        heightPx: 241,
        color: "#E8FF57",
        glowColor: "rgba(232, 255, 87, 0.4)",
    },
];

const DEFAULT_ORGANIC_BOOSTED_GROUPS: OrganicBoostedGroup[] = [
    { id: "1", label: "Ladies Night", organicValue: 200, organicHeightPx: 48, boostedValue: 260, boostedHeightPx: 62 },
    { id: "2", label: "Ladies Night", organicValue: 620, organicHeightPx: 148, boostedValue: 900, boostedHeightPx: 216 },
    { id: "3", label: "Ladies Night", organicValue: 340, organicHeightPx: 82, boostedValue: 500, boostedHeightPx: 120 },
    { id: "4", label: "Ladies Night", organicValue: 100, organicHeightPx: 24, boostedValue: 140, boostedHeightPx: 34 },
    { id: "5", label: "Ladies Night", organicValue: 780, organicHeightPx: 188, boostedValue: 470, boostedHeightPx: 112 },
    { id: "6", label: "Ladies Night", organicValue: 180, organicHeightPx: 43, boostedValue: 260, boostedHeightPx: 62 },
    { id: "7", label: "Ladies Night", organicValue: 560, organicHeightPx: 135, boostedValue: 820, boostedHeightPx: 196 },
    { id: "8", label: "Ladies Night", organicValue: 270, organicHeightPx: 65, boostedValue: 390, boostedHeightPx: 94 },
    { id: "9", label: "Ladies Night", organicValue: 150, organicHeightPx: 36, boostedValue: 560, boostedHeightPx: 134 },
    { id: "10", label: "Ladies Night", organicValue: 180, organicHeightPx: 43, boostedValue: 220, boostedHeightPx: 53 },
];

const Y_AXIS_TICKS = [
    { label: "1000", positionPx: 0 },
    { label: "750", positionPx: 60 },
    { label: "500", positionPx: 120 },
    { label: "250", positionPx: 180 },
    { label: "0", positionPx: 241 },
];

export function TrafficByTimeChart({
    className = "",
    slots = DEFAULT_SLOTS,
    variant = "default",
    title,
    tagText,
    subtitle,
    groups = DEFAULT_ORGANIC_BOOSTED_GROUPS,
}: TrafficByTimeChartProps) {
    const [activeSlot, setActiveSlot] = useState<string | null>(null);

    const isOrganicBoosted = variant === "organicVsBoosted";

    const displayTag = tagText || (isOrganicBoosted ? "BOOST ANALYTICS" : "TRAFFIC PATTERN");
    const displayTitle = title || (isOrganicBoosted ? "Organic vs Boosted" : "Traffic by Time of Day");
    const displaySubtitle = subtitle || (isOrganicBoosted ? "Performance comparison across events" : "Visitor density across the day");

    return (
        <div
            className={`relative w-full max-w-[1200px] min-h-[419px] p-6 flex flex-col justify-between bg-[#0E093C]/76 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.05)] rounded-[22px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(124,58,237,0.15)_0%,rgba(0,0,0,0)_100%)] pointer-events-none z-0" />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 w-full mb-4">
                <div className="flex flex-col gap-1">
                    {/* SecLabel */}
                    <div className="flex items-center gap-2 h-[14px]">
                        <div
                            className="w-[4px] h-[14px] rounded-full shrink-0"
                            style={{
                                background: "linear-gradient(180deg, #7C3AED 0%, #E8FF57 100%)",
                            }}
                        />
                        <span className="font-extrabold text-[9px] leading-[14px] tracking-[1.35px] text-[#8B7EC8] uppercase">
                            {displayTag}
                        </span>
                    </div>

                    {/* Heading 3 */}
                    <h3 className="font-extrabold text-[18px] sm:text-[20px] leading-[24px] text-white pt-1">
                        {displayTitle}
                    </h3>

                    {/* Paragraph */}
                    <p className="font-normal text-[11px] leading-[16px] text-[#8B7EC8]">
                        {displaySubtitle}
                    </p>
                </div>

                {/* Right Legend for Organic vs Boosted */}
                {isOrganicBoosted && (
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-[3px] bg-[#A855F7] shrink-0" />
                            <span className="font-semibold text-[12px] text-[#8B7EC8]">Organic</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-[3px] bg-[#E8FF57] shrink-0" />
                            <span className="font-semibold text-[12px] text-[#8B7EC8]">Boosted</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Chart Area: Grid, Y-Axis, and Bar Groups */}
            <div className="relative w-full h-[270px] mt-2 z-10 flex flex-col justify-end">
                {/* Y-Axis Grid Lines & Labels Container */}
                <div className="absolute inset-0 left-0 right-0 h-[241px]">
                    {Y_AXIS_TICKS.map((tick) => (
                        <div
                            key={tick.label}
                            className="absolute w-full flex items-center gap-3"
                            style={{ top: `${tick.positionPx}px` }}
                        >
                            {/* Y-Axis Label */}
                            <span className="w-[32px] text-right font-['Inter'] font-normal text-[10px] leading-[12px] text-[#8B7EC8] shrink-0">
                                {tick.label}
                            </span>
                            {/* Horizontal Grid Line */}
                            <div className="flex-1 h-[1px] bg-[rgba(124,58,237,0.12)]" />
                        </div>
                    ))}
                </div>

                {/* Render Bars Layout */}
                {isOrganicBoosted ? (
                    /* Organic vs Boosted Paired Bar Layout */
                    <div className="relative ml-[48px] mr-2 h-[270px] flex items-end justify-between gap-1.5 sm:gap-3 overflow-x-auto scrollbar-none">
                        {groups.map((grp, idx) => {
                            const isHovered = activeSlot === grp.id;
                            return (
                                <div
                                    key={`${grp.id}-${idx}`}
                                    className="relative flex-1 min-w-[54px] max-w-[84px] flex flex-col items-center justify-end h-full group cursor-pointer"
                                    onMouseEnter={() => setActiveSlot(grp.id)}
                                    onMouseLeave={() => setActiveSlot(null)}
                                >
                                    {/* Hover Tooltip */}
                                    {isHovered && (
                                        <div className="absolute -top-12 z-30 px-3 py-1.5 bg-[#0C0854]/95 backdrop-blur-md border border-[#7C3AED] rounded-md shadow-lg flex flex-col gap-1 text-[11px] font-['Inter'] whitespace-nowrap animate-in fade-in zoom-in duration-150">
                                            <div className="flex items-center gap-2 text-[#A855F7]">
                                                <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                                                <span>Organic: <b>{grp.organicValue}</b></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#E8FF57]">
                                                <span className="w-2 h-2 rounded-full bg-[#E8FF57]" />
                                                <span>Boosted: <b>{grp.boostedValue}</b></span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dual Side-by-Side Bars */}
                                    <div className="flex items-end gap-1 w-full justify-center">
                                        {/* Organic Bar */}
                                        <div
                                            className="flex-1 max-w-[36px] rounded-t-[12px] bg-[#A855F7] transition-all duration-300 relative overflow-hidden"
                                            style={{
                                                height: `${grp.organicHeightPx}px`,
                                                boxShadow: isHovered ? "0px 0px 12px rgba(168,85,247,0.5)" : "none",
                                            }}
                                        />
                                        {/* Boosted Bar */}
                                        <div
                                            className="flex-1 max-w-[36px] rounded-t-[12px] bg-[#E8FF57] transition-all duration-300 relative overflow-hidden"
                                            style={{
                                                height: `${grp.boostedHeightPx}px`,
                                                boxShadow: isHovered ? "0px 0px 12px rgba(232,255,87,0.5)" : "none",
                                            }}
                                        />
                                    </div>

                                    {/* X-Axis Category Label */}
                                    <div className="h-[20px] flex items-center justify-center mt-2.5">
                                        <span
                                            className={`font-['Inter'] font-bold text-[9px] sm:text-[10px] leading-[12px] text-center truncate transition-colors duration-200 ${
                                                isHovered ? "text-white" : "text-[#8B7EC8]"
                                            }`}
                                        >
                                            {grp.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Default Time Slots Bar Layout */
                    <div className="relative ml-[48px] mr-2 h-[270px] flex items-end justify-between gap-2 sm:gap-4 md:gap-[36px]">
                        {slots.map((slot) => {
                            const isHovered = activeSlot === slot.id;
                            return (
                                <div
                                    key={slot.id}
                                    className="relative flex-1 max-w-[164px] flex flex-col items-center justify-end h-full group cursor-pointer"
                                    onMouseEnter={() => setActiveSlot(slot.id)}
                                    onMouseLeave={() => setActiveSlot(null)}
                                >
                                    {/* Tooltip on Hover */}
                                    {isHovered && (
                                        <div className="absolute -top-10 z-30 px-3 py-1 bg-[#0C0854]/95 backdrop-blur-md border border-[#7C3AED] rounded-md shadow-lg flex items-center gap-1.5 whitespace-nowrap animate-in fade-in zoom-in duration-150">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: slot.color }}
                                            />
                                            <span className="font-['Inter'] text-xs font-semibold text-white">
                                                {slot.value} visitors
                                            </span>
                                        </div>
                                    )}

                                    {/* Bar Rectangle */}
                                    <div
                                        className="w-full rounded-t-[12px] transition-all duration-300 relative overflow-hidden"
                                        style={{
                                            height: `${slot.heightPx}px`,
                                            backgroundColor: slot.color,
                                            boxShadow: isHovered
                                                ? `0px 0px 20px ${slot.glowColor}, 0px 4px 12px rgba(0,0,0,0.3)`
                                                : "none",
                                            transform: isHovered ? "scaleY(1.02)" : "scaleY(1)",
                                            transformOrigin: "bottom",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-20 pointer-events-none"
                                            style={{
                                                background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)`,
                                            }}
                                        />
                                    </div>

                                    {/* X-Axis Category Label */}
                                    <div className="h-[20px] flex items-center justify-center mt-2.5">
                                        <span
                                            className={`font-['Inter'] font-bold text-[10px] leading-[12px] text-center transition-colors duration-200 ${
                                                isHovered ? "text-white" : "text-[#8B7EC8]"
                                            }`}
                                        >
                                            {slot.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrafficByTimeChart;
