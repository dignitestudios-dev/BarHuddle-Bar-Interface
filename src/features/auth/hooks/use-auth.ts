import { useLoginMutation, useVerifyOtpMutation } from "../api/auth.mutations";
import { setAuth, logout } from "@/store/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, accessToken, isRehydrated } = useAppSelector((state) => state.auth);

  const loginMutation = useLoginMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [otpCode, setOtpCode] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      // Assuming password is used in a real endpoint, but doc says only email is needed for /auth. We send both.
      await loginMutation.mutateAsync({ email });
      // Redirect to OTP verification
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&mode=login`);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await loginMutation.mutateAsync({ email });
      // Redirect to OTP verification
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&mode=register`);
    } catch (error) {
      console.error("Signup error", error);
    }
  };

  const handleVerifyOtp = async (codeToVerify: string, mode: "login" | "register" | "reset-password", targetEmail: string) => {
    try {
      const response = await verifyOtpMutation.mutateAsync({ email: targetEmail, otp: codeToVerify });
      dispatch(setAuth({ 
        token: response.data.token, 
        user: response.data.user || user 
      }));

      if (mode === "reset-password") {
        router.push("/auth/create-new-password");
        return;
      }
      console.log(response, "here////////////////////")
      if (!response?.data?.user?.isProfileCompleted) {
        router.push("/auth/profile-setup");
      } else {
        router.push("/app/dashboard");
      }
    } catch (error) {
      console.error("Verify OTP error", error);
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return {
    user,
    accessToken,
    isRehydrated,
    email,
    setEmail,
    password,
    setPassword,
    acceptedTerms,
    setAcceptedTerms,
    otpCode,
    setOtpCode,
    handleLogin,
    handleSignUp,
    handleVerifyOtp,
    handleLogout,
    isLoadingLogin: loginMutation.isPending,
    isLoadingVerify: verifyOtpMutation.isPending,
  };
}
