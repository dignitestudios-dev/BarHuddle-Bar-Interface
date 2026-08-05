"use client";

import { useState } from "react";
import { Button, InputField, SuccessModal } from "@/components/ui";
import { useRouter } from "next/navigation";

interface CreateNewPasswordProps {
    onSuccess?: () => void;
}

export function CreateNewPassword({ onSuccess }: CreateNewPasswordProps) {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || password !== confirmPassword) return;
        setIsSubmitting(true);
        console.log("Updating password...");

        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);
            onSuccess?.();
        }, 600);
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        router.push("/auth/login");
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[496px] mx-auto py-8">
            {/* Header Text */}
            <div className="flex flex-col items-center gap-2 mb-8 text-center w-full">
                <h1 className="font-['Manrope',sans-serif] font-semibold text-[36px] leading-[49px] text-white tracking-tight">
                    Create New Password
                </h1>
                <p className="font-['Manrope',sans-serif] font-normal text-[16px] leading-[22px] text-white/80 max-w-[496px]">
                    Enter your new password to reset
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

                {/* Update Password CTA Button */}
                <div className="w-full max-w-[388px] mt-2">
                    <Button
                        type="submit"
                        variant="gradient"
                        disabled={!password || password !== confirmPassword || isSubmitting}
                        className="w-full h-[52px] font-['Manrope',sans-serif] font-bold text-[16px] leading-[22px]"
                    >
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                title="Password Updated"
                description="Your password has been reset successfully"
                actionButton={
                    <Button
                        onClick={handleModalClose}
                        variant="gradient"
                        className="w-full h-[48px]"
                    >
                        Back to Login
                    </Button>
                }
            />
        </div>
    );
}

export default CreateNewPassword;
