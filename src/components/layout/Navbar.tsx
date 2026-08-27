"use client";

import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";

export function Navbar() {
    return (
        <header className="w-full h-16 px-6 bg-[#05033AD9] border-b border-[#7C3AED]/20 flex items-center justify-end gap-4 sticky top-0 z-30 font-['Manrope',sans-serif]">
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
