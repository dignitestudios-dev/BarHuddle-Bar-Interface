"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export type StatsColorVariant =
    | "purple"
    | "cyan"
    | "yellow"
    | "green"
    | "coral"
    | "pink"
    | "orange";

export interface StatsCardProps {
    title?: string;
    value?: string;
    trend?: string;
    isPositive?: boolean;
    variant?: StatsColorVariant;
    icon?: React.ReactNode;
    className?: string;
}

// Color palette config mapping variants to stroke, fill, icon bg, and border styles
const COLOR_VARIANTS: Record<
    StatsColorVariant,
    {
        stroke: string;
        fill: string;
        iconText: string;
        iconBg: string;
        iconBorder: string;
        cardBorderHover: string;
    }
> = {
    purple: {
        stroke: "#9F4FFA",
        fill: "#7C3AED",
        iconText: "#9F4FFA",
        iconBg: "rgba(124, 58, 237, 0.12)",
        iconBorder: "rgba(124, 58, 237, 0.25)",
        cardBorderHover: "rgba(124, 58, 237, 0.5)",
    },
    cyan: {
        stroke: "#38BDF8",
        fill: "#22D3EE",
        iconText: "#38BDF8",
        iconBg: "rgba(6, 182, 212, 0.12)",
        iconBorder: "rgba(6, 182, 212, 0.25)",
        cardBorderHover: "rgba(6, 182, 212, 0.5)",
    },
    yellow: {
        stroke: "#E8FF57",
        fill: "#e4f76cff",
        iconText: "#E8FF57",
        iconBg: "rgba(232, 255, 87, 0.12)",
        iconBorder: "rgba(232, 255, 87, 0.25)",
        cardBorderHover: "rgba(232, 255, 87, 0.5)",
    },
    green: {
        stroke: "#62e090ff",
        fill: "#4ADE80",
        iconText: "#4ADE80",
        iconBg: "rgba(74, 222, 128, 0.12)",
        iconBorder: "rgba(74, 222, 128, 0.25)",
        cardBorderHover: "rgba(74, 222, 128, 0.5)",
    },
    coral: {
        stroke: "#FB7185",
        fill: "#F43F5E",
        iconText: "#FB7185",
        iconBg: "rgba(244, 63, 94, 0.12)",
        iconBorder: "rgba(244, 63, 94, 0.25)",
        cardBorderHover: "rgba(244, 63, 94, 0.5)",
    },
    pink: {
        stroke: "#F472B6",
        fill: "#EC4899",
        iconText: "#F472B6",
        iconBg: "rgba(236, 72, 153, 0.12)",
        iconBorder: "rgba(236, 72, 153, 0.25)",
        cardBorderHover: "rgba(236, 72, 153, 0.5)",
    },
    orange: {
        stroke: "#FB923C",
        fill: "#F97316",
        iconText: "#FB923C",
        iconBg: "rgba(249, 115, 22, 0.12)",
        iconBorder: "rgba(249, 115, 22, 0.25)",
        cardBorderHover: "rgba(249, 115, 22, 0.5)",
    },
};

