"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { AnalyticsPageHeader, DateFilterOption } from "./AnalyticsPageHeader";
import { AnalyticsTabs, AnalyticsTab } from "./AnalyticsTabs";
import { OverviewTab } from "./OverviewTab";
import { VisitorTab } from "./VisitorTab";
import { RetentionTab } from "./RetentionTab";
import { EventsTab } from "./EventsTab";
import { SentimentTab } from "./SentimentTab";
import { BoostTab } from "./BoostTab";
import { ReportsTab } from "./ReportsTab";
import { AnalyticsFilterParams } from "../api/analytics.service";

export function Analytics() {
    const [dateFilter, setDateFilter] = useState<DateFilterOption>("Weekly");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<AnalyticsTab>("Overview");

    const filterParams: AnalyticsFilterParams = useMemo(() => {
        if (dateFilter === "Custom" && startDate && endDate) {
            const startStr = format(startDate, "yyyy-MM-dd");
            const endStr = format(endDate, "yyyy-MM-dd");
            return {
                filter: "custom",
                startDate: startStr,
                endDate: endStr,
            };
        }
        return {
            filter: dateFilter.toLowerCase(),
        };
    }, [dateFilter, startDate, endDate]);



    const handleDateFilterChange = (
        filter: DateFilterOption,
        start?: Date,
        end?: Date
    ) => {
        setDateFilter(filter);
        setStartDate(start);
        setEndDate(end);
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case "Overview":
                return <OverviewTab filterParams={filterParams} />;
            case "Visitor":
                return <VisitorTab filterParams={filterParams} />;

            case "Retention":
                return <RetentionTab filterParams={filterParams} />;

            case "Events":
                return <EventsTab filterParams={filterParams} />;

            case "Sentiment":
                return <SentimentTab filterParams={filterParams} />;

            case "Boost":
                return <BoostTab filterParams={filterParams} />;

            case "Reports":
                return <ReportsTab />;
            default:
                return <OverviewTab filterParams={filterParams} />;
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 p-4 sm:p-6 font-['Manrope',sans-serif]">
            {/* Top Heading & Date Filter Group */}
            <AnalyticsPageHeader
                dateFilter={dateFilter}
                startDate={startDate}
                endDate={endDate}
                onDateFilterChange={handleDateFilterChange}
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
