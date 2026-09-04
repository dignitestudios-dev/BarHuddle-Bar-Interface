"use client";

import React, { useState, useEffect } from "react";
import { useUpdateVenueMutation } from "@/features/venue-management/api/venue.mutations";
import { toast } from "sonner";

interface EditVenueModalProps {
    isOpen: boolean;
    onClose: () => void;
    venueId: string;
    initialName: string;
    initialAddress: string;
    onSuccess?: () => void;
}

export function EditVenueModal({
    isOpen,
    onClose,
    venueId,
    initialName,
    initialAddress,
    onSuccess,
}: EditVenueModalProps) {
    const [name, setName] = useState(initialName);
    const [address, setAddress] = useState(initialAddress);

    const updateVenueMutation = useUpdateVenueMutation(venueId);

    useEffect(() => {
        if (isOpen) {
            setName(initialName || "");
            setAddress(initialAddress || "");
        }
    }, [isOpen, initialName, initialAddress]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Venue name cannot be empty.");
            return;
        }

        try {
            await updateVenueMutation.mutateAsync({
                id: venueId,
                data: {
                    name: name.trim(),
                    address: address.trim(),
                },
            });
            toast.success("Venue details updated successfully!");
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error("Failed to update venue", error);
            const msg = error?.response?.data?.message || error?.message || "Failed to update venue details.";
            toast.error(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative w-full max-w-[520px] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 shadow-[0px_16px_48px_rgba(0,0,0,0.6)] border border-[rgba(124,58,237,0.35)]"
                style={{ background: "rgba(14, 7, 34, 0.95)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.4)] flex items-center justify-center text-[#E8FF57]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-white">Edit Venue Details</h3>
                            <p className="text-xs text-[#8B7EC8]">Update your establishment's public information</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Informational Banner */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)] text-xs text-[#C4B5FD]">
                    <svg className="w-4 h-4 text-[#E8FF57] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Venue Name and Address are synchronized with Google and cannot be edited.</span>
                </div>

                {/* Form */}
                <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="flex flex-col gap-4">
                    {/* Venue Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#A855F7]">
                            Venue Name (Google Verified)
                        </label>
                        <input
                            type="text"
                            value={name}
                            readOnly
                            disabled
                            placeholder="Venue Name"
                            className="w-full h-12 px-4 rounded-xl bg-[#140E50]/50 border border-[rgba(124,58,237,0.2)] text-white/70 text-sm cursor-not-allowed opacity-75"
                        />
                    </div>

                    {/* Venue Address */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#A855F7]">
                            Address (Google Verified)
                        </label>
                        <textarea
                            value={address}
                            readOnly
                            disabled
                            rows={3}
                            className="w-full p-3.5 rounded-xl bg-[#140E50]/50 border border-[rgba(124,58,237,0.2)] text-white/70 text-sm resize-none cursor-not-allowed opacity-75"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[rgba(124,58,237,0.2)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/15 text-white transition-all"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditVenueModal;
