"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { navItems, type NavItem } from "@/utils/constants";
import { useAppSelector } from "@/store";
import { getAvatarUrl } from "@/context/ProfileContext";
import { useSidebar } from "@/context/SidebarContext";

export { type NavItem };

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAppSelector((state) => state.auth);
    const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();

    // Calculate display name, email, avatar, and initials
    const displayName =
        (user as any)?.name ||
        ((user as any)?.firstName && (user as any)?.lastName
            ? `${(user as any).firstName} ${(user as any).lastName}`
            : (user as any)?.firstName) ||
        user?.email?.split("@")[0] ||
        "Venue Owner";
    const displayEmail = user?.email || "owner@barhuddle.com";
    const avatarUrl = getAvatarUrl(user);

    const getInitials = (name: string) => {
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "VO";
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(displayName);

    // Common Nav Links Renderer
    const renderNavLinks = (collapsed: boolean, onLinkClick?: () => void) => {
        return (
            <nav className="w-full flex flex-col gap-1.5">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href === "/app/dashboard" && pathname === "/app") ||
                        (item.href !== "/app/dashboard" && pathname?.startsWith(item.href + "/"));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onLinkClick}
                            title={collapsed ? item.name : undefined}
                            className={`relative group flex items-center ${
                                collapsed
                                    ? "justify-center w-11 h-11 mx-auto px-0 rounded-2xl"
                                    : "gap-3 w-full h-[41.6px] px-3 rounded-[24px]"
                            } transition-all duration-200 ${
                                isActive
                                    ? "bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#E8FF57]"
                                    : "text-[#9D8FD0] hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                        >
                            {/* Active Glow Indicator */}
                            {isActive && (
                                <span
                                    className={`absolute ${
                                        collapsed
                                            ? "left-0 top-1/2 -translate-y-1/2 w-[3px] h-[22px] bg-[#E8FF57] rounded-r-full shadow-[0px_0px_8px_#E8FF57]"
                                            : "left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-[20px] bg-[#E8FF57] rounded-r-full shadow-[0px_0px_8px_#E8FF57]"
                                    }`}
                                />
                            )}

                            {/* Icon */}
                            <span
                                className={`shrink-0 transition-colors ${
                                    isActive ? "text-[#E8FF57]" : "text-[#AD46FF] group-hover:text-white"
                                }`}
                            >
                                {item.icon}
                            </span>

                            {/* Label */}
                            {!collapsed && (
                                <span
                                    className={`font-semibold text-[14px] leading-[20px] truncate ${
                                        isActive
                                            ? "text-[#E8FF57]"
                                            : "text-[#9D8FD0] group-hover:text-white"
                                    }`}
                                >
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        );
    };

    // User Profile Section
    const renderUserProfile = (collapsed: boolean, onProfileClick?: () => void) => {
        return (
            <div
                className={`w-full border-t border-[rgba(124,58,237,0.2)] bg-[#070210] ${
                    collapsed ? "p-3 flex justify-center" : "p-4"
                }`}
            >
                <Link
                    href="/app/profile"
                    onClick={onProfileClick}
                    title={collapsed ? `${displayName} (${displayEmail})` : undefined}
                    className={`flex items-center ${
                        collapsed ? "justify-center p-1 rounded-xl" : "gap-3 w-full p-1.5 -m-1.5 rounded-xl"
                    } hover:bg-white/[0.04] transition-colors group cursor-pointer`}
                >
                    {/* User Avatar Circle */}
                    {avatarUrl ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[rgba(124,58,237,0.4)]">
                            <Image
                                src={avatarUrl}
                                alt={displayName}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#F472B6] flex items-center justify-center font-bold text-[13px] text-[#F0EEFF] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            {initials}
                        </div>
                    )}

                    {/* User Info */}
                    {!collapsed && (
                        <div className="flex flex-col truncate min-w-0">
                            <span className="font-semibold text-[14px] leading-[20px] text-white truncate group-hover:text-[#C4B5FD] transition-colors">
                                {displayName}
                            </span>
                            <span className="font-normal text-[11px] leading-[16px] text-[#9D8FD0] truncate">
                                {displayEmail}
                            </span>
                        </div>
                    )}
                </Link>
            </div>
        );
    };

    return (
        <>
            {/* Desktop & Tablet Sidebar (Hidden on Mobile < md, smoothly collapses to 72px) */}
            <aside
                className={`hidden md:flex h-screen sticky top-0 bg-[#030228F2] border-r border-[#7C3AED]/20 shrink-0 flex-col justify-between select-none font-['Manrope',sans-serif] overflow-y-auto custom-scrollbar transition-all duration-300 ${
                    isCollapsed ? "w-[72px]" : "w-[255px]"
                }`}
            >
                {/* Top Brand & Menu Section */}
                <div
                    className={`flex flex-col items-start w-full ${
                        isCollapsed ? "p-3 pb-4" : "p-6 pb-4"
                    }`}
                >
                    {/* Brand Logo, Title & Shrink/Expand Toggle Arrow */}
                    <div className="flex items-center justify-between w-full mb-1">
                        <div
                            className={`flex items-center gap-2.5 ${
                                isCollapsed ? "justify-center w-full" : ""
                            }`}
                        >
                            <div className="relative w-9 h-9 shrink-0">
                                <Image
                                    src="/images/bar-huddle-logo.png"
                                    alt="BarHuddle"
                                    fill
                                    sizes="36px"
                                    className="object-contain"
                                />
                            </div>
                            {!isCollapsed && (
                                <span className="font-extrabold text-[20px] leading-[28px] tracking-[-0.5px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent">
                                    BarHuddle
                                </span>
                            )}
                        </div>

                        {/* Collapse/Expand Arrow Toggle Button (Visible on Desktop & Tablet) */}
                        {!isCollapsed && (
                            <button
                                type="button"
                                onClick={toggleCollapse}
                                className="w-7 h-7 rounded-lg bg-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.3)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C4B5FD] hover:text-white transition-all cursor-pointer"
                                title="Collapse Sidebar"
                                aria-label="Collapse Sidebar"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Subtitle / Portal Tag or Expand Button in Collapsed Mode */}
                    {isCollapsed ? (
                        <div className="w-full flex justify-center mt-3 mb-6">
                            <button
                                type="button"
                                onClick={toggleCollapse}
                                className="w-8 h-8 rounded-xl bg-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.35)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#E8FF57] hover:scale-105 transition-all cursor-pointer"
                                title="Expand Sidebar"
                                aria-label="Expand Sidebar"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="pl-[44px] mb-8">
                            <span className="font-normal text-[10px] leading-[15px] text-[#9D8FD0] tracking-wide">
                                Owner Portal
                            </span>
                        </div>
                    )}

                    {/* Navigation Menu */}
                    {renderNavLinks(isCollapsed)}
                </div>

                {/* Bottom User Profile Section */}
                {renderUserProfile(isCollapsed)}
            </aside>

            {/* Mobile Drawer (Visible on < md when isMobileOpen is true) */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-200"
                    onClick={closeMobile}
                >
                    <aside
                        className="fixed inset-y-0 left-0 w-[265px] bg-[#030228F8] border-r border-[#7C3AED]/30 shadow-2xl flex flex-col justify-between select-none font-['Manrope',sans-serif] overflow-y-auto custom-scrollbar z-50 animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Brand Section & Close Button */}
                        <div className="flex flex-col items-start w-full p-5 pb-4">
                            <div className="flex items-center justify-between w-full mb-1">
                                <div className="flex items-center gap-2.5">
                                    <div className="relative w-8 h-8 shrink-0">
                                        <Image
                                            src="/images/bar-huddle-logo.png"
                                            alt="BarHuddle"
                                            fill
                                            sizes="32px"
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="font-extrabold text-[18px] leading-[26px] tracking-[-0.5px] bg-gradient-to-r from-white to-[#C4B5FD] bg-clip-text text-transparent">
                                        BarHuddle
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeMobile}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#9D8FD0] hover:text-white transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="pl-[40px] mb-6">
                                <span className="font-normal text-[10px] leading-[15px] text-[#9D8FD0] tracking-wide">
                                    Owner Portal
                                </span>
                            </div>

                            {/* Navigation Menu */}
                            {renderNavLinks(false, closeMobile)}
                        </div>

                        {/* Bottom User Profile Section */}
                        {renderUserProfile(false, closeMobile)}
                    </aside>
                </div>
            )}
        </>
    );
}

export default Sidebar;
