"use client";

import React from "react";
import { useRemoveGalleryImageMutation } from "@/features/venue-management/api/venue.mutations";
import { cleanImageUrl, DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";
import { toast } from "sonner";

interface DeleteGalleryConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    venueId: string;
    imageId: string;
    imageUrl: string;
    onSuccess?: () => void;
}

export function DeleteGalleryConfirmModal({
    isOpen,
    onClose,
    venueId,
    imageId,
    imageUrl,
    onSuccess,
}: DeleteGalleryConfirmModalProps) {
    const removeGalleryMutation = useRemoveGalleryImageMutation(venueId);

    if (!isOpen) return null;

    const handleDelete = async () => {
        const imagePayload = imageUrl || imageId;
        if (!venueId || !imagePayload) {
            toast.error("Missing venue or image identifier.");
            return;
        }

        try {
            await removeGalleryMutation.mutateAsync({
                venueId,
                image: imagePayload,
            });

            toast.success("Photo removed from gallery successfully!");
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error("Failed to delete gallery image", error);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete photo from gallery.";
            toast.error(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative w-full max-w-[460px] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 shadow-[0px_20px_60px_rgba(0,0,0,0.8)] border border-red-500/30"
                style={{ background: "rgba(18, 8, 30, 0.96)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <h3 className="text-lg sm:text-xl font-extrabold text-white">
                            Delete Gallery Photo?
                        </h3>
                        <p className="text-xs text-[#9D8FD0] leading-relaxed">
                            This action will permanently delete this image from your venue's public gallery and discovery apps.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Thumbnail Preview */}
                {imageUrl && (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-inner">
                        <img
                            src={cleanImageUrl(imageUrl, DEFAULT_VENUE_IMAGE)}
                            alt=""
                            onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-2.5 left-3 text-[11px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                            ID: {imageId.length > 20 ? `${imageId.slice(0, 18)}...` : imageId}
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={removeGalleryMutation.isPending}
                        className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#B7AADC] hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={removeGalleryMutation.isPending}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white shadow-[0px_4px_16px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:pointer-events-none transition-all"
                    >
                        {removeGalleryMutation.isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete Photo</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteGalleryConfirmModal;
