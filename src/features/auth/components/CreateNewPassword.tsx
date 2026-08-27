"use client";

import { useState, useEffect } from "react";
import { Button, InputField } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "../api/auth.mutations";
import { toast } from "sonner";

export function CreateNewPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetToken, setResetToken] = useState<string>("");

    const resetPasswordMutation = useResetPasswordMutation();

    useEffect(() => {
        const tokenFromQuery = searchParams?.get("token");
        const tokenFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("reset-token") : null;
        const token = tokenFromQuery || tokenFromStorage || "";
        setResetToken(token);
    }, [searchParams]);

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(pwd)) {
            return "Password must contain at least 1 uppercase letter";
        }
        if (!/[a-z]/.test(pwd)) {
            return "Password must contain at least 1 lowercase letter";
        }
        if (!/[0-9]/.test(pwd)) {
            return "Password must contain at least 1 number";
        }
        if (!/[^a-zA-Z0-9]/.test(pwd)) {
            return "Password must contain at least 1 special character (!@#$%^&* etc.)";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resetToken) {
            toast.error("Invalid or missing reset token. Please request a new OTP.");
            router.push("/auth/forgot-password");
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await resetPasswordMutation.mutateAsync({
                resetToken,
                password,
            });

            if (typeof window !== "undefined") {
                sessionStorage.removeItem("reset-token");
            }

            toast.success("Password updated successfully");
            router.push("/auth/login");
        } catch (error: any) {
            console.error("Update password error:", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to update password. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[496px] mx-auto py-8 font-['Manrope',sans-serif]">
            {/* Header Text */}
            <div className="flex flex-col items-center gap-2 mb-8 text-center w-full">
                <h1 className="font-semibold text-[32px] sm:text-[36px] leading-[44px] sm:leading-[49px] text-white tracking-tight">
                    Create New Password
                </h1>
                <p className="font-normal text-[15px] sm:text-[16px] leading-[22px] text-white/80 max-w-[460px]">
                    Enter your new password to reset and secure your account.
                </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
                {/* Password Field */}
                <div className="w-full max-w-[388px]">
                    <InputField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        placeholder="•••••••••"
                        required
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="focus:outline-none p-1 hover:text-[#B972FC] transition-colors cursor-pointer"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5 text-[#B972FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-[#B972FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 0111.44 3.029C20.268 10.057 16.478 13 12 13c-.88 0-1.737-.113-2.553-.326m-4.52-4.52l12.14 12.14" />
                                    </svg>
                                )}
                            </button>
                        }
                    />
                </div>

                {/* Confirm Password Field */}
                <div className="w-full max-w-[388px]">
                    <InputField
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setConfirmPassword(e.target.value)
                        }
                        placeholder="•••••••••"
                        required
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="focus:outline-none p-1 hover:text-[#B972FC] transition-colors cursor-pointer"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5 text-[#B972FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-[#B972FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 0111.44 3.029C20.268 10.057 16.478 13 12 13c-.88 0-1.737-.113-2.553-.326m-4.52-4.52l12.14 12.14" />
                                    </svg>
                                )}
                            </button>
                        }
                    />
                </div>

                {/* Password requirements hint */}
                <div className="w-full max-w-[388px] text-[12px] text-white/60 -mt-2">
                    Must be at least 8 characters with uppercase, lowercase, number, and special character.
                </div>

                {/* Update Password CTA Button */}
                <div className="w-full max-w-[388px] mt-2">
                    <Button
                        type="submit"
                        variant="gradient"
                        disabled={!password || !confirmPassword || resetPasswordMutation.isPending}
                        className="w-full h-[52px] rounded-full font-bold text-[15px] sm:text-[16px] leading-[22px] cursor-pointer"
                    >
                        {resetPasswordMutation.isPending ? "Updating Password..." : "Update Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateNewPassword;
