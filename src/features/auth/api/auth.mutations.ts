import { useMutation } from "@tanstack/react-query";
import { login, verifyOtp, LoginPayload, VerifyOtpPayload, AuthResponse } from "./auth.service";

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
