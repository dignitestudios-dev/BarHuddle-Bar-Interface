"use client";

import React from "react";
import type { Attendee } from "./VenueAttendeesSection";

export interface AttendeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    attendees?: Attendee[];
    title?: string;
}

const DEFAULT_MODAL_ATTENDEES: Attendee[] = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: "Wade Warren",
    avatarUrl: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
    ][i % 6],
}));

export function AttendeesModal({
    isOpen,
    onClose,
    attendees = DEFAULT_MODAL_ATTENDEES,
    title = "List Of Attendees",
}: AttendeesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Modal Card Container */}
            <div className="relative w-full max-w-[563px] h-[799px] max-h-[90vh] bg-[#05033A] border border-[rgba(124,58,237,0.3)] shadow-[0px_4px_25px_rgba(0,0,0,0.5)] rounded-[16px] p-6 sm:p-7 flex flex-col gap-6 overflow-hidden">
                {/* Fixed Modal Header */}
                <div className="flex items-center justify-between z-10 shrink-0">
                    <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize">
                        {title}
                    </h2>

                    {/* Close Icon Button (40x40) */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable 4-Column Attendees Grid Area */}
                <div className="flex-1 overflow-y-auto scrollbar-none pr-1 z-0">
                    <div className="grid grid-cols-4 gap-3 w-full pb-20">
                        {attendees.map((person, idx) => (
                            <div
                                key={`${person.id}-${idx}`}
                                className="relative w-full h-[133.59px] rounded-[16px] overflow-hidden group shadow-[0px_4px_12px_rgba(0,0,0,0.25)] bg-[#100A3A]"
                            >
                                {/* Attendee Image */}
                                <img
                                    src={person.avatarUrl}
                                    alt={person.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Card Dark Gradient Bottom Edge Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                {/* Name Badge Pill (Bottom Center) */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[110px] h-[29.3px] px-2 rounded-[10px] bg-[rgba(132,36,187,0.7)] backdrop-blur-md shadow-[0px_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center">
                                    <span className="font-medium text-[11px] leading-[22px] text-white capitalize text-center truncate">
                                        {person.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fixed Blurry Gradient Overlay at Modal Bottom */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[110px] z-20 backdrop-blur-md bg-gradient-to-t from-[#05033A] via-[#05033A]/80 to-transparent rounded-b-[16px]" />
            </div>
        </div>
    );
}

export default AttendeesModal;
