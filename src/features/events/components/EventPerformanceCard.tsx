"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetEventsQuery, useGetEventPerformanceQuery } from "@/features/events/api/events.queries";
import { Skeleton } from "@/components/ui/skeleton";

export interface EventPerformanceItem {
    id: number | string;
    title: string;
    date: string;
    attendees: number;
    engagement: number;
    imageSrc?: string;
}

export interface EventPerformanceCardProps {
    events?: EventPerformanceItem[];
    className?: string;
}

function EventPerformanceRow({ event }: { event: any }) {
    const eventId = String(event._id || event.id || "");
    const hasDirectData = event.attendees !== undefined || event.engagement !== undefined;
    const { data: perfResponse, isLoading: isPerfLoading } = useGetEventPerformanceQuery(eventId);

    const perf = perfResponse?.data || perfResponse || {};
    const attendees = event.attendees ?? perf.attendees ?? perf.uniqueVisitors ?? perf.totalAttendees ?? event.views ?? 0;
    const rawEngagement = event.engagement ?? perf.engagement ?? perf.performancePercent ?? perf.engagementRate ?? (perf.rate ? parseFloat(perf.rate) : 0);
    const engagement = Math.min(100, Math.max(0, Number(rawEngagement) || 0));
    const showLoading = isPerfLoading && !hasDirectData;

    const title = event.title || event.name || "Event";
    const dateStr = event.startAt || event.date
        ? new Date(event.startAt || event.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
          })
        : "Active Event";

    const imageSrc = event.coverImage || event.banner || event.image || event.images?.[0] || event.imageUrl;

    return (
        <div className="relative w-full min-h-[103px] p-2.5 bg-[rgba(10,6,45,0.6)] border border-[rgba(124,58,237,0.15)] rounded-[18px] flex items-center gap-3 transition-all hover:border-[rgba(124,58,237,0.35)]">
            {/* Event Thumbnail */}
            <div className="relative w-[100px] h-[87px] rounded-[12px] overflow-hidden shrink-0 bg-gradient-to-br from-[#1E0938] to-[#0B0633] flex items-center justify-center border border-[rgba(124,58,237,0.2)]">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0633] via-[#009706]/30 to-[#E8FF57]/20 opacity-80" />
                        <div className="relative z-10 text-center flex flex-col items-center">
                            <svg className="w-6 h-6 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                    </>
                )}
            </div>

            {/* Event Info & Engagement Progress */}
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0 pr-2">
                {/* Top Title & Date Row */}
                <div className="flex flex-col">
                    <h4 className="font-extrabold text-[16px] leading-[22px] text-white capitalize truncate">
                        {title}
                    </h4>
                    <span className="font-normal text-[11px] leading-[18px] text-[#E8C7FF] capitalize">
                        {dateStr}
                    </span>
                </div>

                {/* Bottom Attendees & Engagement Progress Row */}
                <div className="flex items-end justify-between gap-4 mt-2">
                    {/* Attendees Count */}
                    <div className="flex flex-col">
                        {showLoading ? (
                            <Skeleton className="h-5 w-12 rounded bg-purple-900/40" />
                        ) : (
                            <span className="font-extrabold text-[16px] leading-[20px] text-white">
                                {Number(attendees).toLocaleString()}
                            </span>
                        )}
                        <span className="font-normal text-[11px] leading-[16px] text-[#E8C7FF] capitalize">
                            Attendees
                        </span>
                    </div>

                    {/* Engagement Bar */}
                    <div className="flex-1 flex flex-col gap-1 max-w-[260px]">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="font-normal text-[#E8C7FF]">Engagement</span>
                            {showLoading ? (
                                <Skeleton className="h-3 w-8 rounded bg-purple-900/40" />
                            ) : (
                                <span className="font-bold text-[#FDF88F]">{Math.round(engagement)}%</span>
                            )}
                        </div>
                        <div className="w-full h-[6px] bg-[#0B083C] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#C27AFF] to-[#FDF88F] transition-all duration-500"
                                style={{ width: `${Math.round(engagement)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function EventPerformanceCard({
    events,
    className = "",
}: EventPerformanceCardProps) {
    const router = useRouter();
    const { data: apiEventsData, isLoading } = useGetEventsQuery();

    const eventsList = React.useMemo(() => {
        if (events) return events;
        const raw = Array.isArray(apiEventsData?.data)
            ? apiEventsData.data
            : Array.isArray(apiEventsData?.data?.events)
                ? apiEventsData.data.events
                : Array.isArray(apiEventsData)
                    ? apiEventsData
                    : [];
        return raw;
    }, [events, apiEventsData]);

    return (
        <div
            className={`relative w-full max-w-[598px] h-[496px] p-6 flex flex-col justify-between bg-[#0E093C]/75 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0px_4px_24px_rgba(0,0,0,0.4),inset_0px_1px_0px_rgba(255,255,255,0.06)] rounded-[24px] overflow-hidden select-none font-['Manrope',sans-serif] ${className}`}
        >
            {/* Background Glow Orb */}
            <div className="absolute right-[-20px] bottom-[-20px] w-[200px] h-[120px] bg-[radial-gradient(58.31%_97.18%_at_50%_50%,rgba(232,255,87,0.3)_0%,rgba(0,0,0,0)_70%)] opacity-[0.1] rounded-full pointer-events-none z-0" />

            {/* Header Row: Title & View All Button */}
            <div className="flex items-center justify-between w-full relative z-10 mb-4">
                {/* Left Title & Tag */}
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C27AFF] shrink-0">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-extrabold text-[10px] leading-[15px] tracking-[1.4px] text-[#8B7EC8] uppercase">
                            Events
                        </span>
                    </div>

                    <h3 className="font-extrabold text-[16px] leading-[24px] text-white">
                        Event Performance
                    </h3>
                </div>

                {/* Right View All Button */}
                <button
                    type="button"
                    onClick={() => router.push("/app/events")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(232,255,87,0.03)] border border-[rgba(232,255,87,0.157)] text-[#E8FF57] font-bold text-[11px] hover:bg-[rgba(232,255,87,0.1)] transition-all cursor-pointer"
                >
                    <span>View All</span>
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Event Cards Scrollable List */}
            <div className="flex-1 w-full flex flex-col gap-3 overflow-y-auto pr-1 relative z-10 custom-scrollbar">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-full h-[103px] p-2.5 rounded-[18px] bg-[rgba(10,6,45,0.4)] border border-[rgba(124,58,237,0.15)] flex items-center gap-3">
                            <Skeleton className="w-[100px] h-[87px] rounded-[12px] bg-purple-900/30" />
                            <div className="flex-1 flex flex-col gap-2">
                                <Skeleton className="w-1/2 h-4 rounded bg-purple-900/30" />
                                <Skeleton className="w-1/4 h-3 rounded bg-purple-900/30" />
                                <Skeleton className="w-3/4 h-4 rounded bg-purple-900/30 mt-2" />
                            </div>
                        </div>
                    ))
                ) : eventsList.length === 0 ? (
                    <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center gap-2 text-center p-6 border border-dashed border-[rgba(124,58,237,0.2)] rounded-[18px] bg-[rgba(10,6,45,0.4)]">
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 mb-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-white/70">No event performance data available</span>
                        <span className="text-xs text-[#9D8FD0]">Events created will show performance metrics here.</span>
                    </div>
                ) : (
                    eventsList.map((event: any, idx: number) => (
                        <EventPerformanceRow
                            key={event._id || event.id || idx}
                            event={event}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default EventPerformanceCard;
