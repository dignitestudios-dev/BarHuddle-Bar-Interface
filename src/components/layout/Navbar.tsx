"use client";

import { useMemo } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { useGetOwnerVenuesQuery } from "@/features/venue-management/api/venue.queries";
import { useAppSelector } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";

export function Navbar() {
    const { data: ownerVenuesData, isLoading } = useGetOwnerVenuesQuery();
    const { user } = useAppSelector((state) => state.auth);

    const venueName = useMemo(() => {
        const raw = ownerVenuesData as any;
        if (!raw && !user) return "";

        const list = Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.venues)
            ? raw.venues
            : Array.isArray(raw)
            ? raw
            : raw?.data && typeof raw.data === "object"
            ? [raw.data]
            : raw && typeof raw === "object" && (raw.name || raw._id || raw.id)
            ? [raw]
            : [];

        const first = list[0];
        const nameFromApi = first?.venue?.name || first?.name || first?.title;
        const nameFromUser =
            (user as any)?.venue?.name ||
            (user as any)?.venueName ||
            (user as any)?.claimedVenue?.name ||
            (user as any)?.venue?.title ||
            "";

        return nameFromApi || nameFromUser || "";
    }, [ownerVenuesData, user]);

    return (
        <header className="relative w-full h-16 px-6 bg-[#05033AD9] backdrop-blur-md border-b border-[#7C3AED]/20 flex items-center justify-between sticky top-0 z-30 font-['Manrope',sans-serif]">
            {/* Left Spacer for symmetry */}
            <div className="flex items-center min-w-[40px] md:min-w-[80px]" />

            {/* Center Venue / Bar Name */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center max-w-[60%] sm:max-w-[70%] pointer-events-none sm:pointer-events-auto">
                {isLoading && !venueName ? (
                    <Skeleton className="h-8 w-40 sm:w-56 rounded-full bg-[rgba(124,58,237,0.15)]" />
                ) : venueName ? (
                    <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.3)] shadow-[0_0_20px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-[#E8FF57] shadow-[0_0_8px_#E8FF57] animate-pulse shrink-0" />
                        <span className="font-extrabold text-[14px] sm:text-[16px] leading-[22px] tracking-tight bg-gradient-to-r from-white via-white to-[#E8FF57] bg-clip-text text-transparent truncate max-w-[180px] sm:max-w-[320px] md:max-w-[450px]">
                            {venueName}
                        </span>
                    </div>
                ) : null}
            </div>

            {/* Right Action Dropdowns */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notification Dropdown Component */}
                <NotificationDropdown />

                {/* Profile Dropdown Component */}
                <ProfileDropdown />
            </div>
        </header>
    );
}

export default Navbar;

