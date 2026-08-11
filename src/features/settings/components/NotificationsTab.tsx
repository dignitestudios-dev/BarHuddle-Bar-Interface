"use client";

import React, { useState } from "react";

interface NotificationItemData {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    badgeColor: string;
    icon: React.ReactNode;
}

export function NotificationsTab() {
    const [notifications, setNotifications] = useState<NotificationItemData[]>([
        {
            id: "push",
            title: "Push Notifications",
            description: "Receive real-time alerts on your device",
            enabled: true,
            badgeColor: "bg-[#7C3AED]/20 text-[#AD46FF] border-[#7C3AED]/40",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
            ),
        },
        {
            id: "email",
            title: "Email Notifications",
            description: "Get updates delivered to your inbox",
            enabled: true,
            badgeColor: "bg-[#06B6D4]/20 text-[#22D3EE] border-[#06B6D4]/40",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            id: "event",
            title: "Event Updates",
            description: "New check-ins, attendees, and event activity",
            enabled: true,
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
            id: "promo",
            title: "Promotional Offers",
            description: "Special deals and platform promotions",
            enabled: false,
            badgeColor: "bg-[#EAB308]/20 text-[#FACC15] border-[#EAB308]/40",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.684A1.761 1.761 0 013 12V8a1.76 1.76 0 012.436-1.63L11 5.882M18 13c1.657 0 3-1.343 3-3s-1.343-3-3-3"
                    />
                </svg>
            ),
        },
        {
            id: "venue",
            title: "Venue Activity Alerts",
            description: "Visitor surges, reviews, and milestones",
            enabled: true,
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
            id: "billing",
            title: "Subscription & Billing",
            description: "Invoices, renewals, and payment alerts",
            enabled: true,
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
    ]);

    const toggleNotification = (id: string) => {
        setNotifications((prev) =>
            prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
        );
    };

    const enableAll = () => {
        setNotifications((prev) => prev.map((item) => ({ ...item, enabled: true })));
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
                className="w-full rounded-[24px] p-6 flex flex-col gap-6 backdrop-blur-md"
                style={{
                    background: "rgba(12, 5, 26, 0.75)",
                    border: "0.8px solid rgba(124, 58, 237, 0.3)",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                }}
            >
                {/* Preferences Card Header */}
                <div className="flex items-center justify-between border-b border-[#7C3AED]/20 pb-4">
                    <span
                        className="font-extrabold text-[10px] leading-[14px] uppercase tracking-[1.2px]"
                        style={{ color: "#8B7EC8" }}
                    >
                        NOTIFICATION PREFERENCES
                    </span>

                    <button
                        type="button"
                        onClick={enableAll}
                        className="px-4 py-1.5 rounded-full bg-[rgba(124,58,237,0.2)] hover:bg-[rgba(124,58,237,0.35)] border border-[rgba(124,58,237,0.4)] text-[#D8B4FE] text-[12px] font-semibold transition-all duration-200 cursor-pointer active:scale-95"
                    >
                        Enable All
                    </button>
                </div>

                {/* List of Notification Toggles */}
                <div className="flex flex-col gap-5">
                    {notifications.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-transparent hover:border-[#7C3AED]/20"
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
                                        item.enabled ? "text-[#00FF85]" : "text-[#8B7EC8]"
                                    }`}
                                >
                                    {item.enabled ? "On" : "Off"}
                                </span>

                                {/* Toggle Switch */}
                                <button
                                    type="button"
                                    onClick={() => toggleNotification(item.id)}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 p-0.5 cursor-pointer focus:outline-none ${
                                        item.enabled
                                            ? "bg-gradient-to-r from-[#7C3AED] to-[#AD46FF] shadow-[0_0_12px_rgba(124,58,237,0.5)]"
                                            : "bg-[#1E1435] border border-[#7C3AED]/30"
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                            item.enabled ? "translate-x-[24px]" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NotificationsTab;
