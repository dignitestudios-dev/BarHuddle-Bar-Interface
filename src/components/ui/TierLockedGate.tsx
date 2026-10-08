"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";

export interface TierLockedGateProps {
    requiredTier?: "premium" | "executive";
    title?: string;
    description?: string;
    featureList?: string[];
    children?: React.ReactNode;
    blurContent?: boolean;
    className?: string;
    compact?: boolean;
}

export function TierLockedGate({
    requiredTier = "premium",
    title,
    description,
    featureList,
    children,
    blurContent = false,
    className = "",
    compact = false,
}: TierLockedGateProps) {
    const isExecutive = requiredTier === "executive";

    const defaultTitle = isExecutive
        ? "Pro Analytics & Intelligence"
        : "Pro Analytics & Intelligence";

    const defaultDescription =
        "Unlock real-time visitor check-ins, demographics, customer retention metrics, event attendance tracking, sentiment intelligence, boost ROI, and data reports with the Pro Plan ($9.99/mo).";

    const defaultFeatures = [
        "Real-time check-ins & crowd size headcount",
        "Visitor demographics (gender ratio, median age, peak hours)",
        "Customer retention curves & repeat visitor patterns",
        "Event attendance, engagement, & turnout analytics",
        "Visitor sentiment poll results & satisfaction scores",
        "Boost ROI tracking & event promotion discounts ($9.99)",
        "Automated performance reports & data export",
    ];

    const displayTitle = title || defaultTitle;
    const displayDescription = description || defaultDescription;
    const displayFeatures = featureList || defaultFeatures;

    if (compact) {
        return (
            <div
                className={`relative rounded-[20px] p-5 backdrop-blur-md overflow-hidden flex flex-col items-center text-center gap-3 border bg-gradient-to-b from-[rgba(124,58,237,0.25)] via-[rgba(79,20,150,0.2)] to-[rgba(20,14,80,0.8)] border-[rgba(124,58,237,0.3)] shadow-[0px_0px_30px_rgba(124,58,237,0.15)] ${className}`}
            >
                <div className="w-10 h-10 rounded-full flex items-center justify-center border shadow-inner bg-[rgba(124,58,237,0.25)] border-[rgba(124,58,237,0.4)] text-[#C4B5FD]">
                    <Lock className="w-5 h-5" />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C4B5FD]">
                        PRO TIER REQUIRED
                    </span>
                    <h4 className="font-bold text-white text-[15px] leading-[20px]">
                        {displayTitle}
                    </h4>
                    <p className="text-[12px] text-[#9D8FD0] max-w-[280px]">
                        {displayDescription}
                    </p>
                </div>

                <Link
                    href="/app/settings?tab=subscription"
                    className="h-[36px] px-4 rounded-full font-bold text-[12px] flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-[0px_0px_16px_rgba(124,58,237,0.4)] hover:brightness-110 active:scale-95"
                >
                    <span>Upgrade to Pro ($9.99/mo)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        );
    }

    return (
        <div className={`relative w-full max-w-[1200px] overflow-hidden rounded-[24px] ${className}`}>
            {/* Optional underlying content with blur */}
            {children && (
                <div
                    className={
                        blurContent
                            ? "filter blur-[6px] opacity-40 pointer-events-none select-none"
                            : ""
                    }
                >
                    {children}
                </div>
            )}

            {/* Lock Overlay / Card */}
            <div
                className={`${
                    children
                        ? "absolute inset-0 z-20 flex items-center justify-center p-6 bg-[#05033A]/85 backdrop-blur-md"
                        : "relative w-full p-8 sm:p-10 backdrop-blur-md"
                } rounded-[24px] border bg-gradient-to-b from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.25)] to-[rgba(20,14,80,0.95)] border-[rgba(124,58,237,0.35)] shadow-[0px_0px_50px_rgba(124,58,237,0.2)]`}
            >
                {/* Radial Glow Effect */}
                <div
                    className="absolute w-[320px] h-[320px] right-[-50px] top-[-50px] pointer-events-none opacity-20 rounded-full"
                    style={{
                        background: "radial-gradient(50% 50% at 50% 50%, #7C3AED 0%, rgba(0, 0, 0, 0) 70%)",
                    }}
                />

                <div className="relative z-10 flex flex-col items-center text-center max-w-[620px] mx-auto gap-5">
                    {/* Top Tier Badge & Lock Icon */}
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg bg-[rgba(124,58,237,0.25)] border-[rgba(124,58,237,0.5)] text-[#C4B5FD]">
                            <Lock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-extrabold uppercase tracking-wider mx-auto">
                            <Sparkles className="w-3.5 h-3.5 text-[#E8FF57]" />
                            <span className="text-[#C4B5FD]">
                                PRO PLAN REQUIRED
                            </span>
                        </div>

                        <h3 className="font-extrabold text-[24px] sm:text-[28px] text-white leading-tight">
                            {displayTitle}
                        </h3>

                        <p className="font-normal text-[14px] sm:text-[15px] leading-[22px] text-[#C4B5FD]">
                            {displayDescription}
                        </p>
                    </div>

                    {/* Features checklist */}
                    {displayFeatures.length > 0 && (
                        <div className="w-full max-w-[500px] flex flex-col gap-2 text-left bg-black/25 border border-white/10 rounded-2xl p-4 sm:p-5 my-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B7EC8]">
                                Included with Pro Plan ($9.99/mo):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                {displayFeatures.map((feat, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-[12px] text-white/90">
                                        <svg
                                            className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Upgrade CTA */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                        <Link
                            href="/app/settings?tab=subscription"
                            className="min-w-[220px] h-[48px] px-6 rounded-full font-extrabold text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-[0px_0px_24px_rgba(124,58,237,0.5)] hover:brightness-110 active:scale-95"
                        >
                            <span>Upgrade to Pro Plan ($9.99/mo)</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TierLockedGate;
