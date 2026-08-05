import { StatsColorVariant } from "@/components/ui";
import React from "react";

export interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
}

interface DashboardStat {
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    variant: StatsColorVariant;
    icon: React.ReactNode;
}

export const navItems: NavItem[] = [
    {
        name: "Dashboard",
        href: "/app/dashboard",
        icon: (
            <svg className="w-[17px] h-[17px]" viewBox="0 0 17 17" fill="none">
                <rect x="2" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="9.5" y="2" width="5.5" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="9.5" y="7.5" width="5.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="2" y="9.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            </svg>
        ),
    },
    {
        name: "Venue Management",
        href: "/app/venue-management",
        icon: (
            <svg className="w-[17px] h-[17px]" viewBox="0 0 17 17" fill="none">
                <path d="M2.5 14.5V6.5L8.5 2.5L14.5 6.5V14.5H2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M6.5 14.5V10.5H10.5V14.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
        ),
    },
    {
        name: "Events",
        href: "/app/events",
        icon: (
            <svg className="w-[17px] h-[17px]" viewBox="0 0 17 17" fill="none">
                <rect x="2" y="3.5" width="13" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M5.5 2V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M11.5 2V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M2 7H15" stroke="currentColor" strokeWidth="1.4" />
            </svg>
        ),
    },
    {
        name: "Promotions",
        href: "/app/promotions",
        icon: (
            <svg className="w-[17px] h-[17px]" viewBox="0 0 17 17" fill="none">
                <path d="M2.5 8.5L8.5 2.5H14.5V8.5L8.5 14.5L2.5 8.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <circle cx="11.5" cy="5.5" r="1" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "Event Boosting",
        href: "/app/boosting",
        icon: (
            <svg className="w-[17px] h-[17px]" viewBox="0 0 17 17" fill="none">
                <path d="M9.5 2L3.5 9.5H8.5L7.5 15L13.5 7.5H8.5L9.5 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        name: "Analytics",
        href: "/app/analytics",
        icon: (
            <svg className="w-[17px] h-[17px]" viewBox="0 0 17 17" fill="none">
                <path d="M3 14V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M7 14V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M11 14V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M15 14V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Settings",
        href: "/app/settings",
        icon: (
            <svg className="w-[17px] h-[17px]" viewBox="0 0 17 17" fill="none">
                <circle cx="8.5" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8.5 2.5V3.5M8.5 13.5V14.5M2.5 8.5H3.5M13.5 8.5H14.5M4.25 4.25L5 5M12 12L12.75 12.75M4.25 12.75L5 12M12 5L12.75 4.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        ),
    },
];

export const statsList: DashboardStat[] = [
    {
        title: "Total Visitors",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "purple",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
    {
        title: "Total Check-Ins",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "cyan",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        title: "Avg Stay Duration",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "yellow",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        title: "New Customers",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "green",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
    },
    {
        title: "Repeat Customers",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "purple",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
    },
    {
        title: "Lost Customers",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "coral",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
            </svg>
        ),
    },
    {
        title: "Event Attendance",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "pink",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        title: "Avg Stay Duration",
        value: "12,840",
        trend: "+18.4%",
        isPositive: true,
        variant: "orange",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
    },
];
