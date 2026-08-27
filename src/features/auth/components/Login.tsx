"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, InputField } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useLoginMutation, useCheckEmailMutation } from "../api/auth.mutations";
import { useAppDispatch } from "@/store";
import { setAuth, updateUser } from "@/store/slices/auth.slice";
import { toast } from "sonner";

const emailSchema = z.object({
    email: z.string().min(1, "Email is required").email({ message: "Please enter a valid email address" }).max(100, { message: "Email must be less than 100 characters" }),
});

const passwordSchema = z.object({
    password: z.string()
        .min(1, "Password is required")
        .min(8, { message: "Password must be at least 8 characters" })
        .max(50, { message: "Password must be less than 50 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least 1 special character" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function Login() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [step, setStep] = useState<1 | 2>(1);
    const [emailValue, setEmailValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(true);

    const checkEmailMutation = useCheckEmailMutation();
    const loginMutation = useLoginMutation();

    // RHF for Step 1 (Email)
    const {
        control: emailControl,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
    } = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" },
    });

    // RHF for Step 2 (Password)
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "" },
    });

    const onEmailSubmit = async (data: EmailFormValues) => {
        try {
            await checkEmailMutation.mutateAsync(data.email);
            setEmailValue(data.email);
            setStep(2);
        } catch (error: any) {
            console.error("Check email error", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to check email");
            setEmailValue(data.email);
            setStep(2);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        if (!acceptedTerms) {
            toast.error("Please accept the Terms & Conditions and Privacy Policy to proceed");
            return;
        }

        try {
            const response = await loginMutation.mutateAsync({
                email: emailValue,
                password: data.password,
                role: "bar_owner",
            });

            if (response.data?.requiresOtp) {
                if (response.data.user) {
                    dispatch(updateUser(response.data.user));
                }
                router.push(`/auth/verify-email?email=${encodeURIComponent(emailValue)}&mode=login`);
            } else {
                dispatch(setAuth({ token: response.data.token || "", user: response.data.user }));
                toast.success("Logged in successfully!");
                if (!response.data.user?.isProfileCompleted) {
                    router.push(`/auth/profile-setup`);
                } else {
                    router.push(`/app/dashboard`);
                }
            }
        } catch (error: any) {
            console.error("Login error", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to login");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto py-6 font-['Manrope',sans-serif]">
            {/* Logo */}
            <div className="relative w-[160px] h-[160px] mb-4 transition-transform hover:scale-105 duration-300">
                <Image
                    src="/images/bar-huddle-logo.png"
                    alt="Bar Huddle Logo"
                    fill
                    priority
                    className="object-contain"
                />
            </div>

            {/* Header Text */}
            <div className="flex flex-col items-center gap-1.5 mb-6 text-center">
                <h1 className="font-semibold text-[32px] sm:text-[36px] leading-[44px] sm:leading-[49px] text-white tracking-tight">
                    Welcome back!
                </h1>
                <p className="font-normal text-[15px] leading-[22px] text-white/80">
                    Enter your details below to login.
                </p>
            </div>

            {step === 1 ? (
                /* Step 1: Email Form */
                <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="w-full flex flex-col gap-5 animate-in fade-in duration-200">
                    <Controller
                        name="email"
                        control={emailControl}
                        render={({ field }) => (
                            <InputField
                                label="Email"
                                type="email"
                                placeholder="jamessmith@gmail.com"
                                error={emailErrors.email?.message}
                                {...field}
                            />
                        )}
                    />

                    <Button 
                        type="submit" 
                        variant="gradient" 
                        disabled={checkEmailMutation.isPending}
                        className="w-full h-[52px] rounded-full font-bold text-[15px] cursor-pointer"
                    >
                        {checkEmailMutation.isPending ? "Checking..." : "Continue"}
                    </Button>

                    <SocialLogins />
                </form>
            ) : (
                /* Step 2: Password Form */
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="w-full flex flex-col gap-5 animate-in fade-in duration-200">
                    {/* Email Field with Change Option */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Email
                            </label>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="font-medium text-[13px] leading-[18px] text-[#B972FC] hover:underline cursor-pointer focus:outline-none"
                            >
                                Change
                            </button>
                        </div>
                        <InputField
                            type="email"
                            value={emailValue}
                            disabled
                            className="opacity-60 cursor-not-allowed bg-purple-950/30"
                        />
                    </div>

                    {/* Forgot Password Link & Password Field */}
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center mb-1">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => router.push('/auth/forgot-password')}
                                className="font-medium text-[13px] leading-[18px] text-[#B972FC] hover:underline transition-colors focus:outline-none cursor-pointer"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <Controller
                            name="password"
                            control={passwordControl}
                            render={({ field }) => (
                                <InputField
                                    type={showPassword ? "text" : "password"}
                                    placeholder="•••••••••"
                                    error={passwordErrors.password?.message}
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="focus:outline-none p-1 hover:text-[#B972FC] transition-colors cursor-pointer"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
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
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-center justify-center gap-2.5 mt-1">
                        <button
                            type="button"
                            onClick={() => setAcceptedTerms(!acceptedTerms)}
                            className={`w-5 h-5 min-w-[20px] rounded-[4px] flex items-center justify-center transition-colors cursor-pointer ${
                                acceptedTerms ? "bg-[#B45FF2]" : "bg-white/10 border border-white/30"
                            }`}
                        >
                            {acceptedTerms && (
                                <svg className="w-3.5 h-2.5 text-white fill-current" viewBox="0 0 16 12">
                                    <path d="M5.5 10.586L1.707 6.793A1 1 0 00.293 8.207l4.5 4.5a1 1 0 001.414 0l9-9A1 1 0 0013.793 2.293L5.5 10.586z" />
                                </svg>
                            )}
                        </button>
                        <p className="text-[13px] sm:text-[14px] leading-[20px] text-white/90">
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

                    <Button 
                        type="submit" 
                        variant="gradient" 
                        disabled={loginMutation.isPending}
                        className="w-full h-[52px] rounded-full font-bold text-[15px] cursor-pointer mt-1"
                    >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                </form>
            )}
        </div>
    );
}

function SocialLogins() {
    return (
        <>
            <div className="flex items-center justify-between gap-3 my-1">
                <div className="flex-1 h-[1px] bg-white/20" />
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[16px] leading-[20px] text-white/80 uppercase px-1">
                    OR
                </span>
                <div className="flex-1 h-[1px] bg-white/20" />
            </div>

            <div className="flex items-center gap-3 w-full">
                <Button type="button" variant="social" className="gap-2 flex-1 h-[48px] rounded-full cursor-pointer">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.37-6.08-3.38-2.73-7.23-7.39-11.55-13.98-6.19-9.39-11.03-19.86-14.53-31.4-3.5-11.55-5.25-22.38-5.25-32.5 0-14.54 3.73-26.6 11.19-36.19 7.46-9.59 16.78-14.47 27.97-14.65 4.8 0 10.05 1.25 15.75 3.75 5.7 2.5 9.7 3.79 12 3.87 1.8.08 5.86-1.22 12.18-3.9 6.32-2.68 11.58-3.9 15.78-3.66 8.5.54 15.67 3.33 21.52 8.37-12.28 7.42-18.29 17.84-18.03 31.26.26 10.45 4.23 19.14 11.91 26.07 7.68 6.93 16.59 10.66 26.73 11.19-1.9 6.22-4.57 12.82-8.01 19.8zm-29.41-105.1c0 6.64-2.45 13.06-7.35 19.26-4.9 6.2-10.82 9.77-17.75 10.71-.53-6.64 1.77-13.1 6.9-19.38 5.13-6.28 11.35-9.87 18.66-10.77.1 0 .26.06.54.18z" />
                    </svg>
                    Apple
                </Button>

                <Button type="button" variant="social" className="gap-2 flex-1 h-[48px] rounded-full cursor-pointer">
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
        </>
    );
}

export default Login;
