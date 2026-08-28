import { useLoginMutation, useVerifyOtpMutation, useGoogleLoginMutation } from "../api/auth.mutations";
import { logoutUser, updateFcmToken } from "../api/auth.service";
import { setAuth, logout } from "@/store/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { requestFcmToken } from "@/lib/firebase-messaging";
import { toast } from "sonner";



export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, accessToken, isRehydrated } = useAppSelector((state) => state.auth);

  const loginMutation = useLoginMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const googleLoginMutation = useGoogleLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await loginMutation.mutateAsync({ email });
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&mode=login`);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await loginMutation.mutateAsync({ email });
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&mode=register`);
    } catch (error) {
      console.error("Signup error", error);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoadingGoogle(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await googleLoginMutation.mutateAsync({
        idToken,
        role: "bar_owner",
      });


      if (response && response.success === false) {
        throw new Error(response.message || "Google authentication failed");
      }

      const token = response?.data?.token || response?.token || (response as any)?.data?.accessToken;
      const userData = response?.data?.user || response?.user || (response as any)?.data?.data?.user;

      if (token) {
        dispatch(setAuth({ 
          token, 
          user: userData || user 
        }));
        toast.success("Signed in successfully with Google!");

        // Auto request & initialize browser push notification and sync with backend
        requestFcmToken().then((fcm) => {
          if (fcm) updateFcmToken(fcm);
        });

        if (userData && !userData.isProfileCompleted) {
          router.push("/auth/profile-setup");
        } else {
          router.push("/app/dashboard");
        }
      } else if (response?.data?.requiresOtp && response?.data?.email) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(response.data.email)}&mode=login`);
      } else {
        router.push("/app/dashboard");
      }
    } catch (error: any) {
      console.error("Google Auth error:", error);
      if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") {
        return;
      }
      const backendMessage = error?.response?.data?.message || error?.message || "Failed to sign in with Google";
      toast.error(backendMessage);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleVerifyOtp = async (
    codeToVerify: string, 
    mode: "login" | "register" | "reset" | "reset-password", 
    targetEmail: string
  ) => {
    try {
      const isReset = mode === "reset" || mode === "reset-password";
      const response = await verifyOtpMutation.mutateAsync({ 
        email: targetEmail, 
        otp: codeToVerify,
        type: "email",
        mode: isReset ? "reset" : undefined
      });

      if (response && response.success === false) {
        throw new Error(response.message || "Invalid or Expired OTP");
      }

      if (isReset) {
        const resetToken = response?.data?.resetToken || (response as any)?.resetToken;
        if (resetToken && typeof window !== "undefined") {
          sessionStorage.setItem("reset-token", resetToken);
        }
        router.push(`/auth/create-new-password?token=${encodeURIComponent(resetToken || "")}&email=${encodeURIComponent(targetEmail)}`);
        return;
      }

      if (response?.data?.token) {
        dispatch(setAuth({ 
          token: response.data.token, 
          user: response.data.user || user 
        }));

        // Auto request & initialize browser push notification and sync with backend
        requestFcmToken().then((fcm) => {
          if (fcm) updateFcmToken(fcm);
        });
      }


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

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API call error:", err);
    }
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
    handleGoogleAuth,
    handleVerifyOtp,
    handleLogout,
    isLoadingLogin: loginMutation.isPending,
    isLoadingVerify: verifyOtpMutation.isPending,
    isLoadingGoogle,
  };
}

