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

                // Authenticated user routing logic based on isClaimed and isSubscribed
                const isClaimed = user?.isClaimed || "none"; // fallback to none
                let targetRoute = "/app/dashboard"; // Default to dashboard if fully subscribed

                // If approved and subscribed, they can access the dashboard.
                // Otherwise, they are forced into onboarding steps.
                if (isClaimed === "none") {
                    targetRoute = "/venue-management"; // Needs to claim bar
                } else if (isClaimed === "pending") {
                    targetRoute = "/pending"; // Waiting for approval
                } else if (isClaimed === "approved" && !user?.isSubscribed) {
                    targetRoute = "/subscription"; // Needs to pick a plan
                } else if (isClaimed === "approved" && user?.isSubscribed) {
                    targetRoute = "/app/dashboard"; // All good
                }

                // If user is on an auth route OR they are on a protected route that doesn't match their allowed onboarding route
                // Exceptions: If they are subscribed, they can access ANY /app/* route.

                if (isAuthRoute || pathname === "/auth/profile-setup") {
                    // Redirect logged-in user away from auth pages
                    router.replace(targetRoute);
                } else if (pathname?.startsWith("/app")) {
                    // Authenticated users already inside the app should stay in the app and never be redirected to onboarding
                    setIsChecking(false);
                    return;
                } else if (
                    !(isClaimed === "approved" && user?.isSubscribed) &&
                    !pathname?.startsWith(targetRoute)
                ) {
                    // Force the user to stay on their required onboarding step
                    router.replace(targetRoute);
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
