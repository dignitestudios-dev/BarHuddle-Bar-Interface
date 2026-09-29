"use client";

import React, { useState, useMemo } from "react";
import { useSubscriptionPlans } from "@/features/subscription/api/subscription.queries";
import { usePurchasePlanMutation } from "@/features/subscription/api/subscription.mutations";
import { SubscriptionPlan } from "@/features/subscription/api/subscription.service";
import { toast } from "sonner";

export interface SubscriptionPlansModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan?: (planId: string) => void;
}

const FALLBACK_MODAL_PLANS: Partial<SubscriptionPlan>[] = [
    {
        key: "venue_free",
        label: "Starter",
        name: "Starter",
        displayPrice: 0,
        currency: "usd",
        features: [
            "Claim and verify venue",
            "Basic venue profile & hours",
            "Upload venue photos",
            "Receive customer reviews",
            "Basic foot-traffic analytics",
        ],
        sortOrder: 1,
    },
    {
        key: "venue_premium",
        label: "Growth",
        name: "Growth",
        displayPrice: 49,
        currency: "usd",
        features: [
            "Everything in Starter",
            "Create unlimited events",
            "Featured venue placement",
            "Attendee demographic insights",
            "Promotional tools",
            "Enhanced analytics",
        ],
        popular: true,
        sortOrder: 2,
    },
    {
        key: "venue_executive",
        label: "Executive",
        name: "Executive",
        displayPrice: 99,
        currency: "usd",
        features: [
            "Everything in Growth",
            "Top-tier priority placement",
            "Advanced analytics dashboard",
            "Dedicated VIP support",
            "Custom branding options",
            "Early access to new features",
        ],
        sortOrder: 3,
    },
];

function extractPlansFromResponse(response: any): SubscriptionPlan[] {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.plans)) return response.data.plans;
    if (Array.isArray(response?.plans)) return response.plans;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
}

