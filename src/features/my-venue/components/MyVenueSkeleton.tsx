import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MyVenueSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`w-full max-w-[1200px] mx-auto flex flex-col gap-8 font-['Manrope',sans-serif] pb-24 animate-in fade-in duration-300 ${className}`}>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED] opacity-[0.15] blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E8FF57] opacity-[0.05] blur-[120px] pointer-events-none" />

            {/* Top Page Header & Controls Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-2.5 h-2.5 rounded-full bg-[#E8FF57]/40 border-none" />
                        <Skeleton className="h-3.5 w-36 rounded-full bg-[#E8FF57]/15 border border-[#E8FF57]/20" />
                    </div>
                    <Skeleton className="h-9 sm:h-11 w-64 sm:w-80 rounded-2xl bg-purple-900/30" />
                    <Skeleton className="h-4 w-72 sm:w-96 rounded-lg bg-purple-900/20" />
                </div>

                {/* Header Actions Skeletons */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <Skeleton className="h-10 w-44 rounded-xl bg-purple-900/30" />
                    <Skeleton className="h-10 w-28 rounded-xl bg-purple-900/30" />
                </div>
            </div>

            {/* Hero Banner Card Skeleton */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-[28px] overflow-hidden bg-[#140E50]/70 border border-[rgba(124,58,237,0.3)] shadow-[0px_16px_48px_rgba(0,0,0,0.5)]">
                {/* Background shimmer */}
                <Skeleton className="w-full h-full rounded-none bg-gradient-to-br from-[#2E1065]/40 via-[#1E0B36]/50 to-[#0A0524]/60 border-none" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080318] via-[#080318]/50 to-transparent pointer-events-none" />

                {/* Badges Top Right */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Skeleton className="h-6 w-32 rounded-full bg-emerald-500/15 border border-emerald-500/25" />
                    <Skeleton className="h-6 w-36 rounded-full bg-white/10 border border-white/15 hidden sm:block" />
                </div>

                {/* Information Overlay Bottom Left */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2.5 max-w-2xl w-full">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-16 rounded-full bg-[#7C3AED]/35 border border-[#7C3AED]/40" />
                            <Skeleton className="h-5 w-14 rounded-full bg-amber-400/20 border border-amber-400/30" />
                            <Skeleton className="h-4 w-32 rounded-md bg-purple-900/30 hidden md:block" />
                        </div>

                        <Skeleton className="h-8 sm:h-10 w-3/4 sm:w-96 rounded-xl bg-white/20" />
                        <Skeleton className="h-4 w-60 sm:w-80 rounded-md bg-white/15" />
                    </div>

                    {/* Quick Stats Pill Skeleton */}
                    <div className="flex items-center gap-4 bg-[#0E0528]/80 backdrop-blur-md p-3 rounded-2xl border border-[rgba(124,58,237,0.3)] self-start sm:self-auto shrink-0">
                        <div className="flex flex-col items-center gap-1.5 px-3 border-r border-white/10">
                            <Skeleton className="h-2.5 w-10 rounded bg-purple-900/40" />
                            <Skeleton className="h-5 w-6 rounded bg-white/20" />
                        </div>
                        <div className="flex flex-col items-center gap-1.5 px-3">
                            <Skeleton className="h-2.5 w-10 rounded bg-purple-900/40" />
                            <Skeleton className="h-5 w-14 rounded bg-[#E8FF57]/30" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs Skeleton */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0E0528]/80 border border-[rgba(124,58,237,0.25)] max-w-md">
                <Skeleton className="h-9 flex-1 rounded-xl bg-purple-900/40" />
                <Skeleton className="h-9 flex-1 rounded-xl bg-purple-900/20" />
                <Skeleton className="h-9 flex-1 rounded-xl bg-purple-900/20" />
            </div>

            {/* Content Details Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card (lg:col-span-2): Establishment Profile */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div
                        className="rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-md border border-[rgba(124,58,237,0.25)] shadow-xl"
                        style={{ background: "rgba(14, 7, 34, 0.85)" }}
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-[rgba(124,58,237,0.2)]">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-2.5 h-2.5 rounded-full bg-[#A855F7]/40" />
                                <Skeleton className="h-5 w-44 rounded-lg bg-purple-900/40" />
                            </div>
                            <Skeleton className="h-4 w-16 rounded-md bg-[#E8FF57]/20" />
                        </div>

                        {/* 4 Attributes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#140E50]/60 border border-[rgba(124,58,237,0.2)]"
                                >
                                    <Skeleton className="h-2.5 w-16 rounded bg-purple-900/40" />
                                    <Skeleton className="h-5 w-32 rounded-md bg-white/15" />
                                </div>
                            ))}
                        </div>

                        {/* Address Box */}
                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#140E50]/60 border border-[rgba(124,58,237,0.2)]">
                            <Skeleton className="h-2.5 w-24 rounded bg-purple-900/40" />
                            <Skeleton className="h-4 w-full rounded-md bg-white/15" />
                            <Skeleton className="h-4 w-2/3 rounded-md bg-white/15" />
                        </div>
                    </div>
                </div>

                {/* Right Card: Quick Actions */}
                <div className="flex flex-col gap-6">
                    <div
                        className="rounded-[24px] p-6 flex flex-col gap-4 backdrop-blur-md border border-[rgba(124,58,237,0.25)] shadow-xl"
                        style={{ background: "rgba(14, 7, 34, 0.85)" }}
                    >
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="w-8 h-8 rounded-lg bg-purple-900/40 border border-[#7C3AED]/40" />
                            <div className="flex flex-col gap-1 flex-1">
                                <Skeleton className="h-4 w-28 rounded-md bg-white/20" />
                                <Skeleton className="h-3 w-40 rounded-md bg-purple-900/30" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Skeleton className="w-4 h-4 rounded-full bg-purple-900/40" />
                                        <Skeleton className="h-3.5 w-36 rounded-md bg-white/15" />
                                    </div>
                                    <Skeleton className="w-3 h-3 rounded bg-purple-900/30" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyVenueSkeleton;
