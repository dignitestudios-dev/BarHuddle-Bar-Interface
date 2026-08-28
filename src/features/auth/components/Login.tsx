"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, InputField } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoginMutation, useCheckEmailMutation } from "../api/auth.mutations";
import { useAuth } from "../hooks/use-auth";
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
        .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter (A-Z)" })
        .regex(/[a-z]/, { message: "Password must contain at least 1 lowercase letter (a-z)" })
        .regex(/[0-9]/, { message: "Password must contain at least 1 number (0-9)" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least 1 special character (!@#$%^&* etc.)" }),
    confirmPassword: z.string().optional(),
});


type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function Login() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [step, setStep] = useState<1 | 2>(1);
    const [emailValue, setEmailValue] = useState("");
    const [isExistingUser, setIsExistingUser] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(true);

    const checkEmailMutation = useCheckEmailMutation();
    const loginMutation = useLoginMutation();
    const { handleGoogleAuth, isLoadingGoogle } = useAuth();

    // RHF for Step 1 (Email)
    const {
        control: emailControl,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
    } = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" },
    });

    // RHF for Step 2 (Password / Confirm Password)
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onEmailSubmit = async (data: EmailFormValues) => {
        try {
            const response = await checkEmailMutation.mutateAsync(data.email);
            const exists = Boolean(response?.data?.exists ?? (response as any)?.exists);
            setIsExistingUser(exists);
            setEmailValue(data.email);
            resetPasswordForm({ password: "", confirmPassword: "" });
            setStep(2);
        } catch (error: any) {
            console.error("Check email error", error);
            const exists = Boolean(error?.response?.data?.data?.exists);
            setIsExistingUser(exists);
            setEmailValue(data.email);
            resetPasswordForm({ password: "", confirmPassword: "" });
            setStep(2);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        if (!acceptedTerms) {
            toast.error("Please accept the Terms & Conditions and Privacy Policy to proceed");
            return;
        }

        // Validate confirm password for new users
        if (!isExistingUser) {
            if (!data.confirmPassword) {
                toast.error("Please confirm your password");
                return;
            }
            if (data.password !== data.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
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
                router.push(`/auth/verify-email?email=${encodeURIComponent(emailValue)}&mode=${isExistingUser ? "login" : "signup"}`);
            } else {
                dispatch(setAuth({ token: response.data.token || "", user: response.data.user }));
                toast.success(isExistingUser ? "Logged in successfully!" : "Account created successfully!");
                if (!response.data.user?.isProfileCompleted) {
                    router.push(`/auth/profile-setup`);
                } else {
                    router.push(`/app/dashboard`);
                }
            }
        } catch (error: any) {
            console.error("Login error", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to proceed");
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
                    {step === 1 ? "Welcome back!" : isExistingUser ? "Welcome back!" : "Create Account"}
                </h1>
                <p className="font-normal text-[15px] leading-[22px] text-white/80">
                    {step === 1
                        ? "Enter your details below to continue."
                        : isExistingUser
                        ? "Enter your password below to login."
                        : "Set a password to create your account."}
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

                    <SocialLogins onGoogleAuth={handleGoogleAuth} isLoadingGoogle={isLoadingGoogle} />
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

                    {/* Password Field */}
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center mb-1">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Password
                            </label>
                            {/* Forgot Password link only for existing users */}
                            {isExistingUser && (
                                <Link
                                    href={`/auth/forgot-password?email=${encodeURIComponent(emailValue)}`}
                                    className="font-semibold text-[13px] leading-[18px] text-[#B972FC] hover:underline transition-all"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <div className="relative w-full">
                            <Controller
                                name="password"
                                control={passwordControl}
                                render={({ field }) => (
                                    <InputField
                                        type={showPassword ? "text" : "password"}
                                        placeholder={isExistingUser ? "Enter your password" : "Create password (min 8 chars)"}
                                        error={passwordErrors.password?.message}
                                        {...field}
                                    />
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[14px] text-white/50 hover:text-white transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field only for new users */}
                    {!isExistingUser && (
                        <div className="flex flex-col gap-1 w-full animate-in fade-in duration-200">
                            <label className="font-semibold text-[14px] leading-[19px] text-white mb-1">
                                Confirm Password
                            </label>
                            <div className="relative w-full">
                                <Controller
                                    name="confirmPassword"
                                    control={passwordControl}
                                    render={({ field }) => (
                                        <InputField
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            error={passwordErrors.confirmPassword?.message}
                                            {...field}
                                        />
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-[14px] text-white/50 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Terms Checkbox for new users */}
                    {!isExistingUser && (
                        <div className="flex items-center gap-2.5 mt-1 animate-in fade-in duration-200">
                            <button
                                type="button"
                                onClick={() => setAcceptedTerms(!acceptedTerms)}
                                className={`w-5 h-5 min-w-[20px] rounded-[4px] flex items-center justify-center transition-colors ${
                                    acceptedTerms ? "bg-[#B45FF2]" : "bg-white/10 border border-white/30"
                                }`}
                            >
                                {acceptedTerms && (
                                    <svg className="w-3.5 h-2.5 text-white fill-current" viewBox="0 0 16 12">
                                        <path d="M5.5 10.586L1.707 6.793A1 1 0 00.293 8.207l4.5 4.5a1 1 0 001.414 0l9-9A1 1 0 0013.793 2.293L5.5 10.586z" />
                                    </svg>
                                )}
                            </button>
                            <p className="text-[13px] leading-[18px] text-white/90">
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
                    )}

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        variant="gradient" 
                        disabled={loginMutation.isPending}
                        className="w-full h-[52px] rounded-full font-bold text-[15px] cursor-pointer mt-1"
                    >
                        {loginMutation.isPending
                            ? isExistingUser
                                ? "Logging in..."
                                : "Creating Account..."
                            : isExistingUser
                            ? "Login"
                            : "Create Account"}
                    </Button>
                </form>
            )}
        </div>
    );
}

function SocialLogins({
    onGoogleAuth,
    isLoadingGoogle,
}: {
    onGoogleAuth?: () => void;
    isLoadingGoogle?: boolean;
}) {
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
                <Button
                    type="button"
                    variant="social"
                    onClick={onGoogleAuth}
                    disabled={isLoadingGoogle}
                    className="gap-2 w-full h-[48px] rounded-full cursor-pointer disabled:opacity-50"
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
        </>
    );
}


export default Login;
