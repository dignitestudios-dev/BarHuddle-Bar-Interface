"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, LayoutDashboard, Building2, Store, Calendar, Tag, Zap, BarChart3, Settings, User } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { VenueSelectionModal } from "./VenueSelectionModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelectedVenue } from "@/hooks/useSelectedVenue";
import { useSidebar } from "@/context/SidebarContext";

const ROUTE_NAME_MAP: Record<string, { label: string; icon: React.ReactNode }> = {
    dashboard: { label: "Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5 text-[#AD46FF]" /> },
    "venue-management": { label: "Venue Management", icon: <Building2 className="w-3.5 h-3.5 text-[#AD46FF]" /> },
    "my-venue": { label: "My Venue", icon: <Store className="w-3.5 h-3.5 text-[#AD46FF]" /> },
    events: { label: "Events", icon: <Calendar className="w-3.5 h-3.5 text-[#AD46FF]" /> },
    promotions: { label: "Promotions", icon: <Tag className="w-3.5 h-3.5 text-[#AD46FF]" /> },
    "event-boosting": { label: "Event Boosting", icon: <Zap className="w-3.5 h-3.5 text-[#AD46FF]" /> },
    analytics: { label: "Analytics", icon: <BarChart3 className="w-3.5 h-3.5 text-[#AD46FF]" /> },
    settings: { label: "Settings", icon: <Settings className="w-3.5 h-3.5 text-[#AD46FF]" /> },
    profile: { label: "Profile", icon: <User className="w-3.5 h-3.5 text-[#AD46FF]" /> },
};

export function Navbar() {
    const pathname = usePathname();
    const { venues, selectedVenueId, selectedVenueName, selectVenue, isLoading } = useSelectedVenue();
    const { toggleMobile, isCollapsed, toggleCollapse } = useSidebar();
    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

    // Compute dynamic breadcrumbs from current route path
    const breadcrumbData = useMemo(() => {
        if (!pathname) return { title: "Dashboard", icon: ROUTE_NAME_MAP.dashboard.icon, path: "Dashboard" };

        const segments = pathname.split("/").filter(Boolean);
        // segments might be ['app', 'events'] or ['app', 'venue-management']
        const currentSegment = segments[segments.length - 1] || "dashboard";
        const meta = ROUTE_NAME_MAP[currentSegment] || {
            label: currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1).replace(/-/g, " "),
            icon: <LayoutDashboard className="w-3.5 h-3.5 text-[#AD46FF]" />,
        };

        return {
            title: meta.label,
            icon: meta.icon,
            segment: currentSegment,
        };
    }, [pathname]);

    return (
        <>
            <header className="relative w-full h-16 px-3 sm:px-6 bg-[#05033AD9] backdrop-blur-md border-b border-[#7C3AED]/20 flex items-center justify-between sticky top-0 z-30 font-['Manrope',sans-serif] select-none">
                {/* Left Section: Mobile Drawer Trigger + Dynamic Breadcrumb Trail */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 z-40">
                    {/* Mobile Hamburger Drawer Trigger */}
                    <button
                        type="button"
                        onClick={toggleMobile}
                        className="md:hidden p-2 -ml-1 rounded-xl bg-[rgba(124,58,237,0.12)] hover:bg-[rgba(124,58,237,0.25)] border border-[rgba(124,58,237,0.3)] text-[#C4B5FD] hover:text-white transition-all cursor-pointer shrink-0"
                        title="Open Menu"
                        aria-label="Open Navigation Menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Breadcrumb Indicator with Icon (Hidden on mobile, visible on desktop) */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-semibold truncate">
                        <Link
                            href="/app/dashboard"
                            className="inline-flex items-center gap-1.5 text-[#9D8FD0] hover:text-[#E8FF57] transition-colors"
                        >
                            <span>BarHuddle</span>
                        </Link>
                        <ChevronRight className="inline-block w-3.5 h-3.5 text-[#9D8FD0]/60 shrink-0" />

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] text-white">
                            <span className="shrink-0">{breadcrumbData.icon}</span>
                            <span className="font-bold text-[13px] text-[#F0EEFF] truncate max-w-[160px]">
                                {breadcrumbData.title}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center Venue / Bar Name Trigger (Adaptive & Responsive) */}
                <div className="flex items-center justify-center mx-auto max-w-[45%] sm:max-w-[50%] md:max-w-[60%] z-40">
                    {isLoading && !selectedVenueName ? (
                        <Skeleton className="h-8 w-28 sm:w-48 rounded-full bg-[rgba(124,58,237,0.15)]" />
                    ) : selectedVenueName ? (
                        <button
                            type="button"
                            onClick={() => setIsVenueModalOpen(true)}
                            className="group flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[rgba(124,58,237,0.14)] hover:bg-[rgba(124,58,237,0.25)] border border-[rgba(124,58,237,0.3)] hover:border-[rgba(124,58,237,0.6)] shadow-[0_0_20px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md transition-all cursor-pointer select-none"
                            title="Click to switch active venue"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#E8FF57] shadow-[0_0_8px_#E8FF57] animate-pulse shrink-0" />
                            <span className="font-extrabold text-[12px] sm:text-[15px] md:text-[16px] leading-[20px] sm:leading-[22px] tracking-tight bg-gradient-to-r from-white via-white to-[#E8FF57] bg-clip-text text-transparent truncate max-w-[100px] sm:max-w-[200px] md:max-w-[320px]">
                                {selectedVenueName}
                            </span>
                            <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/5 group-hover:bg-[#E8FF57]/20 transition-colors shrink-0">
                                <svg
                                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9D8FD0] group-hover:text-[#E8FF57] transition-colors shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                            </div>
                        </button>
                    ) : null}
                </div>

                {/* Right Action Dropdowns (Notifications + Profile) */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0 z-40">
                    {/* Notification Dropdown Component */}
                    <NotificationDropdown />

                    {/* Profile Dropdown Component */}
                    <ProfileDropdown />
                </div>
            </header>

            {/* Venue Selection Dialog Box */}
            <VenueSelectionModal
                isOpen={isVenueModalOpen}
                onClose={() => setIsVenueModalOpen(false)}
                venues={venues}
                selectedVenueId={selectedVenueId}
                onSelectVenue={selectVenue}
            />
        </>
    );
}

export default Navbar;
