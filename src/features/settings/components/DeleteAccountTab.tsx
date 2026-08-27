"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type DeleteStep = "SELECT_REASON" | "ENTER_OTP";

const REASON_OPTIONS = [
    "I no longer manage or own this venue.",
    "The platform is too complicated or hard to use.",
    "Subscription or feature prices are too high.",
    "Found a better alternative platform.",
    "Not seeing enough customer check-ins or value.",
    "Technical issues or bug concerns.",
    "Privacy or security concerns.",
    "Other (please specify)",
];

export function DeleteAccountTab() {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const [step, setStep] = useState<DeleteStep>("SELECT_REASON");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string>(REASON_OPTIONS[0]);
    const [otherText, setOtherText] = useState<string>("");
    const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState<number>(14);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer logic for OTP resend
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === "ENTER_OTP" && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.charAt(value.length - 1);
        }
        const updated = [...otpValues];
        updated[index] = value;
        setOtpValues(updated);

        // Auto focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        setTimer(14);
        setIsResendDisabled(true);
        setOtpValues(["", "", "", "", "", ""]);
        toast.info("A new 6-digit verification code has been sent to your email.");
    };

    const handleTriggerFinalDelete = () => {
        const enteredOtp = otpValues.join("");
        if (enteredOtp.length < 6) {
            toast.error("Please enter the complete 6-digit verification code.");
            return;
        }
        // Open the Shadcn confirmation dialog as the final security gate
        setIsConfirmModalOpen(true);
    };

    const handleConfirmFinalDeletion = async () => {
        setIsDeleting(true);
        try {
            setIsConfirmModalOpen(false);
            toast.success("Your account has been deleted successfully.");
            router.push("/auth/login");
        } catch (error) {
            console.error("Delete account error:", error);
            toast.error("Failed to delete account. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif] relative animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-[32px] h-[32px] rounded-full bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center text-red-400 shrink-0">
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <div>
                    <h2 className="font-extrabold text-[18px] leading-[28px] text-white">
                        Delete Account
                    </h2>
                    <p className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                        Permanently remove your account and all associated venue data.
                    </p>
                </div>
            </div>

            {/* STEP 1: SELECT REASON SCREEN */}
            {step === "SELECT_REASON" && (
                <div
                    className="w-full max-w-[892px] rounded-[24px] p-6 sm:p-8 flex flex-col justify-between backdrop-blur-md min-h-[480px] animate-in fade-in duration-200"
                    style={{
                        background: "rgba(12, 5, 26, 0.75)",
                        border: "0.8px solid rgba(124, 58, 237, 0.3)",
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                    }}
                >
                    <div className="flex flex-col gap-6">
                        {/* Warning Callout */}
                        <div className="p-4 rounded-[16px] bg-red-500/10 border border-red-500/25 flex items-center gap-3 text-red-400">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-[13px] leading-[18px] text-white/90">
                                Deleting your account will permanently remove all your claimed venues, active events, promotions, and subscriber data.
                            </span>
                        </div>

                        <p className="font-semibold text-[15px] leading-[22px] text-white">
                            We are sorry to see you go! Please let us know the reason for deleting your account:
                        </p>

                        <div className="flex flex-col gap-3.5">
                            {REASON_OPTIONS.map((reason, idx) => {
                                const isSelected = selectedReason === reason;
                                return (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <label
                                            onClick={() => setSelectedReason(reason)}
                                            className="flex items-center gap-3 cursor-pointer select-none group"
                                        >
                                            <div
                                                className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all shrink-0 ${
                                                    isSelected
                                                        ? "border-[#7C3AED] bg-[#7C3AED]/20 shadow-[0_0_8px_#7C3AED]"
                                                        : "border-[#8B7EC8]/40 group-hover:border-[#7C3AED]"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <div className="w-[8px] h-[8px] rounded-full bg-white" />
                                                )}
                                            </div>
                                            <span
                                                className={`font-normal text-[14px] leading-[20px] transition-colors ${
                                                    isSelected ? "text-white font-medium" : "text-[#9D8FD0] group-hover:text-white"
                                                }`}
                                            >
                                                {reason}
                                            </span>
                                        </label>

                                        {/* Optional textarea if "Other" is selected */}
                                        {reason === "Other (please specify)" && isSelected && (
                                            <textarea
                                                rows={3}
                                                value={otherText}
                                                onChange={(e) => setOtherText(e.target.value)}
                                                placeholder="Please tell us more..."
                                                className="w-full max-w-[500px] mt-1 ml-[30px] p-3 rounded-xl bg-[#070210] border border-[#7C3AED]/40 text-white text-xs placeholder-[#8B7EC8]/50 focus:outline-none focus:border-[#AD46FF]"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-end mt-8 pt-4 border-t border-[rgba(124,58,237,0.2)]">
                        <button
                            type="button"
                            onClick={() => setStep("ENTER_OTP")}
                            className="px-8 h-[48px] rounded-full font-extrabold text-[14px] text-white transition-all cursor-pointer hover:scale-105 active:scale-95 bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5)]"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: OTP VERIFICATION SCREEN */}
            {step === "ENTER_OTP" && (
                <div
                    className="w-full max-w-[892px] rounded-[24px] p-8 sm:p-12 flex flex-col items-center justify-center backdrop-blur-md min-h-[480px] text-center animate-in fade-in duration-200"
                    style={{
                        background: "rgba(12, 5, 26, 0.75)",
                        border: "0.8px solid rgba(124, 58, 237, 0.3)",
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                    }}
                >
                    <div className="flex flex-col items-center gap-8 w-full max-w-md">
                        {/* Subtitle */}
                        <div className="flex flex-col gap-2">
                            <h3 className="font-extrabold text-[22px] leading-[30px] text-white">
                                Verification Code
                            </h3>
                            <p className="font-normal text-[14px] leading-[22px] text-white/80">
                                To permanently delete your account, enter the 6-digit verification code sent to{" "}
                                <strong className="text-white font-semibold">{user?.email || "your email address"}</strong>
                            </p>
                        </div>

                        {/* 6 Input Digit Boxes */}
                        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                            {otpValues.map((val, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => {
                                        otpInputRefs.current[idx] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={val}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    className="w-[48px] h-[56px] sm:w-[56px] sm:h-[64px] rounded-[16px] text-center font-extrabold text-[20px] text-white focus:outline-none transition-all"
                                    style={{
                                        background: "rgba(124, 58, 237, 0.12)",
                                        border: val ? "1.5px solid #AD46FF" : "0.8px solid rgba(124, 58, 237, 0.3)",
                                        boxShadow: val ? "0px 0px 12px rgba(173, 70, 255, 0.4)" : "none",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Resend Timer Text */}
                        <div className="text-[13px] leading-[18px] text-[#9D8FD0]">
                            Didn't receive code?{" "}
                            {isResendDisabled ? (
                                <span className="font-semibold text-[#E8FF57]">
                                    Resend in 0:{timer < 10 ? `0${timer}` : timer}
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="font-semibold text-[#E8FF57] underline cursor-pointer hover:opacity-80"
                                >
                                    Resend Code
                                </button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 w-full">
                            <button
                                type="button"
                                onClick={() => setStep("SELECT_REASON")}
                                className="flex-1 h-[48px] rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-[14px] transition-all cursor-pointer"
                            >
                                Back
                            </button>

                            <button
                                type="button"
                                onClick={handleTriggerFinalDelete}
                                className="flex-1 h-[48px] rounded-full font-extrabold text-[15px] text-white transition-all cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0px_0px_28px_rgba(239,68,68,0.5)] hover:scale-105 active:scale-98"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SHADCN DIALOG CONFIRMATION MODAL */}
            <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                <DialogContent className="max-w-[480px] p-7 bg-[#090530] border border-[rgba(239,68,68,0.3)] shadow-[0px_8px_32px_rgba(0,0,0,0.7),0px_0px_24px_rgba(239,68,68,0.25)] rounded-[24px] font-['Manrope',sans-serif]">
                    <DialogHeader className="flex flex-col items-center text-center gap-3">
                        {/* Red Danger Warning Icon */}
                        <div className="w-[72px] h-[72px] rounded-full bg-[#F01A1A]/15 border border-[#F01A1A]/35 flex items-center justify-center shadow-[0_0_24px_rgba(240,26,26,0.35)] mb-1">
                            <svg className="w-[38px] h-[38px] text-[#F01A1A]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>

                        <DialogTitle className="text-[24px] font-extrabold text-white tracking-tight">
                            Permanent Account Deletion
                        </DialogTitle>

                        <DialogDescription className="text-[14px] leading-[22px] text-white/80 max-w-[380px]">
                            Are you absolutely sure? This will permanently delete your account, remove all your venue claims, cancel upcoming events, and terminate all active subscriptions. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-row items-center gap-3 mt-4 w-full">
                        <button
                            type="button"
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="flex-1 h-[48px] rounded-full bg-[rgba(124,58,237,0.25)] hover:bg-[rgba(124,58,237,0.4)] border border-[rgba(124,58,237,0.4)] text-white font-bold text-[15px] cursor-pointer transition-all active:scale-95"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={handleConfirmFinalDeletion}
                            className="flex-1 h-[48px] rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0px_0px_24px_rgba(239,68,68,0.5)] text-white font-extrabold text-[15px] cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DeleteAccountTab;
