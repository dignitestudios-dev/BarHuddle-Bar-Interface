"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, InputField } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useUpdateProfileMutation } from "../api/auth.mutations";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { updateUser } from "@/store/slices/auth.slice";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { toast } from "sonner";

const profileSchema = z.object({
    name: z.string().min(1, "Owner name is required").max(50, "Name cannot exceed 50 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProfileSetup() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const updateProfileMutation = useUpdateProfileMutation();
    const { user } = useAppSelector((state: RootState) => state.auth);
    const { handleLogout } = useAuth();
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(user?.profileImage || null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
  
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
            });
            if (user.profileImage) {
                setImagePreview(user.profileImage);
            }
        }
    }, [user, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
            const ext = "." + file.name.split(".").pop()?.toLowerCase();
            const validExts = [".jpg", ".jpeg", ".png", ".webp"];
            if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
                toast.error("Only PNG, JPG, and WEBP images are supported.");
                if (e.target) e.target.value = "";
                return;
            }

            if (file.size > MAX_PROFILE_IMAGE_SIZE) {
                toast.error("Profile picture size cannot exceed 5MB. Please upload a smaller image.");
                if (e.target) e.target.value = "";
                return;
            }

            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            if (imageFile) {
                if (imageFile.size > MAX_PROFILE_IMAGE_SIZE) {
                    toast.error("Profile picture size cannot exceed 5MB.");
                    return;
                }
                formData.append("image", imageFile);
            }

            const response = await updateProfileMutation.mutateAsync(formData);
            
            // Update the user state locally so RouteProxy allows dashboard access
            const updatedUserData = response?.data?.user || response?.data || response?.user || {};
            dispatch(updateUser({ ...updatedUserData, isProfileCompleted: true }));
            toast.success("Profile setup completed successfully!");

            router.push("/app/dashboard");
        } catch (error: any) {
            console.error("Profile update error", error);
            toast.error(error?.response?.data?.message || "Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[420px] mx-auto py-6 font-['Manrope',sans-serif] animate-in fade-in duration-300">
            {/* Top Right Logout Button */}
            <div className="fixed top-6 right-6 z-50">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-all text-white cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                    title="Log Out"
                    aria-label="Log Out"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>

            {/* Header Text */}
            <div className="flex flex-col items-center gap-2 mb-6 text-center w-full">
                <h1 className="font-extrabold text-[32px] sm:text-[36px] leading-[42px] sm:leading-[48px] text-white tracking-tight">
                    Complete Your Profile
                </h1>
                <p className="font-normal text-[15px] leading-[22px] text-white/80">
                    Set up your venue owner profile to get started.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                {/* Profile Pic Upload Section */}
                <div className="flex flex-col items-center gap-2.5 mb-1">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-[110px] h-[110px] rounded-full bg-[rgba(124,58,237,0.15)] border-2 border-[rgba(124,58,237,0.4)] hover:border-[#B45FF2] flex items-center justify-center hover:bg-[rgba(124,58,237,0.25)] active:scale-95 transition-all overflow-hidden cursor-pointer group shadow-[0_0_25px_rgba(124,58,237,0.25)]"
                    >
                        {imagePreview ? (
                            <Image
                                src={imagePreview}
                                alt="Profile Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-[#B45FF2] group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        )}

                        {/* Overlay Camera Badge */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>

                    <span className="font-medium text-[14px] leading-[19px] text-white/80">
                        {imagePreview ? "Change Profile Picture" : "Upload Profile Picture"}
                    </span>
                </div>

                {/* Owner Name Field */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <InputField
                            label="Owner Name"
                            placeholder="e.g. James Smith"
                            error={errors.name?.message}
                            {...field}
                        />
                    )}
                />

                {/* Save Profile Button */}
                <Button
                    type="submit"
                    variant="gradient"
                    disabled={updateProfileMutation.isPending}
                    className="w-full h-[52px] rounded-full font-bold text-[15px] cursor-pointer mt-2"
                >
                    {updateProfileMutation.isPending ? "Saving Profile..." : "Save Profile"}
                </Button>
            </form>
        </div>
    );
}

export default ProfileSetup;
