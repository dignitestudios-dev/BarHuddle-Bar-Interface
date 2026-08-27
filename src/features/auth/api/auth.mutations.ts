import { useMutation } from "@tanstack/react-query";
import { login, verifyOtp, checkEmail, updateProfile, getMe, updatePassword, LoginPayload, VerifyOtpPayload, UpdatePasswordPayload } from "./auth.service";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
  });
}

export function useCheckEmailMutation() {
  return useMutation({
    mutationFn: (email: string) => checkEmail(email),
  });
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
  });
}

export function useGetMeMutation() {
  return useMutation({
    mutationFn: () => getMe(),
  });
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) => updatePassword(payload),
  });
}
