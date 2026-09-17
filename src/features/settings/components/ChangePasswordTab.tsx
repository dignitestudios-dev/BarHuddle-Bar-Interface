"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useUpdatePasswordMutation } from "@/features/auth/api/auth.mutations";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ShieldAlert, ShieldCheck } from "lucide-react";

// ==========================================
// ZOD VALIDATION SCHEMA
// ==========================================
const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(1, "New password is required")
            .min(8, "New password must be at least 8 characters long")
            .max(50, "New password cannot exceed 50 characters")
            .regex(/[A-Z]/, "Must contain at least 1 uppercase letter (A-Z)")
            .regex(/[a-z]/, "Must contain at least 1 lowercase letter (a-z)")
            .regex(/[0-9]/, "Must contain at least 1 number (0-9)")
            .regex(/[^a-zA-Z0-9]/, "Must contain at least 1 special character (!@#$%^&* etc.)"),
        confirmPassword: z
            .string()
            .min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
        message: "New password must be different from your current password",
        path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords do not match",
        path: ["confirmPassword"],
    });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export type PasswordStrengthLevel = "weak" | "average" | "strong";

interface PasswordStrengthInfo {
    level: PasswordStrengthLevel;
    label: string;
    score: number; // 0 to 5
    percent: number;
    color: string;
    bgColor: string;
    badgeClass: string;
}

