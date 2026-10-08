"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { EventCardData } from "@/features/events/components";
import { cleanImageUrl } from "@/utils/image";
import { SubscriptionPlan } from "@/features/subscription/api/subscription.service";
import { useSubscriptionPlans } from "@/features/subscription/api/subscription.queries";
import { CreateBoostPayload } from "../api/boost.service";
import { useTierAccess } from "@/hooks/useTierAccess";

export interface BoostOption {
    id?: string;
    key?: string;
    label: string;
    days: number;
    price: number;
    discountBadge?: string;
    currency?: string;
    theme: {
        border: string;
        bg: string;
        shadow: string;
        inactiveBg: string;
        inactiveBorder: string;
        textColor: string;
    };
}

const THEMES = [
    {
        border: "border-[#7C3AED]",
        bg: "bg-[rgba(124,58,237,0.18)]",
        shadow: "shadow-[0px_0px_16px_rgba(124,58,237,0.3)]",
        inactiveBg: "bg-[rgba(124,58,237,0.047)]",
        inactiveBorder: "border-[rgba(124,58,237,0.133)]",
        textColor: "text-[#7C3AED]",
    },
    {
        border: "border-[#E8FF57]",
        bg: "bg-[rgba(232,255,87,0.18)]",
        shadow: "shadow-[0px_0px_16px_rgba(232,255,87,0.3)]",
        inactiveBg: "bg-[rgba(232,255,87,0.047)]",
        inactiveBorder: "border-[rgba(232,255,87,0.133)]",
        textColor: "text-[#E8FF57]",
    },
    {
        border: "border-[#22D3EE]",
        bg: "bg-[rgba(34,211,238,0.18)]",
        shadow: "shadow-[0px_0px_16px_rgba(34,211,238,0.3)]",
        inactiveBg: "bg-[rgba(34,211,238,0.047)]",
        inactiveBorder: "border-[rgba(34,211,238,0.133)]",
        textColor: "text-[#22D3EE]",
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

export interface BoostEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event?: EventCardData | null;
    isPending?: boolean;
    plans?: SubscriptionPlan[];
    isLoadingPlans?: boolean;
    onConfirmBoost?: (
        event: EventCardData,
        duration: string,
        payload: CreateBoostPayload
    ) => void;
}

export function BoostEventModal({
    isOpen,
    onClose,
    event,
    isPending = false,
    plans = [],
    isLoadingPlans: propIsLoadingPlans = false,
    onConfirmBoost,
}: BoostEventModalProps) {
    const { isExecutive, isPremium } = useTierAccess();

    // Fetch one_time boost plans from /subscriptions/plans?billingMode=one_time
    const { data: plansResponse, isLoading: isFetchingPlans } = useSubscriptionPlans("one_time", {
        enabled: isOpen,
    });

    const isLoadingPlans = propIsLoadingPlans || isFetchingPlans;

    const fetchedPlans = useMemo(() => {
        if (plans && plans.length > 0) return plans;
        return extractPlansFromResponse(plansResponse);
    }, [plans, plansResponse]);

    const boostOptions: BoostOption[] = useMemo(() => {
        const basePrice = isExecutive ? 9.99 : isPremium ? 19.99 : 29.99;
        const discountBadge = isExecutive ? "$20 OFF" : isPremium ? "$10 OFF" : undefined;

        // If one-time plans are returned by the API
        if (fetchedPlans.length > 0) {
            // Case 1: Multiple plans returned (e.g. 7, 14, 21 days)
            if (fetchedPlans.length > 1) {
                return fetchedPlans.map((plan, idx) => {
                    const parsedDays =
                        plan.durationDays ||
                        plan.days ||
                        (plan.label?.match(/(\d+)\s*Day/i) ? parseInt(plan.label.match(/(\d+)\s*Day/i)![1], 10) : null) ||
                        (idx === 0 ? 7 : idx === 1 ? 14 : 21);

                    const price = isExecutive
                        ? Math.min(plan.displayPrice ?? 29.99, Number((basePrice * (parsedDays / 7)).toFixed(2)))
                        : isPremium
                            ? Math.min(plan.displayPrice ?? 29.99, Number((basePrice * (parsedDays / 7)).toFixed(2)))
                            : (plan.displayPrice ?? plan.price ?? 29.99);

                    const label = plan.label || `${parsedDays} Days`;

                    return {
                        id: plan._id || plan.id,
                        key: plan.key,
                        label,
                        days: parsedDays,
                        price,
                        discountBadge: discountBadge || plan.badge,
                        currency: plan.currency || "usd",
                        theme: THEMES[idx % THEMES.length],
                    };
                });
            }

            // Case 2: Single plan returned (e.g. standard event_boost product)
            const singlePlan = fetchedPlans[0];
            const planId = singlePlan._id || singlePlan.id;
            const planBasePrice = isExecutive ? 9.99 : isPremium ? 19.99 : (singlePlan.displayPrice ?? 29.99);

            return [
                {
                    id: planId,
                    key: singlePlan.key,
                    label: singlePlan.label || "7 Days",
                    days: 7,
                    price: planBasePrice,
                    discountBadge: discountBadge || singlePlan.badge,
                    currency: singlePlan.currency || "usd",
                    theme: THEMES[0],
                },
                {
                    id: planId,
                    key: singlePlan.key,
                    label: "14 Days",
                    days: 14,
                    price: Number((planBasePrice * 1.8).toFixed(2)),
                    discountBadge,
                    currency: singlePlan.currency || "usd",
                    theme: THEMES[1],
                },
                {
                    id: planId,
                    key: singlePlan.key,
                    label: "21 Days",
                    days: 21,
                    price: Number((planBasePrice * 2.5).toFixed(2)),
                    discountBadge,
                    currency: singlePlan.currency || "usd",
                    theme: THEMES[2],
                },
            ];
        }

        // Fallback default options
        const defaultPlanId = fetchedPlans?.[0]?._id || fetchedPlans?.[0]?.id || "event_boost";
        return [
            {
                id: defaultPlanId,
                label: "7 Days",
                days: 7,
                price: basePrice,
                discountBadge,
                theme: THEMES[0],
            },
            {
                id: defaultPlanId,
                label: "14 Days",
                days: 14,
                price: Number((basePrice * 1.8).toFixed(2)),
                discountBadge,
                theme: THEMES[1],
            },
            {
                id: defaultPlanId,
                label: "21 Days",
                days: 21,
                price: Number((basePrice * 2.5).toFixed(2)),
                discountBadge,
                theme: THEMES[2],
            },
        ];
    }, [fetchedPlans, isExecutive, isPremium]);

    const [selectedDays, setSelectedDays] = useState<number>(7);

    // Reset to first option (7 days) when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedDays(7);
        }
    }, [isOpen]);

    const selectedOption = useMemo(() => {
        return boostOptions.find((o) => o.days === selectedDays) || boostOptions[0];
    }, [boostOptions, selectedDays]);

    if (!isOpen || !event) return null;

    const handleConfirm = () => {
        const days = selectedOption?.days || selectedDays || 7;
        const amount = selectedOption?.price || (isExecutive ? 9.99 : isPremium ? 19.99 : 29.99);

        const startAt = new Date().toISOString();
        const endAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

        const resolvedPlanId = selectedOption?.id || fetchedPlans?.[0]?._id || fetchedPlans?.[0]?.id || "event_boost";

        const payload: CreateBoostPayload = {
            eventId: String(event.id),
            planId: resolvedPlanId,
            startAt,
            endAt,
            amount,
        };

        onConfirmBoost?.(event, selectedOption?.label || `${days} Days`, payload);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Modal Container: 563px width, #05033A background, 16px radius */}
            <div className="relative w-full max-w-[563px] bg-[#05033A] border border-[rgba(124,58,237,0.25)] shadow-[0px_4px_24px_rgba(0,0,0,0.5)] rounded-[16px] p-6 sm:p-[30px] flex flex-col gap-6 max-h-[92vh] overflow-y-auto scrollbar-none">

                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize tracking-tight">
                            Boost Event
                        </h2>
                        {isLoadingPlans && (
                            <span className="w-2 h-2 rounded-full bg-[#E8FF57] animate-ping" title="Loading current pricing..." />
                        )}
                    </div>

                    {/* Close Button (40x40 container) */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                        aria-label="Close modal"
                    >
                        <div className="w-[18px] h-[18px] border-[1.8px] border-white rounded-[1px] flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Event Card Summary Box (height 89.6px) */}
                <div className="w-full h-[89.6px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.2)] rounded-[18px] p-4 flex items-center justify-between gap-3 shrink-0">
                    {/* Left: Thumbnail & Title/Details */}
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <div className="w-[80px] h-[56px] rounded-[12px] bg-[#3C0366] overflow-hidden shrink-0">
                            <Image
                                src={cleanImageUrl(event?.imageUrl, "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80")}
                                alt={event?.title || "Event"}
                                width={80}
                                height={56}
                                className="w-full h-full object-cover opacity-85"
                            />
                        </div>
                        <div className="flex flex-col justify-center truncate">
                            <h3 className="font-extrabold text-[14px] leading-[20px] text-white truncate">
                                {event.title}
                            </h3>
                            <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] truncate mt-0.5">
                                {event.dateTime} · {event.venueName}
                            </span>
                        </div>
                    </div>

                    {/* Right: Stats (Organic Reach & Views) */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Organic Reach */}
                        <div className="flex flex-col items-end">
                            <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8]">
                                Organic Reach
                            </span>
                            <span className="font-extrabold text-[16px] leading-[24px] text-[#22D3EE]">
                                {event.views || "0.7K"}
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="w-[1px] h-[40px] bg-[rgba(124,58,237,0.2)] mx-1" />

                        {/* Views */}
                        <div className="flex flex-col items-end">
                            <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8]">
                                Views
                            </span>
                            <span className="font-extrabold text-[16px] leading-[24px] text-[#A855F7]">
                                {event.ratio || "184"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="w-full border-t border-[rgba(255,255,255,0.11)]" />

                {/* Notice Text */}
                <p className="font-medium text-[13px] leading-[16px] text-[#C4B5FD]">
                    Promotions will appear on your venue page during selected days and will be visible to all BarHuddle users in your area.
                </p>

                {/* Duration Select Row */}
                {isLoadingPlans ? (
                    <div className="grid grid-cols-3 gap-3 w-full">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="h-[72px] rounded-[14px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.15)] animate-pulse flex flex-col items-center justify-center gap-2"
                            >
                                <div className="w-16 h-4 rounded bg-white/20" />
                                <div className="w-10 h-3 rounded bg-white/10" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3 w-full">
                        {boostOptions.map((opt, idx) => {
                            const isSelected = selectedDays === opt.days;
                            return (
                                <button
                                    key={opt.id || opt.key || idx}
                                    type="button"
                                    onClick={() => setSelectedDays(opt.days)}
                                    className={`relative h-[72px] rounded-[14px] flex flex-col items-center justify-center cursor-pointer transition-all ${
                                        isSelected
                                            ? `${opt.theme.bg} border-2 ${opt.theme.border} ${opt.theme.shadow}`
                                            : `${opt.theme.inactiveBg} border ${opt.theme.inactiveBorder} hover:bg-white/10`
                                    }`}
                                >
                                    {opt.discountBadge && (
                                        <span className="absolute -top-2 px-2 py-[1px] rounded-full bg-[#E8FF57] text-[#05033A] font-extrabold text-[9px] tracking-wide shadow-sm uppercase">
                                            {opt.discountBadge}
                                        </span>
                                    )}
                                    <span className={`font-extrabold text-[14px] leading-[20px] ${opt.theme.textColor}`}>
                                        {opt.label}
                                    </span>
                                    <span className="font-bold text-[11px] text-white/90 mt-0.5">
                                        ${opt.price}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Boost Now Button */}
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isPending || isLoadingPlans}
                    className="w-full h-[52px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] flex items-center justify-center font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-1 disabled:opacity-50"
                >
                    {isPending
                        ? "Boosting Event..."
                        : `Boost Now ($${selectedOption?.price ?? 9.99})`}
                </button>
            </div>
        </div>
    );
}

export default BoostEventModal;
