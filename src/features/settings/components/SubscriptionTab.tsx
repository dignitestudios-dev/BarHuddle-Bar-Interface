"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateUser } from "@/store/slices/auth.slice";
import { useGetMeMutation } from "@/features/auth/api/auth.mutations";
import {
    useMySubscription,
    useSubscriptionPlans,
} from "@/features/subscription/api/subscription.queries";
import {
    useCancelSubscriptionMutation,
    usePurchasePlanMutation,
    useChangePlanMutation,
} from "@/features/subscription/api/subscription.mutations";
import { SubscriptionPlan } from "@/features/subscription/api/subscription.service";
import { toast } from "sonner";

const DEFAULT_SETTINGS_PLANS: SubscriptionPlan[] = [
    {
        _id: "plan_free_tier",
        key: "venue_free",
        billingMode: "subscription",
        label: "Starter Plan",
        name: "Starter",
        displayPrice: 0,
        price: 0,
        currency: "usd",
        features: [
            "Claim and verify venue profile",
            "Basic venue details & opening hours",
            "Upload venue photos & menus",
            "Receive customer reviews & ratings",
            "Standard foot-traffic visibility",
        ],
        sortOrder: 1,
    },
    {
        _id: "plan_growth_tier",
        key: "venue_premium",
        billingMode: "subscription",
        label: "Growth Plan",
        name: "Growth",
        displayPrice: 49,
        price: 49,
        currency: "usd",
        features: [
            "Everything in Starter",
            "Create unlimited events & drink specials",
            "Featured venue placement in search results",
            "Attendee demographic & peak hour insights",
            "Direct customer promo & notification tools",
            "Enhanced performance analytics dashboard",
        ],
        popular: true,
        sortOrder: 2,
    },
    {
        _id: "plan_executive_tier",
        key: "venue_executive",
        billingMode: "subscription",
        label: "Executive Plan",
        name: "Executive",
        displayPrice: 99,
        price: 99,
        currency: "usd",
        features: [
            "Everything in Growth",
            "Top-tier priority placement across the app",
            "Advanced real-time foot-traffic radar",
            "Dedicated VIP account manager",
            "Custom branding & flyer designer integration",
            "Multi-venue management tools",
            "Early VIP access to all new features",
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

export function SubscriptionTab() {
    const dispatch = useAppDispatch();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isSyncingUser, setIsSyncingUser] = useState(false);

    // Read user profile state directly from Redux
    const user = useAppSelector((state) => state.auth.user);
    const { mutateAsync: getMe } = useGetMeMutation();

    const {
        data: mySubResponse,
        isLoading: isSubLoading,
        refetch: refetchMySub,
    } = useMySubscription();

    const {
        data: plansResponse,
        isLoading: isPlansLoading,
        refetch: refetchPlans,
    } = useSubscriptionPlans();

    const cancelMutation = useCancelSubscriptionMutation();
    const purchaseMutation = usePurchasePlanMutation();
    const changePlanMutation = useChangePlanMutation();

    // Sync latest user profile from /users API on mount
    const syncUserProfile = useCallback(async () => {
        try {
            setIsSyncingUser(true);
            const res = await getMe();
            const userData = res?.user || res?.data?.user || res?.data;
            if (userData) {
                dispatch(updateUser(userData));
            }
        } catch (err) {
            console.error("[SubscriptionTab] Failed to sync /users profile:", err);
        } finally {
            setIsSyncingUser(false);
        }
    }, [getMe, dispatch]);

    useEffect(() => {
        syncUserProfile();
    }, [syncUserProfile]);

    const currentSub = mySubResponse?.data?.subscription;

    // Determine whether the user is actively subscribed from /users API
    const isSubscribedFromUser = Boolean(
        user?.isSubscribed ||
        (user?.subscriptionPlan &&
            user.subscriptionPlan !== "none" &&
            user.subscriptionPlan !== "null" &&
            user.subscriptionPlan !== "venue_free")
    );

    const isActive = Boolean(
        isSubscribedFromUser ||
        mySubResponse?.data?.isActive ||
        currentSub?.status === "active"
    );

    // Plans list fetched from API with fallback
    const plans: SubscriptionPlan[] = useMemo(() => {
        const rawList = extractPlansFromResponse(plansResponse);
        const filtered = rawList.filter((p) => p.billingMode !== "one_time" && p.key !== "event_boost");
        if (filtered.length > 0) return filtered;
        return DEFAULT_SETTINGS_PLANS;
    }, [plansResponse]);

    // Determine current plan key directly from /users API (`subscriptionPlan` e.g. "venue_premium", "venue_executive", "venue_free")
    const currentPlanKey = useMemo(() => {
        if (
            user?.subscriptionPlan &&
            user.subscriptionPlan !== "none" &&
            user.subscriptionPlan !== "null"
        ) {
            return user.subscriptionPlan;
        }
        if (typeof currentSub?.planId === "object" && currentSub.planId?.key) {
            return currentSub.planId.key;
        }
        if (currentSub?.planKey) {
            return currentSub.planKey;
        }
        return isActive ? "venue_premium" : "venue_free";
    }, [user?.subscriptionPlan, currentSub, isActive]);

    // Active plan details object
    const activePlanObj = useMemo(() => {
        const matched =
            plans.find((p) => p.key === currentPlanKey) ||
            plans.find((p) => p._id === currentSub?.planId) ||
            DEFAULT_SETTINGS_PLANS.find((p) => p.key === currentPlanKey);

        if (matched) return matched;
        return isActive ? DEFAULT_SETTINGS_PLANS[1] : DEFAULT_SETTINGS_PLANS[0];
    }, [plans, currentPlanKey, currentSub, isActive]);

    const isCancelAtPeriodEnd =
        Boolean(currentSub?.cancelAtPeriodEnd) ||
        Boolean(currentSub?.cancel_at_period_end) ||
        currentSub?.status === "canceled";

    // Format renewal / expiration date
    const formattedDate = useMemo(() => {
        const rawDate = currentSub?.currentPeriodEnd || currentSub?.periodEnd;
        if (!rawDate) return "Monthly billing cycle";
        try {
            const date = new Date(rawDate);
            if (isNaN(date.getTime())) return "Monthly billing cycle";
            return date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return "Monthly billing cycle";
        }
    }, [currentSub]);

    const handleConfirmCancel = async () => {
        try {
            await cancelMutation.mutateAsync();
            toast.success("Subscription will cancel at the end of the billing period.");
            setIsCancelModalOpen(false);
            await Promise.all([refetchMySub(), syncUserProfile()]);
        } catch (error: any) {
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to cancel subscription.";
            toast.error(msg);
        }
    };

    const handlePlanAction = async (plan: SubscriptionPlan) => {
        const isFree = (plan.displayPrice ?? plan.price ?? 0) === 0 || plan.key === "venue_free";

        if (isFree) {
            toast.info("Starter features are included by default.");
            return;
        }

        // Find matching API plan with valid MongoDB ObjectId
        let planId = plan._id || plan.id;
        if (!isValidMongoObjectId(planId)) {
            const apiPlans = extractPlansFromResponse(plansResponse);
            const foundInApi = apiPlans.find((p) => p.key === plan.key);
            if (foundInApi && isValidMongoObjectId(foundInApi._id || foundInApi.id)) {
                planId = foundInApi._id || foundInApi.id;
            }
        }

        if (!isValidMongoObjectId(planId)) {
            toast.error("Plan configuration is loading. Please try again in a moment.");
            await refetchPlans();
            return;
        }

        try {
            if (isActive) {
                // Change plan if currently active
                await changePlanMutation.mutateAsync({ newPlanId: planId! });
                toast.success(`Plan successfully updated to ${plan.label || plan.name}!`);
                await Promise.all([refetchMySub(), syncUserProfile()]);
            } else {
                // Initiate Stripe Checkout for subscription purchase
                const origin = typeof window !== "undefined" ? window.location.origin : "";
                const result = await purchaseMutation.mutateAsync({
                    planId: planId!,
                    successUrl: `${origin}/app/settings?tab=subscription&checkout=success`,
                    cancelUrl: `${origin}/app/settings?tab=subscription&checkout=cancelled`,
                });
                if (result?.data?.checkoutUrl) {
                    window.location.href = result.data.checkoutUrl;
                }
            }
        } catch (error: any) {
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to process request.";
            toast.error(msg);
        }
    };

    // Other plans available for upgrade/switch (exclude active plan)
    const alternativePlans = useMemo(() => {
        return plans.filter((p) => p.key !== currentPlanKey);
    }, [plans, currentPlanKey]);

    const planPrice =
        activePlanObj?.displayPrice ??
        activePlanObj?.price ??
        (currentPlanKey === "venue_executive" ? 99 : currentPlanKey === "venue_premium" ? 49 : 0);

    const planDisplayName =
        activePlanObj?.label ||
        activePlanObj?.name ||
        (currentPlanKey === "venue_executive"
            ? "Executive Plan"
            : currentPlanKey === "venue_premium"
            ? "Growth Plan"
            : "Starter Plan");

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif] relative">
            {/* Top Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-[36px] h-[36px] rounded-[14px] bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center shrink-0 shadow-inner">
                        <svg className="w-[18px] h-[18px] text-[#C4B5FD]" viewBox="0 0 14 14" fill="none">
                            <rect
                                x="1.5"
                                y="3"
                                width="11"
                                height="8"
                                rx="1.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                            />
                            <path
                                d="M1.5 5.5H12.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-[18px] sm:text-[20px] leading-[28px] text-white">
                            Subscription & Billing
                        </h2>
                        <p className="font-normal text-[12px] sm:text-[13px] leading-[16px] text-[#8B7EC8]">
                            Manage your active tier, billing cycle, and venue promotions.
                        </p>
                    </div>
                </div>

                {/* Refresh Status Button */}
                <button
                    type="button"
                    onClick={() => {
                        syncUserProfile();
                        refetchMySub();
                        refetchPlans();
                        toast.info("Refreshed subscription details.");
                    }}
                    disabled={isSyncingUser}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-white/5 hover:bg-white/10 border border-white/10 text-[#C4B5FD] text-[12px] font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    title="Refresh subscription status"
                >
                    <svg
                        className={`w-3.5 h-3.5 ${isSyncingUser ? "animate-spin text-[#E8FF57]" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{isSyncingUser ? "Syncing..." : "Refresh"}</span>
                </button>
            </div>

            {/* Main Active Plan Card */}
            <div
                className="w-full max-w-[892px] rounded-[24px] p-6 sm:p-7 relative overflow-hidden backdrop-blur-md"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(124, 58, 237, 0.45) 0%, rgba(79, 20, 150, 0.3) 60%, rgba(14, 9, 60, 0.45) 100%)",
                    border: "0.8px solid rgba(124, 58, 237, 0.4)",
                    boxShadow: "0px 0px 60px rgba(124, 58, 237, 0.15)",
                }}
            >
                {/* Radial Glow Aura */}
                <div
                    className="absolute w-[260px] h-[260px] right-[-50px] top-[-50px] pointer-events-none opacity-20 rounded-full"
                    style={{
                        background:
                            "radial-gradient(70.71% 70.71% at 50% 50%, #E8FF57 0%, rgba(0, 0, 0, 0) 70%)",
                    }}
                />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    {/* Left Content */}
                    <div className="flex flex-col items-start gap-2.5 max-w-[520px]">
                        {/* Tags Header */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#E8FF57]">
                                ACTIVE PLAN
                            </span>
                            <span
                                className={`px-2.5 py-[2px] rounded-full border text-[10px] font-bold leading-[15px] flex items-center gap-1.5 ${
                                    isCancelAtPeriodEnd
                                        ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                                        : isActive
                                        ? "bg-[rgba(74,222,128,0.15)] border-[rgba(74,222,128,0.3)] text-[#4ADE80]"
                                        : "bg-white/10 border-white/20 text-white/80"
                                }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        isCancelAtPeriodEnd
                                            ? "bg-rose-400"
                                            : isActive
                                            ? "bg-[#4ADE80] animate-pulse"
                                            : "bg-white/60"
                                    }`}
                                />
                                {isCancelAtPeriodEnd
                                    ? "Canceling at period end"
                                    : isActive
                                    ? "Active Subscription"
                                    : "Free Tier"}
                            </span>

                            {user?.boostsCount !== undefined && user.boostsCount > 0 && (
                                <span className="px-2.5 py-[2px] rounded-full bg-[rgba(232,255,87,0.12)] border border-[rgba(232,255,87,0.3)] text-[#E8FF57] font-bold text-[10px] leading-[15px]">
                                    {user.boostsCount} Event Boost{user.boostsCount > 1 ? "s" : ""} Available
                                </span>
                            )}
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="font-extrabold text-[26px] sm:text-[30px] leading-[36px] text-white">
                            {planDisplayName}
                        </h3>
                        <p className="font-normal text-[13px] sm:text-[14px] leading-[20px] text-[#C4B5FD]">
                            ${planPrice} / month ·{" "}
                            {isCancelAtPeriodEnd
                                ? `Access remains active until ${formattedDate}`
                                : isActive
                                ? `Renews on ${formattedDate}`
                                : `Free tier features active`}
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap gap-2 mt-1">
                            {(activePlanObj?.features && activePlanObj.features.length > 0
                                ? activePlanObj.features.slice(0, 4)
                                : [
                                      "Unlimited Events",
                                      "Featured Placement",
                                      "Audience Insights",
                                      "Enhanced Analytics",
                                  ]
                            ).map((feat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-1.5 px-[10px] py-[4px] rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#C4B5FD] font-semibold text-[11px] leading-[16px]"
                                >
                                    <svg
                                        className="w-[9px] h-[9px] text-[#4ADE80]"
                                        viewBox="0 0 9 9"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M1.5 4.5L3.5 6.5L7.5 2"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    {feat}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Price & Actions */}
                    <div className="flex flex-col items-start lg:items-end gap-3.5 shrink-0">
                        <div className="flex items-baseline gap-1 lg:text-right">
                            <span className="font-extrabold text-[32px] sm:text-[38px] leading-[40px] text-white">
                                ${planPrice}
                            </span>
                            <span className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                                /month
                            </span>
                        </div>

                        {isActive && !isCancelAtPeriodEnd && (
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(true)}
                                className="px-[18px] py-[8px] rounded-[12px] font-bold text-[13px] leading-[20px] text-white transition-all cursor-pointer hover:opacity-90 active:scale-98 shadow-md"
                                style={{
                                    background: "linear-gradient(135deg, #FF2323 0%, #B91616 100%)",
                                    boxShadow: "0px 0px 20px rgba(198, 24, 24, 0.4)",
                                }}
                            >
                                Cancel Subscription
                            </button>
                        )}

                        <p className="font-normal text-[12px] sm:text-[13px] leading-[18px] text-white/80 lg:text-right">
                            {isCancelAtPeriodEnd
                                ? `Active until ${formattedDate}`
                                : `Next billing cycle: ${formattedDate}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Other Plans Grid for Upgrade / Switching */}
            {alternativePlans.length > 0 && (
                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-[16px] text-white">
                            Available Plans & Upgrades
                        </h3>
                        <span className="text-[12px] text-[#8B7EC8]">
                            Switch or upgrade anytime
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[892px]">
                        {alternativePlans.map((plan) => {
                            const price = plan.displayPrice ?? plan.price ?? 0;
                            const isFree = price === 0 || plan.key === "venue_free";
                            const isExecutive = plan.key === "venue_executive";

                            return (
                                <div
                                    key={plan._id || plan.key}
                                    className="box-border flex flex-col justify-between p-[24px] rounded-[24px] w-full backdrop-blur-md relative bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(124,58,237,0.5)] transition-all"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`px-[12px] py-[4px] rounded-full border font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase ${
                                                    isExecutive
                                                        ? "bg-[rgba(232,255,87,0.12)] border-[rgba(232,255,87,0.3)] text-[#E8FF57]"
                                                        : "bg-[rgba(157,143,208,0.12)] border-[rgba(157,143,208,0.25)] text-[#9D8FD0]"
                                                }`}
                                            >
                                                {isExecutive ? "EXECUTIVE TIER" : "STARTER TIER"}
                                            </span>

                                            <div className="w-[36px] h-[36px] rounded-full bg-white/5 flex items-center justify-center text-[#C4B5FD]">
                                                {isExecutive ? (
                                                    <svg className="w-4 h-4 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-[#9D8FD0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-extrabold text-[20px] text-white">
                                                {plan.label || plan.name}
                                            </h4>
                                            <p className="text-[12px] text-[#9D8FD0] mt-0.5">
                                                {isFree
                                                    ? "Essential tools for claimed venue profiles."
                                                    : isExecutive
                                                    ? "Top priority placement & VIP account management."
                                                    : "Advanced analytics and promotional tools."}
                                            </p>
                                        </div>

                                        <div className="flex items-baseline gap-1.5 pt-1">
                                            <span className="font-extrabold text-[32px] text-white">
                                                {isFree ? "Free" : `$${price}`}
                                            </span>
                                            <span className="text-[13px] text-[#9D8FD0]">
                                                {isFree ? "forever" : "/month"}
                                            </span>
                                        </div>

                                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.4)] to-transparent my-1" />

                                        <div className="flex flex-col gap-2.5">
                                            {(plan.features && plan.features.length > 0
                                                ? plan.features
                                                : ["Claim your venue", "Basic venue profile"]
                                            ).map((feature, fIdx) => (
                                                <div key={fIdx} className="flex items-center gap-2 text-[12px] text-[#C4B5FD]">
                                                    <div className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                        <svg className="w-2 h-2 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handlePlanAction(plan)}
                                        disabled={purchaseMutation.isPending || changePlanMutation.isPending}
                                        className="w-full h-[46px] rounded-[16px] font-extrabold text-[14px] text-white transition-all cursor-pointer hover:opacity-95 active:scale-98 mt-6 bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.4)] disabled:opacity-50"
                                    >
                                        {purchaseMutation.isPending || changePlanMutation.isPending
                                            ? "Processing..."
                                            : isFree
                                            ? "Starter Plan"
                                            : isActive
                                            ? `Switch to ${plan.label || plan.name}`
                                            : `Upgrade to ${plan.label || plan.name}`}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Cancel Subscription Confirmation Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
                    <div
                        className="relative w-[515px] max-w-[92vw] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between items-center border border-[rgba(124,58,237,0.4)] shadow-2xl overflow-hidden bg-[#160A32]"
                    >
                        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                            <div className="w-[72px] h-[72px] rounded-full bg-[#F01A1A]/15 border border-[#F01A1A]/30 flex items-center justify-center shadow-[0_0_24px_rgba(240,26,26,0.4)]">
                                <svg className="w-[36px] h-[36px] text-[#F01A1A]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            </div>

                            <div className="flex flex-col items-center gap-1.5">
                                <h3 className="font-extrabold text-[24px] sm:text-[28px] text-white">
                                    Cancel Subscription?
                                </h3>
                                <p className="font-normal text-[14px] sm:text-[15px] leading-[22px] text-[#C4B5FD]">
                                    Your benefits will remain active until the end of the current billing cycle on{" "}
                                    <span className="text-white font-semibold">{formattedDate}</span>.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-row justify-between items-center w-full gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(false)}
                                className="flex-1 h-[48px] rounded-[16px] bg-white/10 hover:bg-white/15 text-white font-semibold text-[14px] cursor-pointer transition-all active:scale-98"
                            >
                                Keep Subscription
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmCancel}
                                disabled={cancelMutation.isPending}
                                className="flex-1 h-[48px] rounded-[16px] text-white font-bold text-[14px] cursor-pointer transition-all hover:opacity-95 active:scale-98 bg-gradient-to-r from-red-600 to-rose-600 shadow-[0px_0px_20px_rgba(225,29,72,0.4)] disabled:opacity-50"
                            >
                                {cancelMutation.isPending ? "Canceling..." : "Confirm Cancellation"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubscriptionTab;

