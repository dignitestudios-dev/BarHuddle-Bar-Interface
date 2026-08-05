"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems, type NavItem } from "@/utils/constants";


export { type NavItem };

export function Sidebar() {
    const pathname = usePathname();


    return (
        <aside className="w-[255px] min-h-screen bg-[#070210] border-r border-[#7C3AED]/20 shrink-0 flex flex-col justify-between select-none font-['Manrope',sans-serif]">
            {/* Top Brand & Menu Section */}
            <div className="flex flex-col items-start w-full p-6 pb-4">
                {/* Brand Logo & Title */}
                <div className="flex items-center gap-2.5 w-full mb-1">
                    <div className="relative w-9 h-9 shrink-0">
                        <Image
                            src="/images/bar-huddle-logo.png"
                            alt="BarHuddle"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-extrabold text-[20px] leading-[28px] tracking-[-0.5px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent">
                        BarHuddle
                    </span>
                </div>

                {/* Subtitle / Portal Tag */}
                <div className="pl-[44px] mb-8">
                    <span className="font-normal text-[10px] leading-[15px] text-[#9D8FD0] tracking-wide">
                        Owner Portal
                    </span>
                </div>

                {/* Navigation Menu */}
                <nav className="w-full flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href === "/app/dashboard" && pathname === "/app");

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative group flex items-center gap-3 w-full h-[41.6px] px-3 rounded-[24px] transition-all duration-200 ${isActive
                                        ? "bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#E8FF57]"
                                        : "text-[#9D8FD0] hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                            >
                                {/* Left Active Glow Indicator */}
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-[20px] bg-[#E8FF57] rounded-r-full shadow-[0px_0px_8px_#E8FF57]" />
                                )}

                                {/* Icon */}
                                <span className={`shrink-0 transition-colors ${isActive ? "text-[#E8FF57]" : "text-[#AD46FF] group-hover:text-white"}`}>
                                    {item.icon}
                                </span>

                                {/* Label */}
                                <span
                                    className={`font-semibold text-[14px] leading-[20px] truncate ${isActive ? "text-[#E8FF57]" : "text-[#9D8FD0] group-hover:text-white"
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom User Profile Section */}
            <div className="w-full p-4 border-t border-[rgba(124,58,237,0.2)] bg-[#070210]">
                <div className="flex items-center gap-3 w-full">
                    {/* User Avatar Circle */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#F472B6] flex items-center justify-center font-bold text-[14px] text-[#F0EEFF] shrink-0 shadow-sm">
                        JD
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col truncate">
                        <span className="font-semibold text-[14px] leading-[20px] text-white truncate">
                            James Dorsey
                        </span>
                        <span className="font-normal text-[11px] leading-[16px] text-[#9D8FD0] truncate">
                            james@barhuddle.com
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
