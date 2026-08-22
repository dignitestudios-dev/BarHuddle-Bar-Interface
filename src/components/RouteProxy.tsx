"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/auth/login", "/auth/verify-email"];

export function RouteProxy({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { accessToken: token, user } = useSelector((state: RootState) => state.auth);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait a small tick to ensure Redux is rehydrated by AuthRehydrator
        const checkRoute = () => {
            const isAuthRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
            const isAuthenticated = !!token;

            if (!isAuthenticated && !isAuthRoute) {
                // Not authenticated, trying to access protected route
                router.replace("/auth/login");
            } else if (isAuthenticated) {
                // Authenticated user routing logic based on status
                // Status flow: Signup -> Claim -> Pending -> Subscription -> Dashboard
                
                const status = user?.status || "new"; // fallback to new if undefined
                let targetRoute = "/app/dashboard"; // Default to dashboard if subscribed

                switch (status) {
                    case "new":
                        targetRoute = "/app/venue-management"; // Needs to claim bar
                        break;
                    case "pending":
                        targetRoute = "/app/pending"; // Waiting for approval
                        break;
                    case "approved":
                        targetRoute = "/app/subscription"; // Needs to pick a plan
                        break;
                    case "subscribed":
                        targetRoute = "/app/dashboard"; // All good
                        break;
                }

                // If user is on an auth route OR they are on a protected route that doesn't match their allowed status route
                // Exceptions: If they are subscribed, they can access ANY /app/* route.
                
                if (isAuthRoute) {
                    // Redirect logged-in user away from auth pages
                    router.replace(targetRoute);
                } else if (
                    (status !== "subscribed") &&
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
