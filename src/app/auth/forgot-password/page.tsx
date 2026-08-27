import { Suspense } from "react";
import { ForgotPassword } from "@/features/auth/components/ForgotPassword";

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="text-white text-center py-8">Loading...</div>}>
            <ForgotPassword />
        </Suspense>
    );
}
