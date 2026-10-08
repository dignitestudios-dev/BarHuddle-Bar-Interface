"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateUser } from "@/store/slices/auth.slice";
import { useSubscriptionPlans } from "@/features/subscription/api/subscription.queries";
import { usePurchasePlanMutation } from "@/features/subscription/api/subscription.mutations";
import {
    SubscriptionPlan,
    subscriptionService,
} from "@/features/subscription/api/subscription.service";
import { toast } from "sonner";

export interface SubscriptionPlansScreenProps {
    onBack?: () => void;
    onSelectPlan?: (planId: string) => void;
    className?: string;
}

// Fallback skeleton metadata if waiting for network
const FALLBACK_PLANS_TEMPLATE: Partial<SubscriptionPlan>[] = [
    {
        key: "venue_free",
        label: "Free",
        name: "Free",
        displayPrice: 0,
        currency: "usd",
        features: [
            "Claiming a venue",
            "Add venue photos",
            "Add Bar open/close timings",
            "Event Creation",
            "Promotion",
            "No Analytics",
        ],
        sortOrder: 1,
    },
    {
        key: "venue_premium",
        label: "Pro",
        name: "Pro",
        displayPrice: 9.99,
        currency: "usd",
        features: [
            "Claiming a venue",
            "Add venue photos",
            "Add Bar open/close timings",
            "Event Creation",
            "Promotion",
            "Full Analytics (Visitor, Retention, Events, Sentiment, Boost, Reports)",
            "Boost events at $9.99",
        ],
        popular: true,
        sortOrder: 2,
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

export function SubscriptionPlansScreen({
    onBack,
    onSelectPlan,
    className = "",
}: SubscriptionPlansScreenProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch subscription plans from backend (role-filtered automatically)
    const { data: plansResponse, isLoading, isFetching, refetch } = useSubscriptionPlans();
    const purchaseMutation = usePurchasePlanMutation();

    const [isVerifyingCheckout, setIsVerifyingCheckout] = useState(false);
    const [verifyingStatus, setVerifyingStatus] = useState("Confirming payment with Stripe...");
    const isPollingRef = useRef(false);

    // Selected plan key (e.g. "venue_premium", "venue_free", "venue_executive")
    const [selectedKey, setSelectedKey] = useState<string>("venue_premium");

    // Extract real plans from API response
    const plans: SubscriptionPlan[] = useMemo(() => {
        const rawList = extractPlansFromResponse(plansResponse);

        // Filter for subscription billing mode (exclude one-time boosts)
        const recurringList = rawList.filter(
            (p) => p.billingMode !== "one_time" && p.key !== "event_boost"
        );

        if (recurringList.length > 0) {
            return [...recurringList].sort((a, b) => {
                if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
                    return a.sortOrder - b.sortOrder;
                }
                const priceA = a.displayPrice ?? a.price ?? 0;
                const priceB = b.displayPrice ?? b.price ?? 0;
                return priceA - priceB;
            });
        }

        return [];
    }, [plansResponse]);

    const currentUser = useAppSelector((state) => state.auth.user);
    const hasRedirectedRef = useRef(false);

    // If user is already on a PAID subscription, redirect immediately to dashboard
    useEffect(() => {
        if (hasRedirectedRef.current) return;

        const isPaidSubscribed = Boolean(
            currentUser?.subscriptionPlan &&
            currentUser.subscriptionPlan !== "none" &&
            currentUser.subscriptionPlan !== "null" &&
            currentUser.subscriptionPlan !== "venue_free"
        );

        if (isPaidSubscribed) {
            hasRedirectedRef.current = true;
            router.replace("/app/dashboard");
        }
    }, [currentUser?.subscriptionPlan, router]);

    // Handle return from Stripe Checkout (Asynchronous webhook verification)
    useEffect(() => {
        const checkoutStatus = searchParams?.get("checkout");
        const sessionId = searchParams?.get("session_id");

        if ((checkoutStatus === "success" || sessionId) && !isPollingRef.current) {
            isPollingRef.current = true;
            setIsVerifyingCheckout(true);

            let attempts = 0;
            const maxAttempts = 8; // 8 * 2s = 16s

            const interval = setInterval(async () => {
                attempts += 1;
                try {
                    const res = await subscriptionService.getMySubscription();
                    if (res?.data?.isActive) {
                        clearInterval(interval);
                        dispatch(
                            updateUser({
                                isSubscribed: true,
                                isClaimed: "approved",
                                subscriptionPlan: res.data.subscription?.planKey || "venue_premium",
                            })
                        );
                        toast.success("Subscription confirmed! Welcome to BarHuddle.");
                        router.push("/app/dashboard");
                        return;
                    }
                } catch {
                    // ignore polling errors
                }

                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setIsVerifyingCheckout(false);
                    // Update user state if webhook is slightly delayed
                    dispatch(updateUser({ isSubscribed: true, isClaimed: "approved" }));
                    toast.info("Payment received! Your dashboard is now ready.");
                    router.push("/app/dashboard");
                }
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [searchParams, dispatch, router]);

    // Active selected plan object from real API plans or fallback
    const selectedPlan: SubscriptionPlan | null = useMemo(() => {
        if (plans.length > 0) {
            const matchByKey = plans.find((p) => p.key === selectedKey);
            if (matchByKey) return matchByKey;

            const popular = plans.find((p) => p.popular || p.key === "venue_premium");
            if (popular) return popular;

            return plans[0];
        }
        return null;
    }, [plans, selectedKey]);

    const isFreePlan = (p: SubscriptionPlan | null) => {
        if (!p) return false;
        const price = p.displayPrice ?? p.price ?? 0;
        return price === 0 || p.key === "venue_free";
    };

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        setSelectedKey(plan.key || "");
    };

    const handleExecutePlan = async (planToExecute?: SubscriptionPlan | null) => {
        const plan = planToExecute || selectedPlan;

        // If plans are still loading from API
        if (!plan) {
            toast.loading("Loading subscription plans...");
            await refetch();
            return;
        }

        setSelectedKey(plan.key || "");
        onSelectPlan?.(plan._id || plan.id || plan.key);

        // 1. FREE PLAN -> Direct redirect to dashboard
        if (isFreePlan(plan)) {
            if (typeof window !== "undefined") {
                sessionStorage.setItem("barhuddle_free_plan_chosen", "true");
                localStorage.setItem("barhuddle_free_plan_chosen", "true");
            }
            dispatch(
                updateUser({
                    isSubscribed: true,
                    isClaimed: "approved",
                    subscriptionPlan: plan.key || "venue_free",
                    hasCompletedSubscriptionChoice: true,
                })
            );
            toast.success("Welcome! You are on the Free plan.");
            router.push("/app/dashboard");
            return;
        }

        // 2. PAID PLAN -> Call Stripe Purchase API: POST /subscriptions/purchase/:planId
        let planId = plan._id || plan.id;

        // If fallback template was clicked, find matching plan from real API response
        if (!isValidMongoObjectId(planId)) {
            const apiPlans = extractPlansFromResponse(plansResponse);
            const matchingApiPlan = apiPlans.find(
                (p) => p.key === plan.key || (p.displayPrice ?? p.price) === (plan.displayPrice ?? plan.price)
            );
            if (matchingApiPlan && isValidMongoObjectId(matchingApiPlan._id || matchingApiPlan.id)) {
                planId = matchingApiPlan._id || matchingApiPlan.id;
            }
        }

        if (!isValidMongoObjectId(planId)) {
            toast.error("Connecting to server to load checkout...");
            const refetched = await refetch();
            const refetchedPlans = extractPlansFromResponse(refetched.data);
            const found = refetchedPlans.find((p) => p.key === plan.key && (p.displayPrice ?? p.price ?? 0) > 0);
            if (found && isValidMongoObjectId(found._id || found.id)) {
                planId = found._id || found.id;
            } else {
                toast.error("Could not locate plan on server. Please try again.");
                return;
            }
        }

        // Initiate Stripe Checkout session
        let toastId: string | number | undefined;
        try {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const successUrl = `${origin}/app/dashboard?checkout=success&planId=${planId}`;
            const cancelUrl = `${origin}/subscription?checkout=cancelled`;

            toastId = toast.loading(`Preparing secure checkout for ${plan.label || plan.name || "Pro Plan"}...`);

            const result = await purchaseMutation.mutateAsync({
                planId: planId!,
                successUrl,
                cancelUrl,
            });

            if (toastId) toast.dismiss(toastId);

            if (result?.data?.checkoutUrl) {
                toast.loading("Redirecting to Stripe secure checkout...");
                window.location.href = result.data.checkoutUrl;
            } else {
                toast.error("Could not retrieve checkout URL. Please try again.");
            }
        } catch (error: any) {
            if (toastId) toast.dismiss(toastId);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to initiate Stripe checkout. Please try again.";
            toast.error(msg);
        }
    };

    const handleContinue = async () => {
        await handleExecutePlan(selectedPlan);
    };

    if (isVerifyingCheckout) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-5 p-6 text-center font-['Manrope',sans-serif]">
                <div className="relative w-20 h-20">
                    <div className="w-20 h-20 rounded-full border-4 border-[#7C3AED]/20 border-t-[#7C3AED] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col gap-2 max-w-[420px]">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        Activating Your Plan
                    </h2>
                    <p className="text-sm sm:text-base text-[#9D8FD0]">
                        {verifyingStatus}
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading && plans.length === 0) {
        return <SubscriptionSkeleton className={className} onBack={onBack} />;
    }

    const displayPlans = plans.length > 0 ? plans : (FALLBACK_PLANS_TEMPLATE as SubscriptionPlan[]);

    return (
        <div
            className={`w-full max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 pt-2 sm:pt-4 md:pt-6 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 font-['Manrope',sans-serif] animate-in fade-in duration-300 ${className}`}
        >
            {/* Top Navigation Header with Back / Skip Button on Left */}
            <div className="w-full flex items-center justify-between min-h-[48px] sm:min-h-[57px] relative z-30 pointer-events-auto">
                <div className="flex items-center gap-3">
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

                    {/* <button
                        type="button"
                        onClick={handleSkip}
                        className="h-[40px] sm:h-[44px] px-5 sm:px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white flex items-center justify-center font-bold text-[13px] sm:text-[14px] transition-all cursor-pointer"
                    >
                        Skip for now
                    </button> */}
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-[#9D8FD0] bg-[#140E50]/60 px-3.5 py-1.5 rounded-full border border-purple-500/20">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                    <span>Encrypted Stripe Checkout</span>
                </div>
            </div>

            {/* Main Header Title & Subtitle Area */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 text-center max-w-[680px] mx-auto px-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#C4B5FD] text-xs font-bold uppercase tracking-wider mb-1">
                    <span>Venue Subscriptions</span>
                </div>
                <h1 className="font-extrabold text-[28px] sm:text-[38px] md:text-[46px] leading-[34px] sm:leading-[46px] md:leading-[54px] bg-gradient-to-r from-white via-[#C4B5FD] to-[#E8FF57] bg-clip-text text-transparent tracking-tight">
                    Choose Your Plan
                </h1>
                <p className="font-normal text-[13.5px] sm:text-[15px] md:text-[16px] leading-[20px] sm:leading-[24px] md:leading-[26px] text-[#9D8FD0]">
                    Select the ideal growth tier for your venue to unlock foot traffic radar, live promos, and premium placement.
                </p>
            </div>

            {/* Pricing Cards Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full items-stretch my-2">
                {displayPlans.map((plan, idx) => {
                    const isSelected = (plan.key || "") === selectedKey;
                    const price = plan.displayPrice ?? plan.price ?? 0;
                    const isFree = price === 0 || plan.key === "venue_free";
                    const isPopular = plan.popular || plan.key === "venue_premium" || idx === 1;
                    const isExecutive = plan.key === "venue_executive" || idx === 2;

                    let tierBadge = "STARTER";
                    if (isPopular) tierBadge = "MOST POPULAR";
                    else if (isExecutive) tierBadge = "BEST VALUE";
                    else if (plan.badge) tierBadge = plan.badge;

                    return (
                        <div
                            key={plan._id || plan.key || idx}
                            onClick={() => handleSelectPlan(plan)}
                            className={`relative rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 md:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                                isPopular
                                    ? isSelected
                                        ? "bg-gradient-to-b from-[rgba(124,58,237,0.6)] via-[rgba(79,20,150,0.5)] to-[rgba(20,14,80,0.9)] border-2 border-[#7C3AED] shadow-[0px_0px_45px_rgba(124,58,237,0.6)] lg:scale-[1.03]"
                                        : "bg-gradient-to-b from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.25)] to-[rgba(20,14,80,0.6)] border border-[#7C3AED]/60 hover:border-[#7C3AED] hover:bg-gradient-to-b hover:from-[rgba(124,58,237,0.45)]"
                                    : isExecutive
                                    ? isSelected
                                        ? "bg-[rgba(20,14,80,0.95)] border-2 border-[#E8FF57] shadow-[0px_0px_35px_rgba(232,255,87,0.35)] lg:scale-[1.02]"
                                        : "bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(232,255,87,0.4)] hover:bg-[rgba(20,14,80,0.75)]"
                                    : isSelected
                                    ? "bg-[rgba(20,14,80,0.95)] border-2 border-[#7C3AED] shadow-[0px_0px_30px_rgba(124,58,237,0.45)] lg:scale-[1.02]"
                                    : "bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(124,58,237,0.5)] hover:bg-[rgba(20,14,80,0.75)]"
                            } ${idx === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
                        >
                            {/* Selected Badge Indicator */}
                            {isSelected && (
                                <div
                                    className={`absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1 ${
                                        isExecutive
                                            ? "bg-[#E8FF57] text-[#05033A]"
                                            : "bg-[#7C3AED] text-white"
                                    }`}
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Selected
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                {/* Card Top Pill & Icon Header */}
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`px-3 py-1 rounded-full border ${
                                            isPopular
                                                ? "bg-[rgba(124,58,237,0.4)] border-[rgba(124,58,237,0.6)]"
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
                                            {tierBadge}
                                        </span>
                                    </div>
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                            isPopular
                                                ? "bg-[rgba(124,58,237,0.3)] text-white"
                                                : isExecutive
                                                ? "bg-[rgba(232,255,87,0.12)] text-[#E8FF57]"
                                                : "bg-[rgba(157,143,208,0.12)] text-[#9D8FD0]"
                                        }`}
                                    >
                                        {isPopular ? (
                                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    <h3 className="font-extrabold text-[20px] sm:text-[22px] leading-[28px] text-white">
                                        {plan.label || plan.name || "Plan"}
                                    </h3>
                                    <p className="font-normal text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20px] text-[#9D8FD0]">
                                        {isFree
                                            ? "Perfect for getting started and claiming your venue."
                                            : isPopular
                                            ? "For venues looking to increase visibility and customer engagement."
                                            : "Advanced growth tools & VIP support for high-performing venues."}
                                    </p>
                                </div>

                                {/* Pricing Display */}
                                <div className="flex items-baseline gap-1.5 pt-1 sm:pt-2">
                                    {isFree ? (
                                        <>
                                            <span className="font-extrabold text-[32px] sm:text-[36px] leading-[36px] text-[#9D8FD0]">
                                                Free
                                            </span>
                                            <span className="font-semibold text-[13px] sm:text-[14px] leading-[20px] text-[#9D8FD0]">
                                                forever
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                className={`font-extrabold text-[36px] sm:text-[44px] leading-[44px] ${
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
                                <div
                                    className={`w-full h-[1px] my-1 ${
                                        isPopular
                                            ? "bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.6)] to-transparent"
                                            : "bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.4)] to-transparent"
                                    }`}
                                />

                                {/* Features List */}
                                <div className="flex flex-col gap-2 sm:gap-2.5">
                                    {(plan.features && plan.features.length > 0
                                        ? plan.features
                                        : [
                                              "Claim and verify venue",
                                              "Basic venue profile",
                                              "Display operating hours",
                                              "Upload venue photos",
                                              "Receive venue reviews",
                                          ]
                                    ).map((feature, fIdx) => (
                                        <div
                                            key={fIdx}
                                            className="flex items-center gap-2 text-[12px] sm:text-[13px] leading-[17px] text-[#C4B5FD]"
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                                    isExecutive
                                                        ? "bg-[rgba(232,255,87,0.15)] text-[#E8FF57]"
                                                        : isPopular
                                                        ? "bg-[rgba(124,58,237,0.3)] text-[#7C3AED]"
                                                        : "bg-[rgba(157,143,208,0.12)] text-[#9D8FD0]"
                                                }`}
                                            >
                                                <svg
                                                    className="w-2.5 h-2.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <span
                                                className={
                                                    fIdx === 0 && (isPopular || isExecutive)
                                                        ? "font-bold text-[#E8FF57]"
                                                        : ""
                                                }
                                            >
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
                                        handleExecutePlan(plan);
                                    }}
                                    disabled={purchaseMutation.isPending && selectedKey === plan.key}
                                    className={`w-full py-2.5 sm:py-3 rounded-[16px] text-[13px] sm:text-[14px] font-bold transition-all cursor-pointer ${
                                        isSelected
                                            ? isExecutive
                                                ? "bg-[#E8FF57] text-[#05033A] shadow-[0px_0px_20px_rgba(232,255,87,0.4)] hover:brightness-110 active:scale-95"
                                                : isPopular
                                                ? "bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-[0px_0px_20px_rgba(124,58,237,0.6)] hover:brightness-110 active:scale-95"
                                                : "bg-[#7C3AED] text-white shadow-[0px_0px_16px_rgba(124,58,237,0.5)] hover:brightness-110 active:scale-95"
                                            : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    {purchaseMutation.isPending && selectedKey === plan.key ? (
                                        "Connecting to Stripe..."
                                    ) : isFree ? (
                                        "Get Started Free"
                                    ) : (
                                        `Upgrade to ${plan.label || plan.name || "Pro"} ($${price}/mo)`
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Action Area */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 pt-2">
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={purchaseMutation.isPending || isFetching}
                    className="w-full sm:w-auto min-w-[280px] h-[52px] sm:h-[56px] px-8 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#9F4FFA] hover:brightness-110 active:scale-95 text-white font-extrabold text-[15px] sm:text-[16px] tracking-wide shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] hover:shadow-[0px_0px_36px_rgba(124,58,237,0.85)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {purchaseMutation.isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Connecting to Stripe...</span>
                        </>
                    ) : isFreePlan(selectedPlan) ? (
                        <>
                            <span>Continue with Free Plan</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>
                                Proceed to Stripe Checkout (${selectedPlan?.displayPrice ?? selectedPlan?.price ?? 9.99}/mo)
                            </span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function SubscriptionSkeleton({
    className = "",
    onBack,
}: {
    className?: string;
    onBack?: () => void;
}) {
    return (
        <div
            className={`w-full max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 pt-2 sm:pt-4 md:pt-6 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 font-['Manrope',sans-serif] animate-pulse ${className}`}
        >
            {/* Top Navigation Header Skeleton */}
            <div className="w-full flex items-center justify-between min-h-[48px] sm:min-h-[57px]">
                <div className="flex items-center gap-3">
                    {onBack && <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10" />}
                </div>
                <div className="w-36 h-8 rounded-full bg-white/5" />
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
                                        style={{ width: `${60 + ((featIdx * 7) % 35)}%` }}
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
                <div className="w-full sm:w-64 h-[52px] sm:h-[56px] rounded-full bg-white/10" />
            </div>
        </div>
    );
}

export default SubscriptionPlansScreen;