export function ChangePasswordTab() {
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const updatePasswordMutation = useUpdatePasswordMutation();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const currentPassword = watch("currentPassword") || "";
    const newPassword = watch("newPassword") || "";
    const confirmPassword = watch("confirmPassword") || "";

    // Real-time validation criteria evaluation
    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
    const isDifferent = Boolean(
        newPassword && currentPassword && newPassword !== currentPassword
    );

    // Password strength score calculation (0 to 5)
    const strengthInfo: PasswordStrengthInfo = useMemo(() => {
        if (!newPassword) {
            return {
                level: "weak",
                label: "Enter a password",
                score: 0,
                percent: 0,
                color: "#6B7280",
                bgColor: "bg-gray-500/20",
                badgeClass: "text-gray-400 bg-gray-500/10 border-gray-500/20",
            };
        }

        let score = 0;
        if (hasMinLength) score += 1;
        if (hasUppercase) score += 1;
        if (hasLowercase) score += 1;
        if (hasNumber) score += 1;
        if (hasSpecial) score += 1;
        if (newPassword.length >= 12) score += 1;

        if (score <= 2) {
            return {
                level: "weak",
                label: "Weak",
                score,
                percent: 33,
                color: "#EF4444",
                bgColor: "bg-rose-500",
                badgeClass: "text-rose-400 bg-rose-500/15 border-rose-500/30",
            };
        }

        if (score <= 4) {
            return {
                level: "average",
                label: "Average",
                score,
                percent: 66,
                color: "#F59E0B",
                bgColor: "bg-amber-500",
                badgeClass: "text-amber-400 bg-amber-500/15 border-amber-500/30",
            };
        }

        return {
            level: "strong",
            label: "Strong",
            score,
            percent: 100,
            color: "#10B981",
            bgColor: "bg-emerald-500",
            badgeClass: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
        };
    }, [newPassword, hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial]);

    const onSubmit = async (data: ChangePasswordFormValues) => {
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const res = await updatePasswordMutation.mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            const msg = res?.message || "Password updated successfully!";
            setSuccessMessage(msg);
            toast.success(msg);
            reset({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setTimeout(() => setSuccessMessage(""), 6000);
        } catch (error: any) {
            const msg =
                error.response?.data?.message ||
                error.message ||
                "Failed to update password. Please verify your current password.";
            setErrorMessage(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Header Section */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#AD46FF] shrink-0">
                    <Lock className="w-4 h-4" />
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
                className="box-border flex flex-col items-start p-6 sm:p-8 isolate rounded-[20px] w-full max-w-[892px] min-h-[412px] backdrop-blur-md"
                style={{
                    background: "rgba(14, 9, 60, 0.76)",
                    border: "0.8px solid rgba(124, 58, 237, 0.2)",
                    boxShadow:
                        "0px 4px 24px rgba(0, 0, 0, 0.4), inset 0px 1px 0px rgba(255, 255, 255, 0.05)",
                }}
            >
                {/* Form Inner Container */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col items-start w-full max-w-[460px] gap-[22px]"
                >
                    {/* Success Banner */}
                    {successMessage && (
                        <div className="w-full p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="w-full p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* 1. CURRENT PASSWORD FIELD */}
                    <div className="flex flex-col items-start w-full">
                        <label
                            htmlFor="currentPassword"
                            className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase mb-2"
                            style={{ color: "#8B7EC8" }}
                        >
                            CURRENT PASSWORD
                        </label>

                        <div className="relative w-full h-[46px]">
                            {/* Left Icon (Lock) */}
                            <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#8B7EC8] pointer-events-none flex items-center justify-center">
                                <Lock className="w-4 h-4" />
                            </div>

                            {/* Password Input */}
                            <input
                                id="currentPassword"
                                type={showCurrentPass ? "text" : "password"}
                                {...register("currentPassword")}
                                placeholder="Enter your current password"
                                className={`box-border w-full h-[46px] pl-[42px] pr-[44px] py-[12px] font-semibold text-[14px] text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none transition-all rounded-[14px] ${
                                    errors.currentPassword
                                        ? "border-rose-500/70 focus:border-rose-500 bg-rose-950/20"
                                        : "border-[rgba(124,58,237,0.25)] focus:border-[#7C3AED] bg-[rgba(124,58,237,0.08)]"
                                }`}
                                style={{
                                    borderWidth: "0.8px",
                                    borderStyle: "solid",
                                }}
                            />

                            {/* Right Toggle Visibility Button */}
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

                        {/* Field-level error */}
                        {errors.currentPassword && (
                            <span className="text-rose-400 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {errors.currentPassword.message}
                            </span>
                        )}
                    </div>

                    {/* 2. NEW PASSWORD FIELD */}
                    <div className="flex flex-col items-start w-full">
                        <label
                            htmlFor="newPassword"
                            className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase mb-2"
                            style={{ color: "#8B7EC8" }}
                        >
                            NEW PASSWORD
                        </label>

                        <div className="relative w-full h-[46px]">
                            {/* Left Icon (Lock) */}
                            <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#8B7EC8] pointer-events-none flex items-center justify-center">
                                <Lock className="w-4 h-4" />
                            </div>

                            {/* Password Input */}
                            <input
                                id="newPassword"
                                type={showNewPass ? "text" : "password"}
                                {...register("newPassword")}
                                placeholder="Create a strong new password"
                                className={`box-border w-full h-[46px] pl-[42px] pr-[44px] py-[12px] font-semibold text-[14px] text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none transition-all rounded-[14px] ${
                                    errors.newPassword
                                        ? "border-rose-500/70 focus:border-rose-500 bg-rose-950/20"
                                        : "border-[rgba(124,58,237,0.25)] focus:border-[#7C3AED] bg-[rgba(124,58,237,0.08)]"
                                }`}
                                style={{
                                    borderWidth: "0.8px",
                                    borderStyle: "solid",
                                }}
                            />

                            {/* Right Toggle Visibility Button */}
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

                        {/* Field-level error */}
                        {errors.newPassword && (
                            <span className="text-rose-400 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {errors.newPassword.message}
                            </span>
                        )}

                        {/* PASSWORD STRENGTH METER BAR (Weak, Average, Strong) */}
                        {newPassword && (
                            <div className="w-full mt-3 p-3.5 rounded-2xl bg-purple-950/40 border border-[rgba(124,58,237,0.25)] flex flex-col gap-2.5 animate-in fade-in duration-200">
                                {/* Strength Header & Badge */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-[#8B7EC8] uppercase tracking-wider">
                                        Password Strength
                                    </span>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border flex items-center gap-1 ${strengthInfo.badgeClass}`}
                                    >
                                        {strengthInfo.level === "strong" && (
                                            <ShieldCheck className="w-3 h-3 shrink-0 text-emerald-400" />
                                        )}
                                        {strengthInfo.level === "average" && (
                                            <ShieldAlert className="w-3 h-3 shrink-0 text-amber-400" />
                                        )}
                                        {strengthInfo.level === "weak" && (
                                            <AlertCircle className="w-3 h-3 shrink-0 text-rose-400" />
                                        )}
                                        <span>{strengthInfo.label}</span>
                                    </span>
                                </div>

                                {/* 3-Segment Strength Progress Bar */}
                                <div className="grid grid-cols-3 gap-1.5 w-full h-2 rounded-full overflow-hidden bg-white/5 p-0.5">
                                    {/* Segment 1: Weak */}
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            strengthInfo.score >= 1
                                                ? strengthInfo.level === "weak"
                                                    ? "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                                    : strengthInfo.level === "average"
                                                    ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                                    : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                                : "bg-white/10"
                                        }`}
                                    />

                                    {/* Segment 2: Average */}
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            strengthInfo.score >= 3
                                                ? strengthInfo.level === "average"
                                                    ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                                    : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                                : "bg-white/10"
                                        }`}
                                    />

                                    {/* Segment 3: Strong */}
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            strengthInfo.level === "strong"
                                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                                : "bg-white/10"
                                        }`}
                                    />
                                </div>

                                {/* Live Requirements Checklist */}
                                <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 pt-1 text-[11px] border-t border-white/5 mt-0.5">
                                    <div
                                        className={`flex items-center gap-1.5 transition-colors ${
                                            hasMinLength
                                                ? "text-emerald-400 font-semibold"
                                                : "text-white/40"
                                        }`}
                                    >
                                        <span className="font-mono text-xs">{hasMinLength ? "✓" : "○"}</span>
                                        <span>8+ characters</span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1.5 transition-colors ${
                                            hasUppercase
                                                ? "text-emerald-400 font-semibold"
                                                : "text-white/40"
                                        }`}
                                    >
                                        <span className="font-mono text-xs">{hasUppercase ? "✓" : "○"}</span>
                                        <span>1 uppercase (A-Z)</span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1.5 transition-colors ${
                                            hasLowercase
                                                ? "text-emerald-400 font-semibold"
                                                : "text-white/40"
                                        }`}
                                    >
                                        <span className="font-mono text-xs">{hasLowercase ? "✓" : "○"}</span>
                                        <span>1 lowercase (a-z)</span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1.5 transition-colors ${
                                            hasNumber
                                                ? "text-emerald-400 font-semibold"
                                                : "text-white/40"
                                        }`}
                                    >
                                        <span className="font-mono text-xs">{hasNumber ? "✓" : "○"}</span>
                                        <span>1 number (0-9)</span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1.5 transition-colors ${
                                            hasSpecial
                                                ? "text-emerald-400 font-semibold"
                                                : "text-white/40"
                                        }`}
                                    >
                                        <span className="font-mono text-xs">{hasSpecial ? "✓" : "○"}</span>
                                        <span>1 special char (!@#$)</span>
                                    </div>

                                    {currentPassword && (
                                        <div
                                            className={`flex items-center gap-1.5 transition-colors ${
                                                isDifferent
                                                    ? "text-emerald-400 font-semibold"
                                                    : "text-rose-400 font-semibold"
                                            }`}
                                        >
                                            <span className="font-mono text-xs">
                                                {isDifferent ? "✓" : "✕"}
                                            </span>
                                            <span>Unique from current</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. CONFIRM NEW PASSWORD FIELD */}
                    <div className="flex flex-col items-start w-full">
                        <label
                            htmlFor="confirmPassword"
                            className="font-extrabold text-[10px] leading-[15px] tracking-[1px] uppercase mb-2"
                            style={{ color: "#8B7EC8" }}
                        >
                            CONFIRM NEW PASSWORD
                        </label>

                        <div className="relative w-full h-[46px]">
                            {/* Left Icon (Lock) */}
                            <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#8B7EC8] pointer-events-none flex items-center justify-center">
                                <Lock className="w-4 h-4" />
                            </div>

                            {/* Password Input */}
                            <input
                                id="confirmPassword"
                                type={showConfirmPass ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder="Re-enter your new password"
                                className={`box-border w-full h-[46px] pl-[42px] pr-[44px] py-[12px] font-semibold text-[14px] text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none transition-all rounded-[14px] ${
                                    errors.confirmPassword
                                        ? "border-rose-500/70 focus:border-rose-500 bg-rose-950/20"
                                        : "border-[rgba(124,58,237,0.25)] focus:border-[#7C3AED] bg-[rgba(124,58,237,0.08)]"
                                }`}
                                style={{
                                    borderWidth: "0.8px",
                                    borderStyle: "solid",
                                }}
                            />

                            {/* Right Toggle Visibility Button */}
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

                        {/* Field-level error */}
                        {errors.confirmPassword && (
                            <span className="text-rose-400 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="flex flex-col items-center pt-2 w-full">
                        <button
                            type="submit"
                            disabled={updatePasswordMutation.isPending || isSubmitting}
                            className="flex flex-row justify-center items-center py-[14px] px-4 gap-[8px] w-full h-[48px] transition-all cursor-pointer hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-[14px] shadow-[0px_0px_28px_rgba(124,58,237,0.4)] rounded-[16px]"
                            style={{
                                background: "linear-gradient(135deg, #7C3AED 0%, #9F4FFA 100%)",
                            }}
                        >
                            {updatePasswordMutation.isPending || isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Updating Password...</span>
                                </div>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4 text-white" />
                                    <span>Update Password</span>
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
