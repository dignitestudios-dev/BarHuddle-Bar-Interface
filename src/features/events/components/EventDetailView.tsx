"use client";

import { EventCardData } from "./EventCard";
import { VenueCarouselSection } from "@/features/venue-management/components";


export interface EventDetailViewProps {
    event?: any;
    isLoading?: boolean;
    onBack?: () => void;
    className?: string;
}

export function EventDetailView({
    event,
    isLoading,
    onBack,
    className = "",
}: EventDetailViewProps) {
    if (isLoading) {
        return (
            <div className="w-full max-w-[1200px] flex items-center justify-center p-16 text-white/70 font-semibold text-lg">
                Loading event details...
            </div>
        );
    }

    const title = event?.title || event?.name || "Event Details";
    const description = event?.description || "No description provided for this event.";
    const startDateFormatted = event?.startAt 
        ? new Date(event.startAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) 
        : "N/A";
    const startTimeFormatted = event?.startAt && event?.endAt 
        ? `${new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : "N/A";
    const artist = event?.artist || "N/A";
    const venueName = event?.venue?.name || "Venue";
    const venueAddress = event?.venue?.address || "";
    const city = venueAddress ? venueAddress.split(",").slice(-2, -1)[0]?.trim() || "Location" : "";

    const customSlides = event ? [
        {
            id: 1,
            title: venueName,
            category: event?.venue?.category || "Bar",
            locationCity: city,
            fullAddress: venueAddress,
            isOpen: true,
            imageUrl: event?.banner || event?.venue?.coverImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
        },
        ...(event?.venue?.coverImage && event?.banner ? [{
            id: 2,
            title: venueName,
            category: event?.venue?.category || "Bar",
            locationCity: city,
            fullAddress: venueAddress,
            isOpen: true,
            imageUrl: event.venue.coverImage,
        }] : [])
    ] : undefined;

    return (
        <div className={`w-full max-w-[1200px] flex flex-col gap-6 font-['Manrope',sans-serif] ${className}`}>
            {/* Top Bar: Back Button, Event Detail Heading & Options Menu */}
            <div className="w-full flex items-center justify-between min-h-[45px]">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="w-10 h-10 rounded-full bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-white hover:bg-[rgba(124,58,237,0.3)] transition-all cursor-pointer shrink-0"
                            aria-label="Go back"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <h1 className="font-extrabold text-[32px] sm:text-[36px] leading-[44px] text-white tracking-tight">
                        {title}
                    </h1>
                </div>

                {/* Top Right Options Menu Button (3 Dots) */}
                <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-[rgba(124,58,237,0.7)] backdrop-blur-md border border-[rgba(124,58,237,0.4)] flex items-center justify-center text-white hover:bg-[#7C3AED] transition-colors shadow-md cursor-pointer shrink-0"
                    aria-label="Options"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>

            {/* Venue Hero & Image Carousel Section */}
            <VenueCarouselSection slides={customSlides} />

            {/* 2-Column Grid Below Carousel: Event Details (Description) + Other Information */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Card (lg:col-span-7): Event Details - Description */}
                <div className="lg:col-span-7 w-full p-6 sm:p-7 rounded-[20px] bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.35),inset_0px_1px_0px_rgba(255,255,255,0.05)] backdrop-blur-xl flex flex-col gap-5">
                    {/* Section Label: Indicator Pill + Text */}
                    <div className="flex items-center gap-2">
                        <div className="w-[4px] h-[20px] rounded-full bg-gradient-to-b from-[#7C3AED] to-[#E8FF57] shrink-0" />
                        <span className="font-bold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#9D8FD0]">
                            EVENT DETAILS
                        </span>
                    </div>

                    {/* Heading 2 */}
                    <h2 className="font-bold text-[20px] leading-[28px] text-white">
                        Description/Instructions
                    </h2>

                    {/* Instructions Text */}
                    <div className="flex flex-col gap-3">
                        <p className="font-normal text-[14px] leading-[22px] text-white/90 whitespace-pre-wrap">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Right Card (lg:col-span-5): Other Information */}
                <div className="lg:col-span-5 w-full p-6 sm:p-7 rounded-[20px] bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.22)] shadow-[0px_8px_32px_rgba(0,0,0,0.35),inset_0px_1px_0px_rgba(255,255,255,0.05)] backdrop-blur-xl flex flex-col gap-5">
                    {/* Section Label: Indicator Pill + Text */}
                    <div className="flex items-center gap-2">
                        <div className="w-[4px] h-[20px] rounded-full bg-gradient-to-b from-[#7C3AED] to-[#E8FF57] shrink-0" />
                        <span className="font-bold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#9D8FD0]">
                            OTHER INFORMATION
                        </span>
                    </div>

                    {/* Inner Glass Container with 2x2 Grid */}
                    <div className="relative w-full p-6 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] flex flex-col gap-6 overflow-hidden">
                        {/* Horizontal Divider Line */}
                        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[rgba(124,58,237,0.4)] to-transparent pointer-events-none" />

                        {/* Vertical Divider Line */}
                        <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[rgba(124,58,237,0.4)] to-transparent pointer-events-none" />

                        {/* Top Row: Date (Left) & Time (Right) */}
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {/* Date */}
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-[13px] leading-[18px] tracking-[-0.408px] capitalize text-[#FDF88F]">
                                    Date
                                </span>
                                <span className="font-normal text-[13px] leading-[18px] tracking-[-0.408px] capitalize text-white">
                                    {startDateFormatted}
                                </span>
                            </div>

                            {/* Time */}
                            <div className="flex flex-col gap-1 items-end text-right">
                                <span className="font-bold text-[13px] leading-[18px] tracking-[-0.408px] capitalize text-[#FDF88F]">
                                    Time
                                </span>
                                <span className="font-normal text-[13px] leading-[18px] tracking-[-0.408px] capitalize text-white">
                                    {startTimeFormatted}
                                </span>
                            </div>
                        </div>

                        {/* Bottom Row: Artist (Left) & Status (Right) */}
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {/* Artist */}
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-[13px] leading-[18px] tracking-[-0.408px] capitalize text-[#FDF88F]">
                                    Artist
                                </span>
                                <span className="font-normal text-[13px] leading-[18px] tracking-[-0.408px] capitalize text-white">
                                    {artist}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1 items-end text-right">
                                <span className="font-bold text-[13px] leading-[18px] tracking-[-0.408px] capitalize text-[#FDF88F]">
                                    Status
                                </span>
                                <span className="font-normal text-[13px] leading-[18px] tracking-[-0.408px] capitalize text-white">
                                    {event?.status || "Published"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetailView;
