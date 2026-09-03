"use client";

import React, { useState, useRef } from "react";
import { useAddGalleryImageMutation } from "@/features/venue-management/api/venue.mutations";
import { toast } from "sonner";

interface UploadGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    venueId: string;
    onSuccess?: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function UploadGalleryModal({
    isOpen,
    onClose,
    venueId,
    onSuccess,
}: UploadGalleryModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const addGalleryMutation = useAddGalleryImageMutation(venueId);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate format
            const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
            const ext = "." + file.name.split(".").pop()?.toLowerCase();
            const validExts = [".jpg", ".jpeg", ".png", ".webp"];
            if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
                toast.error("Only PNG, JPG, and WEBP images are supported.");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            // Size check
            if (file.size > MAX_IMAGE_SIZE) {
                toast.error("Image file size cannot exceed 5MB. Please choose a smaller image.");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error("Please select an image to upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            await addGalleryMutation.mutateAsync({
                venueId,
                formData,
            });

            toast.success("Image uploaded to venue gallery!");
            handleClear();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error("Failed to upload gallery image", error);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to upload gallery image.";
            toast.error(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative w-full max-w-[500px] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 shadow-[0px_16px_48px_rgba(0,0,0,0.6)] border border-[rgba(124,58,237,0.35)]"
                style={{ background: "rgba(14, 7, 34, 0.95)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.4)] flex items-center justify-center text-[#E8FF57]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-white">Add Gallery Photo</h3>
                            <p className="text-xs text-[#8B7EC8]">Upload showcase photos for your venue</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Upload Drop Area */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative w-full h-56 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden transition-all ${
                            previewUrl
                                ? "border-[rgba(124,58,237,0.6)] bg-black/50"
                                : "border-[rgba(124,58,237,0.3)] bg-[#140E50]/40 hover:bg-[#140E50]/70 hover:border-[#7C3AED]"
                        }`}
                    >
                        {previewUrl ? (
                            <>
                                <img
                                    src={previewUrl}
                                    alt="Upload preview"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-black/70">
                                        Click to replace
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2.5 text-center">
                                <div className="w-12 h-12 rounded-full bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#C4B5FD]">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-white">
                                    Click to browse image
                                </span>
                                <span className="text-xs text-[#8B7EC8]">
                                    PNG, JPG, or WEBP up to 5MB
                                </span>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/jpg"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-3 pt-4 border-t border-[rgba(124,58,237,0.2)]">
                        <button
                            type="button"
                            onClick={() => {
                                handleClear();
                                onClose();
                            }}
                            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#B7AADC] hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedFile || addGalleryMutation.isPending}
                            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] hover:brightness-110 active:scale-95 text-white shadow-[0px_4px_16px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:pointer-events-none transition-all"
                        >
                            {addGalleryMutation.isPending ? "Uploading..." : "Add to Gallery"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadGalleryModal;
