"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Button, InputField } from "@/components/ui";
import { useRouter } from "next/navigation";


export function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(true);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Register submitted:", {
            name,
            email,
            password,
            confirmPassword,
            acceptedTerms,
            profileImage,
        });
        router.push('/auth/verify-email');

    };

    return (

        <>
            {/* Profile Pic / Business Logo Upload */}
            <div className="flex flex-col items-center gap-3 mb-6">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-[106px] h-[106px] rounded-full bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex items-center justify-center hover:bg-[rgba(124,58,237,0.2)] active:scale-95 transition-all overflow-hidden cursor-pointer group"
                >
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <svg
                            className="w-6 h-6 text-[#B45FF2] transition-transform group-hover:scale-110"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    )}
                </button>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[16px] leading-[20px] text-white text-center">
                    Upload Profile Pic/Business Logo
                </span>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                {/* Name Field */}
                <InputField
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="James Smith"
                    required
                />

                {/* Email Field */}
                <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="jamessmith@gmail.com"
                    required
                />

                {/* Password Field */}
                <InputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    required
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="focus:outline-none p-1 hover:text-[#B972FC] transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5 text-[#B972FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-[#B972FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 0111.44 3.029C20.268 10.057 16.478 13 12 13c-.88 0-1.737-.113-2.553-.326m-4.52-4.52l12.14 12.14" />
                                </svg>
                            )}
                        </button>
                    }
                />

                {/* Confirm Password Field */}
                <InputField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="•••••••••"
                    required
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="focus:outline-none p-1 hover:text-[#B972FC] transition-colors"
                        >
                            {showConfirmPassword ? (
                                <svg className="w-5 h-5 text-[#B972FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-[#B972FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 0111.44 3.029C20.268 10.057 16.478 13 12 13c-.88 0-1.737-.113-2.553-.326m-4.52-4.52l12.14 12.14" />
                                </svg>
                            )}
                        </button>
                    }
                />

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-center justify-center gap-2.5 mt-2">
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

                {/* Sign Up CTA Button */}
                <Button type="submit" variant="gradient" className="mt-2">
                    Sign Up
                </Button>

                {/* OR Divider */}
                <div className="flex items-center justify-between gap-3 my-1">
                    <div className="flex-1 h-[1px] bg-white/20" />
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[20px] leading-[25px] text-white uppercase px-1">
                        OR
                    </span>
                    <div className="flex-1 h-[1px] bg-white/20" />
                </div>

                {/* Social Login Buttons */}
                <div className="flex items-center gap-3 w-full">
                    {/* Apple Button */}
                    <Button type="button" variant="social" className="gap-2">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.37-6.08-3.38-2.73-7.23-7.39-11.55-13.98-6.19-9.39-11.03-19.86-14.53-31.4-3.5-11.55-5.25-22.38-5.25-32.5 0-14.54 3.73-26.6 11.19-36.19 7.46-9.59 16.78-14.47 27.97-14.65 4.8 0 10.05 1.25 15.75 3.75 5.7 2.5 9.7 3.79 12 3.87 1.8.08 5.86-1.22 12.18-3.9 6.32-2.68 11.58-3.9 15.78-3.66 8.5.54 15.67 3.33 21.52 8.37-12.28 7.42-18.29 17.84-18.03 31.26.26 10.45 4.23 19.14 11.91 26.07 7.68 6.93 16.59 10.66 26.73 11.19-1.9 6.22-4.57 12.82-8.01 19.8zm-29.41-105.1c0 6.64-2.45 13.06-7.35 19.26-4.9 6.2-10.82 9.77-17.75 10.71-.53-6.64 1.77-13.1 6.9-19.38 5.13-6.28 11.35-9.87 18.66-10.77.1 0 .26.06.54.18z" />
                        </svg>
                        Apple
                    </Button>

                    {/* Google Button */}
                    <Button type="button" variant="social" className="gap-2">
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
                        Google
                    </Button>
                </div>

            </form>
        </>


    );
}

export default Register;
