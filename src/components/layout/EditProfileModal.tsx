"use client";

import React, { useState } from "react";

export interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFullName: string;
    currentEmail: string;
    onSave: (newFullName: string) => void;
}

export function EditProfileModal({
    isOpen,
    onClose,
    currentFullName,
    currentEmail,
    onSave,
}: EditProfileModalProps) {
    const [tempFullName, setTempFullName] = useState(currentFullName);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(tempFullName);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-[563px] max-w-[95vw] bg-[#05033A] border border-[rgba(124,58,237,0.25)] shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_0px_32px_rgba(124,58,237,0.25)] rounded-[16px] p-[26px_30px] z-10 text-white select-none">
                {/* Close Button (X) */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-[20px] right-[20px] w-[40px] h-[40px] rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer border border-white/10"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-[20px] leading-[27px] font-bold capitalize text-white mb-6">
                    Edit Profile
                </h2>

                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    {/* EMAIL Field */}
                    <div className="w-full flex flex-col gap-1.5 mb-3">
                        <label className="text-[10px] leading-[15px] font-bold text-[#8B7EC8] uppercase tracking-[1px]">
                            EMAIL
                        </label>
                        <div className="w-full h-[44px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] rounded-[12px] px-3.5 flex items-center text-[13px] leading-[18px] text-[rgba(240,238,255,0.7)] cursor-not-allowed select-none">
                            {currentEmail}
                        </div>
                    </div>

                    {/* Security Warning Message */}
                    <div className="flex items-center gap-2 mb-4">
                        <svg
                            className="w-[19px] h-[19px] text-[#D14249] shrink-0"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <span className="text-[12px] leading-[16px] font-normal text-white">
                            For security reasons, your email address cannot be changed.
                        </span>
                    </div>

                    {/* Horizontal Separator Line */}
                    <div className="w-full h-0 border-t border-[rgba(255,255,255,0.11)] mb-5" />

                    {/* FULL NAME Field */}
                    <div className="w-full flex flex-col gap-1.5 mb-6">
                        <label className="text-[10px] leading-[15px] font-bold text-[#8B7EC8] uppercase tracking-[1px]">
                            FULL NAME
                        </label>
                        <input
                            type="text"
                            value={tempFullName}
                            onChange={(e) => setTempFullName(e.target.value)}
                            placeholder="e.g. James Dorsey"
                            className="w-full h-[44px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] rounded-[12px] px-3.5 text-[13px] leading-[18px] text-white placeholder-[rgba(240,238,255,0.5)] focus:outline-none focus:border-[#9F4FFA] transition-colors"
                            required
                        />
                    </div>

                    {/* Save Changes Button */}
                    <button
                        type="submit"
                        className="w-full h-[52px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] rounded-[14px] flex items-center justify-center text-white font-extrabold text-[14px] leading-[20px] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
