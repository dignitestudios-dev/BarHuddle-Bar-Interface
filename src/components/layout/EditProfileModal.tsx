"use client";

import React, { useState } from "react";
import { useUpdateProfileMutation } from "@/features/auth/api/auth.mutations";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { updateUser, User } from "@/store/slices/auth.slice";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFullName: string;
    currentEmail: string;
    currentAvatarUrl?: string;
    onSave?: (newFullName: string) => void;
}

export function EditProfileModal({
    isOpen,
    onClose,
    currentFullName,
    currentEmail,
    currentAvatarUrl,
    onSave,
}: EditProfileModalProps) {
    const [tempFullName, setTempFullName] = useState(currentFullName);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);

    const updateProfileMutation = useUpdateProfileMutation();
    const dispatch = useAppDispatch();
    const { user: currentUser } = useAppSelector((state: RootState) => state.auth);

    // Prefill data when popup opens or props update
    React.useEffect(() => {
        if (isOpen) {
            setTempFullName(currentFullName || "");
            setPreviewUrl(currentAvatarUrl || null);
            setImageFile(null);
        }
    }, [isOpen, currentFullName, currentAvatarUrl]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 1. Validate image format
            const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
            const ext = "." + file.name.split(".").pop()?.toLowerCase();
            const validExts = [".jpg", ".jpeg", ".png", ".webp"];
            if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
                toast.error("Only PNG, JPG, and WEBP images are supported.");
                if (e.target) e.target.value = "";
                return;
            }

            // 2. Strict 5MB limit
            if (file.size > MAX_FILE_SIZE) {
                toast.error("Profile picture size cannot exceed 5MB. Please upload a smaller image.");
                if (e.target) e.target.value = "";
                return;
            }

            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", tempFullName);
            if (imageFile) {
                if (imageFile.size > MAX_FILE_SIZE) {
                    toast.error("Profile picture size cannot exceed 5MB.");
                    return;
                }
                formData.append("image", imageFile);
            }

            const response = await updateProfileMutation.mutateAsync(formData);
            const serverData = response?.data?.user || response?.data || response?.user || response;

            // Only update profile details and strictly preserve existing auth & subscription state
            const updatedProfile: Partial<User> = {
                name: tempFullName,
            };

            if (serverData && typeof serverData === "object") {
                if (serverData.name) updatedProfile.name = serverData.name;
                if (serverData.profileImage) updatedProfile.profileImage = serverData.profileImage;
                if (serverData.avatar) updatedProfile.avatar = serverData.avatar;
                if (serverData.image) updatedProfile.image = serverData.image;
                if (serverData.profilePicture) updatedProfile.profilePicture = serverData.profilePicture;
            }

            // Keep subscription and claim state intact so no onboarding/subscribe redirect is ever triggered
            if (currentUser?.isSubscribed) {
                updatedProfile.isSubscribed = true;
            }
            if (currentUser?.isClaimed) {
                updatedProfile.isClaimed = currentUser.isClaimed;
            }

            dispatch(updateUser(updatedProfile));
            onSave?.(tempFullName);
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const errMsg = error?.response?.data?.message || error?.message || "Failed to update profile. Please try again.";
            toast.error(errMsg);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-[563px] max-w-[95vw] max-h-[92vh] overflow-y-auto bg-[#05033A] border border-[rgba(124,58,237,0.25)] shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_0px_32px_rgba(124,58,237,0.25)] rounded-[20px] p-[26px_30px] z-10 text-white select-none custom-scrollbar">
                {/* Close Button (X) */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-[20px] right-[20px] w-[40px] h-[40px] rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer border border-white/10"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-[20px] leading-[27px] font-bold capitalize text-white mb-6">
                    Edit Profile
                </h2>

                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    {/* Profile Picture Upload Section */}
                    <div className="flex flex-col items-center mb-5">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border-2 border-[#7C3AED] shadow-md group">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-[#F472B6] flex items-center justify-center font-bold text-lg text-white">
                                    {tempFullName.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}

                            {/* Camera overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                title="Change picture"
                            />
                        </div>
                        <span className="text-[#9D8FD0] text-xs mt-2">Click to change picture (Max 5MB)</span>
                    </div>

                    {/* EMAIL Field */}
                    <div className="w-full flex flex-col gap-1.5 mb-3">
                        <label className="text-[10px] leading-[15px] font-bold text-[#8B7EC8] uppercase tracking-[1px]">
                            EMAIL
                        </label>
                        <div className="w-full h-[44px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] rounded-[12px] px-3.5 flex items-center text-[13px] leading-[18px] text-[rgba(240,238,255,0.7)] cursor-not-allowed select-none">
                            {currentEmail}
                        </div>
                    </div>

                    {/* Security Warning Message */}
                    <div className="flex items-center gap-2 mb-4">
                        <svg
                            className="w-[19px] h-[19px] text-[#D14249] shrink-0"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <span className="text-[12px] leading-[16px] font-normal text-white">
                            For security reasons, your email address cannot be changed.
                        </span>
                    </div>

                    {/* Horizontal Separator Line */}
                    <div className="w-full h-0 border-t border-[rgba(255,255,255,0.11)] mb-5" />

                    {/* FULL NAME Field */}
                    <div className="w-full flex flex-col gap-1.5 mb-6">
                        <label className="text-[10px] leading-[15px] font-bold text-[#8B7EC8] uppercase tracking-[1px]">
                            OWNER NAME
                        </label>
                        <input
                            type="text"
                            value={tempFullName}
                            onChange={(e) => setTempFullName(e.target.value)}
                            placeholder="e.g. James Dorsey"
                            className="w-full h-[44px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] rounded-[12px] px-3.5 text-[13px] leading-[18px] text-white placeholder-[rgba(240,238,255,0.5)] focus:outline-none focus:border-[#9F4FFA] transition-colors"
                            required
                        />
                    </div>

                    {/* Update Profile Button */}
                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="w-full h-[52px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] rounded-[14px] flex items-center justify-center text-white font-extrabold text-[14px] leading-[20px] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                    >
                        {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
