import { SubscriptionPlansScreen } from "@/features/venue-management/components/SubscriptionPlansScreen";

export default function SubscriptionPage() {
    return (
        <div className="w-full max-w-[1280px] flex flex-col items-center justify-start min-h-full py-4 sm:py-6 px-3 sm:px-6 md:px-8">
            {/* The SubscriptionPlansScreen is a client component but we render it here */}
            {/* We will need a wrapper to handle the actual selection logic, but for now we render it directly */}
            <SubscriptionPlansScreen />
        </div>
    );
}
