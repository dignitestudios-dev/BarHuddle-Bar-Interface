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

    const { data: plansData, isLoading } = useSubscriptionPlans();

    React.useEffect(() => {
        if (plansData?.data?.isSubscribed) {
            dispatch(updateUser({ isSubscribed: true }));
            router.push("/app/dashboard");
        }
    }, [plansData, dispatch, router]);

    const handleContinue = async () => {
        onSelectPlan?.(selectedPlan);

        // Simulating the actual purchase logic for now
        // Normally this would be a mutation to subscribe to a plan
        dispatch(updateUser({ isSubscribed: true, isClaimed: "approved" }));
        router.push("/app/dashboard");
    };

    if (isLoading) {
        return <div className="text-white">Loading plans...</div>;
    }

    // For now we'll keep the hardcoded UI to retain the beautiful design, 
    // but in a real implementation we would map over plansData?.data?.plans.
    return (
        <div className={`w-full  flex flex-col gap-8 py-4 font-['Manrope',sans-serif] animate-in fade-in duration-300 ${className}`}>
            {/* Top Navigation Header with Back Button */}
            <div className="w-full flex items-center justify-between min-h-[57px]">

                {/* Bottom Action Button ("Next" CTA) */}

                <button
                    type="button"
                    onClick={handleContinue}
                    className="w-[98px] h-[57px] px-[30px] py-3 rounded-[24px] bg-gradient-to-br  from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center font-extrabold text-[16px] leading-[45px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                
                    Skip
                </button>

            </div>

            {/* Main Header Title & Subtitle Area */}
            <div className="flex flex-col items-center gap-3 text-center max-w-[650px] mx-auto">
                <h1 className="font-extrabold text-[36px] sm:text-[48px] leading-[44px] sm:leading-[60px] bg-gradient-to-r from-white via-[#C4B5FD] to-[#E8FF57] bg-clip-text text-transparent tracking-tight">
                    Choose Your Plan
                </h1>
                <p className="font-normal text-[15px] sm:text-[16px] leading-[26px] text-[#9D8FD0]">
                    Select the plan that best fits your venue and unlock powerful features.
                </p>
            </div>

            {/* 3 Pricing Cards Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch my-2">
                {/* 1. Starter Card */}
                <div
                    onClick={() => setSelectedPlan("starter")}
                    className={`relative rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${selectedPlan === "starter"
                        ? "bg-[rgba(20,14,80,0.9)] border-2 border-[#7C3AED] shadow-[0px_0px_30px_rgba(124,58,237,0.4)] scale-[1.02]"
                        : "bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(124,58,237,0.5)]"
                        }`}
                >
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
                            <h3 className="font-extrabold text-[20px] leading-[28px] text-white">
                                Free
                            </h3>
                            <p className="font-normal text-[12px] leading-[20px] text-[#9D8FD0]">
                                Perfect for getting started on BarHuddle.
                            </p>
                        </div>

                        {/* Pricing Display */}
                        <div className="flex items-baseline gap-1.5 pt-2">
                            <span className="font-extrabold text-[36px] leading-[36px] text-[#9D8FD0]">
                                Free
                            </span>
                            <span className="font-semibold text-[14px] leading-[20px] text-[#9D8FD0]">
                                forever
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.4)] to-transparent my-1" />

                        {/* Features List */}
                        <div className="flex flex-col gap-2.5">
                            {[
                                "Claim your venue",
                                "Basic venue profile",
                                "Display operating hours",
                                "Upload venue photos",
                                "Receive venue reviews",
                                "Basic analytics",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[12px] leading-[16px] text-[#C4B5FD]">
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
                </div>

                {/* 2. Growth Card (MOST POPULAR) */}
                <div
                    onClick={() => setSelectedPlan("growth")}
                    className={`relative rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${selectedPlan === "growth"
                        ? "bg-gradient-to-b from-[rgba(124,58,237,0.55)] via-[rgba(79,20,150,0.45)] to-[rgba(20,14,80,0.7)] border-2 border-[#7C3AED] shadow-[0px_0px_50px_rgba(124,58,237,0.6)] scale-[1.03]"
                        : "bg-gradient-to-b from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.25)] to-[rgba(20,14,80,0.55)] border border-[#7C3AED]/60 hover:border-[#7C3AED]"
                        }`}
                >
                    <div className="flex flex-col gap-4">
                        {/* Card Top Pill & Icon Header */}
                        <div className="flex items-center justify-between">
                            <div className="px-3.5 py-1 rounded-full bg-[rgba(124,58,237,0.35)] border border-[rgba(124,58,237,0.5)]">
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
                            <h3 className="font-extrabold text-[21px] leading-[29px] text-white">
                                Growth
                            </h3>
                            <p className="font-normal text-[12.5px] leading-[20px] text-[#9D8FD0]">
                                For venues looking to increase visibility and engagement.
                            </p>
                        </div>

                        {/* Pricing Display */}
                        <div className="flex items-baseline gap-1 pt-2">
                            <span className="font-extrabold text-[45px] leading-[46px] text-white drop-shadow">
                                $49
                            </span>
                            <span className="font-semibold text-[13px] leading-[17px] text-[#9D8FD0]">
                                /month
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.6)] to-transparent my-1" />

                        {/* Features List */}
                        <div className="flex flex-col gap-2.5">
                            {[
                                "Everything in Free",
                                "Create unlimited events",
                                "Featured venue placement",
                                "Attendee insights",
                                "Audience demographics",
                                "Promotional tools",
                                "Enhanced analytics",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[12.5px] leading-[17px] text-[#C4B5FD]">
                                    <div className="w-4 h-4 rounded-full bg-[rgba(124,58,237,0.3)] flex items-center justify-center shrink-0">
                                        <svg className="w-2.5 h-2.5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className={idx === 0 ? "font-bold text-[#7C3AED]" : ""}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Premium Card (BEST VALUE) */}
                <div
                    onClick={() => setSelectedPlan("premium")}
                    className={`relative rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${selectedPlan === "premium"
                        ? "bg-[rgba(20,14,80,0.9)] border-2 border-[#E8FF57] shadow-[0px_0px_35px_rgba(232,255,87,0.3)] scale-[1.02]"
                        : "bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(232,255,87,0.4)]"
                        }`}
                >
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
                            <h3 className="font-extrabold text-[20px] leading-[28px] text-white">
                                Premium
                            </h3>
                            <p className="font-normal text-[12px] leading-[20px] text-[#9D8FD0]">
                                Advanced tools for high-performing venues.
                            </p>
                        </div>

                        {/* Pricing Display */}
                        <div className="flex items-baseline gap-1 pt-2">
                            <span className="font-extrabold text-[44px] leading-[44px] text-[#E8FF57]">
                                $99
                            </span>
                            <span className="font-semibold text-[12px] leading-[16px] text-[#9D8FD0]">
                                /month
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.4)] to-transparent my-1" />

                        {/* Features List */}
                        <div className="flex flex-col gap-2.5">
                            {[
                                "Everything in Growth",
                                "Priority venue placement",
                                "Advanced analytics dashboard",
                                "VIP support",
                                "Premium branding options",
                                "Marketing campaign tools",
                                "Early access to new features",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[12px] leading-[16px] text-[#C4B5FD]">
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
                </div>
            </div>


        </div>
    );
}

export default SubscriptionPlansScreen;
