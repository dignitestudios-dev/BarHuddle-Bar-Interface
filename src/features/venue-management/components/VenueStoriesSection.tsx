"use client";

import React from "react";
import { DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";

export interface VisitorStory {
    id: number;
    name: string;
    avatarUrl: string;
    storyImageUrl: string;
    timestamp?: string;
}

export interface VenueStoriesSectionProps {
    stories?: VisitorStory[];
    onSelectStory?: (story: VisitorStory) => void;
    className?: string;
}

export const DEFAULT_STORIES: VisitorStory[] = [
    {
        id: 1,
        name: "Sara",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
        timestamp: "10m ago",
    },
    {
        id: 2,
        name: "Mike",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=80",
        timestamp: "25m ago",
    },
    {
        id: 3,
        name: "Justin",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=400&q=80",
        timestamp: "1h ago",
    },
    {
        id: 4,
        name: "Marry",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=400&q=80",
        timestamp: "2h ago",
    },
    {
        id: 5,
        name: "Marry",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80",
        timestamp: "3h ago",
    },
    {
        id: 6,
        name: "Marry",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=400&q=80",
        timestamp: "3h ago",
    },
    {
        id: 7,
        name: "Marry",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
        timestamp: "4h ago",
    },
    {
        id: 8,
        name: "Marry",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
        timestamp: "5h ago",
    },
    {
        id: 9,
        name: "Marry",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        storyImageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=80",
        timestamp: "6h ago",
    },
];

export function VenueStoriesSection({
    stories = DEFAULT_STORIES,
    onSelectStory,
    className = "",
}: VenueStoriesSectionProps) {
    return (
        <div
            className={`relative w-full h-[258px] min-h-[258px] p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.2)] to-[rgba(5,3,58,0.1)] border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_60px_rgba(124,58,237,0.15)] rounded-[24px] font-['Manrope',sans-serif] ${className}`}
        >
            {/* Header Sub-Container: Live Stories Badge + Stories From Visitors Heading */}
            <div className="flex flex-col gap-1 w-full max-w-[672px]">
                {/* Live Stories Pill Label */}
                <div className="flex items-center gap-2">
                    {/* Gradient Pill Bar */}
                    <div className="w-[4px] h-[20px] bg-gradient-to-b from-[#7C3AED] to-[#E8FF57] rounded-full shrink-0" />
                    <span className="font-bold text-[12px] leading-[16px] tracking-[1.2px] uppercase text-[#9D8FD0]">
                        LIVE STORIES
                    </span>
                </div>

                {/* Main Heading */}
                <h2 className="font-bold text-[20px] leading-[28px] text-white">
                    Stories From Visitors
                </h2>
            </div>

            {/* Visitor Stories Row Carousel */}
            <div className="w-full flex items-center gap-3 overflow-x-auto scrollbar-none py-1.5 -mx-1 px-1">
                {stories.map((story) => (
                    <div
                        key={story.id}
                        onClick={() => onSelectStory?.(story)}
                        className="relative w-[118px] h-[144px] shrink-0 rounded-[16px] overflow-hidden cursor-pointer group p-[1.5px] bg-gradient-to-b from-[#F2CA54] via-[rgba(242,202,84,0.6)] to-[rgba(124,58,237,0.8)] shadow-[0px_4px_12px_rgba(0,0,0,0.3)] hover:scale-[1.03] transition-transform duration-200"
                    >
                        {/* Inner Story Card Content */}
                        <div className="relative w-full h-full rounded-[14.5px] overflow-hidden bg-[#1E0B36]">
                            {/* Background Image */}
                            <img
                                src={story.storyImageUrl || DEFAULT_VENUE_IMAGE}
                                alt=""
                                onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Dark Bottom Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Top-Left Visitor Profile Avatar (28x28 circle at top 6px, left 7px) */}
                            <div className="absolute top-[6px] left-[7px] w-[28px] h-[28px] rounded-full overflow-hidden border-[1.5px] border-white/80 shadow-[0px_2px_4px_rgba(0,0,0,0.5)] bg-gray-800">
                                <img
                                    src={story.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"}
                                    alt=""
                                    onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80")}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Visitor Name (Bottom Left) */}
                            <div className="absolute bottom-[10px] left-[10px] right-[6px] truncate">
                                <span className="font-medium text-[14px] leading-[19px] capitalize text-white drop-shadow-[0px_1px_2px_rgba(0,0,0,0.8)]">
                                    {story.name}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VenueStoriesSection;
