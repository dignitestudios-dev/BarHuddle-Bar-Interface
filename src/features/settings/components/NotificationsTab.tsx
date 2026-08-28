"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetNotificationSettingsQuery } from "../api/settings.queries";
import { useUpdateNotificationSettingsMutation } from "../api/settings.mutations";

interface NotificationItemConfig {

    id: "eventUpdates" | "venueActivityAlerts" | "subscriptionBilling";
    title: string;
    description: string;
    badgeColor: string;
    icon: React.ReactNode;
}


const NOTIFICATION_CONFIGS: NotificationItemConfig[] = [
    {
        id: "eventUpdates",
        title: "Event Updates",
        description: "Receive notifications about event approvals, scheduling changes, and attendee activity.",
        badgeColor: "bg-[#EC4899]/20 text-[#F472B6] border-[#EC4899]/40",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
    },
    {
        id: "venueActivityAlerts",
        title: "Venue Activity Alerts",
        description: "Get alerts on visitor trends, peak crowd hours, bar foot-traffic, and check-ins.",
        badgeColor: "bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4M9 11h4"
                />
            </svg>
        ),
    },
    {
        id: "subscriptionBilling",
        title: "Subscription & Billing",
        description: "Stay informed about renewal reminders, invoice receipts, and membership updates.",
        badgeColor: "bg-[#F97316]/20 text-[#FB923C] border-[#F97316]/40",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        ),
    },
];

export function NotificationsTab() {
    const { data: apiData, isLoading } = useGetNotificationSettingsQuery();
    const updateMutation = useUpdateNotificationSettingsMutation();

    const [settings, setSettings] = useState({
        enableAll: true,
        eventUpdates: true,
        venueActivityAlerts: true,
        subscriptionBilling: true,
    });

    useEffect(() => {
        if (apiData?.data) {
            setSettings({
                enableAll: Boolean(apiData.data.enableAll),
                eventUpdates: Boolean(apiData.data.eventUpdates),
                venueActivityAlerts: Boolean(apiData.data.venueActivityAlerts),
                subscriptionBilling: Boolean(apiData.data.subscriptionBilling),
            });
        }
    }, [apiData]);

    const handleToggleSingle = async (
        key: "eventUpdates" | "venueActivityAlerts" | "subscriptionBilling"
    ) => {
        const newValue = !settings[key];
        const nextSettings = {
            ...settings,
            [key]: newValue,
        };

        // Determine if all individual notifications are enabled
        const allActive =
            nextSettings.eventUpdates &&
            nextSettings.venueActivityAlerts &&
            nextSettings.subscriptionBilling;
        nextSettings.enableAll = allActive;

        setSettings(nextSettings);

        try {
            await updateMutation.mutateAsync(nextSettings);
            toast.success("Notification settings updated");
        } catch (error: any) {
            console.error("Failed to update notification setting", error);
            toast.error(error?.response?.data?.message || "Failed to update notification settings");
            // Revert on error
            if (apiData?.data) {
                setSettings({
                    enableAll: Boolean(apiData.data.enableAll),
                    eventUpdates: Boolean(apiData.data.eventUpdates),
                    venueActivityAlerts: Boolean(apiData.data.venueActivityAlerts),
                    subscriptionBilling: Boolean(apiData.data.subscriptionBilling),
                });
            }
        }
    };

    const handleToggleEnableAll = async () => {
        const nextState = !settings.enableAll;
        const nextSettings = {
            enableAll: nextState,
            eventUpdates: nextState,
            venueActivityAlerts: nextState,
            subscriptionBilling: nextState,
        };

        setSettings(nextSettings);

        try {
            await updateMutation.mutateAsync(nextSettings);
            toast.success(
                nextState ? "All notifications enabled" : "All notifications disabled"
            );
        } catch (error: any) {
            console.error("Failed to toggle enable all", error);
            toast.error(error?.response?.data?.message || "Failed to update notification settings");
            if (apiData?.data) {
                setSettings({
                    enableAll: Boolean(apiData.data.enableAll),
                    eventUpdates: Boolean(apiData.data.eventUpdates),
                    venueActivityAlerts: Boolean(apiData.data.venueActivityAlerts),
                    subscriptionBilling: Boolean(apiData.data.subscriptionBilling),
                });
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Page Header inside Content area */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#AD46FF] shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="text-[20px] font-bold text-white leading-tight">Notifications</h2>
                    <p className="text-[12px] leading-[18px] text-[#9D8FD0]">
                        Choose which notifications you'd like to receive from BarHuddle.
                    </p>
                </div>
            </div>

            {/* Notification Preferences Card */}
            <div
                className="w-full max-w-[892px] rounded-[24px] p-6 flex flex-col gap-6 backdrop-blur-md"
                style={{
                    background: "rgba(12, 5, 26, 0.75)",
                    border: "0.8px solid rgba(124, 58, 237, 0.3)",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                }}
            >

                {/* Preferences Card Header */}
                <div className="flex items-center justify-between border-b border-[#7C3AED]/20 pb-4">
                    <div className="flex items-center gap-2.5">
                        <span
                            className="font-extrabold text-[10px] leading-[14px] uppercase tracking-[1.2px]"
                            style={{ color: "#8B7EC8" }}
                        >
                            NOTIFICATION PREFERENCES
                        </span>
                        {updateMutation.isPending && (
                            <span className="text-[10px] text-purple-400 animate-pulse font-medium">
                                Saving...
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleEnableAll}
                        disabled={isLoading || updateMutation.isPending}
                        className={`px-4 py-1.5 rounded-full border text-[12px] font-semibold transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 ${
                            settings.enableAll
                                ? "bg-[#7C3AED]/20 border-[#7C3AED]/40 text-[#D8B4FE] hover:bg-[#7C3AED]/35"
                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                    >
                        {settings.enableAll ? "Disable All" : "Enable All"}
                    </button>
                </div>

                {/* List of Notification Toggles */}
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="w-11 h-11 rounded-2xl" />
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="w-32 h-4" />
                                        <Skeleton className="w-64 h-3" />
                                    </div>
                                </div>
                                <Skeleton className="w-12 h-6 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {NOTIFICATION_CONFIGS.map((item) => {
                            const isEnabled = settings[item.id];
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-transparent hover:border-[#7C3AED]/20"
                                >
                                    {/* Left Info */}
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${item.badgeColor}`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-[14px] leading-[20px] text-white">
                                                {item.title}
                                            </h4>
                                            <p className="font-normal text-[12px] leading-[18px] text-[#9D8FD0]">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Status Label & Switch */}
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`font-semibold text-[12px] leading-[18px] ${
                                                isEnabled ? "text-[#00FF85]" : "text-[#8B7EC8]"
                                            }`}
                                        >
                                            {isEnabled ? "On" : "Off"}
                                        </span>

                                        {/* Toggle Switch */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleSingle(item.id)}
                                            disabled={updateMutation.isPending}
                                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 p-0.5 cursor-pointer focus:outline-none disabled:opacity-60 ${
                                                isEnabled
                                                    ? "bg-gradient-to-r from-[#7C3AED] to-[#AD46FF] shadow-[0_0_12px_rgba(124,58,237,0.5)]"
                                                    : "bg-[#1E1435] border border-[#7C3AED]/30"
                                            }`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                                    isEnabled ? "translate-x-[24px]" : "translate-x-0"
                                                }`}
                                            />
                                        </button>
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

export default NotificationsTab;
