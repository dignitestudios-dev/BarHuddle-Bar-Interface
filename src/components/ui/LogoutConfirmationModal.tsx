"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    isPending?: boolean;
    confirmText?: string;
    className?: string;
}

export function LogoutConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Log Out?",
    description = "Are you sure you want to log out of your Bar Huddle account?",
    isPending = false,
    confirmText = "Log Out",
    className,
}: LogoutConfirmationModalProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Lock scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle Escape key press
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isPending) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isPending, onClose]);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 font-['Manrope',sans-serif]"
            onClick={() => {
                if (!isPending) onClose();
            }}
        >
            {/* Modal Card */}
            <div
                className={cn(
                    "relative w-full max-w-[440px] p-6 sm:p-8",
                    "bg-[#090530] border border-[rgba(124,58,237,0.3)]",
                    "shadow-[0px_8px_32px_rgba(0,0,0,0.6),0px_0px_32px_rgba(124,58,237,0.2)] rounded-[24px]",
                    "flex flex-col items-center justify-center text-center",
                    "animate-in zoom-in-95 duration-200",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Logout Icon */}
                <div className="w-16 h-16 rounded-full bg-[rgba(244,63,94,0.12)] border border-[rgba(244,63,94,0.3)] flex items-center justify-center text-[#F43F5E] mb-5 shadow-[0px_0px_24px_rgba(244,63,94,0.25)]">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>

                {/* Title */}
                <h3 className="text-[22px] sm:text-[24px] font-extrabold text-white tracking-tight mb-2">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-[14px] leading-[22px] text-white/70 max-w-[340px] mb-7">
                    {description}
                </p>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-3 w-full">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 h-[46px] rounded-[14px] bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 font-bold text-[14px] transition-all cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    {/* Confirm Logout Button */}
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 h-[46px] rounded-[14px] bg-gradient-to-r from-[#DC2626] to-[#E11D48] hover:from-[#EF4444] hover:to-[#F43F5E] shadow-[0px_0px_20px_rgba(225,29,72,0.4)] text-white font-extrabold text-[14px] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isPending ? (
                            <span>Logging out...</span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>{confirmText}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}

export default LogoutConfirmationModal;
