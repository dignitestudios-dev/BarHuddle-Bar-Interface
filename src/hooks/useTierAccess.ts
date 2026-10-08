"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store";

export type SubscriptionTier = "free" | "premium" | "executive" | "pro";

export interface TierPermissions {
    tier: SubscriptionTier;
    tierName: string;
    isFree: boolean;
    isPremium: boolean;
    isExecutive: boolean;
    boostPrice: number;
    boostDiscountText: string;

    // Free Tier Allowed Features
    canClaimVenue: boolean;
    canEditVenuePage: boolean;
    canCreateEvents: boolean;
    canBoostEvents: boolean;

    // Pro Features (all available to Pro / paid users)
    canTrackBoostROI: boolean;
    canViewCheckIns: boolean;
    canViewCrowdSize: boolean;
    canViewGenderRatio: boolean;
    canViewPeakHoursAndAge: boolean;
    canViewSentiment: boolean;
    canViewStayVsLeave: boolean;
    canViewTurnoutPerEvent: boolean;
    canExportEventData: boolean;
    canExportData: boolean;

    // Advanced analytics features (unlocked for all Pro users)
    canViewCrowdMomentum: boolean;
    canViewBarHopEngagement: boolean;
    canTrackNewVsRepeat: boolean;
    canViewLostCustomersWindows: boolean;
    canViewCustomerRetention: boolean;
    canViewMovementIntelligence: boolean;
}

export function getSubscriptionTier(user: any): SubscriptionTier {
    if (!user) return "free";

    const planKey = String(user?.subscriptionPlan || "").toLowerCase();
    const isSubscribed = Boolean(user?.isSubscribed);

    if (
        planKey &&
        planKey !== "venue_free" &&
        planKey !== "none" &&
        planKey !== "null" &&
        planKey !== ""
    ) {
        return "premium"; // Maps to Pro paid plan
    }

    if (isSubscribed && planKey !== "venue_free") {
        return "premium";
    }

    return "free";
}

export function useTierAccess(): TierPermissions {
    const user = useAppSelector((state) => state.auth.user);

    return useMemo(() => {
        const tier = getSubscriptionTier(user);
        const isFree = tier === "free";
        const isPremium = !isFree;
        const isExecutive = !isFree; // All Pro users have executive features

        const tierName = isFree ? "Free Starter" : "Pro";
        const boostPrice = isFree ? 29.99 : 9.99;
        const boostDiscountText = isFree ? "Flat Rate" : "$20 Discount Included";

        // Free tier features: Claim venue, edit venue page, create events, boost events
        const canClaimVenue = true;
        const canEditVenuePage = true;
        const canCreateEvents = true;
        const canBoostEvents = true;

        // Pro tier features: ALL analytics unlocked
        const hasProAccess = !isFree;
        const canTrackBoostROI = hasProAccess;
        const canViewCheckIns = hasProAccess;
        const canViewCrowdSize = hasProAccess;
        const canViewGenderRatio = hasProAccess;
        const canViewPeakHoursAndAge = hasProAccess;
        const canViewSentiment = hasProAccess;
        const canViewStayVsLeave = hasProAccess;
        const canViewTurnoutPerEvent = hasProAccess;
        const canExportEventData = hasProAccess;
        const canExportData = hasProAccess;

        const canViewCrowdMomentum = hasProAccess;
        const canViewBarHopEngagement = hasProAccess;
        const canTrackNewVsRepeat = hasProAccess;
        const canViewLostCustomersWindows = hasProAccess;
        const canViewCustomerRetention = hasProAccess;
        const canViewMovementIntelligence = hasProAccess;

        return {
            tier,
            tierName,
            isFree,
            isPremium,
            isExecutive,
            boostPrice,
            boostDiscountText,

            canClaimVenue,
            canEditVenuePage,
            canCreateEvents,
            canBoostEvents,

            canTrackBoostROI,
            canViewCheckIns,
            canViewCrowdSize,
            canViewGenderRatio,
            canViewPeakHoursAndAge,
            canViewSentiment,
            canViewStayVsLeave,
            canViewTurnoutPerEvent,
            canExportEventData,
            canExportData,

            canViewCrowdMomentum,
            canViewBarHopEngagement,
            canTrackNewVsRepeat,
            canViewLostCustomersWindows,
            canViewCustomerRetention,
            canViewMovementIntelligence,
        };
    }, [user]);
}
