"use client";

import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { SyncUser } from "@/components/SyncUser";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const { handleLogout } = useAuth();

    return (
        <div className="flex flex-col h-screen w-full bg-[#05033AD9] text-white overflow-hidden">
            <SyncUser />
            <div className="w-full flex justify-end p-6 absolute top-0 right-0 z-50">
                <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-all text-white"
                    title="Log Out"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
                {children}
            </div>
        </div>
    );
}
