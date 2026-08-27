"use client";

import { useState, useEffect } from "react";
import { Button, OtpInput } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { useResendOtpMutation } from "../api/auth.mutations";
import { toast } from "sonner";

export interface VerifyEmailProps {
    email?: string;
    initialTimerSeconds?: number;
    mode?: "register" | "reset-password" | "login" | "signup" | "reset";
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
    const queryMode = searchParams?.get("mode") as "register" | "reset-password" | "login" | "signup" | "reset" | null;

    const email = propEmail || queryEmail || "jamessmith@gmail.com";
    const mode = propMode || queryMode || "register";

    const isResetPassword = mode === "reset-password" || mode === "reset";

    const [otpCode, setOtpCode] = useState("");
    const [timer, setTimer] = useState(initialTimerSeconds);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { handleVerifyOtp } = useAuth();
    const resendOtpMutation = useResendOtpMutation();
    
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

    const handleResend = async () => {
        if (timer > 0 || resendOtpMutation.isPending) return;
        try {
            await resendOtpMutation.mutateAsync(email);
            setTimer(initialTimerSeconds);
            setOtpCode("");
            onResend?.();
            toast.success("Verification code resent to your email!");
        } catch (error: any) {
            console.error("Resend OTP error:", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to resend code");
        }
    };

    const handleVerificationSubmit = async (codeToVerify: string = otpCode) => {
        if (codeToVerify.length < 4) return;
        setIsSubmitting(true);
        
        try {
            await handleVerifyOtp(codeToVerify, isResetPassword ? "reset-password" : "login", email);
            setIsSubmitting(false);
        } catch (error: any) {
            setIsSubmitting(false);
            toast.error(error.message || "Failed to verify OTP");
            setOtpCode(""); // clear OTP so user can try again
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleVerificationSubmit(otpCode);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[496px] mx-auto py-8 font-['Manrope',sans-serif]">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-2 mb-8 text-center max-w-[496px]">
                <h1 className="font-semibold text-[32px] sm:text-[36px] leading-[44px] sm:leading-[49px] text-white tracking-tight">
                    Verification
                </h1>
                <p className="font-normal text-[15px] sm:text-[16px] leading-[22px] text-white/80">
                    Enter the code sent to{" "}
                    <span className="text-[#FDF88F] font-medium">{email}</span>
                </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-8">
                {/* 4-Digit OTP Input */}
                <OtpInput
                    length={4}
                    value={otpCode}
                    onChange={setOtpCode}
                    onComplete={(code) => {
                        handleVerificationSubmit(code);
                    }}
                    className="gap-3"
                />

                {/* Timer / Resend Link */}
                <div className="text-center">
                    <p className="font-normal text-[15px] sm:text-[16px] leading-[22px] text-white">
                        Didn’t receive code?{" "}
                        {timer > 0 ? (
                            <span className="font-medium text-[#FDF88F]">
                                Resend in {formatTimer(timer)}
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendOtpMutation.isPending}
                                className="text-[#FDF88F] font-semibold hover:underline cursor-pointer transition-all focus:outline-none disabled:opacity-50"
                            >
                                {resendOtpMutation.isPending ? "Resending..." : "Resend"}
                            </button>
                        )}
                    </p>
                </div>

                {/* Verify Button */}
                <div className="w-full max-w-[388px]">
                    <Button
                        type="submit"
                        variant="gradient"
                        disabled={otpCode.length < 4 || isSubmitting}
                        className="w-full h-[52px] rounded-full font-bold text-[15px] sm:text-[16px] leading-[22px] cursor-pointer"
                    >
                        {isSubmitting ? "Verifying..." : "Verify"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default VerifyEmail;
