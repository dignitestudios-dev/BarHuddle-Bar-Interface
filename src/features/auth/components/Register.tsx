"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, InputField } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { toast } from "sonner";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

const registerSchema = z
    .object({
        name: z.string().min(1, "Name is required").max(80, "Name cannot exceed 80 characters"),
        email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .max(50, "Password cannot exceed 50 characters")
            .regex(/[A-Z]/, "Must contain at least 1 uppercase letter (A-Z)")
            .regex(/[a-z]/, "Must contain at least 1 lowercase letter (a-z)")
            .regex(/[0-9]/, "Must contain at least 1 number (0-9)")
            .regex(/[^a-zA-Z0-9]/, "Must contain at least 1 special character (!@#$%^&* etc.)"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
    const router = useRouter();
    const { handleGoogleAuth, isLoadingGoogle } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(true);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const watchedPassword = useWatch({ control, name: "password" }) || "";
    const watchedEmail = useWatch({ control, name: "email" }) || "";

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const onSubmit = (data: RegisterFormValues) => {
        if (!acceptedTerms) {
            toast.error("Please accept the Terms & Conditions and Privacy Policy");
            return;
        }

        console.log("Register submitted:", {
            name: data.name,
            email: data.email,
            password: data.password,
            acceptedTerms,
            profileImage,
        });
        toast.success("Registration details submitted!");
        router.push("/auth/verify-email");
    };

    return (
        <div className="w-full flex flex-col items-center">
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
                        <Image
                            src={profileImage}
                            alt="Profile preview"
                            fill
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

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                {/* Name Field */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <InputField
                            label="Name"
                            type="text"
                            placeholder="James Smith"
                            error={errors.name?.message}
                            {...field}
                        />
                    )}
                />

                {/* Email Field */}
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <InputField
                            label="Email"
                            type="email"
                            placeholder="jamessmith@gmail.com"
                            error={errors.email?.message}
                            {...field}
                        />
                    )}
                />

                {/* Password Field */}
                <div className="flex flex-col gap-1 w-full">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                error={errors.password?.message}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none p-1 text-[#B972FC] hover:text-[#D188FF] transition-colors cursor-pointer flex items-center justify-center"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                }
                                {...field}
                            />
                        )}
                    />

                    {/* Password Strength Meter */}
                    <PasswordStrengthMeter
                        password={watchedPassword}
                        comparePassword={watchedEmail}
                        compareLabel="Different from email"
                        className="mt-1"
                    />
                </div>

                {/* Confirm Password Field */}
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <InputField
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            error={errors.confirmPassword?.message}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="focus:outline-none p-1 text-[#B972FC] hover:text-[#D188FF] transition-colors cursor-pointer flex items-center justify-center"
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                            {...field}
                        />
                    )}
                />

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-center justify-center gap-2.5 mt-2">
                    <button
                        type="button"
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                        className={`w-6 h-6 min-w-[24px] rounded-[4px] flex items-center justify-center transition-colors cursor-pointer ${
                            acceptedTerms ? "bg-[#B45FF2]" : "bg-white/10 border border-white/30"
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
                <Button
                    type="submit"
                    variant="gradient"
                    disabled={isSubmitting}
                    className="mt-2 h-[52px] rounded-full font-bold text-[15px] cursor-pointer"
                >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
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

export default Register;
