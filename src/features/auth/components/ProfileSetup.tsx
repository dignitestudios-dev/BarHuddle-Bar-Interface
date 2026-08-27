"use client";

import { useState } from "react";
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

const profileSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name cannot exceed 50 characters"),
    bio: z.string().min(1, "Bio is required").max(500, "Bio cannot exceed 500 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSetup() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const updateProfileMutation = useUpdateProfileMutation();
    const { accessToken: token, user } = useAppSelector((state: RootState) => state.auth);
    const { handleLogout } = useAuth();
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
  
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "", bio: "" },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("bio", data.bio);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await updateProfileMutation.mutateAsync(formData);
            
            // Update the user state locally so RouteProxy allows us to proceed
            dispatch(updateUser({ ...response?.data, isProfileCompleted: true }));

            router.push("/app/dashboard"); // redirect to dashboard
        } catch (error) {
            console.error("Profile update error", error);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-[496px] mx-auto py-8">
            {/* Top Right Logout Button */}
            <div className="fixed top-6 right-6 z-50">
                <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-all text-white"
                    title="Log Out"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>

            {/* Header Text */}
            <div className="flex flex-col items-center gap-2 mb-8 text-center max-w-[496px]">
                <h1 className="font-['Manrope',sans-serif] font-semibold text-[36px] leading-[49px] text-white tracking-tight">
                    Complete Your Profile
                </h1>
                <p className="font-['Manrope',sans-serif] font-normal text-[16px] leading-[22px] text-white/80">
                    Let's get to know you better.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border-2 border-[rgba(124,58,237,0.5)]">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Profile Preview" fill className="object-cover" />
                        ) : (
                            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            required
                        />
                    </div>
                    <span className="text-white/60 text-sm mt-2 font-['Manrope',sans-serif]">Upload Picture</span>
                </div>

                {/* Name */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <InputField
                            label="Owner Name"
                            placeholder="John Doe"
                            error={errors.name?.message}
                            {...field}
                        />
                    )}
                />

                {/* Bio */}
                <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-['Manrope',sans-serif] font-semibold text-[14px] leading-[19px] text-white">
                                Bio
                            </label>
                            <textarea
                                placeholder="Bar Manager..."
                                className={`w-full p-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border text-white placeholder-white/70 font-['Manrope',sans-serif] text-[14px] focus:outline-none focus:border-[rgba(124,58,237,0.6)] focus:ring-1 focus:ring-[rgba(124,58,237,0.6)] transition-all resize-none h-32 ${errors.bio ? "border-red-500" : "border-[rgba(124,58,237,0.25)]"}`}
                                {...field}
                            />
                            {errors.bio && (
                                <span className="font-['Manrope',sans-serif] text-xs text-red-400">
                                    {errors.bio.message}
                                </span>
                            )}
                        </div>
                    )}
                />

                <Button type="submit" variant="gradient" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
            </form>
        </div>
    );
}

export default ProfileSetup;
