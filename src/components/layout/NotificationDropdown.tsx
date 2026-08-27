"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useGetNotificationsQuery } from "@/features/notifications/api/notifications.queries";

export interface NotificationItem {
    id: string | number;
    title: string;
    message: string;
    time: string;
    isRead?: boolean;
}

export function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const { data: apiNotificationsData, isLoading } = useGetNotificationsQuery();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notifRef.current &&
                !notifRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const notifications: NotificationItem[] = useMemo(() => {
        const rawNotifications = Array.isArray(apiNotificationsData?.data)
            ? apiNotificationsData.data
            : Array.isArray(apiNotificationsData?.data?.notifications)
                ? apiNotificationsData.data.notifications
                : Array.isArray(apiNotificationsData?.notifications)
                    ? apiNotificationsData.notifications
                    : Array.isArray(apiNotificationsData)
                        ? apiNotificationsData
                        : [];

        if (!rawNotifications || rawNotifications.length === 0) return [];

        return rawNotifications.map((item: any) => ({
            id: item._id || item.id,
            title: item.notificationContent?.title || item.title || "Notification",
            message: item.notificationContent?.body || item.message || item.body || "",
            time: item.createdAt 
                ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                : (item.time || "Recently"),
            isRead: item.isRead ?? false,
        }));
    }, [apiNotificationsData]);

    const unreadCount = useMemo(() => {
        return notifications.filter((n) => !n.isRead).length;
    }, [notifications]);

    return (
        <div ref={notifRef} className="relative font-['Manrope',sans-serif]">
            {/* Bell Button */}
            <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-[38px] h-[38px] rounded-full bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex items-center justify-center text-[#DAB2FF] hover:bg-[rgba(124,58,237,0.2)] transition-all focus:outline-none cursor-pointer"
                aria-label="Notifications"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {/* Yellow Badge Counter */}
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#E8FF57] rounded-full flex items-center justify-center text-[9px] font-bold text-[#05033A]">
                        {notifications.length > 99 ? "99+" : notifications.length}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
                <div className="absolute right-0 mt-3 w-[340px] sm:w-[400px] bg-[#05033A] border border-[rgba(180,95,242,0.3)] shadow-2xl rounded-xl p-4 sm:p-5 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between mb-4 border-b border-[#23165A] pb-3">
                        <h3 className="font-semibold text-base text-white">Notifications</h3>
                        <span className="text-xs text-[#B45FF2] bg-[#B45FF2]/10 px-2.5 py-0.5 rounded-full font-medium">
                            {unreadCount > 0 ? `${unreadCount} Unread` : `${notifications.length} Total`}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
                        {isLoading ? (
                            <div className="flex flex-col gap-3 py-2">
                                <div className="h-14 w-full bg-white/5 rounded-lg animate-pulse" />
                                <div className="h-14 w-full bg-white/5 rounded-lg animate-pulse" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
                                <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </div>
                                <span className="font-bold text-sm text-white">No Notifications</span>
                                <span className="text-xs text-purple-200/60">You&apos;re all caught up!</span>
                            </div>
                        ) : (
                            notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-1 border-b border-[#23165A] pb-3 last:border-b-0 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-xs text-white">
                                            {item.title}
                                        </span>
                                        <span className="font-medium text-[11px] text-[#B45FF2]">
                                            {item.time}
                                        </span>
                                    </div>
                                    <p className="font-normal text-xs text-white/60 leading-relaxed">
                                        {item.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;
