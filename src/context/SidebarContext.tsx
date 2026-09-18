"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface SidebarContextType {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    toggleCollapse: () => void;
    toggleMobile: () => void;
    closeMobile: () => void;
    openMobile: () => void;
    setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Auto-close mobile drawer on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Handle screen resize events
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                // On large screens, close mobile drawer
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    const toggleMobile = useCallback(() => {
        setIsMobileOpen((prev) => !prev);
    }, []);

    const closeMobile = useCallback(() => {
        setIsMobileOpen(false);
    }, []);

    const openMobile = useCallback(() => {
        setIsMobileOpen(true);
    }, []);

    const setCollapsed = useCallback((collapsed: boolean) => {
        setIsCollapsed(collapsed);
    }, []);

    return (
        <SidebarContext.Provider
            value={{
                isCollapsed,
                isMobileOpen,
                toggleCollapse,
                toggleMobile,
                closeMobile,
                openMobile,
                setCollapsed,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
