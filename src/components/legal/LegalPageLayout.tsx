"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export interface LegalSection {
    title: string;
    content: string;
}

interface LegalPageLayoutProps {
    activeTab: "terms" | "privacy";
    title: string;
    subtitle: string;
    lastUpdated?: string;
    sections: LegalSection[];
}

export function LegalPageLayout({
    activeTab,
    title,
    subtitle,
    lastUpdated = "September 2026",
    sections,
}: LegalPageLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push("/auth/register");
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#080318] text-white flex flex-col font-['Manrope',sans-serif] selection:bg-[#7C3AED]/40 selection:text-white">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.18)_0%,rgba(0,0,0,0)_70%)] blur-3xl" />
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,rgba(0,0,0,0)_70%)] blur-3xl" />
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(232,255,87,0.08)_0%,rgba(0,0,0,0)_70%)] blur-3xl" />
            </div>

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080318]/80 border-b border-[rgba(124,58,237,0.2)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#E8FF57] p-[1.5px] transition-transform duration-200 group-hover:scale-105">
                            <div className="w-full h-full bg-[#0E093C] rounded-[10px] flex items-center justify-center overflow-hidden">
                                <span className="font-extrabold text-[15px] tracking-tight text-white">BH</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base sm:text-lg tracking-tight text-white leading-tight">
                                BarHuddle
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-[#A855F7] font-semibold">
                                Owner Portal
                            </span>
                        </div>
                    </Link>

                    {/* Back Action */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#C4B5FD] bg-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.25)] border border-[rgba(124,58,237,0.3)] transition-all duration-150 active:scale-95"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
                {/* Header Title Section */}
                <div className="flex flex-col gap-4 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 self-center sm:self-start px-3 py-1 rounded-full bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)]">
                        <span className="w-2 h-2 rounded-full bg-[#E8FF57] animate-pulse" />
                        <span className="text-[11px] font-bold tracking-wider uppercase text-[#E8FF57]">
                            Legal & Compliance
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        {title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#8B7EC8]">
                        <p>{subtitle}</p>
                        <span className="shrink-0 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px]">
                            Last Updated: {lastUpdated}
                        </span>
                    </div>
                </div>

                {/* Tab Switcher: Terms vs Privacy */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0E0528]/80 border border-[rgba(124,58,237,0.25)] w-full max-w-md self-center sm:self-start backdrop-blur-md">
                    <Link
                        href="/terms"
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-center transition-all duration-200 ${
                            activeTab === "terms"
                                ? "bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-[0px_4px_16px_rgba(124,58,237,0.4)]"
                                : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                        }`}
                    >
                        Terms & Conditions
                    </Link>
                    <Link
                        href="/privacy"
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-center transition-all duration-200 ${
                            activeTab === "privacy"
                                ? "bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-[0px_4px_16px_rgba(124,58,237,0.4)]"
                                : "text-[#8B7EC8] hover:text-white hover:bg-white/5"
                        }`}
                    >
                        Privacy Policy
                    </Link>
                </div>

                {/* Legal Sections Document Container */}
                <div
                    className="w-full rounded-[28px] p-6 sm:p-10 flex flex-col gap-8 backdrop-blur-xl border border-[rgba(124,58,237,0.25)] shadow-[0px_16px_48px_rgba(0,0,0,0.5),inset_0px_1px_0px_rgba(255,255,255,0.06)]"
                    style={{ background: "rgba(14, 7, 34, 0.85)" }}
                >
                    {sections.map((section, idx) => (
                        <article key={idx} className="flex flex-col gap-2.5 pb-6 border-b border-[rgba(124,58,237,0.15)] last:border-b-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.35)] flex items-center justify-center text-xs font-bold text-[#E8FF57] shrink-0 font-mono">
                                    {idx + 1}
                                </span>
                                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                    {section.title}
                                </h2>
                            </div>
                            <p className="text-sm sm:text-[15px] leading-relaxed text-[#B7AADC] pl-10 font-normal">
                                {section.content}
                            </p>
                        </article>
                    ))}
                </div>

                {/* Questions & Contact Card */}
                <div className="w-full rounded-2xl p-6 bg-gradient-to-r from-[rgba(124,58,237,0.12)] to-[rgba(232,255,87,0.05)] border border-[rgba(124,58,237,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-sm text-white">Have questions about our legal policies?</h4>
                        <p className="text-xs text-[#8B7EC8]">Our legal and support teams are here to assist you anytime.</p>
                    </div>
                    <a
                        href="mailto:support@barhuddle.com"
                        className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all duration-150 whitespace-nowrap active:scale-95 shadow-md"
                    >
                        Contact Support
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full border-t border-[rgba(124,58,237,0.2)] py-8 px-4 sm:px-6 mt-12 bg-[#080318]/90">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B7EC8]">
                    <p>© {new Date().getFullYear()} BarHuddle, Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/auth/register" className="hover:text-[#E8FF57] text-[#C4B5FD] transition-colors font-medium">
                            Create Account
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LegalPageLayout;
