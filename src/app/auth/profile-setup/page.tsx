import { ProfileSetup } from "@/features/auth/components/ProfileSetup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile Setup | Bar Huddle",
    description: "Complete your venue owner profile on Bar Huddle",
};

export default function ProfileSetupPage() {
    return <ProfileSetup />;
}
