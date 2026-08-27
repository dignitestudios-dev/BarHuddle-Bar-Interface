"use client";

import { useState, useEffect } from "react";
import { Button, InputField } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useForgotPasswordMutation } from "../api/auth.mutations";
import { toast } from "sonner";

interface ForgotPasswordProps {
    onBack?: () => void;
    onSendOtp?: (email: string) => void;
}

export function ForgotPassword({ onBack, onSendOtp }: ForgotPasswordProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const forgotPasswordMutation = useForgotPasswordMutation();

    useEffect(() => {
        const emailFromQuery = searchParams?.get("email");
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            await forgotPasswordMutation.mutateAsync(trimmedEmail);
            onSendOtp?.(trimmedEmail);
            toast.success("OTP sent successfully to your email!");
            router.push(`/auth/verify-email?email=${encodeURIComponent(trimmedEmail)}&mode=reset`);
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to send OTP. Please check your email.");
        }
    };

    const handleBackClick = () => {
        if (onBack) {
            onBack();
        } else {
            router.push("/auth/login");
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full max-w-[496px] mx-auto py-8 font-['Manrope',sans-serif]">
            {/* Top Back Arrow Button */}
            <div className="w-full flex justify-start mb-6">
                <button
                    type="button"
                    onClick={handleBackClick}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-white/5 border border-white/10 hover:bg-white/15 active:scale-95 transition-all focus:outline-none cursor-pointer group"
                    aria-label="Go Back"
                >
                    <svg
                        className="w-6 h-6 text-white transition-transform group-hover:-translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                </button>
            </div>

            {/* Header Text */}
            <div className="flex flex-col items-center gap-2 mb-8 text-center w-full">
                <h1 className="font-semibold text-[32px] sm:text-[36px] leading-[44px] sm:leading-[49px] text-white tracking-tight">
                    Forgot Password?
                </h1>
                <p className="font-normal text-[15px] sm:text-[16px] leading-[22px] text-white/80 max-w-[460px]">
                    Lost your password? No worries. Enter your email below, and we’ll send
                    you a verification code to reset your password securely.
                </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
                {/* Email Field using reusable InputField component */}
                <div className="w-full max-w-[388px]">
                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        placeholder="jamessmith@gmail.com"
                        required
                    />
                </div>

                {/* Send OTP Code CTA Button */}
                <div className="w-full max-w-[388px]">
                    <Button
                        type="submit"
                        variant="gradient"
                        disabled={forgotPasswordMutation.isPending}
                        className="w-full h-[52px] rounded-full font-bold text-[15px] sm:text-[16px] cursor-pointer"
                    >
                        {forgotPasswordMutation.isPending ? "Sending OTP..." : "Send OTP"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword;
