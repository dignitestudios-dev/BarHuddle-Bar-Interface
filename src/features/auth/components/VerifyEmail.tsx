"use client";

import { useState, useEffect } from "react";
import { Button, OtpInput, SuccessModal } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";

export interface VerifyEmailProps {
    email?: string;
    initialTimerSeconds?: number;
    mode?: "register" | "reset-password";
    onVerify?: (code: string) => void;
    onResend?: () => void;
    redirectTo?: string;
}

export function VerifyEmail({
    email: propEmail,
    initialTimerSeconds = 14,
    mode: propMode,
    onVerify,
    onResend,
    redirectTo,
}: VerifyEmailProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Determine email & mode from props or query params
    const queryEmail = searchParams?.get("email");
    const queryMode = searchParams?.get("mode") as "register" | "reset-password" | null;

    const email = propEmail || queryEmail || "jamessmith@gmail.com";
    const mode = propMode || queryMode || "register";

    const isResetPassword = mode === "reset-password";

    // Target redirection URL
    const targetRedirect =
        redirectTo || (isResetPassword ? "/auth/create-new-password" : "/app/dashboard");

    const modalButtonText = isResetPassword
        ? "Continue to Reset Password"
        : "Go to App";

    const [otpCode, setOtpCode] = useState("");
    const [timer, setTimer] = useState(initialTimerSeconds);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Resend countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleResend = () => {
        if (timer > 0) return;
        setTimer(initialTimerSeconds);
        setOtpCode("");
        onResend?.();
    };

    const handleVerificationSubmit = (codeToVerify: string = otpCode) => {
        if (codeToVerify.length < 5) return;
        setIsSubmitting(true);
        console.log("Verifying code:", codeToVerify, "for email:", email, "mode:", mode);
        onVerify?.(codeToVerify);

        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);
        }, 600);
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        if (targetRedirect) {
            router.push(targetRedirect);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleVerificationSubmit(otpCode);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[496px] mx-auto py-8">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-2 mb-8 text-center max-w-[496px]">
                <h1 className="font-['Manrope',sans-serif] font-semibold text-[36px] leading-[49px] text-white tracking-tight">
                    Verification
                </h1>
                <p className="font-['Manrope',sans-serif] font-normal text-[16px] leading-[22px] text-white/80">
                    Enetr the code sent to{" "}
                    <span className="text-[#FDF88F] font-medium">{email}</span>
                </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-8">
                {/* 5-Digit OTP Input */}
                <OtpInput
                    length={5}
                    value={otpCode}
                    onChange={setOtpCode}
                    onComplete={(code) => {
                        console.log("OTP Complete:", code);
                        handleVerificationSubmit(code);
                    }}
                    className="gap-3"
                />

                {/* Timer / Resend Link */}
                <div className="text-center">
                    <p className="font-['Manrope',sans-serif] font-normal text-[16px] leading-[22px] text-white">
                        Didn’t receive code?{" "}
                        {timer > 0 ? (
                            <span className="font-medium text-[#FDF88F]">
                                Resend in {formatTimer(timer)}
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-[#FDF88F] font-semibold hover:underline cursor-pointer transition-all focus:outline-none"
                            >
                                Resend
                            </button>
                        )}
                    </p>
                </div>

                {/* Verify Button */}
                <div className="w-full max-w-[388px]">
                    <Button
                        type="submit"
                        variant="gradient"
                        disabled={otpCode.length < 5 || isSubmitting}
                        className="w-full h-[52px] font-['Manrope',sans-serif] font-bold text-[16px] leading-[22px]"
                    >
                        {isSubmitting ? "Verifying..." : "Verify"}
                    </Button>
                </div>
            </form>

            {/* Reusable Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                title="Email Verified"
                description="Your email has been verified successfully"
                actionButton={
                    <Button
                        onClick={handleModalClose}
                        variant="gradient"
                        className="w-full h-[48px]"
                    >
                        {modalButtonText}
                    </Button>
                }
            />
        </div>
    );
}

export default VerifyEmail;
