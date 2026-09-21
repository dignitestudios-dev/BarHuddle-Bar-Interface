"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { updateUser } from "@/store/slices/auth.slice";
import { useSubscriptionPlans } from "@/features/subscription/api/subscription.queries";

export interface SubscriptionPlansScreenProps {
    onBack?: () => void;
    onSelectPlan?: (planId: string) => void;
    className?: string;
}

export function SubscriptionPlansScreen({
    onBack,
    onSelectPlan,
    className = "",
}: SubscriptionPlansScreenProps) {
    const [selectedPlan, setSelectedPlan] = useState<string>("growth");
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { data: plansData, isLoading, isFetching } = useSubscriptionPlans();

    React.useEffect(() => {
        if (plansData?.data?.isSubscribed) {
            dispatch(updateUser({ isSubscribed: true }));
            router.push("/app/dashboard");
        }
    }, [plansData, dispatch, router]);

    const handleContinue = async () => {
        onSelectPlan?.(selectedPlan);

        // Update user auth state and navigate to dashboard
        dispatch(updateUser({ isSubscribed: true, isClaimed: "approved" }));
        router.push("/app/dashboard");
    };

    if (isLoading || isFetching) {
        return <SubscriptionSkeleton className={className} onBack={onBack} />;
    }

    const planNameDisplay =
        selectedPlan === "starter"
            ? "Starter"
            : selectedPlan === "growth"
            ? "Growth"
            : "Premium";

    return (
        <div
            className={`w-full max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 pt-2 sm:pt-4 md:pt-6 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 font-['Manrope',sans-serif] animate-in fade-in duration-300 ${className}`}
        >
            {/* Top Navigation Header with Back / Skip Button on Left */}
            <div className="w-full flex items-center justify-start gap-3 sm:gap-4 min-h-[48px] sm:min-h-[57px] relative z-30 pointer-events-auto">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer z-30 shadow-md"
                        aria-label="Go back"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Skip CTA Button on Left */}
                <button
                    type="button"
                    onClick={handleContinue}
                    className="relative z-30 h-[40px] sm:h-[48px] px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] hover:brightness-125 hover:from-[#8B5CF6] hover:to-[#B45FF2] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] hover:shadow-[0px_0px_36px_rgba(124,58,237,0.85)] flex items-center justify-center font-extrabold text-[14px] sm:text-[15px] text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
                >
                    <span className="pointer-events-none font-extrabold tracking-wide text-white">
                        Skip
                    </span>
                </button>
            </div>

            {/* Main Header Title & Subtitle Area */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 text-center max-w-[650px] mx-auto px-2">
                <h1 className="font-extrabold text-[28px] sm:text-[38px] md:text-[46px] leading-[34px] sm:leading-[46px] md:leading-[54px] bg-gradient-to-r from-white via-[#C4B5FD] to-[#E8FF57] bg-clip-text text-transparent tracking-tight">
                    Choose Your Plan
                </h1>
                <p className="font-normal text-[13.5px] sm:text-[15px] md:text-[16px] leading-[20px] sm:leading-[24px] md:leading-[26px] text-[#9D8FD0]">
                    Select the plan that best fits your venue and unlock powerful features.
                </p>
            </div>

            {/* 3 Pricing Cards Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full items-stretch my-2">
                {/* 1. Starter Card */}
                <div
                    onClick={() => setSelectedPlan("starter")}
                    className={`relative rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 md:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                        selectedPlan === "starter"
                            ? "bg-[rgba(20,14,80,0.95)] border-2 border-[#7C3AED] shadow-[0px_0px_30px_rgba(124,58,237,0.45)] lg:scale-[1.02]"
                            : "bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(124,58,237,0.5)] hover:bg-[rgba(20,14,80,0.75)]"
                    }`}
                >
                    {/* Selected Badge Indicator */}
                    {selectedPlan === "starter" && (
                        <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#7C3AED] text-white text-[11px] font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Selected
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {/* Card Top Pill & Icon Header */}
                        <div className="flex items-center justify-between">
                            <div className="px-3 py-1 rounded-full bg-[rgba(157,143,208,0.12)] border border-[rgba(157,143,208,0.25)]">
                                <span className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#9D8FD0]">
                                    STARTER
                                </span>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-[rgba(157,143,208,0.12)] flex items-center justify-center text-[#9D8FD0]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* Plan Name & Tagline */}
                        <div className="flex flex-col gap-1">
                            <h3 className="font-extrabold text-[20px] sm:text-[22px] leading-[28px] text-white">
                                Free
                            </h3>
                            <p className="font-normal text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20px] text-[#9D8FD0]">
                                Perfect for getting started on BarHuddle.
                            </p>
                        </div>

                        {/* Pricing Display */}
                        <div className="flex items-baseline gap-1.5 pt-1 sm:pt-2">
                            <span className="font-extrabold text-[32px] sm:text-[36px] leading-[36px] text-[#9D8FD0]">
                                Free
                            </span>
                            <span className="font-semibold text-[13px] sm:text-[14px] leading-[20px] text-[#9D8FD0]">
                                forever
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.4)] to-transparent my-1" />

                        {/* Features List */}
                        <div className="flex flex-col gap-2 sm:gap-2.5">
                            {[
                                "Claim your venue",
                                "Basic venue profile",
                                "Display operating hours",
                                "Upload venue photos",
                                "Receive venue reviews",
                                "Basic analytics",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[12px] sm:text-[13px] leading-[17px] text-[#C4B5FD]">
                                    <div className="w-4 h-4 rounded-full bg-[rgba(157,143,208,0.12)] flex items-center justify-center shrink-0">
                                        <svg className="w-2.5 h-2.5 text-[#9D8FD0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card Action Button */}
                    <div className="mt-6 pt-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlan("starter");
                            }}
                            className={`w-full py-2.5 sm:py-3 rounded-[16px] text-[13px] sm:text-[14px] font-bold transition-all ${
                                selectedPlan === "starter"
                                    ? "bg-[#7C3AED] text-white shadow-[0px_0px_16px_rgba(124,58,237,0.5)]"
                                    : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {selectedPlan === "starter" ? "Plan Selected" : "Choose Starter"}
                        </button>
                    </div>
                </div>

                {/* 2. Growth Card (MOST POPULAR) */}
                <div
                    onClick={() => setSelectedPlan("growth")}
                    className={`relative rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 md:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                        selectedPlan === "growth"
                            ? "bg-gradient-to-b from-[rgba(124,58,237,0.55)] via-[rgba(79,20,150,0.45)] to-[rgba(20,14,80,0.85)] border-2 border-[#7C3AED] shadow-[0px_0px_45px_rgba(124,58,237,0.6)] lg:scale-[1.03]"
                            : "bg-gradient-to-b from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.25)] to-[rgba(20,14,80,0.6)] border border-[#7C3AED]/60 hover:border-[#7C3AED] hover:bg-gradient-to-b hover:from-[rgba(124,58,237,0.45)]"
                    }`}
                >
                    {/* Selected Badge Indicator */}
                    {selectedPlan === "growth" && (
                        <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#7C3AED] text-white text-[11px] font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Selected
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {/* Card Top Pill & Icon Header */}
                        <div className="flex items-center justify-between">
                            <div className="px-3.5 py-1 rounded-full bg-[rgba(124,58,237,0.4)] border border-[rgba(124,58,237,0.6)]">
                                <span className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase text-white">
                                    MOST POPULAR
                                </span>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#7C3AED]">
                                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                        </div>

                        {/* Plan Name & Tagline */}
                        <div className="flex flex-col gap-1">
                            <h3 className="font-extrabold text-[21px] sm:text-[23px] leading-[29px] text-white">
                                Growth
                            </h3>
                            <p className="font-normal text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20px] text-[#9D8FD0]">
                                For venues looking to increase visibility and engagement.
                            </p>
                        </div>

                        {/* Pricing Display */}
                        <div className="flex items-baseline gap-1 pt-1 sm:pt-2">
                            <span className="font-extrabold text-[36px] sm:text-[44px] leading-[44px] text-white drop-shadow">
                                $49
                            </span>
                            <span className="font-semibold text-[13px] leading-[17px] text-[#9D8FD0]">
                                /month
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.6)] to-transparent my-1" />

                        {/* Features List */}
                        <div className="flex flex-col gap-2 sm:gap-2.5">
                            {[
                                "Everything in Free",
                                "Create unlimited events",
                                "Featured venue placement",
                                "Attendee insights",
                                "Audience demographics",
                                "Promotional tools",
                                "Enhanced analytics",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[12px] sm:text-[13px] leading-[17px] text-[#C4B5FD]">
                                    <div className="w-4 h-4 rounded-full bg-[rgba(124,58,237,0.3)] flex items-center justify-center shrink-0">
                                        <svg className="w-2.5 h-2.5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className={idx === 0 ? "font-bold text-[#E8FF57]" : ""}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card Action Button */}
                    <div className="mt-6 pt-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlan("growth");
                            }}
                            className={`w-full py-2.5 sm:py-3 rounded-[16px] text-[13px] sm:text-[14px] font-bold transition-all ${
                                selectedPlan === "growth"
                                    ? "bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-[0px_0px_20px_rgba(124,58,237,0.6)]"
                                    : "bg-white/10 border border-[#7C3AED]/40 text-white hover:bg-[#7C3AED]/30"
                            }`}
                        >
                            {selectedPlan === "growth" ? "Plan Selected" : "Choose Growth"}
                        </button>
                    </div>
                </div>

                {/* 3. Premium Card (BEST VALUE) */}
                <div
                    onClick={() => setSelectedPlan("premium")}
                    className={`relative rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 md:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer md:col-span-2 lg:col-span-1 ${
                        selectedPlan === "premium"
                            ? "bg-[rgba(20,14,80,0.95)] border-2 border-[#E8FF57] shadow-[0px_0px_35px_rgba(232,255,87,0.35)] lg:scale-[1.02]"
                            : "bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(232,255,87,0.4)] hover:bg-[rgba(20,14,80,0.75)]"
                    }`}
                >
                    {/* Selected Badge Indicator */}
                    {selectedPlan === "premium" && (
                        <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#E8FF57] text-[#05033A] text-[11px] font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1">
                            <svg className="w-3 h-3 text-[#05033A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Selected
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {/* Card Top Pill & Icon Header */}
                        <div className="flex items-center justify-between">
                            <div className="px-3 py-1 rounded-full bg-[rgba(232,255,87,0.12)] border border-[rgba(232,255,87,0.3)]">
                                <span className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#E8FF57]">
                                    BEST VALUE
                                </span>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-[rgba(232,255,87,0.12)] flex items-center justify-center text-[#E8FF57]">
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Plan Name & Tagline */}
                        <div className="flex flex-col gap-1">
                            <h3 className="font-extrabold text-[20px] sm:text-[22px] leading-[28px] text-white">
                                Premium
                            </h3>
                            <p className="font-normal text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20px] text-[#9D8FD0]">
                                Advanced tools for high-performing venues.
                            </p>
                        </div>

                        {/* Pricing Display */}
                        <div className="flex items-baseline gap-1 pt-1 sm:pt-2">
                            <span className="font-extrabold text-[36px] sm:text-[44px] leading-[44px] text-[#E8FF57]">
                                $99
                            </span>
                            <span className="font-semibold text-[12px] sm:text-[13px] leading-[16px] text-[#9D8FD0]">
                                /month
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.4)] to-transparent my-1" />

                        {/* Features List */}
                        <div className="flex flex-col gap-2 sm:gap-2.5">
                            {[
                                "Everything in Growth",
                                "Priority venue placement",
                                "Advanced analytics dashboard",
                                "VIP support",
                                "Premium branding options",
                                "Marketing campaign tools",
                                "Early access to new features",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[12px] sm:text-[13px] leading-[17px] text-[#C4B5FD]">
                                    <div className="w-4 h-4 rounded-full bg-[rgba(232,255,87,0.12)] flex items-center justify-center shrink-0">
                                        <svg className="w-2.5 h-2.5 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className={idx === 0 ? "font-bold text-[#E8FF57]" : ""}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card Action Button */}
                    <div className="mt-6 pt-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlan("premium");
                            }}
                            className={`w-full py-2.5 sm:py-3 rounded-[16px] text-[13px] sm:text-[14px] font-bold transition-all ${
                                selectedPlan === "premium"
                                    ? "bg-[#E8FF57] text-[#05033A] shadow-[0px_0px_20px_rgba(232,255,87,0.4)]"
                                    : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {selectedPlan === "premium" ? "Plan Selected" : "Choose Premium"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Action Area */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 pt-2">
                <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full sm:w-auto min-w-[240px] h-[52px] sm:h-[56px] px-8 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#9F4FFA] hover:brightness-110 active:scale-95 text-white font-extrabold text-[15px] sm:text-[16px] tracking-wide shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] hover:shadow-[0px_0px_36px_rgba(124,58,237,0.85)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>Continue with {planNameDisplay}</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function SubscriptionSkeleton({ className = "", onBack }: { className?: string; onBack?: () => void }) {
    return (
        <div
            className={`w-full max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 pt-2 sm:pt-4 md:pt-6 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 font-['Manrope',sans-serif] animate-pulse ${className}`}
        >
            {/* Top Navigation Header Skeleton */}
            <div className="w-full flex items-center justify-start gap-3 sm:gap-4 min-h-[48px] sm:min-h-[57px]">
                {onBack && (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10" />
                )}
                <div className="w-[100px] h-[40px] sm:h-[48px] rounded-full bg-white/10" />
            </div>

            {/* Main Header Title & Subtitle Skeleton */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 text-center max-w-[650px] mx-auto w-full px-2">
                <div className="h-9 sm:h-12 w-64 sm:w-96 rounded-full bg-white/10" />
                <div className="h-4 sm:h-5 w-52 sm:w-80 rounded-full bg-white/5" />
            </div>

            {/* 3 Pricing Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full items-stretch my-2">
                {[1, 2, 3].map((cardIdx) => (
                    <div
                        key={cardIdx}
                        className={`rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 md:p-7 flex flex-col gap-5 bg-[rgba(20,14,80,0.6)] border ${
                            cardIdx === 2
                                ? "border-[rgba(124,58,237,0.4)] bg-[rgba(124,58,237,0.15)] shadow-[0px_0px_30px_rgba(124,58,237,0.2)]"
                                : "border-[rgba(124,58,237,0.18)]"
                        } ${cardIdx === 3 ? "md:col-span-2 lg:col-span-1" : ""}`}
                    >
                        {/* Top Pill & Icon */}
                        <div className="flex items-center justify-between">
                            <div className="w-20 h-6 rounded-full bg-white/10" />
                            <div className="w-9 h-9 rounded-full bg-white/10" />
                        </div>

                        {/* Title & Tagline */}
                        <div className="flex flex-col gap-2">
                            <div className="h-6 sm:h-7 w-28 rounded-lg bg-white/10" />
                            <div className="h-4 w-44 rounded-lg bg-white/5" />
                        </div>

                        {/* Price */}
                        <div className="h-9 sm:h-10 w-32 rounded-lg bg-white/10 mt-1" />

                        {/* Divider */}
                        <div className="w-full h-[1px] bg-white/10 my-1" />

                        {/* Features List Skeleton */}
                        <div className="flex flex-col gap-2.5">
                            {[1, 2, 3, 4, 5, 6].map((featIdx) => (
                                <div key={featIdx} className="flex items-center gap-2.5">
                                    <div className="w-4 h-4 rounded-full bg-white/10 shrink-0" />
                                    <div
                                        className="h-3.5 rounded-md bg-white/5"
                                        style={{ width: `${60 + (featIdx * 5) % 35}%` }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="h-10 w-full rounded-[16px] bg-white/10 mt-4" />
                    </div>
                ))}
            </div>

            {/* Bottom Button Skeleton */}
            <div className="w-full flex justify-center mt-4">
                <div className="w-full sm:w-60 h-[52px] sm:h-[56px] rounded-full bg-white/10" />
            </div>
        </div>
    );
}

export default SubscriptionPlansScreen;

