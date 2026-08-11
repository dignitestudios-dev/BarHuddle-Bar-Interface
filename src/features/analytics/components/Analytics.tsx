"use client";

import React, { useState } from "react";
import { AnalyticsPageHeader, DateFilterOption } from "./AnalyticsPageHeader";
import { AnalyticsTabs, AnalyticsTab } from "./AnalyticsTabs";
import { OverviewTab } from "./OverviewTab";
import { VisitorTab } from "./VisitorTab";
import { RetentionTab } from "./RetentionTab";
import { EventsTab } from "./EventsTab";
import { SentimentTab } from "./SentimentTab";
import { BoostTab } from "./BoostTab";
import { ReportsTab } from "./ReportsTab";

export function Analytics() {
    const [dateFilter, setDateFilter] = useState<DateFilterOption>("Weekly");
    const [activeTab, setActiveTab] = useState<AnalyticsTab>("Overview");

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case "Overview":
                return <OverviewTab />;
            case "Visitor":
                return <VisitorTab />;
            case "Retention":
                return <RetentionTab />;
            case "Events":
                return <EventsTab />;
            case "Sentiment":
                return <SentimentTab />;
            case "Boost":
                return <BoostTab />;
            case "Reports":
                return <ReportsTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Heading & Date Filter Group */}
            <AnalyticsPageHeader
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
            />

            {/* Selection Tabs Row */}
            <AnalyticsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Active Tab View */}
            {renderActiveTabContent()}
        </div>
    );
}

export default Analytics;
