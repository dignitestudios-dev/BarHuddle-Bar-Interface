"use client";

import React from "react";
import { SettingsTab } from "../types";

interface SettingsSidePanelProps {
    activeTab: SettingsTab;
    onTabChange: (tab: SettingsTab) => void;
}

export function SettingsSidePanel({ activeTab, onTabChange }: SettingsSidePanelProps) {
    return (
        <aside
            className="box-border flex flex-col items-start p-[20px] isolate w-[220px] shrink-0 z-[9] font-['Manrope',sans-serif] select-none"
            style={{
                minHeight: "750px",
                background: "rgba(173, 70, 255, 0.06)",
                borderRight: "0.8px solid rgba(124, 58, 237, 0.7)",
                borderRadius: "24px 24px 0px 0px",
            }}
        >
            {/* Paragraph / SETTINGS MENU Header */}
            <div className="flex flex-col items-start px-[12px] py-0 w-[179.2px] h-[14px] mb-[12px]">
                <span
                    className="font-extrabold text-[9px] leading-[14px] uppercase tracking-[0.9px]"
                    style={{ color: "#8B7EC8" }}
                >
                    SETTINGS MENU
                </span>
            </div>

            {/* Frame 2147227824 - Menu List */}
            <div className="flex flex-col items-start p-0 gap-[4px] w-[179.2px]">
                {/* 1. Notifications */}
                <button
                    type="button"
                    onClick={() => onTabChange("Notifications")}
                    className={`box-border flex flex-row items-center px-[12px] py-[10px] gap-[12px] w-[179.2px] h-[39.6px] rounded-[13px] transition-all cursor-pointer text-left ${
                        activeTab === "Notifications"
                            ? "bg-[rgba(124,58,237,0.18)] border border-[rgba(124,58,237,0.28)]"
                            : "hover:bg-[rgba(124,58,237,0.1)] border border-transparent"
                    }`}
                >
                    {/* Icon */}
                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                        <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M7 12.25C7.64433 12.25 8.16667 11.7277 8.16667 11.0833H5.83333C5.83333 11.7277 6.35567 12.25 7 12.25ZM10.5 8.75V5.83333C10.5 4.0425 9.54333 2.5375 7.875 2.14083V1.75C7.875 1.26583 7.48417 0.875 7 0.875C6.51583 0.875 6.125 1.26583 6.125 1.75V2.14083C4.45667 2.5375 3.5 4.03667 3.5 5.83333V8.75L2.33333 9.91667V10.5H11.6667V9.91667L10.5 8.75Z"
                                stroke={activeTab === "Notifications" ? "#E8FF57" : "rgba(124, 58, 237, 0.5)"}
                                strokeWidth="1.16667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <span
                        className="font-semibold text-[12px] leading-[18px] flex-grow truncate"
                        style={{
                            color: activeTab === "Notifications" ? "#E8FF57" : "#8B7EC8",
                        }}
                    >
                        Notifications
                    </span>

                    {/* Icon:align (Right Chevron for Active tab) */}
                    {activeTab === "Notifications" && (
                        <div className="flex flex-row justify-end items-center shrink-0 w-[12px] h-[12px]">
                            <svg className="w-[12px] h-[12px]" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M4.5 9L7.5 6L4.5 3"
                                    stroke="#E8FF57"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </button>

                {/* 2. Change Password */}
                <button
                    type="button"
                    onClick={() => onTabChange("Change Password")}
                    className={`box-border flex flex-row items-center px-[12px] py-[10px] gap-[12px] w-[179.2px] h-[39.6px] rounded-[13px] transition-all cursor-pointer text-left ${
                        activeTab === "Change Password"
                            ? "bg-[rgba(124,58,237,0.18)] border border-[rgba(124,58,237,0.28)]"
                            : "hover:bg-[rgba(124,58,237,0.1)] border border-transparent"
                    }`}
                >
                    {/* Icon */}
                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                        <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                            <rect
                                x="2"
                                y="6"
                                width="10"
                                height="6.5"
                                rx="1.5"
                                stroke={activeTab === "Change Password" ? "#E8FF57" : "rgba(124, 58, 237, 0.5)"}
                                strokeWidth="1.16667"
                            />
                            <path
                                d="M4.5 6V4C4.5 2.61929 5.61929 1.5 7 1.5C8.38071 1.5 9.5 2.61929 9.5 4V6"
                                stroke={activeTab === "Change Password" ? "#E8FF57" : "rgba(124, 58, 237, 0.5)"}
                                strokeWidth="1.16667"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <span
                        className="font-semibold text-[12px] leading-[18px] flex-grow truncate"
                        style={{
                            color: activeTab === "Change Password" ? "#E8FF57" : "#8B7EC8",
                        }}
                    >
                        Change Password
                    </span>

                    {/* Active chevron */}
                    {activeTab === "Change Password" && (
                        <div className="flex flex-row justify-end items-center shrink-0 w-[12px] h-[12px]">
                            <svg className="w-[12px] h-[12px]" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M4.5 9L7.5 6L4.5 3"
                                    stroke="#E8FF57"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </button>

                {/* 3. Subscription */}
                <button
                    type="button"
                    onClick={() => onTabChange("Subscription")}
                    className={`box-border flex flex-row items-center px-[12px] py-[10px] gap-[12px] w-[179.2px] h-[39.6px] rounded-[13px] transition-all cursor-pointer text-left ${
                        activeTab === "Subscription"
                            ? "bg-[rgba(124,58,237,0.18)] border border-[rgba(124,58,237,0.28)]"
                            : "hover:bg-[rgba(124,58,237,0.1)] border border-transparent"
                    }`}
                >
                    {/* Icon */}
                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                        <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                            <rect
                                x="1.5"
                                y="3"
                                width="11"
                                height="8"
                                rx="1.5"
                                stroke={activeTab === "Subscription" ? "#E8FF57" : "rgba(124, 58, 237, 0.5)"}
                                strokeWidth="1.16667"
                            />
                            <path
                                d="M1.5 5.5H12.5"
                                stroke={activeTab === "Subscription" ? "#E8FF57" : "rgba(124, 58, 237, 0.5)"}
                                strokeWidth="1.16667"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <span
                        className="font-semibold text-[12px] leading-[18px] flex-grow truncate"
                        style={{
                            color: activeTab === "Subscription" ? "#E8FF57" : "#8B7EC8",
                        }}
                    >
                        Subscription
                    </span>

                    {/* Active chevron */}
                    {activeTab === "Subscription" && (
                        <div className="flex flex-row justify-end items-center shrink-0 w-[12px] h-[12px]">
                            <svg className="w-[12px] h-[12px]" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M4.5 9L7.5 6L4.5 3"
                                    stroke="#E8FF57"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </button>

                {/* 4. Privacy Policy */}
                <button
                    type="button"
                    onClick={() => onTabChange("Privacy Policy")}
                    className={`box-border flex flex-row items-center px-[12px] py-[10px] gap-[12px] w-[179.2px] h-[39.6px] rounded-[13px] transition-all cursor-pointer text-left ${
                        activeTab === "Privacy Policy"
                            ? "bg-[rgba(124,58,237,0.18)] border border-[rgba(124,58,237,0.28)]"
                            : "hover:bg-[rgba(124,58,237,0.1)] border border-transparent"
                    }`}
                >
                    {/* Icon */}
                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                        <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M7 1.75L2.33333 3.5V6.41667C2.33333 9.42083 4.3225 12.1975 7 12.8333C9.6775 12.1975 11.6667 9.42083 11.6667 6.41667V3.5L7 1.75Z"
                                stroke={activeTab === "Privacy Policy" ? "#E8FF57" : "rgba(124, 58, 237, 0.5)"}
                                strokeWidth="1.16667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <span
                        className="font-semibold text-[12px] leading-[18px] flex-grow truncate"
                        style={{
                            color: activeTab === "Privacy Policy" ? "#E8FF57" : "#8B7EC8",
                        }}
                    >
                        Privacy Policy
                    </span>

                    {/* Active chevron */}
                    {activeTab === "Privacy Policy" && (
                        <div className="flex flex-row justify-end items-center shrink-0 w-[12px] h-[12px]">
                            <svg className="w-[12px] h-[12px]" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M4.5 9L7.5 6L4.5 3"
                                    stroke="#E8FF57"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </button>

                {/* 5. Terms & Conditions */}
                <button
                    type="button"
                    onClick={() => onTabChange("Terms & Conditions")}
                    className={`box-border flex flex-row items-center px-[12px] py-[10px] gap-[12px] w-[179.2px] h-[39.6px] rounded-[13px] transition-all cursor-pointer text-left ${
                        activeTab === "Terms & Conditions"
                            ? "bg-[rgba(124,58,237,0.18)] border border-[rgba(124,58,237,0.28)]"
                            : "hover:bg-[rgba(124,58,237,0.1)] border border-transparent"
                    }`}
                >
                    {/* Icon */}
                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                        <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M3.5 1.75H8.75L11.6667 4.66667V12.25H3.5V1.75Z"
                                stroke={
                                    activeTab === "Terms & Conditions"
                                        ? "#E8FF57"
                                        : "rgba(124, 58, 237, 0.5)"
                                }
                                strokeWidth="1.16667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8.75 1.75V4.66667H11.6667"
                                stroke={
                                    activeTab === "Terms & Conditions"
                                        ? "#E8FF57"
                                        : "rgba(124, 58, 237, 0.5)"
                                }
                                strokeWidth="1.16667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5.25 7H8.75M5.25 9.33333H8.75"
                                stroke={
                                    activeTab === "Terms & Conditions"
                                        ? "#E8FF57"
                                        : "rgba(124, 58, 237, 0.5)"
                                }
                                strokeWidth="1.16667"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <span
                        className="font-semibold text-[12px] leading-[18px] flex-grow truncate"
                        style={{
                            color: activeTab === "Terms & Conditions" ? "#E8FF57" : "#8B7EC8",
                        }}
                    >
                        Terms & Conditions
                    </span>

                    {/* Active chevron */}
                    {activeTab === "Terms & Conditions" && (
                        <div className="flex flex-row justify-end items-center shrink-0 w-[12px] h-[12px]">
                            <svg className="w-[12px] h-[12px]" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M4.5 9L7.5 6L4.5 3"
                                    stroke="#E8FF57"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </button>

                {/* 6. Delete Account */}
                <button
                    type="button"
                    onClick={() => onTabChange("Delete Account")}
                    className={`box-border flex flex-row items-center px-[12px] py-[10px] gap-[12px] w-[179.2px] h-[39.6px] rounded-[13px] transition-all cursor-pointer text-left ${
                        activeTab === "Delete Account"
                            ? "bg-[rgba(124,58,237,0.18)] border border-[rgba(124,58,237,0.28)]"
                            : "hover:bg-[rgba(124,58,237,0.1)] border border-transparent"
                    }`}
                >
                    {/* Icon */}
                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                        <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M2.33333 3.5H11.6667M5.25 3.5V2.33333C5.25 1.8731 5.6231 1.5 6.08333 1.5H7.91667C8.3769 1.5 8.75 1.8731 8.75 2.33333V3.5M10.5 3.5V11.6667C10.5 12.1269 10.1269 12.5 9.66667 12.5H4.33333C3.8731 12.5 3.5 12.1269 3.5 11.6667V3.5"
                                stroke={activeTab === "Delete Account" ? "#E8FF57" : "rgba(124, 58, 237, 0.5)"}
                                strokeWidth="1.16667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <span
                        className="font-semibold text-[12px] leading-[18px] flex-grow truncate"
                        style={{
                            color: activeTab === "Delete Account" ? "#E8FF57" : "#8B7EC8",
                        }}
                    >
                        Delete Account
                    </span>

                    {/* Active chevron */}
                    {activeTab === "Delete Account" && (
                        <div className="flex flex-row justify-end items-center shrink-0 w-[12px] h-[12px]">
                            <svg className="w-[12px] h-[12px]" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M4.5 9L7.5 6L4.5 3"
                                    stroke="#E8FF57"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}

export default SettingsSidePanel;
