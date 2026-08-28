"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, InputField } from "@/components/ui";
import { useAuth } from "../hooks/use-auth";

export function SignUp({ setShowLogin }: { setShowLogin?: (showLogin: boolean) => void }) {
    const { email, setEmail, acceptedTerms, setAcceptedTerms, handleSignUp, handleGoogleAuth, isLoadingLogin, isLoadingGoogle } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSignUp();
    };


    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[392px] mx-auto py-8">
            {/* Logo */}
            <div className="relative w-[180px] h-[180px] mb-6 transition-transform hover:scale-105 duration-300">
                <Image
                    src="/images/bar-huddle-logo.png"
                    alt="Bar Huddle Logo"
                    fill
                    priority
                    className="object-contain"
                />
            </div>

            {/* Header Text */}
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
                <h1 className="font-['Manrope',sans-serif] font-semibold text-[36px] leading-[49px] text-white">
                    Welcome back!
                </h1>
                <p className="font-['Manrope',sans-serif] font-normal text-[16px] leading-[22px] text-white/80">
                    Enter your details below to login.
                </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                {/* Email Field using reusable InputField component */}
                <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="jamessmith@gmail.com"
                    required
                />

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-center justify-center gap-2.5 mt-0">
                    <button
                        type="button"
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                        className={`w-6 h-6 min-w-[24px] rounded-[4px] flex items-center justify-center transition-colors ${acceptedTerms ? "bg-[#B45FF2]" : "bg-white/10 border border-white/30"
                            }`}
                    >
                        {acceptedTerms && (
                            <svg className="w-4 h-3 text-white fill-current" viewBox="0 0 16 12">
                                <path d="M5.5 10.586L1.707 6.793A1 1 0 00.293 8.207l4.5 4.5a1 1 0 001.414 0l9-9A1 1 0 0013.793 2.293L5.5 10.586z" />
                            </svg>
                        )}
                    </button>
                    <p className="font-['Manrope',sans-serif] text-[14px] leading-[20px] text-white">
                        I accept the{" "}
                        <Link href="/terms" className="text-[#FDF88F] font-medium hover:underline">
                            Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#FDF88F] font-medium hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>

                {/* Continue CTA Button using reusable Button component */}
                <Button type="submit" variant="gradient" disabled={isLoadingLogin}>
                    {isLoadingLogin ? "Loading..." : "Continue"}
                </Button>

                {/* OR Divider */}
                <div className="flex items-center justify-between gap-3 my-1">
                    <div className="flex-1 h-[1px] bg-white/20" />
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[20px] leading-[25px] text-white uppercase px-1">
                        OR
                    </span>
                    <div className="flex-1 h-[1px] bg-white/20" />
                </div>

                {/* Social Login Buttons using reusable Button component */}
                <div className="flex items-center gap-3 w-full">
                    {/* Google Button */}
                    <Button
                        type="button"
                        variant="social"
                        onClick={handleGoogleAuth}
                        disabled={isLoadingGoogle}
                        className="gap-2 w-full disabled:opacity-50 cursor-pointer"
                    >
                        {isLoadingGoogle ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                </svg>
                                <span>Google</span>
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    );
}

export default SignUp;
