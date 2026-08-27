import axiosInstance from "@/lib/axios";
import { User } from "@/store/slices/auth.slice";

export interface LoginPayload {
  email: string;
  password?: string;
  role?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface CheckEmailResponse {
  success: boolean;
  message: string;
  data: {
    exists: boolean;
  };
}

export interface AuthLoginResponse {
  success: boolean;
  message: string;
  data: {
    requiresOtp: boolean;
    email: string;
    user: User;
    token?: string;
  };
}

export async function checkEmail(email: string): Promise<CheckEmailResponse> {
  const { data } = await axiosInstance.post<CheckEmailResponse>("/auth/check-email", { email });
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthLoginResponse> {
  const { data } = await axiosInstance.post<AuthLoginResponse>("/auth", {
    ...payload,
    method: "email",
    role: "bar_owner"
  });
  return data;
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>("/auth/verify-otp", payload);
  return data;
}

export async function updateProfile(formData: FormData): Promise<any> {
  const { data } = await axiosInstance.put("/venue-owner/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
}
export async function getMe(): Promise<any> {
  const { data } = await axiosInstance.get("/users");
  return data;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function updatePassword(payload: UpdatePasswordPayload): Promise<any> {
  try {
    const { data } = await axiosInstance.put("/venue-owner/profile/password", payload);
    return data;
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.status === 405) {
      const { data } = await axiosInstance.post("/venue-owner/profile/password", payload);
      return data;
    }
    throw error;
  }
}
