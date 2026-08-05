import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full flex justify-end items-center overflow-x-hidden">
            <Image
                src="/images/auth-bg.png"
                alt="Auth background"
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover object-left pointer-events-none select-none"
            />
            <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 z-10">
                {children}
            </div>
        </div>
    );
}