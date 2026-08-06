"use client";

import React, { useState } from "react";
import { EventCardData } from "@/components/events/EventCard";

export interface BoostEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event?: EventCardData | null;
    onConfirmBoost?: (event: EventCardData, duration: string) => void;
}

export function BoostEventModal({
    isOpen,
    onClose,
    event,
    onConfirmBoost,
}: BoostEventModalProps) {
    const [selectedDuration, setSelectedDuration] = useState("14 Days");

    if (!isOpen || !event) return null;

    const handleConfirm = () => {
        onConfirmBoost?.(event, selectedDuration);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Modal Container: 563px width, #05033A background, 16px radius */}
            <div className="relative w-full max-w-[563px] bg-[#05033A] border border-[rgba(124,58,237,0.25)] shadow-[0px_4px_24px_rgba(0,0,0,0.5)] rounded-[16px] p-6 sm:p-[30px] flex flex-col gap-6 max-h-[92vh] overflow-y-auto scrollbar-none">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize tracking-tight">
                        Boost Event
                    </h2>

                    {/* Close Button (40x40 container) */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                        aria-label="Close modal"
                    >
                        <div className="w-[18px] h-[18px] border-[1.8px] border-white rounded-[1px] flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Event Card Summary Box (height 89.6px) */}
                <div className="w-full h-[89.6px] bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.2)] rounded-[18px] p-4 flex items-center justify-between gap-3 shrink-0">
                    {/* Left: Thumbnail & Title/Details */}
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <div className="w-[80px] h-[56px] rounded-[12px] bg-[#3C0366] overflow-hidden shrink-0">
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover opacity-85"
                            />
                        </div>
                        <div className="flex flex-col justify-center truncate">
                            <h3 className="font-extrabold text-[14px] leading-[20px] text-white truncate">
                                {event.title}
                            </h3>
                            <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] truncate mt-0.5">
                                {event.dateTime} · {event.venueName}
                            </span>
                        </div>
                    </div>

                    {/* Right: Stats (Organic Reach & Views) */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Organic Reach */}
                        <div className="flex flex-col items-end">
                            <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8]">
                                Organic Reach
                            </span>
                            <span className="font-extrabold text-[16px] leading-[24px] text-[#22D3EE]">
                                {event.views || "0.7K"}
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="w-[1px] h-[40px] bg-[rgba(124,58,237,0.2)] mx-1" />

                        {/* Views */}
                        <div className="flex flex-col items-end">
                            <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8]">
                                Views
                            </span>
                            <span className="font-extrabold text-[16px] leading-[24px] text-[#A855F7]">
                                {event.ratio || "184"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="w-full border-t border-[rgba(255,255,255,0.11)]" />

                {/* Notice Text */}
                <p className="font-medium text-[13px] leading-[16px] text-[#C4B5FD]">
                    Promotions will appear on your venue page during selected days and will be visible to all BarHuddle users in your area.
                </p>

                {/* Duration Select Row (3 Options) */}
                <div className="grid grid-cols-3 gap-3 w-full">
                    {/* 7 Days Option */}
                    <button
                        type="button"
                        onClick={() => setSelectedDuration("7 Days")}
                        className={`h-[63px] rounded-[14px] flex flex-col items-center justify-center cursor-pointer transition-all ${
                            selectedDuration === "7 Days"
                                ? "bg-[rgba(124,58,237,0.18)] border-2 border-[#7C3AED] shadow-[0px_0px_16px_rgba(124,58,237,0.3)]"
                                : "bg-[rgba(124,58,237,0.047)] border border-[rgba(124,58,237,0.133)] hover:bg-[rgba(124,58,237,0.1)]"
                        }`}
                    >
                        <span className="font-extrabold text-[14px] leading-[20px] text-[#7C3AED]">
                            7 Days
                        </span>
                        <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8] mt-0.5">
                            Duration
                        </span>
                    </button>

                    {/* 14 Days Option */}
                    <button
                        type="button"
                        onClick={() => setSelectedDuration("14 Days")}
                        className={`h-[63px] rounded-[14px] flex flex-col items-center justify-center cursor-pointer transition-all ${
                            selectedDuration === "14 Days"
                                ? "bg-[rgba(232,255,87,0.18)] border-2 border-[#E8FF57] shadow-[0px_0px_16px_rgba(232,255,87,0.3)]"
                                : "bg-[rgba(232,255,87,0.047)] border border-[rgba(232,255,87,0.133)] hover:bg-[rgba(232,255,87,0.1)]"
                        }`}
                    >
                        <span className="font-extrabold text-[14px] leading-[20px] text-[#E8FF57]">
                            14 Days
                        </span>
                        <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8] mt-0.5">
                            Duration
                        </span>
                    </button>

                    {/* 21 Days Option */}
                    <button
                        type="button"
                        onClick={() => setSelectedDuration("21 Days")}
                        className={`h-[63px] rounded-[14px] flex flex-col items-center justify-center cursor-pointer transition-all ${
                            selectedDuration === "21 Days"
                                ? "bg-[rgba(34,211,238,0.18)] border-2 border-[#22D3EE] shadow-[0px_0px_16px_rgba(34,211,238,0.3)]"
                                : "bg-[rgba(34,211,238,0.047)] border border-[rgba(34,211,238,0.133)] hover:bg-[rgba(34,211,238,0.1)]"
                        }`}
                    >
                        <span className="font-extrabold text-[14px] leading-[20px] text-[#22D3EE]">
                            21 Days
                        </span>
                        <span className="font-semibold text-[10px] leading-[15px] text-[#8B7EC8] mt-0.5">
                            Duration
                        </span>
                    </button>
                </div>

                {/* Boost Now Button */}
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="w-full h-[52px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] flex items-center justify-center font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-1"
                >
                    Boost Now
                </button>
            </div>
        </div>
    );
}

export default BoostEventModal;
