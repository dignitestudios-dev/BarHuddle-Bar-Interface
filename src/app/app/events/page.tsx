import { Suspense } from "react";
import Events from "@/features/events/components/Events";

export default function EventsPage() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen" />}>
            <Events />
        </Suspense>
    );
}

