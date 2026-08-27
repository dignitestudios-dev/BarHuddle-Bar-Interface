"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth.slice";
import { useDeleteAccountMutation } from "@/features/auth/api/auth.mutations";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function DeleteAccountTab() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const deleteAccountMutation = useDeleteAccountMutation();

    const handleConfirmDeletion = async () => {
        try {
            await deleteAccountMutation.mutateAsync();
            setIsConfirmModalOpen(false);
            dispatch(logout());
            toast.success("Your account has been deleted successfully.");
            router.push("/auth/login");
        } catch (error: any) {
            console.error("Delete account error:", error);
            toast.error(error?.response?.data?.message || "Failed to delete account. Please try again.");
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-6 font-['Manrope',sans-serif] relative animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-[32px] h-[32px] rounded-full bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center text-red-400 shrink-0">
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <div>
                    <h2 className="font-extrabold text-[18px] leading-[28px] text-white">
                        Delete Account
                    </h2>
                    <p className="font-normal text-[12px] leading-[16px] text-[#8B7EC8]">
                        Permanently remove your account and all associated venue data.
                    </p>
                </div>
            </div>

            {/* Main Danger Card */}
            <div
                className="w-full max-w-[892px] rounded-[24px] p-6 sm:p-8 flex flex-col justify-between backdrop-blur-md min-h-[380px] animate-in fade-in duration-200"
                style={{
                    background: "rgba(12, 5, 26, 0.75)",
                    border: "0.8px solid rgba(239, 68, 68, 0.3)",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
                }}
            >
                <div className="flex flex-col gap-6">
                    {/* Warning Callout */}
                    <div className="p-4 rounded-[16px] bg-red-500/10 border border-red-500/25 flex items-center gap-3 text-red-400">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-[13px] leading-[18px] text-white/90">
                            Warning: Deleting your account is irreversible. All venue profiles, active events, promotions, and subscriptions will be permanently erased.
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-[16px] leading-[24px] text-white">
                            What happens when you delete your account:
                        </h3>
                        <ul className="flex flex-col gap-2.5 text-[13px] leading-[20px] text-white/80">
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 font-bold">•</span>
                                <span>All your claimed venues will be unlinked and removed from your account.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 font-bold">•</span>
                                <span>All upcoming scheduled events and active promotions will be immediately cancelled.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 font-bold">•</span>
                                <span>Any active subscriptions and boost plans will be terminated.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 font-bold">•</span>
                                <span>Your profile details, email ({user?.email || "registered email"}), and settings will be permanently deleted from our servers.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Delete Button */}
                <div className="flex items-center justify-end mt-8 pt-5 border-t border-[rgba(124,58,237,0.2)]">
                    <button
                        type="button"
                        onClick={() => setIsConfirmModalOpen(true)}
                        className="px-8 h-[48px] rounded-full font-extrabold text-[14px] text-white transition-all cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0px_0px_24px_rgba(239,68,68,0.5)] hover:scale-105 active:scale-95"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                <DialogContent className="max-w-[480px] p-7 bg-[#090530] border border-[rgba(239,68,68,0.3)] shadow-[0px_8px_32px_rgba(0,0,0,0.7),0px_0px_24px_rgba(239,68,68,0.25)] rounded-[24px] font-['Manrope',sans-serif]">
                    <DialogHeader className="flex flex-col items-center text-center gap-3">
                        {/* Red Danger Warning Icon */}
                        <div className="w-[72px] h-[72px] rounded-full bg-[#F01A1A]/15 border border-[#F01A1A]/35 flex items-center justify-center shadow-[0_0_24px_rgba(240,26,26,0.35)] mb-1">
                            <svg className="w-[38px] h-[38px] text-[#F01A1A]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>

                        <DialogTitle className="text-[24px] font-extrabold text-white tracking-tight">
                            Permanent Account Deletion
                        </DialogTitle>

                        <DialogDescription className="text-[14px] leading-[22px] text-white/80 max-w-[380px]">
                            Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your venues, events, and data.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-row items-center gap-3 mt-4 w-full">
                        <button
                            type="button"
                            disabled={deleteAccountMutation.isPending}
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="flex-1 h-[48px] rounded-full bg-[rgba(124,58,237,0.25)] hover:bg-[rgba(124,58,237,0.4)] border border-[rgba(124,58,237,0.4)] text-white font-bold text-[15px] cursor-pointer transition-all active:scale-95"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={deleteAccountMutation.isPending}
                            onClick={handleConfirmDeletion}
                            className="flex-1 h-[48px] rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0px_0px_24px_rgba(239,68,68,0.5)] text-white font-extrabold text-[15px] cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {deleteAccountMutation.isPending ? "Deleting..." : "Yes, Delete"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DeleteAccountTab;
