import { useMutation } from "@tanstack/react-query";
import {

  login,
  loginWithGoogle,
  verifyOtp,
  resendOtp,
  checkEmail,
  forgotPassword,
  resetPassword,
  updateProfile,
  getMe,
  updatePassword,
  deleteVenueOwnerAccount,
  updateFcmToken,
  LoginPayload,
  GoogleLoginPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
} from "./auth.service";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}

export function useGoogleLoginMutation() {
  return useMutation({
    mutationFn: (payload: string | GoogleLoginPayload) => loginWithGoogle(payload),
  });
}



export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (email: string) => resendOtp(email),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
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

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: () => deleteVenueOwnerAccount(),
  });
}

export function useUpdateFcmTokenMutation() {
  return useMutation({
    mutationFn: (fcmToken: string) => updateFcmToken(fcmToken),
  });
}

