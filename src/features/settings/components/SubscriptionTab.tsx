"use client";

import React, { useState } from "react";

export function SubscriptionTab() {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    const handleConfirmCancel = () => {
        setIsCancelled(true);
        setIsCancelModalOpen(false);
    };

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif] relative">
            {/* Top Page Header */}
            <div className="flex items-center gap-3">
                {/* Icon Container */}
                <div className="w-[28px] h-[28px] rounded-[20px] bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center shrink-0">
                    <svg className="w-[13px] h-[13px]" viewBox="0 0 14 14" fill="none">
                        <rect
                            x="1.5"
                            y="3"
                            width="11"
                            height="8"
                            rx="1.5"
                            stroke="#A855F7"
                            strokeWidth="1.08333"
                        />
                        <path
                            d="M1.5 5.5H12.5"
                            stroke="#A855F7"
                            strokeWidth="1.08333"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="font-extrabold text-[18px] leading-[28px] text-white">
                        Subscription
                    </h2>
                    <p className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                        Manage your plan and unlock powerful tools for your venue.
                    </p>
                </div>
            </div>

            {/* Main Active Plan Card (Growth Plan) */}
            <div
                className="w-full max-w-[892px] rounded-[22px] p-6 sm:p-7 relative overflow-hidden backdrop-blur-md"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(124, 58, 237, 0.45) 0%, rgba(79, 20, 150, 0.3) 60%, rgba(14, 9, 60, 0.4) 100%)",
                    border: "0.8px solid rgba(124, 58, 237, 0.4)",
                    boxShadow: "0px 0px 60px rgba(124, 58, 237, 0.12)",
                }}
            >
                {/* Radial Glow Aura */}
                <div
                    className="absolute w-[224px] h-[224px] right-[-40px] top-[-40px] pointer-events-none opacity-15 rounded-full"
                    style={{
                        background:
                            "radial-gradient(70.71% 70.71% at 50% 50%, #E8FF57 0%, rgba(0, 0, 0, 0) 70%)",
                    }}
                />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    {/* Left Content */}
                    <div className="flex flex-col items-start gap-2 max-w-[485px]">
                        {/* Tags Header */}
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#E8FF57]">
                                CURRENT PLAN
                            </span>
                            <span
                                className={`px-2 py-[2px] rounded-full border text-[10px] font-bold leading-[15px] flex items-center gap-1 ${
                                    isCancelled
                                        ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                                        : "bg-[rgba(74,222,128,0.15)] border-[rgba(74,222,128,0.3)] text-[#4ADE80]"
                                }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        isCancelled ? "bg-rose-400" : "bg-[#4ADE80] animate-pulse"
                                    }`}
                                />
                                {isCancelled ? "Expiring" : "Active"}
                            </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="font-extrabold text-[30px] leading-[36px] text-white">
                            Growth Plan
                        </h3>
                        <p className="font-normal text-[14px] leading-[20px] text-[#C4B5FD]">
                            $49 / month · Renews July 28, 2025 · Monthly billing
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap gap-2.5 mt-2">
                            <div className="flex items-center gap-1.5 px-[10px] py-[4px] rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#C4B5FD] font-semibold text-[11px] leading-[16px]">
                                <svg className="w-[9px] h-[9px] text-[#4ADE80]" viewBox="0 0 9 9" fill="none" stroke="currentColor">
                                    <path d="M1.5 4.5L3.5 6.5L7.5 2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Unlimited Events
                            </div>
                            <div className="flex items-center gap-1.5 px-[10px] py-[4px] rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#C4B5FD] font-semibold text-[11px] leading-[16px]">
                                <svg className="w-[9px] h-[9px] text-[#4ADE80]" viewBox="0 0 9 9" fill="none" stroke="currentColor">
                                    <path d="M1.5 4.5L3.5 6.5L7.5 2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Featured Placement
                            </div>
                            <div className="flex items-center gap-1.5 px-[10px] py-[4px] rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#C4B5FD] font-semibold text-[11px] leading-[16px]">
                                <svg className="w-[9px] h-[9px] text-[#4ADE80]" viewBox="0 0 9 9" fill="none" stroke="currentColor">
                                    <path d="M1.5 4.5L3.5 6.5L7.5 2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Audience Insights
                            </div>
                            <div className="flex items-center gap-1.5 px-[10px] py-[4px] rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#C4B5FD] font-semibold text-[11px] leading-[16px]">
                                <svg className="w-[9px] h-[9px] text-[#4ADE80]" viewBox="0 0 9 9" fill="none" stroke="currentColor">
                                    <path d="M1.5 4.5L3.5 6.5L7.5 2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Enhanced Analytics
                            </div>
                        </div>
                    </div>

                    {/* Right Price & Cancel Action */}
                    <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                        <div className="flex items-baseline gap-1 lg:text-right">
                            <span className="font-extrabold text-[36px] leading-[40px] text-white">
                                $49
                            </span>
                            <span className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                                /month
                            </span>
                        </div>

                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={() => setIsCancelModalOpen(true)}
                            className="px-[20px] py-[10px] rounded-[13px] font-bold text-[14px] leading-[20px] text-white transition-all cursor-pointer hover:opacity-90 active:scale-98"
                            style={{
                                background: "linear-gradient(135deg, #FF2323 0%, #B91616 100%)",
                                boxShadow: "0px 0px 20px rgba(198, 24, 24, 0.4)",
                            }}
                        >
                            Cancel Subscription
                        </button>

                        <p className="font-normal text-[13px] leading-[18px] text-white/90 lg:text-right">
                            Your subscription will expire on 30 September
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Cards Grid (Starter Free & Premium $99) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[892px] mt-2">
                {/* 1. Starter (Free) Pricing Card */}
                <div
                    className="box-border flex flex-col justify-between p-[24px] rounded-[24px] w-full backdrop-blur-md relative"
                    style={{
                        background: "rgba(20, 14, 80, 0.6)",
                        border: "0.8px solid rgba(124, 58, 237, 0.22)",
                        boxShadow:
                            "0px 8px 32px rgba(0, 0, 0, 0.3), inset 0px 1px 0px rgba(255, 255, 255, 0.04)",
                        minHeight: "538px",
                    }}
                >
                    <div className="flex flex-col gap-5">
                        {/* Card Header Tag & Icon */}
                        <div className="flex items-center justify-between">
                            <span className="px-[12px] py-[4px] rounded-full bg-[rgba(157,143,208,0.12)] border border-[rgba(157,143,208,0.25)] text-[#9D8FD0] font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase">
                                STARTER
                            </span>

                            <div className="w-[36px] h-[36px] rounded-[24px] bg-[rgba(157,143,208,0.12)] flex items-center justify-center text-[#9D8FD0]">
                                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4M9 11h4" />
                                </svg>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h3 className="font-extrabold text-[20px] leading-[28px] text-white">
                                Free
                            </h3>
                            <p className="font-normal text-[12px] leading-[20px] text-[#9D8FD0] mt-1">
                                Perfect for getting started on BarHuddle.
                            </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 pt-2">
                            <span className="font-extrabold text-[36px] leading-[36px] text-[#9D8FD0]">
                                Free
                            </span>
                            <span className="font-semibold text-[14px] leading-[20px] text-[#9D8FD0]">
                                forever
                            </span>
                        </div>

                        {/* Gradient Divider */}
                        <div
                            className="w-full h-[1px] my-1"
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(124, 58, 237, 0.4) 50%, rgba(0, 0, 0, 0) 100%)",
                            }}
                        />

                        {/* Features List */}
                        <div className="flex flex-col gap-3">
                            {[
                                "Claim your venue",
                                "Basic venue profile",
                                "Display operating hours",
                                "Upload venue photos",
                                "Receive venue reviews",
                                "Basic analytics",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2.5">
                                    <div className="w-[16px] h-[16px] rounded-full bg-[rgba(157,143,208,0.12)] flex items-center justify-center shrink-0">
                                        <svg className="w-[9px] h-[9px] text-[#9D8FD0]" viewBox="0 0 9 9" fill="none" stroke="currentColor">
                                            <path d="M1.5 4.5L3.5 6.5L7.5 2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-[12px] leading-[16px] text-[#C4B5FD]">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Buy Now Button */}
                    <button
                        type="button"
                        className="w-full h-[48px] rounded-[16px] font-extrabold text-[14px] leading-[20px] text-center text-white transition-all cursor-pointer hover:opacity-95 active:scale-98 mt-6"
                        style={{
                            background: "linear-gradient(135deg, #7C3AED 0%, #9F4FFA 100%)",
                            boxShadow:
                                "0px 0px 28px rgba(124, 58, 237, 0.4), 0px 0px 60px rgba(124, 58, 237, 0.08)",
                        }}
                    >
                        Buy Now
                    </button>
                </div>

                {/* 2. Premium ($99) Pricing Card */}
                <div
                    className="box-border flex flex-col justify-between p-[24px] rounded-[24px] w-full backdrop-blur-md relative"
                    style={{
                        background: "rgba(20, 14, 80, 0.6)",
                        border: "0.8px solid rgba(124, 58, 237, 0.22)",
                        boxShadow:
                            "0px 8px 32px rgba(0, 0, 0, 0.3), inset 0px 1px 0px rgba(255, 255, 255, 0.04)",
                        minHeight: "538px",
                    }}
                >
                    <div className="flex flex-col gap-5">
                        {/* Card Header Tag & Icon */}
                        <div className="flex items-center justify-between">
                            <span className="px-[12px] py-[4px] rounded-full bg-[rgba(232,255,87,0.12)] border border-[rgba(232,255,87,0.3)] text-[#E8FF57] font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase">
                                BEST VALUE
                            </span>

                            <div className="w-[36px] h-[36px] rounded-[24px] bg-[rgba(232,255,87,0.12)] flex items-center justify-center text-[#E8FF57]">
                                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h3 className="font-extrabold text-[20px] leading-[28px] text-white">
                                Premium
                            </h3>
                            <p className="font-normal text-[12px] leading-[20px] text-[#9D8FD0] mt-1">
                                Advanced tools for high-performing venues.
                            </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 pt-1">
                            <span className="font-extrabold text-[44px] leading-[44px] text-[#E8FF57]">
                                $99
                            </span>
                            <span className="font-semibold text-[12px] leading-[16px] text-[#9D8FD0]">
                                /month
                            </span>
                        </div>

                        {/* Gradient Divider */}
                        <div
                            className="w-full h-[1px] my-1"
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(124, 58, 237, 0.4) 50%, rgba(0, 0, 0, 0) 100%)",
                            }}
                        />

                        {/* Features List */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-[16px] h-[16px] rounded-full bg-[rgba(232,255,87,0.12)] flex items-center justify-center shrink-0">
                                    <svg className="w-[9px] h-[9px] text-[#E8FF57]" viewBox="0 0 9 9" fill="none" stroke="currentColor">
                                        <path d="M1.5 4.5L3.5 6.5L7.5 2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-[12px] leading-[16px] text-[#E8FF57]">
                                    Everything in Growth
                                </span>
                            </div>

                            {[
                                "Priority venue placement",
                                "Advanced analytics dashboard",
                                "VIP support",
                                "Premium branding options",
                                "Marketing campaign tools",
                                "Early access to new features",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2.5">
                                    <div className="w-[16px] h-[16px] rounded-full bg-[rgba(232,255,87,0.12)] flex items-center justify-center shrink-0">
                                        <svg className="w-[9px] h-[9px] text-[#E8FF57]" viewBox="0 0 9 9" fill="none" stroke="currentColor">
                                            <path d="M1.5 4.5L3.5 6.5L7.5 2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-[12px] leading-[16px] text-[#C4B5FD]">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Buy Now Button */}
                    <button
                        type="button"
                        className="w-full h-[48px] rounded-[16px] font-extrabold text-[14px] leading-[20px] text-center text-white transition-all cursor-pointer hover:opacity-95 active:scale-98 mt-6"
                        style={{
                            background: "linear-gradient(135deg, #7C3AED 0%, #9F4FFA 100%)",
                            boxShadow:
                                "0px 0px 28px rgba(124, 58, 237, 0.4), 0px 0px 60px rgba(124, 58, 237, 0.08)",
                        }}
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            {/* Cancel Subscription Confirmation Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
                    {/* Modal Card Container */}
                    <div
                        className="relative w-[515px] max-w-[92vw] h-[337px] rounded-[16px] p-6 flex flex-col justify-between items-center border border-[rgba(124,58,237,0.4)] shadow-2xl overflow-hidden"
                        style={{
                            background: "rgba(22, 10, 50, 0.95)",
                            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {/* Soft Purple Overlay Tint */}
                        <div className="absolute inset-0 bg-[rgba(132,36,187,0.18)] pointer-events-none" />

                        {/* Top Group Header (Icon + Text) */}
                        <div className="relative z-10 flex flex-col items-center gap-4 mt-2">
                            {/* Iconly/Bold/Danger Icon (80px x 80px) */}
                            <div className="w-[80px] h-[80px] flex items-center justify-center shrink-0">
                                <div className="w-[80px] h-[80px] rounded-full bg-[#F01A1A]/15 border border-[#F01A1A]/30 flex items-center justify-center shadow-[0_0_24px_rgba(240,26,26,0.4)]">
                                    <svg className="w-[42px] h-[42px] text-[#F01A1A]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Frame 1171275861 (Title & Subtitle) */}
                            <div className="flex flex-col items-center gap-2 text-center w-[428px] max-w-full">
                                <h3 className="font-semibold text-[32px] leading-[44px] tracking-[-0.008em] capitalize text-white">
                                    Cancel Subscription
                                </h3>
                                <p className="font-normal text-[18px] leading-[25px] text-white/80">
                                    Are you sure ypu want to cancel subscription?
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons Row (Frame 2147227785) */}
                        <div className="relative z-10 flex flex-row justify-between items-center w-full max-w-[468px] h-[50px] gap-[12px] mb-1">
                            {/* Frame 2147227778 (No Button) */}
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(false)}
                                className="flex-1 h-[50px] rounded-[24px] bg-[rgba(124,58,237,0.31)] hover:bg-[rgba(124,58,237,0.45)] text-white font-semibold text-[16px] leading-[22px] text-center cursor-pointer transition-all active:scale-98 flex items-center justify-center"
                            >
                                No
                            </button>

                            {/* Frame 2147227779 (Yes Button) */}
                            <button
                                type="button"
                                onClick={handleConfirmCancel}
                                className="flex-1 h-[50px] rounded-[24px] text-white font-semibold text-[16px] leading-[22px] text-center cursor-pointer transition-all hover:opacity-95 active:scale-98 flex items-center justify-center"
                                style={{
                                    background: "linear-gradient(135deg, #7C3AED 0%, #9F4FFA 100%)",
                                    boxShadow:
                                        "0px 0px 24px rgba(124, 58, 237, 0.5), 0px 0px 48px rgba(232, 255, 87, 0.1)",
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubscriptionTab;
