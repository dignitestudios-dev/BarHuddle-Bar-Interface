"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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

import { useSelectedVenue } from "@/hooks/useSelectedVenue";
import { useTierAccess } from "@/hooks/useTierAccess";
import { TierLockedGate } from "@/components/ui/TierLockedGate";

const VALID_TABS: Record<string, AnalyticsTab> = {
    overview: "Overview",
    visitor: "Visitor",
    visitors: "Visitor",
    retention: "Retention",
    events: "Events",
    sentiment: "Sentiment",
    boost: "Boost",
    reports: "Reports",
};

export function Analytics() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isFree } = useTierAccess();

    const { selectedVenueId } = useSelectedVenue();
    const [dateFilter, setDateFilter] = useState<DateFilterOption>("Weekly");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const rawTab = searchParams?.get("tab")?.toLowerCase() || "";
    const activeTab: AnalyticsTab = VALID_TABS[rawTab] || "Overview";

    const handleTabChange = (tab: AnalyticsTab) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("tab", tab.toLowerCase());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const filterParams: AnalyticsFilterParams = useMemo(() => {
        const base: AnalyticsFilterParams = {};
        if (selectedVenueId) {
            base.venueId = selectedVenueId;
        }

        if (dateFilter === "Custom" && startDate && endDate) {
            const startStr = format(startDate, "yyyy-MM-dd");
            const endStr = format(endDate, "yyyy-MM-dd");
            return {
                ...base,
                filter: "custom",
                startDate: startStr,
                endDate: endStr,
            };
        }
        return {
            ...base,
            filter: dateFilter.toLowerCase(),
        };
    }, [dateFilter, startDate, endDate, selectedVenueId]);



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

    if (isFree) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-4 sm:p-8 font-['Manrope',sans-serif] min-h-[70vh]">
                <TierLockedGate
                    requiredTier="premium"
                    title="Analytics is a Pro Feature"
                    description="Upgrade to Pro ($9.99/mo) or higher to unlock real-time visitor demographics, event attendance, sentiment intelligence, retention trends, boost ROI, and downloadable reports."
                    featureList={[
                        "Visitor Demographics (Age, Peak Hours, Gender Ratio)",
                        "Customer Retention & Repeat Visitor Tracking",
                        "Event Turnout & Attendance Analytics",
                        "Live Sentiment Poll Results & Intelligence",
                        "Boost Performance & ROI Tracking",
                        "Exportable Analytics & Automated Reports",
                    ]}
                />
            </div>
        );
    }

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
                onTabChange={handleTabChange}
            />

            {/* Active Tab View */}
            {renderActiveTabContent()}
        </div>
    );
}

export default Analytics;
