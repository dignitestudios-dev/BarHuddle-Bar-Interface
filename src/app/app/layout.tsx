import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-[#0B0314] text-white overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Right Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
                {/* Navbar / Topbar */}
                <Navbar />

                {/* Page Content Area Container with Scoped Background Image */}
                <div className="relative flex-1 min-h-0 overflow-hidden">
                    {/* Background Image scoped strictly to Page Content Area */}
                    <Image
                        src="/images/dashboard-bg.png"
                        alt="Dashboard background"
                        fill
                        priority
                        quality={90}
                        sizes="100vw"
                        className="object-cover object-top pointer-events-none select-none z-0 opacity-80"
                    />

                    {/* Page Content */}
                    <div className="relative z-10 w-full min-h-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
