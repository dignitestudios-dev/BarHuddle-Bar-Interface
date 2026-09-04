import { Suspense } from "react";
import type { Metadata } from "next";
import MyVenueView from "@/features/my-venue/components/MyVenueView";
import { MyVenueSkeleton } from "@/features/my-venue/components/MyVenueSkeleton";

export const metadata: Metadata = {
    title: "My Venue - BarHuddle Owner Portal",
    description: "Manage your claimed venue details, operating hours, and gallery showcase.",
};

export default function MyVenuePage() {
    return (
        <Suspense fallback={<MyVenueSkeleton />}>
            <MyVenueView />
        </Suspense>
    );
}
