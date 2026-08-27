import { Suspense } from "react";
import { CreateNewPassword } from "@/features/auth/components/CreateNewPassword";

export default function CreateNewPasswordPage() {
    return (
        <Suspense fallback={<div className="text-white text-center py-8">Loading...</div>}>
            <CreateNewPassword />
        </Suspense>
    );
}
