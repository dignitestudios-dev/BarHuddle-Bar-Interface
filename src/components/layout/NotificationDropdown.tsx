"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useGetInfiniteNotificationsQuery } from "@/features/notifications/api/notifications.queries";
import { useMarkAllNotificationsAsReadMutation } from "@/features/notifications/api/notifications.mutations";

export interface NotificationItem {
    id: string | number;
    title: string;
    message: string;
    time: string;
    isRead?: boolean;
}

const NOTIFICATIONS_PAGE_LIMIT = 10;

export function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const bottomSentinelRef = useRef<HTMLDivElement>(null);

    const {
        data: infiniteNotificationsData,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useGetInfiniteNotificationsQuery(NOTIFICATIONS_PAGE_LIMIT);

    const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();

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

    // Flatten all pages from infinite query
    const notifications: NotificationItem[] = useMemo(() => {
        if (!infiniteNotificationsData?.pages) return [];

        const list: NotificationItem[] = [];
        const seenIds = new Set<string>();

        infiniteNotificationsData.pages.forEach((page: any) => {
            const rawNotifications = Array.isArray(page?.data)
                ? page.data
                : Array.isArray(page?.data?.notifications)
                ? page.data.notifications
                : Array.isArray(page?.notifications)
                ? page.notifications
                : Array.isArray(page?.data?.data)
                ? page.data.data
                : Array.isArray(page)
                ? page
                : [];

            rawNotifications.forEach((item: any) => {
                const id = String(item._id || item.id || "");
                if (id && seenIds.has(id)) return;
                if (id) seenIds.add(id);

                const title = item.notificationContent?.title || item.title || "Notification";
                const message = item.notificationContent?.body || item.message || item.body || "";
                const time = item.createdAt
                    ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : (item.time || "Recently");
                const isRead = item.isRead ?? false;

                list.push({
                    id: id || `${Math.random()}`,
                    title,
                    message,
                    time,
                    isRead,
                });
            });
        });

        return list;
    }, [infiniteNotificationsData]);

    const unreadCount = useMemo(() => {
        return notifications.filter((n) => !n.isRead).length;
    }, [notifications]);

    // IntersectionObserver to auto-load next page when bottom sentinel is reached
    useEffect(() => {
        if (!showNotifications || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                root: scrollContainerRef.current,
                threshold: 0.1,
                rootMargin: "60px",
            }
        );

        const currentTarget = bottomSentinelRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
            observer.disconnect();
        };
    }, [showNotifications, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Fallback scroll listener on container for instant page triggering
    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollHeight - scrollTop - clientHeight < 60 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    const handleToggleDropdown = () => {
        const willOpen = !showNotifications;
        setShowNotifications(willOpen);

        // When opening the notification dropdown, mark all as read
        if (willOpen && unreadCount > 0) {
            markAllAsReadMutation.mutate();
        }
    };

    return (
        <div ref={notifRef} className="relative font-['Manrope',sans-serif]">
            {/* Bell Button */}
            <button
                type="button"
                onClick={handleToggleDropdown}
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
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#E8FF57] rounded-full flex items-center justify-center text-[9px] font-bold text-[#05033A]">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
                <div className="absolute right-0 mt-3 w-[340px] sm:w-[400px] bg-[#05033A] border border-[rgba(180,95,242,0.3)] shadow-2xl rounded-xl p-4 sm:p-5 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between mb-4 border-b border-[#23165A] pb-3">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base text-white">Notifications</h3>
                            <span className="text-xs text-[#B45FF2] bg-[#B45FF2]/10 px-2.5 py-0.5 rounded-full font-medium">
                                {unreadCount > 0 ? `${unreadCount} Unread` : `${notifications.length} Total`}
                            </span>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={() => markAllAsReadMutation.mutate()}
                                disabled={markAllAsReadMutation.isPending}
                                className="text-[11px] text-[#A78BFA] hover:text-[#C4B5FD] font-semibold cursor-pointer transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex flex-col gap-3 max-h-[340px] sm:max-h-[380px] overflow-y-auto pr-1 custom-scrollbar"
                    >
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
                            <>
                                {notifications.map((item, idx) => (
                                    <div
                                        key={`${item.id}-${idx}`}
                                        className={`flex flex-col gap-1 border-b border-[#23165A] pb-3 last:border-b-0 hover:bg-white/5 p-2.5 rounded-xl transition-colors cursor-pointer ${
                                            !item.isRead ? "bg-purple-950/25 border-l-2 border-l-[#E8FF57]" : ""
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                {!item.isRead && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF57] shrink-0" />
                                                )}
                                                <span className="font-bold text-xs text-white truncate">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <span className="font-medium text-[10px] text-[#B45FF2] shrink-0">
                                                {item.time}
                                            </span>
                                        </div>
                                        <p className="font-normal text-xs text-white/70 leading-relaxed break-words">
                                            {item.message}
                                        </p>
                                    </div>
                                ))}

                                {/* Bottom Intersection Observer Sentinel */}
                                <div ref={bottomSentinelRef} className="h-2 w-full shrink-0" />

                                {/* Next Page Loading Indicator */}
                                {isFetchingNextPage && (
                                    <div className="flex items-center justify-center py-3 gap-2.5 bg-white/[0.02] rounded-xl border border-white/5">
                                        <div className="w-4 h-4 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
                                        <span className="text-[#C4B5FD] text-xs font-medium">Loading more notifications...</span>
                                    </div>
                                )}

                                {/* End of list indicator */}
                                {!hasNextPage && notifications.length >= NOTIFICATIONS_PAGE_LIMIT && (
                                    <div className="py-2.5 text-center text-[11px] text-[#8B7EC8]/70 font-medium">
                                        All notifications loaded
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;
