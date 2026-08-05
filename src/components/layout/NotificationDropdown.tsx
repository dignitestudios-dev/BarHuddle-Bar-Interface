"use client";

import React, { useState, useRef, useEffect } from "react";

export interface NotificationItem {
    id: number;
    title: string;
    message: string;
    time: string;
}

export function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

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

    const notifications: NotificationItem[] = [
        {
            id: 1,
            title: "New Booking Request",
            message: "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique.",
            time: "7:30 PM",
        },
        {
            id: 2,
            title: "Event Boost Approved",
            message: "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique.",
            time: "6:15 PM",
        },
        {
            id: 3,
            title: "Weekly Analytics Ready",
            message: "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique.",
            time: "4:00 PM",
        },
    ];

    return (
        <div ref={notifRef} className="relative">
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
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8FF57] rounded-full flex items-center justify-center text-[9px] font-bold text-[#05033A]">
                    {notifications.length}
                </span>
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
                <div className="absolute right-0 mt-3 w-[360px] sm:w-[420px] bg-[#05033A] border border-[rgba(180,95,242,0.3)] shadow-2xl rounded-xl p-5 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between mb-4 border-b border-[#23165A] pb-3">
                        <h3 className="font-semibold text-base text-white">Notifications</h3>
                        <span className="text-xs text-[#B45FF2] bg-[#B45FF2]/10 px-2 py-0.5 rounded-full font-medium">
                            {notifications.length} Unread
                        </span>
                    </div>

                    <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">
                        {notifications.map((item) => (
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
                                <p className="font-normal text-xs text-white/50 leading-relaxed">
                                    {item.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;
