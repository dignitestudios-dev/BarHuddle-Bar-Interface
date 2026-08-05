"use client";

import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";

export function Navbar() {
    return (
        <header className="w-full h-16 px-6 bg-[#0B0314]/80 backdrop-blur-md border-b border-[#7C3AED]/20 flex items-center justify-end gap-4 sticky top-0 z-30 font-['Manrope',sans-serif]">
            {/* Search Bar */}
            <div className="relative w-full max-w-[320px] sm:max-w-[400px]">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#C27AFF]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search venues..."
                    className="w-full h-[38px] pl-10 pr-4 bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] rounded-[24px] text-sm text-white placeholder-[#9D8FD0] outline-none focus:border-[#9F4FFA] transition-all"
                />
            </div>

            {/* Right Action Dropdowns */}
            <div className="flex items-center gap-4">
                {/* Notification Dropdown Component */}
                <NotificationDropdown />

                {/* Profile Dropdown Component */}
                <ProfileDropdown />
            </div>
        </header>
    );
}

export default Navbar;
