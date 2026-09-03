"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { EventAnalyticsCard, EventTagConfig } from "./EventAnalyticsCard";
import { EventAttendanceTrendChart, AttendanceDataPoint } from "@/components/charts/EventAttendanceTrendChart";
import { TopPerformingEventsCard, RankedEventItem } from "@/components/charts/TopPerformingEventsCard";
import { TrafficByTimeChart, TimeSlotData } from "@/components/charts/TrafficByTimeChart";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetEventsOverviewQuery,
    useGetEventsAttendanceQuery,
    useGetBestPerformingEventsQuery,
    useGetTimeOfDayGraphQuery,
} from "../api/analytics.queries";
import { AnalyticsFilterParams } from "../api/analytics.service";
import { cleanImageUrl } from "@/utils/image";

const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80";

export interface EventItemData {
    id: string;
    title: string;
    date: string;
    image: string;
    tag: EventTagConfig;
    attendees: number;
    engagement: number;
}

export interface EventsTabProps {
    filterParams?: AnalyticsFilterParams;
}

export function EventsTab({ filterParams }: EventsTabProps) {
    const { data: eventsOverviewResponse, isLoading: isLoadingOverview } =
        useGetEventsOverviewQuery(filterParams);
    const { data: eventsAttendanceResponse, isLoading: isLoadingAttendance } =
        useGetEventsAttendanceQuery(filterParams);
    const { data: bestPerformingResponse, isLoading: isLoadingBestPerforming } =
        useGetBestPerformingEventsQuery(filterParams);
    const { data: timeOfDayResponse, isLoading: isLoadingTimeOfDay } =
        useGetTimeOfDayGraphQuery(filterParams);

    const isLoading =
        isLoadingOverview ||
        isLoadingAttendance ||
        isLoadingBestPerforming ||
        isLoadingTimeOfDay;

    const overviewData = eventsOverviewResponse?.data;
    const bestEventsData = bestPerformingResponse?.data;

    // Map top performance cards from best-performing events
    const eventsList: EventItemData[] = useMemo(() => {
        if (!bestEventsData || !Array.isArray(bestEventsData) || bestEventsData.length === 0) {
            return [];
        }

        return bestEventsData.map((item: any, idx: number) => {
            const rawDate = item.date || item.startAt;
            const isUpcoming = rawDate ? new Date(rawDate) > new Date() : false;

            let tagConfig: EventTagConfig = { label: "Top", icon: "⭐", variant: "top" };
            if (isUpcoming) {
                tagConfig = { label: "Upcoming", variant: "upcoming" };
            } else if (item.engagement >= 50) {
                tagConfig = { label: "Top", icon: "⭐", variant: "top" };
            } else if (item.attendees > 0) {
                tagConfig = { label: "Growing", variant: "growing" };
            }

            return {
                id: item._id || item.id || `evt-${idx}`,
                title: item.title || "Event",
                date: rawDate
                    ? format(new Date(rawDate), "MMM dd")
                    : "TBD",
                image: cleanImageUrl(item.banner || item.image, DEFAULT_EVENT_IMAGE),
                tag: tagConfig,
                attendees: item.attendees ?? 0,
                engagement: item.engagement ?? 0,
            };
        });
    }, [bestEventsData]);

    // Map ranked events for the right sidebar card
    const rankedList: RankedEventItem[] = useMemo(() => {
        if (!bestEventsData || !Array.isArray(bestEventsData) || bestEventsData.length === 0) {
            return [];
        }

        return bestEventsData.map((item: any, idx: number) => ({
            id: item._id || item.id || `rank-${idx}`,
            title: item.title || "Event",
            attendees: `${item.attendees ?? 0} attendees`,
            engagement: item.engagement ?? 0,
            image: cleanImageUrl(item.banner || item.image, DEFAULT_EVENT_IMAGE),
        }));
    }, [bestEventsData]);

    // Attendance Trend mapping from GET /analytics/events/attendance
    const attendanceTrendData: AttendanceDataPoint[] | undefined = useMemo(() => {
        const raw = eventsAttendanceResponse?.data;
        if (!raw || !Array.isArray(raw) || raw.length === 0) {
            return undefined;
        }

        return raw.map((item) => {
            let label = "Day";
            try {
                const d = new Date(item.date);
                if (!isNaN(d.getTime())) {
                    label = format(d, "MMM dd");
                }
            } catch {
                label = item.date;
            }

            return {
                name: label,
                attendance: item.attendance ?? 0,
            };
        });
    }, [eventsAttendanceResponse]);

    // Time of Day mapping from GET /analytics/overview/time-of-day-graph
    const timeSlotsData: TimeSlotData[] = useMemo(() => {
        const t = timeOfDayResponse?.data;
        const morningVal = t?.morning ?? 0;
        const afternoonVal = t?.afternoon ?? 0;
        const eveningVal = t?.evening ?? 0;
        const lateNightVal = t?.latenight ?? t?.lateNight ?? 0;

        return [
            {
                id: "morning",
                label: "Morning",
                value: morningVal,
                color: "#22D3EE",
                glowColor: "rgba(34, 211, 238, 0.4)",
            },
            {
                id: "afternoon",
                label: "Afternoon",
                value: afternoonVal,
                color: "#A855F7",
                glowColor: "rgba(168, 85, 247, 0.4)",
            },
            {
                id: "evening",
                label: "Evening",
                value: eveningVal,
                color: "#7C3AED",
                glowColor: "rgba(124, 58, 237, 0.4)",
            },
            {
                id: "late-night",
                label: "Late Night",
                value: lateNightVal,
                color: "#E8FF57",
                glowColor: "rgba(232, 255, 87, 0.4)",
            },
        ];
    }, [timeOfDayResponse]);

    // Summary Stat Cards
    const summaryCards = [
        {
            id: "total_events",
            label: "Total Events",
            value: String(overviewData?.totalEvents ?? 0),
            iconColor: "text-[#9F4FFA]",
            iconBgShadow: "shadow-[0px_0px_12px_rgba(159,79,250,0.2)]",
        },
        {
            id: "upcoming_events",
            label: "Upcoming Events",
            value: String(overviewData?.upcomingEvents ?? 0),
            iconColor: "text-[#22D3EE]",
            iconBgShadow: "shadow-[0px_0px_12px_rgba(34,211,238,0.2)]",
        },
        {
            id: "past_events",
            label: "Past Events",
            value: String(overviewData?.pastEvents ?? 0),
            iconColor: "text-[#C4B5FD]",
            iconBgShadow: "shadow-[0px_0px_12px_rgba(196,181,253,0.2)]",
        },
        {
            id: "boosted_events",
            label: "Boosted Events",
            value: String(overviewData?.boostedEvents ?? 0),
            iconColor: "text-[#E8FF57]",
            iconBgShadow: "shadow-[0px_0px_12px_rgba(232,255,87,0.2)]",
        },
    ];

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
                <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-[80px] rounded-[24px]" />
                    ))}
                </div>
                <div className="w-full max-w-[1200px] flex gap-4 overflow-x-auto pb-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="w-[240px] h-[222px] rounded-[18px] shrink-0" />
                    ))}
                </div>
                <div className="max-w-[1200px] w-full flex flex-col lg:flex-row gap-6 items-stretch">
                    <Skeleton className="h-[380px] flex-1 w-full rounded-[24px]" />
                    <Skeleton className="h-[380px] w-full lg:w-[340px] rounded-[24px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Stat Cards Row */}
            <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {summaryCards.map((card) => (
                    <div
                        key={card.id}
                        className="w-full h-[80px] rounded-[24px] bg-gradient-to-br from-[rgba(124,58,237,0.35)] via-[rgba(79,20,150,0.2)] to-[rgba(5,3,58,0.1)] border border-[rgba(124,58,237,0.3)] shadow-[0px_0px_60px_rgba(124,58,237,0.15)] px-4 flex items-center gap-3.5"
                    >
                        {/* Icon Box */}
                        <div className={`w-[48px] h-[48px] rounded-[10px] bg-[rgba(124,58,237,0.082)] border border-[rgba(124,58,237,0.157)] flex items-center justify-center shrink-0 ${card.iconBgShadow}`}>
                            <svg className={`w-5 h-5 ${card.iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>

                        {/* Text Container */}
                        <div className="flex flex-col">
                            <span className="font-extrabold text-[20px] leading-[22px] text-white">
                                {card.value}
                            </span>
                            <span className="font-normal text-[11px] leading-[16px] text-[#8B7EC8] mt-1">
                                {card.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Event Analytics Cards Carousel Row - only show when events exist */}
            {eventsList.length > 0 && (
                <div className="w-full max-w-[1200px]">
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2">
                        {eventsList.map((event) => (
                            <EventAnalyticsCard
                                key={event.id}
                                title={event.title}
                                date={event.date}
                                image={event.image}
                                tag={event.tag}
                                attendees={event.attendees}
                                engagement={event.engagement}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Lower Charts Row: Attendance Trend & Top Performing Events */}
            <div className="max-w-[1200px] w-full flex flex-col lg:flex-row gap-6 items-stretch">
                <EventAttendanceTrendChart
                    data={attendanceTrendData}
                    className="flex-1 max-w-full"
                />
                {rankedList.length > 0 && (
                    <TopPerformingEventsCard
                        items={rankedList}
                        className="w-full lg:w-[320px] xl:w-[340px] shrink-0"
                    />
                )}
            </div>

            {/* Traffic By Time Chart */}
            <div className="max-w-[1200px] w-full flex flex-col xl:flex-row gap-6 items-stretch">
                <TrafficByTimeChart
                    slots={timeSlotsData}
                    className="flex-1 max-w-full"
                />
            </div>
        </div>
    );
}

export default EventsTab;
