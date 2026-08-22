"use client";

import React from "react";
import { Button } from "@/components/ui";

export function PendingApprovalScreen() {
    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[70vh] font-['Manrope',sans-serif] animate-in fade-in duration-300">
            <div className="relative w-full max-w-[600px] bg-[rgba(20,14,80,0.6)] border border-[rgba(124,58,237,0.3)] rounded-[32px] p-10 md:p-14 flex flex-col items-center text-center shadow-[0px_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
                {/* Glow Effects */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15)_0%,transparent_50%)] pointer-events-none" />

                {/* Animated Icon */}
                <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#E8FF57] rounded-full blur-[30px] opacity-20 animate-pulse" />
                    <div className="w-20 h-20 rounded-full bg-[rgba(232,255,87,0.1)] border border-[rgba(232,255,87,0.3)] flex items-center justify-center z-10 animate-bounce">
                        <svg className="w-10 h-10 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="font-extrabold text-[32px] md:text-[40px] leading-[1.2] bg-gradient-to-r from-white via-[#C4B5FD] to-[#E8FF57] bg-clip-text text-transparent mb-4">
                    Under Review
                </h1>
                
                <p className="font-normal text-[16px] leading-[26px] text-[#9D8FD0] mb-8 max-w-[400px]">
                    Your venue claim has been submitted successfully. Our team is currently reviewing your application. You will be notified via email once approved.
                </p>

                <div className="flex flex-col gap-4 w-full">
                    <div className="p-4 rounded-[16px] bg-[rgba(157,143,208,0.1)] border border-[rgba(157,143,208,0.2)] text-left">
                        <h4 className="font-bold text-[14px] text-white mb-1">What happens next?</h4>
                        <ul className="text-[13px] text-[#C4B5FD] flex flex-col gap-2">
                            <li className="flex items-start gap-2">
                                <span className="text-[#E8FF57] mt-0.5">•</span>
                                Verification usually takes 24-48 hours.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E8FF57] mt-0.5">•</span>
                                We may contact you if additional information is needed.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E8FF57] mt-0.5">•</span>
                                Once approved, you'll select a subscription plan.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mt-8 pt-6 border-t border-[rgba(124,58,237,0.2)] w-full flex items-center justify-center gap-2">
                    <span className="text-[13px] text-[#9D8FD0]">Need help?</span>
                    <a href="mailto:support@barhuddle.com" className="text-[13px] font-bold text-[#E8FF57] hover:underline transition-all">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}

export default PendingApprovalScreen;
