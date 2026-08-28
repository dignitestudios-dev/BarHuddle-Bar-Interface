"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useUpdatePasswordMutation } from "@/features/auth/api/auth.mutations";
import { Eye, EyeOff } from "lucide-react";

export function ChangePasswordTab() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const updatePasswordMutation = useUpdatePasswordMutation();

    const validatePassword = (pwd: string, currPwd?: string): string | null => {
        if (!currPwd) {
            return "Please enter your current password.";
        }
        if (!pwd) {
            return "Please enter a new password.";
        }
        if (currPwd === pwd) {
            return "New password must be different from your current password.";
        }
        if (pwd.length < 8) {
            return "New password must be at least 8 characters long.";
        }
        if (pwd.length > 50) {
            return "New password cannot exceed 50 characters.";
        }
        if (!/[A-Z]/.test(pwd)) {
            return "New password must contain at least 1 uppercase letter (A-Z).";
        }
        if (!/[a-z]/.test(pwd)) {
            return "New password must contain at least 1 lowercase letter (a-z).";
        }
        if (!/[0-9]/.test(pwd)) {
            return "New password must contain at least 1 number (0-9).";
        }
        if (!/[^a-zA-Z0-9]/.test(pwd)) {
            return "New password must contain at least 1 special character (!@#$%^&* etc.).";
        }
        return null;
    };

    // Live validation flags
    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
    const isDifferent = Boolean(newPassword && currentPassword && newPassword !== currentPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const passwordError = validatePassword(newPassword, currentPassword);
        if (passwordError) {
            setErrorMessage(passwordError);
            toast.error(passwordError);
            return;
        }

        if (newPassword !== confirmPassword) {
            const msg = "New passwords do not match!";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        try {
            const res = await updatePasswordMutation.mutateAsync({
                currentPassword,
                newPassword,
            });
            const msg = res?.message || "Password updated successfully!";
            setSuccessMessage(msg);
            toast.success(msg);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Failed to update password. Please verify your current password.";
            setErrorMessage(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#AD46FF] shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-[20px] font-bold text-white leading-tight">Change Password</h2>
                    <p className="text-[12px] leading-[18px] text-[#9D8FD0]">
                        Update your password to ensure your owner account remains safe and secure.
                    </p>
                </div>
            </div>

            {/* Main Outer Card */}
            <div
                className="box-border flex flex-col items-start p-6 isolate rounded-[20px] w-full max-w-[892px] min-h-[412px] backdrop-blur-md"
                style={{
                    background: "rgba(14, 9, 60, 0.76)",
                    border: "0.8px solid rgba(124, 58, 237, 0.2)",
                    boxShadow:
                        "0px 4px 24px rgba(0, 0, 0, 0.4), inset 0px 1px 0px rgba(255, 255, 255, 0.05)",
                }}
            >
                {/* Form Inner Container (ChangePassword) */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-start w-full max-w-[448px] gap-[20px]"
                >
                    {successMessage && (
                        <div className="w-full max-w-[400px] p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="w-full max-w-[400px] p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errorMessage}
                        </div>
                    )}

                    {/* 1. CURRENT PASSWORD FIELD */}
                    <div className="flex flex-col items-start w-full max-w-[400px]">
                        {/* Label */}
                        <div className="flex flex-col items-start w-full h-[15px]">
                            <label
                                className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase"
                                style={{ color: "#8B7EC8" }}
                            >
                                CURRENT PASSWORD
                            </label>
                        </div>

                        {/* Input Container */}
                        <div className="relative w-full max-w-[400px] h-[44px] mt-[8px]">
                            {/* Left Icon (Lock Vector) */}
                            <div className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] pointer-events-none flex items-center justify-center">
                                <svg className="w-[13px] h-[13px]" viewBox="0 0 13 13" fill="none">
                                    <rect
                                        x="1.5"
                                        y="5.5"
                                        width="10"
                                        height="6"
                                        rx="1"
                                        stroke="#8B7EC8"
                                        strokeWidth="1.08333"
                                    />
                                    <path
                                        d="M3.8 5.5V3.75C3.8 2.50736 4.80736 1.5 6.05 1.5C7.29264 1.5 8.3 2.50736 8.3 3.75V5.5"
                                        stroke="#8B7EC8"
                                        strokeWidth="1.08333"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            {/* Password Input */}
                            <input
                                type={showCurrentPass ? "text" : "password"}
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Current Password"
                                className="box-border w-full h-[44px] pl-[40px] pr-[40px] py-[12px] font-semibold text-[14px] leading-[19px] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#7C3AED] transition-colors"
                                style={{
                                    background: "rgba(124, 58, 237, 0.08)",
                                    border: "0.8px solid rgba(124, 58, 237, 0.2)",
                                    borderRadius: "14px",
                                }}
                            />

                            {/* Right Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowCurrentPass(!showCurrentPass)}
                                className="absolute right-[12px] top-1/2 -translate-y-1/2 p-1.5 flex items-center justify-center text-[#8B7EC8] hover:text-[#E8FF57] transition-colors cursor-pointer focus:outline-none"
                                aria-label={showCurrentPass ? "Hide password" : "Show password"}
                            >
                                {showCurrentPass ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 2. NEW PASSWORD FIELD */}
                    <div className="flex flex-col items-start w-full max-w-[400px]">
                        {/* Label */}
                        <div className="flex flex-col items-start w-full h-[15px]">
                            <label
                                className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase"
                                style={{ color: "#8B7EC8" }}
                            >
                                NEW PASSWORD
                            </label>
                        </div>

                        {/* Input Container */}
                        <div className="relative w-full max-w-[400px] h-[44px] mt-[8px]">
                            {/* Left Icon (Lock Vector) */}
                            <div className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] pointer-events-none flex items-center justify-center">
                                <svg className="w-[13px] h-[13px]" viewBox="0 0 13 13" fill="none">
                                    <rect
                                        x="1.5"
                                        y="5.5"
                                        width="10"
                                        height="6"
                                        rx="1"
                                        stroke="#8B7EC8"
                                        strokeWidth="1.08333"
                                    />
                                    <path
                                        d="M3.8 5.5V3.75C3.8 2.50736 4.80736 1.5 6.05 1.5C7.29264 1.5 8.3 2.50736 8.3 3.75V5.5"
                                        stroke="#8B7EC8"
                                        strokeWidth="1.08333"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            {/* Password Input */}
                            <input
                                type={showNewPass ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="box-border w-full h-[44px] pl-[40px] pr-[40px] py-[12px] font-semibold text-[14px] leading-[19px] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#7C3AED] transition-colors"
                                style={{
                                    background: "rgba(124, 58, 237, 0.08)",
                                    border: "0.8px solid rgba(124, 58, 237, 0.2)",
                                    borderRadius: "14px",
                                }}
                            />

                            {/* Right Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowNewPass(!showNewPass)}
                                className="absolute right-[12px] top-1/2 -translate-y-1/2 p-1.5 flex items-center justify-center text-[#8B7EC8] hover:text-[#E8FF57] transition-colors cursor-pointer focus:outline-none"
                                aria-label={showNewPass ? "Hide password" : "Show password"}
                            >
                                {showNewPass ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Real-time Password Strength Requirements */}
                        {newPassword && (
                            <div className="w-full mt-2.5 p-3 rounded-xl bg-purple-950/40 border border-purple-800/30 flex flex-col gap-1.5 text-[11px] animate-in fade-in duration-200">
                                <div className="font-semibold text-purple-200 text-[11.5px] mb-0.5">Password requirements:</div>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400 font-medium" : "text-white/50"}`}>
                                        <span>{hasMinLength ? "✓" : "○"}</span>
                                        <span>8+ characters</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-400 font-medium" : "text-white/50"}`}>
                                        <span>{hasUppercase ? "✓" : "○"}</span>
                                        <span>1 uppercase (A-Z)</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-400 font-medium" : "text-white/50"}`}>
                                        <span>{hasLowercase ? "✓" : "○"}</span>
                                        <span>1 lowercase (a-z)</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400 font-medium" : "text-white/50"}`}>
                                        <span>{hasNumber ? "✓" : "○"}</span>
                                        <span>1 number (0-9)</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-400 font-medium" : "text-white/50"}`}>
                                        <span>{hasSpecial ? "✓" : "○"}</span>
                                        <span>1 special char (!@#$)</span>
                                    </div>
                                    {currentPassword && (
                                        <div className={`flex items-center gap-1.5 ${isDifferent ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}`}>
                                            <span>{isDifferent ? "✓" : "○"}</span>
                                            <span>Unique from current</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                    {/* 3. CONFIRM NEW PASSWORD FIELD */}
                    <div className="flex flex-col items-start w-full max-w-[400px]">
                        {/* Label */}
                        <div className="flex flex-col items-start w-full h-[15px]">
                            <label
                                className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase"
                                style={{ color: "#8B7EC8" }}
                            >
                                CONFIRM NEW PASSWORD
                            </label>
                        </div>

                        {/* Input Container */}
                        <div className="relative w-full max-w-[400px] h-[44px] mt-[8px]">
                            {/* Left Icon (Lock Vector) */}
                            <div className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] pointer-events-none flex items-center justify-center">
                                <svg className="w-[13px] h-[13px]" viewBox="0 0 13 13" fill="none">
                                    <rect
                                        x="1.5"
                                        y="5.5"
                                        width="10"
                                        height="6"
                                        rx="1"
                                        stroke="#8B7EC8"
                                        strokeWidth="1.08333"
                                    />
                                    <path
                                        d="M3.8 5.5V3.75C3.8 2.50736 4.80736 1.5 6.05 1.5C7.29264 1.5 8.3 2.50736 8.3 3.75V5.5"
                                        stroke="#8B7EC8"
                                        strokeWidth="1.08333"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            {/* Password Input */}
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm New Password"
                                className="box-border w-full h-[44px] pl-[40px] pr-[40px] py-[12px] font-semibold text-[14px] leading-[19px] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#7C3AED] transition-colors"
                                style={{
                                    background: "rgba(124, 58, 237, 0.08)",
                                    border: "0.8px solid rgba(124, 58, 237, 0.2)",
                                    borderRadius: "14px",
                                }}
                            />

                            {/* Right Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-[12px] top-1/2 -translate-y-1/2 p-1.5 flex items-center justify-center text-[#8B7EC8] hover:text-[#E8FF57] transition-colors cursor-pointer focus:outline-none"
                                aria-label={showConfirmPass ? "Hide password" : "Show password"}
                            >
                                {showConfirmPass ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* BUTTON:MARGIN / SUBMIT BUTTON */}
                    <div className="flex flex-col items-center pt-[8px] w-full max-w-[400px]">
                        <button
                            type="submit"
                            disabled={updatePasswordMutation.isPending}
                            className="flex flex-row justify-center items-center py-[14px] px-0 gap-[8px] w-full max-w-[400px] h-[48px] transition-all cursor-pointer hover:opacity-95 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: "linear-gradient(135deg, #7C3AED 0%, #9F4FFA 100%)",
                                boxShadow:
                                    "0px 0px 28px rgba(124, 58, 237, 0.4), 0px 0px 60px rgba(124, 58, 237, 0.08)",
                                borderRadius: "16px",
                            }}
                        >
                            {updatePasswordMutation.isPending ? (
                                <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>
                                    {/* Icon */}
                                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                                        <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                                            <rect
                                                x="1.5"
                                                y="6"
                                                width="11"
                                                height="6.5"
                                                rx="1"
                                                stroke="#FFFFFF"
                                                strokeWidth="1.16667"
                                            />
                                            <path
                                                d="M4.1 6V4C4.1 2.4 5.4 1.5 7 1.5C8.6 1.5 9.9 2.4 9.9 4V6"
                                                stroke="#FFFFFF"
                                                strokeWidth="1.16667"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>

                                    {/* Text */}
                                    <span className="font-extrabold text-[14px] leading-[20px] text-center text-white truncate">
                                        Update Password
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordTab;
