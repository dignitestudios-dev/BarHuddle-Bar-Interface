"use client";

import React, { useState } from "react";
import { SettingsTab } from "../types";
import { SettingsSidePanel } from "./SettingsSidePanel";
import { NotificationsTab } from "./NotificationsTab";
import { ChangePasswordTab } from "./ChangePasswordTab";
import { SubscriptionTab } from "./SubscriptionTab";
import { PrivacyPolicyTab } from "./PrivacyPolicyTab";
import { TermsConditionsTab } from "./TermsConditionsTab";
import { DeleteAccountTab } from "./DeleteAccountTab";

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("Notifications");

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
        <div className="w-full flex flex-col p-6 sm:p-8 font-['Manrope',sans-serif] min-h-screen">
            {/* Top Title Heading */}
            <h1 className="text-[28px] font-extrabold text-white tracking-tight mb-8">
                Settings
            </h1>

            {/* Layout Container with Side Panel on Left and Content on Right */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full">
                {/* Side Panel matching specified Figma CSS */}
                <SettingsSidePanel
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
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
