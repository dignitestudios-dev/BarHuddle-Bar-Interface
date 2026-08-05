"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    iconBgColor?: string;
    actionButton?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

export function SuccessModal({
    isOpen,
    onClose,
    title = "Email Verified",
    description = "Your email has been verified successfully",
    icon,
    iconBgColor = "#009706",
    actionButton,
    className,
    children,
}: SuccessModalProps) {
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
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Card */}
            <div
                className={cn(
                    "relative w-full max-w-[515px] min-h-[308px] p-8 sm:p-10",
                    "bg-[#1D082A]/90 sm:bg-[rgba(132,36,187,0.25)] backdrop-blur-xl border border-[rgba(132,36,187,0.4)]",
                    "shadow-[0px_4px_25px_rgba(0,0,0,0.5)] rounded-[16px]",
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
                    className="absolute right-5 top-5 w-10 h-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                    aria-label="Close"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Inner Layout Frame */}
                <div className="flex flex-col items-center justify-center gap-8 w-full max-w-[428px]">
                    {/* Icon Container */}
                    <div
                        className="w-[80px] h-[80px] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#009706]/20 transition-transform hover:scale-105"
                        style={{ backgroundColor: iconBgColor }}
                    >
                        {icon ? (
                            icon
                        ) : (
                            /* Charm tick / check mark icon */
                            <svg
                                className="w-10 h-10 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </div>

                    {/* Text Section */}
                    <div className="flex flex-col items-center gap-4 w-full">
                        {title && (
                            <h2 className="font-['Manrope',sans-serif] font-semibold text-[28px] sm:text-[32px] leading-[38px] sm:leading-[44px] text-white tracking-[-0.008em] capitalize">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="font-['Manrope',sans-serif] font-normal text-[16px] sm:text-[18px] leading-[22px] sm:leading-[25px] text-white/80 max-w-[439px]">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Optional Custom Action Button or Children */}
                    {actionButton && <div className="w-full mt-2">{actionButton}</div>}
                    {children}
                </div>
            </div>
        </div>
    );
}

export default SuccessModal;
