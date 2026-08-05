import Register from "@/features/auth/components/Register";


export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[392px] mx-auto py-8">
            {/* Header Text */}
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
                <h1 className="font-['Manrope',sans-serif] font-semibold text-[36px] leading-[49px] text-white">
                    Sign Up
                </h1>
                <p className="font-['Manrope',sans-serif] font-normal text-[16px] leading-[22px] text-white/80">
                    Enter your details below to signup.
                </p>
            </div>

            <Register />
        </div>
    )
}