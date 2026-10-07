"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SettingsTab } from "../types";
import { SettingsSidePanel } from "./SettingsSidePanel";
import { NotificationsTab } from "./NotificationsTab";
import { ChangePasswordTab } from "./ChangePasswordTab";
import { SubscriptionTab } from "./SubscriptionTab";
import { PrivacyPolicyTab } from "./PrivacyPolicyTab";
import { TermsConditionsTab } from "./TermsConditionsTab";
import { DeleteAccountTab } from "./DeleteAccountTab";

const TAB_PARAM_MAP: Record<string, SettingsTab> = {
    notifications: "Notifications",
    notification: "Notifications",
    "change-password": "Change Password",
    change_password: "Change Password",
    password: "Change Password",
    subscription: "Subscription",
    subscriptions: "Subscription",
    plan: "Subscription",
    plans: "Subscription",
    "privacy-policy": "Privacy Policy",
    privacy: "Privacy Policy",
    "terms-conditions": "Terms & Conditions",
    terms: "Terms & Conditions",
    "terms-and-conditions": "Terms & Conditions",
    "delete-account": "Delete Account",
    delete: "Delete Account",
};

const TAB_TO_PARAM: Record<SettingsTab, string> = {
    Notifications: "notifications",
    "Change Password": "change-password",
    Subscription: "subscription",
    "Privacy Policy": "privacy-policy",
    "Terms & Conditions": "terms-conditions",
    "Delete Account": "delete-account",
};

export function SettingsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabParam = (searchParams?.get("tab") || "").toLowerCase().trim();

    const activeTab: SettingsTab = useMemo(() => {
        if (tabParam && TAB_PARAM_MAP[tabParam]) {
            return TAB_PARAM_MAP[tabParam];
        }
        return "Notifications";
    }, [tabParam]);

    const handleTabChange = (newTab: SettingsTab) => {
        const paramValue = TAB_TO_PARAM[newTab] || "notifications";
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("tab", paramValue);
        router.push(`${pathname}?${params.toString()}`);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "Notifications":
                return <NotificationsTab />;
            case "Change Password":
                return <ChangePasswordTab />;
            case "Subscription":
                return <SubscriptionTab />;
            case "Privacy Policy":
                return <PrivacyPolicyTab />;
            case "Terms & Conditions":
                return <TermsConditionsTab />;
            case "Delete Account":
                return <DeleteAccountTab />;
            default:
                return <NotificationsTab />;
        }
    };

    return (
        <div className="w-full flex flex-col p-4 sm:p-6 md:p-8 font-['Manrope',sans-serif] min-h-screen">
            {/* Top Title Heading */}
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-white tracking-tight mb-4 sm:mb-6 md:mb-8">
                Settings
            </h1>

            {/* Layout Container with Side Panel on Left and Content on Right */}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-start w-full">
                {/* Side Panel matching specified Figma CSS */}
                <SettingsSidePanel
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {/* Main Content Panel */}
                <div className="flex-1 min-w-0 w-full">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;

