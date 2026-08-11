"use client";

import React from "react";

export function PrivacyPolicyTab() {
    const policySections = [
        {
            title: "Introduction",
            content:
                "Welcome to BarHuddle. These policies govern your use of our platform, Owner Portal, and all related services. By accessing BarHuddle, you agree to the terms outlined below. We are committed to transparency, user privacy, and providing a trustworthy environment for venue owners and their customers.",
        },
        {
            title: "Data Collection",
            content:
                "We collect information you provide directly, such as account registration details, venue information, event data, and promotional content. We also automatically collect usage data, device information, and interaction logs to improve our platform and deliver relevant analytics to venue owners.",
        },
        {
            title: "How We Use Your Data",
            content:
                "Your data is used to operate and improve the BarHuddle platform, deliver venue analytics, personalize your experience, and communicate important updates. We never sell your personal data to third parties. Anonymized, aggregated data may be used for platform research and development.",
        },
        {
            title: "Data Sharing",
            content:
                "BarHuddle shares minimal data with trusted third-party service providers such as payment processors, email delivery services, and cloud infrastructure providers, solely to operate the platform. All providers are contractually bound to protect your data.",
        },
        {
            title: "Your Rights",
            content:
                "Depending on your location, you may have the right to access, correct, delete, or export your personal data. To exercise these rights, contact our support team at privacy@barhuddle.com. We respond to valid requests within 30 days.",
        },
    ];

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif]">
            {/* Top Page Header */}
            <div className="flex items-center gap-3">
                <div className="w-[28px] h-[28px] rounded-[20px] bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#AD46FF] shrink-0">
                    <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="font-extrabold text-[18px] leading-[28px] text-white">
                        Privacy Policy
                    </h2>
                    <p className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                        How BarHuddle collects, uses, and protects your data.
                    </p>
                </div>
            </div>

            {/* Document Card Container */}
            <div
                className="w-full max-w-[892px] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-md"
                style={{
                    background: "rgba(12, 5, 26, 0.75)",
                    border: "0.8px solid rgba(124, 58, 237, 0.3)",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                }}
            >
                <div className="flex flex-col gap-6 max-h-[620px] overflow-y-auto custom-scrollbar pr-2 sm:pr-4">
                    {policySections.map((section, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                            {/* Icon Badge */}
                            <div className="w-[32px] h-[32px] rounded-full bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#AD46FF] shrink-0 mt-0.5">
                                <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>

                            {/* Text Group */}
                            <div className="flex flex-col gap-1.5 flex-1">
                                <h3 className="font-bold text-[16px] leading-[22px] text-white">
                                    {section.title}
                                </h3>
                                <p className="font-normal text-[13px] leading-[20px] text-[#9D8FD0]">
                                    {section.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicyTab;
