"use client";

import React from "react";

export interface ClaimPendingDialogProps {
    isOpen: boolean;
    venueName?: string;
    onOk: () => void;
}

export function ClaimPendingDialog({ isOpen, venueName = "Your bar", onOk }: ClaimPendingDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Modal Container */}
            <div className="relative w-full max-w-[480px] bg-[#05033A] border border-[rgba(124,58,237,0.35)] shadow-[0px_8px_32px_rgba(0,0,0,0.6)] rounded-[24px] p-6 sm:p-8 flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-200">
                {/* Ambient Glow */}
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_60%)] pointer-events-none" />

                {/* Animated Clock / Review Badge */}
                <div className="relative w-20 h-20 flex items-center justify-center my-1 z-10">
                    <div className="absolute inset-0 bg-[#E8FF57] rounded-full blur-[24px] opacity-25 animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-[rgba(232,255,87,0.12)] border border-[rgba(232,255,87,0.4)] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(232,255,87,0.2)]">
                        <svg className="w-8 h-8 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-2 z-10">
                    <h3 className="font-extrabold text-[22px] sm:text-[24px] leading-[30px] text-white tracking-tight">
                        Pending Admin Approval
                    </h3>
                    <p className="text-[14px] leading-[22px] text-[#9D8FD0] max-w-[380px]">
                        <span className="text-white font-bold">{venueName}</span> is now <span className="text-[#E8FF57] font-semibold">pending</span> and has been sent for admin approval.
                    </p>
                </div>

                {/* Status Details Card */}
                <div className="w-full p-4 rounded-[20px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.3)] flex flex-col gap-3 text-left z-10">
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#C4B5FD]">Bar / Venue</span>
                        <span className="text-[13px] font-bold text-white truncate max-w-[220px]">
                            {venueName}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#C4B5FD]">Claim Status</span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8FF57]/15 border border-[#E8FF57]/30 text-[#E8FF57] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF57] animate-pulse" />
                            Pending Approval
                        </span>
                    </div>
                    <div className="h-[1px] w-full bg-[rgba(124,58,237,0.2)]" />
                    <div className="flex flex-col gap-1.5 text-[12px] leading-[18px] text-[#9D8FD0]">
                        <div className="flex items-start gap-2">
                            <span className="text-[#E8FF57]">•</span>
                            <span>Your ownership documents have been submitted to the admin team for review.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-[#E8FF57]">•</span>
                            <span>You will be notified once the verification is completed.</span>
                        </div>
                    </div>
                </div>

                {/* OK Button */}
                <button
                    type="button"
                    onClick={onOk}
                    className="w-full h-[50px] rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5)] font-bold text-[15px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer z-10"
                >
                    OK
                </button>
            </div>
        </div>
    );
}

export default ClaimPendingDialog;
