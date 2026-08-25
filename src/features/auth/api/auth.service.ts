import axiosInstance from "@/lib/axios";
import { User } from "@/store/slices/auth.slice";

export interface LoginPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export async function login(payload: LoginPayload): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<{ message: string }>("/auth", {
    ...payload,
    method: "email"
  });
  return data;
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>("/auth/verify-otp", payload);
  return data;
}
