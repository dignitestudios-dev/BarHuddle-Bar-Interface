import { Suspense } from "react";
import Analytics from "@/features/analytics/components/Analytics";

export default function AnalyticsPage() {
    return (
        <Suspense fallback={null}>
            <Analytics />
        </Suspense>
    );
}
