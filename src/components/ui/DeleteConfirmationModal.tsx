"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    isPending?: boolean;
    confirmText?: string;
    className?: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item",
    description = "Are you sure you want to delete this? This action cannot be undone.",
    itemName,
    isPending = false,
    confirmText = "Delete",
    className,
}: DeleteConfirmationModalProps) {
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 font-['Manrope',sans-serif]"
            onClick={() => {
                if (!isPending) onClose();
            }}
        >
            {/* Modal Card */}
            <div
                className={cn(
                    "relative w-full max-w-[480px] p-6 sm:p-8",
                    "bg-[#090530] border border-[rgba(239,68,68,0.3)]",
                    "shadow-[0px_8px_32px_rgba(0,0,0,0.6),0px_0px_24px_rgba(239,68,68,0.2)] rounded-[20px]",
                    "flex flex-col items-center justify-center text-center",
                    "animate-in zoom-in-95 duration-200",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button (top-right X icon) */}
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

                {/* Trash Warning Icon */}
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-5 shadow-[0px_0px_20px_rgba(239,68,68,0.25)]">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                {/* Title */}
                <h3 className="text-[22px] sm:text-[24px] font-extrabold text-white tracking-tight mb-2">
                    {title}
                </h3>

                {/* Item Name Highlight */}
                {itemName && (
                    <div className="inline-block max-w-full px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-purple-300 truncate mb-3">
                        {itemName}
                    </div>
                )}

                {/* Description */}
                <p className="text-[14px] leading-[20px] text-white/70 max-w-[380px] mb-7">
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

                    {/* Confirm Delete Button */}
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 h-[46px] rounded-[14px] bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0px_0px_20px_rgba(239,68,68,0.4)] text-white font-extrabold text-[14px] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isPending ? (
                            <span>Deleting...</span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>{confirmText}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;
