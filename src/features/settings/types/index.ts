export type SettingsTab =
    | "Notifications"
    | "Change Password"
    | "Subscription"
    | "Privacy Policy"
    | "Terms & Conditions"
    | "Delete Account";

export interface MenuItem {
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
}

export interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    category: string;
    icon: React.ReactNode;
}

export * from "../api/settings.service";