const isValidMongoObjectId = (id?: string): boolean => {
    if (!id || typeof id !== "string") return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export function SubscriptionPlansModal({
    isOpen,
    onClose,
    onSelectPlan,
}: SubscriptionPlansModalProps) {
    const { data: plansResponse, isLoading, refetch } = useSubscriptionPlans(undefined, {
        enabled: isOpen,
    });
    const purchaseMutation = usePurchasePlanMutation();

    const [selectedKey, setSelectedKey] = useState<string>("venue_premium");

    const plans: SubscriptionPlan[] = useMemo(() => {
        const rawList = extractPlansFromResponse(plansResponse);
        const recurringList = rawList.filter(
            (p) => p.billingMode !== "one_time" && p.key !== "event_boost"
        );

        if (recurringList.length > 0) {
            return [...recurringList].sort((a, b) => {
                const priceA = a.displayPrice ?? a.price ?? 0;
                const priceB = b.displayPrice ?? b.price ?? 0;
                return priceA - priceB;
            });
        }
        return [];
    }, [plansResponse]);

    if (!isOpen) return null;

    const displayPlans = plans.length > 0 ? plans : (FALLBACK_MODAL_PLANS as SubscriptionPlan[]);

    const selectedPlan: SubscriptionPlan | null = useMemo(() => {
        if (plans.length > 0) {
            return (
                plans.find((p) => p.key === selectedKey) ||
                plans.find((p) => p.popular || p.key === "venue_premium") ||
                plans[0]
            );
        }
        return null;
    }, [plans, selectedKey]);

    const isFreePlan = (p: SubscriptionPlan | null) => {
        if (!p) return false;
        const price = p.displayPrice ?? p.price ?? 0;
        return price === 0 || p.key === "venue_free";
    };

    const handleContinue = async () => {
        if (!selectedPlan) {
            toast.loading("Loading subscription plans...");
            await refetch();
            return;
        }

        onSelectPlan?.(selectedPlan._id || selectedPlan.key);

        if (isFreePlan(selectedPlan)) {
            toast.success("Starter plan selected!");
            onClose();
            return;
        }

        const planId = selectedPlan._id || selectedPlan.id;
        if (!isValidMongoObjectId(planId)) {
            toast.error("Invalid plan identifier. Refreshing plans from server...");
            await refetch();
            return;
        }

        let toastId: string | number | undefined;
        try {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const successUrl = `${origin}/app/dashboard?checkout=success&planId=${planId}`;
            const cancelUrl = `${origin}/subscription?checkout=cancelled`;

            toastId = toast.loading(`Initiating secure checkout for ${selectedPlan.label || selectedPlan.name}...`);

            const result = await purchaseMutation.mutateAsync({
                planId: planId!,
                successUrl,
                cancelUrl,
            });

            if (toastId) toast.dismiss(toastId);

            if (result?.data?.checkoutUrl) {
                window.location.href = result.data.checkoutUrl;
            } else {
                toast.error("Could not obtain checkout URL.");
            }
        } catch (error: any) {
            if (toastId) toast.dismiss(toastId);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to initiate checkout.";
            toast.error(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200 overflow-y-auto font-['Manrope',sans-serif]">
            {/* Modal Card Outer Container */}
            <div className="relative w-full max-w-[1050px] my-auto bg-[#05033A] border border-[rgba(124,58,237,0.3)] shadow-[0px_8px_32px_rgba(0,0,0,0.5)] rounded-[24px] p-6 sm:p-10 flex flex-col items-center gap-8 max-h-[95vh] overflow-y-auto scrollbar-none">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-5 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-10"
                    aria-label="Close subscription modal"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header Title & Subtitle Area */}
                <div className="flex flex-col items-center gap-2 text-center max-w-[576px] mt-2">
                    <h1 className="font-extrabold text-[32px] sm:text-[44px] leading-[40px] sm:leading-[54px] bg-gradient-to-r from-white via-[#C4B5FD] to-[#E8FF57] bg-clip-text text-transparent tracking-tight">
                        Choose Your Plan
                    </h1>
                    <p className="font-normal text-[14px] sm:text-[15px] leading-[24px] text-[#9D8FD0]">
                        Select the plan that best fits your venue and unlock powerful management features.
                    </p>
                </div>

                {/* 3 Pricing Cards Grid Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch my-2">
                    {displayPlans.map((plan, idx) => {
                        const isSelected = (plan.key || "") === selectedKey;
                        const price = plan.displayPrice ?? plan.price ?? 0;
                        const isFree = price === 0 || plan.key === "venue_free";
                        const isPopular = plan.popular || plan.key === "venue_premium" || idx === 1;
                        const isExecutive = plan.key === "venue_executive" || idx === 2;

                        let badge = "STARTER";
                        if (isPopular) badge = "MOST POPULAR";
                        else if (isExecutive) badge = "BEST VALUE";

                        return (
                            <div
                                key={plan._id || plan.key || idx}
                                onClick={() => setSelectedKey(plan.key || "")}
                                className={`relative rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                                    isPopular
                                        ? isSelected
                                            ? "bg-gradient-to-b from-[rgba(124,58,237,0.55)] via-[rgba(79,20,150,0.45)] to-[rgba(20,14,80,0.7)] border-2 border-[#7C3AED] shadow-[0px_0px_50px_rgba(124,58,237,0.6)] scale-[1.03]"
                                            : "bg-gradient-to-b from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.25)] to-[rgba(20,14,80,0.55)] border border-[#7C3AED]/60 hover:border-[#7C3AED]"
                                        : isExecutive
                                        ? isSelected
                                            ? "bg-[rgba(20,14,80,0.9)] border-2 border-[#E8FF57] shadow-[0px_0px_35px_rgba(232,255,87,0.3)] scale-[1.02]"
                                            : "bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(232,255,87,0.4)]"
                                        : isSelected
                                        ? "bg-[rgba(20,14,80,0.9)] border-2 border-[#7C3AED] shadow-[0px_0px_30px_rgba(124,58,237,0.4)] scale-[1.02]"
                                        : "bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(124,58,237,0.5)]"
                                }`}
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Card Top Pill & Icon Header */}
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`px-3 py-1 rounded-full border ${
                                                isPopular
                                                    ? "bg-[rgba(124,58,237,0.35)] border-[rgba(124,58,237,0.5)]"
                                                    : isExecutive
                                                    ? "bg-[rgba(232,255,87,0.12)] border-[rgba(232,255,87,0.3)]"
                                                    : "bg-[rgba(157,143,208,0.12)] border-[rgba(157,143,208,0.25)]"
                                            }`}
                                        >
                                            <span
                                                className={`font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase ${
                                                    isPopular
                                                        ? "text-white"
                                                        : isExecutive
                                                        ? "text-[#E8FF57]"
                                                        : "text-[#9D8FD0]"
                                                }`}
                                            >
                                                {badge}
                                            </span>
                                        </div>
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                                isPopular
                                                    ? "bg-[rgba(124,58,237,0.3)] text-[#7C3AED]"
                                                    : isExecutive
                                                    ? "bg-[rgba(232,255,87,0.12)] text-[#E8FF57]"
                                                    : "bg-[rgba(157,143,208,0.12)] text-[#9D8FD0]"
                                            }`}
                                        >
                                            {isPopular ? (
                                                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                            ) : isExecutive ? (
                                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    {/* Plan Name & Tagline */}
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-extrabold text-[20px] leading-[28px] text-white">
                                            {plan.label || plan.name}
                                        </h3>
                                        <p className="font-normal text-[12px] leading-[20px] text-[#9D8FD0]">
                                            {isFree
                                                ? "Perfect for getting started on BarHuddle."
                                                : isPopular
                                                ? "For venues looking to increase visibility and engagement."
                                                : "Advanced tools for high-performing venues."}
                                        </p>
                                    </div>

                                    {/* Pricing Display */}
                                    <div className="flex items-baseline gap-1.5 pt-2">
                                        {isFree ? (
                                            <>
                                                <span className="font-extrabold text-[36px] leading-[36px] text-[#9D8FD0]">
                                                    Free
                                                </span>
                                                <span className="font-semibold text-[14px] leading-[20px] text-[#9D8FD0]">
                                                    forever
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    className={`font-extrabold text-[40px] leading-[42px] ${
                                                        isExecutive ? "text-[#E8FF57]" : "text-white drop-shadow"
                                                    }`}
                                                >
                                                    ${price}
                                                </span>
                                                <span className="font-semibold text-[13px] leading-[17px] text-[#9D8FD0]">
                                                    /month
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Divider Line */}
                                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.4)] to-transparent my-1" />

                                    {/* Features List */}
                                    <div className="flex flex-col gap-2.5">
                                        {(plan.features && plan.features.length > 0
                                            ? plan.features
                                            : ["Claim your venue", "Basic venue profile", "Display operating hours"]
                                        ).map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2 text-[12px] leading-[16px] text-[#C4B5FD]">
                                                <div
                                                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                                        isExecutive
                                                            ? "bg-[rgba(232,255,87,0.12)] text-[#E8FF57]"
                                                            : isPopular
                                                            ? "bg-[rgba(124,58,237,0.3)] text-[#7C3AED]"
                                                            : "bg-[rgba(157,143,208,0.12)] text-[#9D8FD0]"
                                                    }`}
                                                >
                                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className={fIdx === 0 && (isPopular || isExecutive) ? "font-bold text-[#E8FF57]" : ""}>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Action Button ("Next" / Continue CTA) */}
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={purchaseMutation.isPending}
                    className="min-w-[180px] h-[54px] px-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center font-extrabold text-[15px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                    {purchaseMutation.isPending ? "Connecting..." : "Select Plan"}
                </button>
            </div>
        </div>
    );
}

export default SubscriptionPlansModal;
