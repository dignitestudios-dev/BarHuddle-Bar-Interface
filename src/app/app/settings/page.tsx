import { Suspense } from "react";
import SettingsPage from "@/features/settings/components/SettingsPage";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <SettingsPage />
        </Suspense>
    );
}

