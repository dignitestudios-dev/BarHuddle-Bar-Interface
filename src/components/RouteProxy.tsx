"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Routes accessible to everyone (guests and authenticated users)
const LEGAL_ROUTES = [
    "/terms",
    "/privacy",
    "/terms-and-conditions",
    "/privacy-policy",
];

// Authentication-only routes (login, signup, password resets)
const AUTH_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/create-new-password",
];

const PUBLIC_ROUTES = [...AUTH_ROUTES, ...LEGAL_ROUTES];

export function RouteProxy({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { accessToken: token, user } = useSelector((state: RootState) => state.auth);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait a small tick to ensure Redux is rehydrated by AuthRehydrator
        const checkRoute = () => {
            // Legal pages are always publicly accessible without redirecting
            if (LEGAL_ROUTES.some(route => pathname?.startsWith(route))) {
                setIsChecking(false);
                return;
            }

            const isAuthRoute = AUTH_ROUTES.some(route => pathname?.startsWith(route));
            const isAuthenticated = !!token;

            if (!isAuthenticated && !isAuthRoute) {
                // Not authenticated, trying to access protected route
                router.replace("/auth/login");
            } else if (isAuthenticated) {
                // If profile is not completed, they MUST be on profile-setup page
                if (user && !user.isProfileCompleted) {
                    if (pathname !== "/auth/profile-setup") {
                        router.replace("/auth/profile-setup");
                    }
                    setIsChecking(false);
                    return;
                }

                // Normalize status flags
                const isClaimed = String(user?.isClaimed || (user as any)?.isClamied || "none").toLowerCase().trim();

                let targetRoute = "/app/dashboard";

                // Route enforcement based on onboarding state
                if (isClaimed === "none") {
                    targetRoute = "/venue-management"; // Must claim a venue first
                } else if (isClaimed === "pending") {
                    targetRoute = "/pending"; // Waiting for admin approval (Under Review)
                } else {
                    targetRoute = "/app/dashboard"; // Approved claims go directly to dashboard
                }

                if (isAuthRoute || pathname === "/auth/profile-setup") {
                    // Redirect logged-in user away from auth/profile-setup to their target onboarding step
                    router.replace(targetRoute);
                } else if (isClaimed === "none") {
                    // Users who haven't claimed a venue yet stay on venue-management
                    if (!pathname?.startsWith("/venue-management")) {
                        router.replace("/venue-management");
                    } else {
                        setIsChecking(false);
                        return;
                    }
                } else if (isClaimed === "pending") {
                    // Users with pending claims stay on the under review screen
                    if (pathname !== "/pending") {
                        router.replace("/pending");
                    } else {
                        setIsChecking(false);
                        return;
                    }
                } else if (pathname === "/pending" && isClaimed !== "pending") {
                    router.replace(targetRoute);
                } else {
                    setIsChecking(false);
                    return;
                }
            }
            setIsChecking(false);
        };

        checkRoute();
    }, [pathname, token, user, router]);

    if (isChecking) {
        return null; // Or a full screen loader
    }

    return <>{children}</>;
}
