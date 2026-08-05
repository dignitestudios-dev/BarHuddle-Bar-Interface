import { Suspense } from "react";
import { VerifyEmail } from "@/features/auth/components/VerifyEmail";

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="text-white text-center py-8">Loading verification...</div>}>
            <VerifyEmail />
        </Suspense>
    );
}
