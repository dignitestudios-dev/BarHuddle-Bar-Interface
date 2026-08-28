import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { ProfileProvider } from "@/context/ProfileContext";
import { PushNotificationManager } from "@/features/notifications/components/PushNotificationManager";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProfileProvider>
            <PushNotificationManager />
            <div className="flex h-screen w-full bg-[#05033AD9] text-white overflow-hidden">
                {/* Left Sidebar */}
                <Sidebar />

                {/* Right Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar bg-[#05033AD9]">
                    {/* Navbar / Topbar */}
                    <Navbar />

                    {/* Page Content Area */}
                    <div className="flex-1 min-h-0 w-full">
                        {children}
                    </div>
                </div>
            </div>
        </ProfileProvider>
    );
}