export function StatsCard({
    title = "Total Visitors",
    value = "12,840",
    trend = "+18.4%",
    isPositive = true,
    variant = "purple",
    icon,
    className,
}: StatsCardProps) {
    const rawId = useId();
    const gradientId = `paint0_linear_${variant}_${rawId.replace(/:/g, "")}`;
    const mask0Id = `mask0_${rawId.replace(/:/g, "")}`;
    const mask1Id = `mask1_${rawId.replace(/:/g, "")}`;

    const config = COLOR_VARIANTS[variant] || COLOR_VARIANTS.purple;

    return (
        <div
            className={cn(
                "relative w-[260px] h-[134px] p-[16.8px] flex flex-col justify-between overflow-hidden select-none font-['Manrope',sans-serif]",
                "bg-gradient-to-br from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.2)] to-[rgba(5,3,58,0.1)]",
                "border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_60px_rgba(124,58,237,0.15)] rounded-[24px]",
                "transition-all duration-300",
                className
            )}
        >
            {/* Top Row: Icon Container */}
            <div className="flex items-center justify-between w-full relative z-10">
                {/* Icon Container with Variant Styling */}
                <div
                    className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0 shadow-[0px_0px_12px_rgba(124,58,237,0.094)]"
                    style={{
                        backgroundColor: config.iconBg,
                        borderColor: config.iconBorder,
                        borderWidth: "0.8px",
                        color: config.iconText,
                    }}
                >
                    {icon ? (
                        icon
                    ) : (
                        /* Default Users Icon */
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    )}
                </div>
            </div>

            {/* Bottom Row: Value & Subtitle */}
            <div className="flex flex-col items-start relative z-10">
                <span className="font-extrabold text-[22px] leading-[22px] tracking-[-0.55px] text-white">
                    {value}
                </span>
                <span className="font-semibold text-[11px] leading-[16px] text-[#8B7EC8] mt-1">
                    {title}
                </span>
            </div>

            {/* Background Sparkline Area Wave SVG with Dynamic Variant Colors */}
            <div className="absolute -right-6 top-21.5 w-[195px] h-[68px] pointer-events-none z-0 overflow-hidden rounded-br-[24px]">
                <svg
                    className="w-full h-full object-cover pointer-events-none"
                    viewBox="0 0 897 366"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <mask id={mask0Id} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="897" height="366">
                        <path d="M857.583 0.00066246L0 195.937L38.7723 365.695L896.355 169.76L857.583 0.00066246Z" fill="white" />
                    </mask>
                    <g mask={`url(#${mask0Id})`}>
                        <mask id={mask1Id} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="17" y="4" width="863" height="363">
                            <path d="M839.717 4.08301L17.8667 191.854L57.6593 366.081L879.508 178.309L839.717 4.08301Z" fill="white" />
                        </mask>
                        <g mask={`url(#${mask1Id})`}>
                            {/* Area Gradient Fill */}
                            <path
                                d="M30.7021 248.052C67.9346 230.775 105.168 213.502 144.304 204.56C183.44 195.619 225.13 197.859 266.03 196.66C306.933 195.456 350.585 206.287 389.721 197.345C428.858 188.404 467.853 178.846 506.706 168.662C545.558 158.483 579.851 128.34 616.866 110.11C653.877 91.8777 689.65 68.2205 728.786 59.2789C767.923 50.3376 808.369 47.1231 848.812 43.9131L878.487 173.841C839.35 182.783 800.219 191.724 761.082 200.666C721.946 209.607 682.81 218.549 643.678 227.49C604.542 236.431 565.405 245.373 526.269 254.314C487.133 263.256 447.996 272.198 408.859 281.139C369.723 290.081 330.587 299.022 291.451 307.964C252.32 316.905 213.183 325.846 174.047 334.788C134.911 343.729 95.7748 352.671 56.6385 361.613L30.7021 248.052Z"
                                fill={`url(#${gradientId})`}
                                fillOpacity="0.6"
                            />
                            {/* Wave Stroke Line */}
                            <path
                                d="M30.7021 248.052C67.9346 230.775 105.168 213.502 144.304 204.56C183.44 195.619 225.13 197.859 266.03 196.66C306.933 195.456 350.585 206.287 389.721 197.345C428.858 188.404 467.853 178.846 506.706 168.662C545.558 158.483 579.851 128.34 616.866 110.11C653.877 91.8777 689.65 68.2205 728.786 59.2789C767.923 50.3376 808.369 47.1231 848.812 43.9131"
                                stroke={config.stroke}
                                strokeWidth="1.8"
                            />
                        </g>
                    </g>
                    <defs>
                        <linearGradient id={gradientId} x1="24.3466" y1="220.226" x2="56.649" y2="361.61" gradientUnits="userSpaceOnUse">
                            <stop stopColor={config.fill} stopOpacity="0.45" />
                            <stop offset="1" stopColor={config.fill} stopOpacity="0.01" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}

export default StatsCard;
