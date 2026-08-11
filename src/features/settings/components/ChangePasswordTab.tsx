"use client";

import React, { useState } from "react";

export function ChangePasswordTab() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        setSuccessMessage("Password updated successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
                        <div className="w-full max-w-[400px] p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {successMessage}
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
                                className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                                    {showCurrentPass ? (
                                        <path
                                            d="M1.75 1.75L12.25 12.25M6.02 6.02C5.7 6.34 5.5 6.78 5.5 7.27C5.5 8.24 6.28 9.02 7.25 9.02C7.74 9.02 8.18 8.82 8.5 8.5M10.21 10.21C9.33 10.74 8.33 11.02 7.25 11.02C4.17 11.02 1.75 7.27 1.75 7.27C2.46 6.06 3.42 5.06 4.54 4.38"
                                            stroke="#8B7EC8"
                                            strokeWidth="1.16667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    ) : (
                                        <>
                                            <path
                                                d="M1.75 7C1.75 7 4.08333 2.91667 7 2.91667C9.91667 2.91667 12.25 7 12.25 7C12.25 7 9.91667 11.0833 7 11.0833C4.08333 11.0833 1.75 7 1.75 7Z"
                                                stroke="#8B7EC8"
                                                strokeWidth="1.16667"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <circle
                                                cx="7"
                                                cy="7"
                                                r="1.75"
                                                stroke="#8B7EC8"
                                                strokeWidth="1.16667"
                                            />
                                        </>
                                    )}
                                </svg>
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
                                className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                                    {showNewPass ? (
                                        <path
                                            d="M1.75 1.75L12.25 12.25M6.02 6.02C5.7 6.34 5.5 6.78 5.5 7.27C5.5 8.24 6.28 9.02 7.25 9.02C7.74 9.02 8.18 8.82 8.5 8.5M10.21 10.21C9.33 10.74 8.33 11.02 7.25 11.02C4.17 11.02 1.75 7.27 1.75 7.27C2.46 6.06 3.42 5.06 4.54 4.38"
                                            stroke="#8B7EC8"
                                            strokeWidth="1.16667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    ) : (
                                        <>
                                            <path
                                                d="M1.75 7C1.75 7 4.08333 2.91667 7 2.91667C9.91667 2.91667 12.25 7 12.25 7C12.25 7 9.91667 11.0833 7 11.0833C4.08333 11.0833 1.75 7 1.75 7Z"
                                                stroke="#8B7EC8"
                                                strokeWidth="1.16667"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <circle
                                                cx="7"
                                                cy="7"
                                                r="1.75"
                                                stroke="#8B7EC8"
                                                strokeWidth="1.16667"
                                            />
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>
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
                                className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                                    {showConfirmPass ? (
                                        <path
                                            d="M1.75 1.75L12.25 12.25M6.02 6.02C5.7 6.34 5.5 6.78 5.5 7.27C5.5 8.24 6.28 9.02 7.25 9.02C7.74 9.02 8.18 8.82 8.5 8.5M10.21 10.21C9.33 10.74 8.33 11.02 7.25 11.02C4.17 11.02 1.75 7.27 1.75 7.27C2.46 6.06 3.42 5.06 4.54 4.38"
                                            stroke="#8B7EC8"
                                            strokeWidth="1.16667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    ) : (
                                        <>
                                            <path
                                                d="M1.75 7C1.75 7 4.08333 2.91667 7 2.91667C9.91667 2.91667 12.25 7 12.25 7C12.25 7 9.91667 11.0833 7 11.0833C4.08333 11.0833 1.75 7 1.75 7Z"
                                                stroke="#8B7EC8"
                                                strokeWidth="1.16667"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <circle
                                                cx="7"
                                                cy="7"
                                                r="1.75"
                                                stroke="#8B7EC8"
                                                strokeWidth="1.16667"
                                            />
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* BUTTON:MARGIN / SUBMIT BUTTON */}
                    <div className="flex flex-col items-center pt-[8px] w-full max-w-[400px]">
                        <button
                            type="submit"
                            className="flex flex-row justify-center items-center py-[14px] px-0 gap-[8px] w-full max-w-[400px] h-[48px] transition-all cursor-pointer hover:opacity-95 active:scale-98"
                            style={{
                                background: "linear-gradient(135deg, #7C3AED 0%, #9F4FFA 100%)",
                                boxShadow:
                                    "0px 0px 28px rgba(124, 58, 237, 0.4), 0px 0px 60px rgba(124, 58, 237, 0.08)",
                                borderRadius: "16px",
                            }}
                        >
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
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordTab;
