"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type DeleteStep = "CONFIRM_MODAL" | "SELECT_REASON" | "ENTER_OTP" | "DELETED_SUCCESS";

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
    const [step, setStep] = useState<DeleteStep>("CONFIRM_MODAL");
    const [selectedReason, setSelectedReason] = useState<string>(REASON_OPTIONS[0]);
    const [otherText, setOtherText] = useState<string>("");
    const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState<number>(14);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
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
    };

    const handleDeleteNow = () => {
        // Navigate to login after entering OTP and clicking Delete Now
        router.push("/auth/login");
    };

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif] relative">
            {/* Header (Visible on Reason, OTP & Success steps) */}
            {step !== "CONFIRM_MODAL" && (
                <div className="flex items-center gap-3">
                    <div className="w-[28px] h-[28px] rounded-[20px] bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#AD46FF] shrink-0">
                        <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-[18px] leading-[28px] text-white">
                            Delete Account
                        </h2>
                        <p className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                            Permanently remove your account and all associated data.
                        </p>
                    </div>
                </div>
            )}

            {/* STEP 1: CONFIRMATION MODAL */}
            {step === "CONFIRM_MODAL" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
                    <div
                        className="relative w-[515px] max-w-[92vw] h-[337px] rounded-[16px] p-6 flex flex-col justify-between items-center border border-[rgba(124,58,237,0.4)] shadow-2xl overflow-hidden"
                        style={{
                            background: "rgba(22, 10, 50, 0.95)",
                            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        <div className="absolute inset-0 bg-[rgba(132,36,187,0.18)] pointer-events-none" />

                        {/* Top Danger Icon + Text */}
                        <div className="relative z-10 flex flex-col items-center gap-4 mt-2">
                            {/* Iconly Danger Icon */}
                            <div className="w-[80px] h-[80px] flex items-center justify-center shrink-0">
                                <div className="w-[80px] h-[80px] rounded-full bg-[#F01A1A]/15 border border-[#F01A1A]/30 flex items-center justify-center shadow-[0_0_24px_rgba(240,26,26,0.4)]">
                                    <svg className="w-[42px] h-[42px] text-[#F01A1A]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Title & Message */}
                            <div className="flex flex-col items-center gap-2 text-center w-[428px] max-w-full">
                                <h3 className="font-semibold text-[32px] leading-[44px] tracking-[-0.008em] capitalize text-white">
                                    Delete Account
                                </h3>
                                <p className="font-normal text-[18px] leading-[25px] text-white/80">
                                    Are you sure ypu want to delete your account?
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="relative z-10 flex flex-row justify-between items-center w-full max-w-[468px] h-[50px] gap-[12px] mb-1">
                            <button
                                type="button"
                                onClick={() => setStep("CONFIRM_MODAL")}
                                className="flex-1 h-[50px] rounded-[24px] bg-[rgba(124,58,237,0.31)] hover:bg-[rgba(124,58,237,0.45)] text-white font-semibold text-[16px] leading-[22px] text-center cursor-pointer transition-all active:scale-98 flex items-center justify-center"
                            >
                                No
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep("SELECT_REASON")}
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

            {/* STEP 2: SELECT REASON SCREEN */}
            {step === "SELECT_REASON" && (
                <div
                    className="w-full max-w-[892px] rounded-[24px] p-6 sm:p-8 flex flex-col justify-between backdrop-blur-md min-h-[480px]"
                    style={{
                        background: "rgba(12, 5, 26, 0.75)",
                        border: "0.8px solid rgba(124, 58, 237, 0.3)",
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                    }}
                >
                    <div className="flex flex-col gap-6">
                        <p className="font-medium text-[14px] leading-[20px] text-white/90">
                            We are sorry to see you go! Please let us know the reason for deleting your account.
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

                    {/* Next Button */}
                    <div className="flex justify-end mt-8">
                        <button
                            type="button"
                            onClick={() => setStep("ENTER_OTP")}
                            className="px-8 py-3 rounded-[16px] font-extrabold text-[14px] text-white transition-all cursor-pointer hover:opacity-95 active:scale-98"
                            style={{
                                background: "linear-gradient(135deg, #7C3AED 0%, #9F4FFA 100%)",
                                boxShadow: "0px 0px 24px rgba(124, 58, 237, 0.5)",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: OTP VERIFICATION SCREEN */}
            {step === "ENTER_OTP" && (
                <div
                    className="w-full max-w-[892px] rounded-[24px] p-8 sm:p-12 flex flex-col items-center justify-center backdrop-blur-md min-h-[480px] text-center"
                    style={{
                        background: "rgba(12, 5, 26, 0.75)",
                        border: "0.8px solid rgba(124, 58, 237, 0.3)",
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                    }}
                >
                    <div className="flex flex-col items-center gap-8 w-full max-w-md">
                        {/* Subtitle */}
                        <p className="font-normal text-[14px] leading-[22px] text-white/80">
                            To permanently delete your account, please enter the 6 digit code send to your email{" "}
                            <strong className="text-white font-semibold">mikesmith@gmail.com</strong>
                        </p>

                        {/* 5 / 6 Input Digit Boxes */}
                        <div className="flex items-center justify-center gap-3">
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
                                    className="w-[52px] h-[60px] sm:w-[60px] sm:h-[68px] rounded-[16px] text-center font-extrabold text-[22px] text-white focus:outline-none transition-all"
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

                        {/* Delete Now Button -> Navigates to Login */}
                        <button
                            type="button"
                            onClick={handleDeleteNow}
                            className="w-full max-w-[320px] h-[48px] rounded-[16px] font-extrabold text-[15px] leading-[20px] text-center text-white transition-all cursor-pointer hover:opacity-95 active:scale-98 mt-2"
                            style={{
                                background: "linear-gradient(135deg, #7C3AED 0%, #9F4FFA 100%)",
                                boxShadow:
                                    "0px 0px 28px rgba(124, 58, 237, 0.5), 0px 0px 60px rgba(124, 58, 237, 0.1)",
                            }}
                        >
                            Delete Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeleteAccountTab;
