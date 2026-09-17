"use client";

import React, { useMemo } from "react";
import { AlertCircle, ShieldAlert, ShieldCheck } from "lucide-react";

export type PasswordStrengthLevel = "weak" | "average" | "strong";

export interface PasswordStrengthInfo {
    level: PasswordStrengthLevel;
    label: string;
    score: number; // 0 to 5+
    percent: number;
    color: string;
    badgeClass: string;
}

export interface PasswordStrengthMeterProps {
    password?: string;
    comparePassword?: string;
    compareLabel?: string;
    className?: string;
    showRequirements?: boolean;
}

export function evaluatePasswordStrength(
    password: string = "",
    comparePassword?: string
): {
    strength: PasswordStrengthInfo;
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    isDifferent: boolean;
    allMet: boolean;
} {
    const pwd = password || "";
    const hasMinLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    const isDifferent = Boolean(
        comparePassword ? pwd && comparePassword && pwd.toLowerCase() !== comparePassword.toLowerCase() : true
    );

    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;
    if (pwd.length >= 12) score += 1;

    const allMet = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && isDifferent;

    if (!pwd) {
        return {
            strength: {
                level: "weak",
                label: "Enter password",
                score: 0,
                percent: 0,
                color: "#6B7280",
                badgeClass: "text-gray-400 bg-gray-500/10 border-gray-500/20",
            },
            hasMinLength: false,
            hasUppercase: false,
            hasLowercase: false,
            hasNumber: false,
            hasSpecial: false,
            isDifferent: true,
            allMet: false,
        };
    }

    if (score <= 2) {
        return {
            strength: {
                level: "weak",
                label: "Weak",
                score,
                percent: 33,
                color: "#EF4444",
                badgeClass: "text-rose-400 bg-rose-500/15 border-rose-500/30",
            },
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecial,
            isDifferent,
            allMet,
        };
    }

    if (score <= 4) {
        return {
            strength: {
                level: "average",
                label: "Average",
                score,
                percent: 66,
                color: "#F59E0B",
                badgeClass: "text-amber-400 bg-amber-500/15 border-amber-500/30",
            },
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecial,
            isDifferent,
            allMet,
        };
    }

    return {
        strength: {
            level: "strong",
            label: "Strong",
            score,
            percent: 100,
            color: "#10B981",
            badgeClass: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
        },
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial,
        isDifferent,
        allMet,
    };
}

export function PasswordStrengthMeter({
    password = "",
    comparePassword,
    compareLabel = "Unique from current",
    className = "",
    showRequirements = true,
}: PasswordStrengthMeterProps) {
    const {
        strength,
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial,
        isDifferent,
    } = useMemo(() => evaluatePasswordStrength(password, comparePassword), [password, comparePassword]);

    if (!password) return null;

    return (
        <div
            className={`w-full p-3 sm:p-3.5 rounded-2xl bg-purple-950/40 border border-[rgba(124,58,237,0.25)] flex flex-col gap-2.5 animate-in fade-in duration-200 font-['Manrope',sans-serif] ${className}`}
        >
            {/* Strength Header & Status Badge */}
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8B7EC8] uppercase tracking-wider">
                    Password Strength
                </span>
                <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border flex items-center gap-1 ${strength.badgeClass}`}
                >
                    {strength.level === "strong" && (
                        <ShieldCheck className="w-3 h-3 shrink-0 text-emerald-400" />
                    )}
                    {strength.level === "average" && (
                        <ShieldAlert className="w-3 h-3 shrink-0 text-amber-400" />
                    )}
                    {strength.level === "weak" && (
                        <AlertCircle className="w-3 h-3 shrink-0 text-rose-400" />
                    )}
                    <span>{strength.label}</span>
                </span>
            </div>

            {/* 3-Segment Progress Bar (Weak, Average, Strong) */}
            <div className="grid grid-cols-3 gap-1.5 w-full h-2 rounded-full overflow-hidden bg-white/5 p-0.5">
                {/* Segment 1: Weak */}
                <div
                    className={`h-full rounded-full transition-all duration-300 ${
                        strength.score >= 1
                            ? strength.level === "weak"
                                ? "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                : strength.level === "average"
                                ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            : "bg-white/10"
                    }`}
                />

                {/* Segment 2: Average */}
                <div
                    className={`h-full rounded-full transition-all duration-300 ${
                        strength.score >= 3
                            ? strength.level === "average"
                                ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            : "bg-white/10"
                    }`}
                />

                {/* Segment 3: Strong */}
                <div
                    className={`h-full rounded-full transition-all duration-300 ${
                        strength.level === "strong"
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            : "bg-white/10"
                    }`}
                />
            </div>

            {/* Live Requirements Checklist */}
            {showRequirements && (
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 pt-1 text-[11px] border-t border-white/5 mt-0.5">
                    <div
                        className={`flex items-center gap-1.5 transition-colors ${
                            hasMinLength ? "text-emerald-400 font-semibold" : "text-white/40"
                        }`}
                    >
                        <span className="font-mono text-xs">{hasMinLength ? "✓" : "○"}</span>
                        <span>8+ characters</span>
                    </div>

                    <div
                        className={`flex items-center gap-1.5 transition-colors ${
                            hasUppercase ? "text-emerald-400 font-semibold" : "text-white/40"
                        }`}
                    >
                        <span className="font-mono text-xs">{hasUppercase ? "✓" : "○"}</span>
                        <span>1 uppercase (A-Z)</span>
                    </div>

                    <div
                        className={`flex items-center gap-1.5 transition-colors ${
                            hasLowercase ? "text-emerald-400 font-semibold" : "text-white/40"
                        }`}
                    >
                        <span className="font-mono text-xs">{hasLowercase ? "✓" : "○"}</span>
                        <span>1 lowercase (a-z)</span>
                    </div>

                    <div
                        className={`flex items-center gap-1.5 transition-colors ${
                            hasNumber ? "text-emerald-400 font-semibold" : "text-white/40"
                        }`}
                    >
                        <span className="font-mono text-xs">{hasNumber ? "✓" : "○"}</span>
                        <span>1 number (0-9)</span>
                    </div>

                    <div
                        className={`flex items-center gap-1.5 transition-colors ${
                            hasSpecial ? "text-emerald-400 font-semibold" : "text-white/40"
                        }`}
                    >
                        <span className="font-mono text-xs">{hasSpecial ? "✓" : "○"}</span>
                        <span>1 special char (!@#$)</span>
                    </div>

                    {comparePassword && (
                        <div
                            className={`flex items-center gap-1.5 transition-colors ${
                                isDifferent ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"
                            }`}
                        >
                            <span className="font-mono text-xs">{isDifferent ? "✓" : "✕"}</span>
                            <span>{compareLabel}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PasswordStrengthMeter;
