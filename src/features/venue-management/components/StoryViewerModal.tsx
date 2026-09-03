"use client";

import type { VisitorStory } from "./VenueStoriesSection";
import { DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";

export interface StoryViewerModalProps {
    story: VisitorStory | null;
    onClose: () => void;
}

export function StoryViewerModal({ story, onClose }: StoryViewerModalProps) {
    if (!story) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            <div className="relative w-full max-w-[380px] h-[640px] bg-black rounded-[24px] overflow-hidden border border-purple-500/40 shadow-2xl flex flex-col justify-between p-4">
                {/* Story Progress Bar */}
                <div className="relative z-10 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-full animate-pulse" />
                </div>

                {/* Top Story Header */}
                <div className="flex items-center justify-between z-10 pt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-purple-500 shrink-0">
                            <img
                                src={story.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"}
                                alt=""
                                onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80")}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{story.name}</span>
                            <span className="text-xs text-white/60">{story.timestamp || "Recently"}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                        aria-label="Close story viewer"
                    >
                        ✕
                    </button>
                </div>

                {/* Story Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={story.storyImageUrl || DEFAULT_VENUE_IMAGE}
                        alt=""
                        onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
                </div>
            </div>
        </div>
    );
}

export default StoryViewerModal;
