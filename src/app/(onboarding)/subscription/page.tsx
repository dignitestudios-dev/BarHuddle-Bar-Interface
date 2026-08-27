import { SubscriptionPlansScreen } from "@/features/venue-management/components/SubscriptionPlansScreen";

export default function SubscriptionPage() {
    return (
        <div className="min-h-screen  w-full max-w-[1200px] flex flex-col items-center justify-center p-4 md:p-8">
            {/* The SubscriptionPlansScreen is a client component but we render it here */}
            {/* We will need a wrapper to handle the actual selection logic, but for now we render it directly */}
            <SubscriptionPlansScreen />
        </div>
    );
}
