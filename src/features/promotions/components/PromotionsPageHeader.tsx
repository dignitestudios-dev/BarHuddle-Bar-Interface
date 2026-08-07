"use client";

import React from "react";

export interface PromotionsPageHeaderProps {
    onCreatePromotion?: () => void;
    className?: string;
}

export function PromotionsPageHeader({
    onCreatePromotion,
    className = "",
}: PromotionsPageHeaderProps) {
    return (
        <div className={`w-full max-w-[1200px] flex items-center justify-between min-h-[45px] font-['Manrope',sans-serif] ${className}`}>
            {/* Promotions Gradient Heading */}
            <h1 className="font-extrabold text-[36px] leading-[45px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent tracking-tight">
                Promotions
            </h1>

            {/* Create Promotion Button */}
            <button
                type="button"
                onClick={onCreatePromotion}
                className="w-[190px] h-[40px] px-5 py-[10px] rounded-[14px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_22px_rgba(124,58,237,0.45)] flex items-center justify-center gap-2 font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
            >
                {/* Plus Icon */}
                <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Create Promotion</span>
            </button>
        </div>
    );
}

export default PromotionsPageHeader;
