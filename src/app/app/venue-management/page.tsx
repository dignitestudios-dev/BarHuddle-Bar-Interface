import VenueManagement from "@/features/venue-management/components/VenueManagement";
import { Suspense } from "react";

export default function VenueManagementPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center text-white">Loading...</div>}>
            <VenueManagement />
        </Suspense>
    );
}
