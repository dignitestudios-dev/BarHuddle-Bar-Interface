

"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { EventDetailView } from "@/features/events/components";
import { useGetEventDetailsQuery } from "@/features/events/api/events.queries";

export default function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();

    const { data: apiResponse, isLoading } = useGetEventDetailsQuery(resolvedParams.id);
    const event = apiResponse?.data || apiResponse;

    return (
        <main className="w-full min-h-screen px-4 sm:px-6 py-8 flex flex-col gap-8 font-['Manrope',sans-serif]">
            <EventDetailView
                event={event}
                isLoading={isLoading}
                onBack={() => router.push("/app/events")}
            />
        </main>
    );
}
