"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, InputField } from "@/components/ui";
import { useRouter } from "next/navigation";

interface ForgotPasswordProps {
    onBack?: () => void;
    onSendOtp?: (email: string) => void;
}

export function ForgotPassword({ onBack, onSendOtp }: ForgotPasswordProps) {
    const router = useRouter();
    const [email, setEmail] = useState("jamessmith@gmail.com");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsSubmitting(true);
        console.log("Sending OTP code to:", email);
        onSendOtp?.(email);
        setTimeout(() => {
            setIsSubmitting(false);
            router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&mode=reset-password`);
        }, 500);

    };

    const handleBackClick = () => {
        if (onBack) {
            onBack();
        } else {
            router.push("/auth/login");
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full max-w-[496px] mx-auto py-8">
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
                <h1 className="font-['Manrope',sans-serif] font-semibold text-[36px] leading-[49px] text-white tracking-tight">
                    Forgot Password?
                </h1>
                <p className="font-['Manrope',sans-serif] font-normal text-[16px] leading-[22px] text-white/80 max-w-[496px]">
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
                        disabled={isSubmitting}
                        className="w-full h-[52px] font-['Manrope',sans-serif] font-bold text-[16px] leading-[22px]"
                    >
                        {isSubmitting ? "Sending..." : "Send OTP Code"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword;
