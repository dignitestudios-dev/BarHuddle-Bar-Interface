"use client";

import React, { useState } from "react";
import { cleanImageUrl, DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";

export interface CarouselSlide {
    id: number;
    title: string;
    category: string;
    locationCity: string;
    fullAddress: string;
    isOpen: boolean;
    imageUrl: string;
}

export interface VenueCarouselSectionProps {
    slides?: CarouselSlide[];
    className?: string;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
    {
        id: 1,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        locationCity: "Washington, DC",
        fullAddress: "1622 14th St NW, Washington, DC",
        isOpen: true,
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 2,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        locationCity: "Washington, DC",
        fullAddress: "1622 14th St NW, Washington, DC",
        isOpen: true,
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 3,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        locationCity: "Washington, DC",
        fullAddress: "1622 14th St NW, Washington, DC",
        isOpen: true,
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 4,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        locationCity: "Washington, DC",
        fullAddress: "1622 14th St NW, Washington, DC",
        isOpen: true,
        imageUrl: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 5,
        title: "Barcelona Wine Bar",
        category: "Wine Bar",
        locationCity: "Washington, DC",
        fullAddress: "1622 14th St NW, Washington, DC",
        isOpen: true,
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80",
    },
];

export function VenueCarouselSection({
    slides = DEFAULT_SLIDES,
    className = "",
}: VenueCarouselSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeSlide = slides[activeIndex] || slides[0];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className={`w-full max-w-[1200px] flex flex-col md:flex-row gap-3 items-stretch select-none font-['Manrope',sans-serif] ${className}`}>
            {/* Left Main Large Hero Showcase Container (Width: ~980px, Height: 480px) */}
            <div className="relative flex-1 h-[480px] bg-[#3C0366] rounded-[20px] overflow-hidden group shadow-[0px_0px_40px_rgba(0,0,0,0.5)]">
                {/* Main Hero Background Image */}
                <img
                    src={cleanImageUrl(activeSlide.imageUrl, DEFAULT_VENUE_IMAGE)}
                    alt=""
                    onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                    className="w-full h-full object-cover transition-all duration-500 rounded-[20px]"
                />

                {/* Dark Ambient Gradient Overlay (matching CSS: linear-gradient(0deg, rgba(5,3,58,0.95) 0%, rgba(5,3,58,0.3) 40%, rgba(0,0,0,0) 70%)) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05033A]/95 via-[#05033A]/30 to-transparent pointer-events-none rounded-[20px]" />

                {/* Top-Left Category & Status Badges Row (left: 20px, top: 20px) */}
                <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                    {/* Category Pill Badge ("Wine Bar") */}
                    <div className="px-3.5 py-1.5 rounded-full bg-[rgba(124,58,237,0.85)] border border-[rgba(124,58,237,0.5)] backdrop-blur-md flex items-center justify-center">
                        <span className="font-bold text-[12px] leading-[16px] text-white">
                            {activeSlide.category}
                        </span>
                    </div>

                    {/* Status Pill Badge ("Open Now") */}
                    {activeSlide.isOpen && (
                        <div className="px-3.5 py-1.5 rounded-full bg-[rgba(5,3,58,0.8)] border border-[rgba(232,255,87,0.3)] backdrop-blur-md flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#05DF72] opacity-80 animate-pulse" />
                            <span className="font-bold text-[12px] leading-[16px] text-[#E8FF57]">
                                Open Now
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom Content Overlay Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-4">
                    {/* Info Row: Title & Address on Left, Navigation Buttons on Right */}
                    <div className="flex items-end justify-between w-full gap-4">
                        {/* Title & Address Block */}
                        <div className="flex flex-col gap-1 max-w-[600px]">
                            {/* City / State Header Tag */}
                            <span className="font-semibold text-[12px] leading-[16px] text-[#E8FF57]">
                                {activeSlide.locationCity}
                            </span>

                            {/* Main Venue Name */}
                            <h1 className="font-extrabold text-[32px] sm:text-[36px] leading-[45px] text-white drop-shadow-[0px_2px_8px_rgba(0,0,0,0.8)]">
                                {activeSlide.title}
                            </h1>

                            {/* Address Row with Pin Icon */}
                            <div className="flex items-center gap-1.5 pt-1 text-[#9D8FD0]">
                                <svg className="w-3.5 h-3.5 text-[#C27AFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-normal text-[15px] leading-[16px] truncate">
                                    {activeSlide.fullAddress}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Circular Buttons (< and >) */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Previous Button */}
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="w-10 h-10 rounded-full bg-[rgba(5,3,58,0.7)] hover:bg-[rgba(124,58,237,0.6)] border border-[rgba(124,58,237,0.3)] backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                                aria-label="Previous Slide"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Next Button */}
                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-10 h-10 rounded-full bg-[rgba(5,3,58,0.7)] hover:bg-[rgba(124,58,237,0.6)] border border-[rgba(124,58,237,0.3)] backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                                aria-label="Next Slide"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Pagination Indicators Row */}
                    <div className="flex items-center gap-1.5 pt-1">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveIndex(idx)}
                                className={`h-[6px] rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                                        ? "w-[24px] bg-[#E8FF57]"
                                        : "w-[6px] bg-white/30 hover:bg-white/50"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side Vertical Thumbnails Column (Width: ~144px, Height: 480px) */}
            <div className="w-full md:w-[144px] h-[480px] flex flex-row md:flex-col gap-[10px] shrink-0 overflow-x-auto md:overflow-y-auto scrollbar-none">
                {slides.map((slide, idx) => {
                    const isActive = idx === activeIndex;

                    return (
                        <button
                            key={slide.id}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            className={`relative w-[144px] shrink-0 rounded-[14px] overflow-hidden transition-all duration-300 cursor-pointer ${isActive
                                    ? "h-[140px] border-[1.6px] border-[#E8FF57] shadow-[0px_0px_14px_rgba(232,255,87,0.4)]"
                                    : "h-[80px] border border-[rgba(124,58,237,0.2)] hover:border-[rgba(124,58,237,0.5)] opacity-80 hover:opacity-100"
                                }`}
                        >
                            {/* Thumbnail Image */}
                            <img
                                src={cleanImageUrl(slide.imageUrl, DEFAULT_VENUE_IMAGE)}
                                alt=""
                                onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                                className="w-full h-full object-cover"
                            />

                            {/* Dark Overlay for Inactive Thumbnails */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-[#05033A]/50 transition-opacity group-hover:opacity-20" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default VenueCarouselSection;
