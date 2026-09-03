import { Suspense } from "react";
import type { Metadata } from "next";
import MyVenueView from "@/features/my-venue/components/MyVenueView";

export const metadata: Metadata = {
    title: "My Venue - BarHuddle Owner Portal",
    description: "Manage your claimed venue details, operating hours, and gallery showcase.",
};

export default function MyVenuePage() {
    return (
        <Suspense
            fallback={
                <div className="w-full min-h-[60vh] flex items-center justify-center text-white">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
                        <span className="text-sm font-semibold text-[#9D8FD0]">Loading My Venue...</span>
                    </div>
                </div>
            }
        >
            <MyVenueView />
        </Suspense>
    );
}
