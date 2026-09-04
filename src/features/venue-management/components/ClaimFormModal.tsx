"use client";

import React, { useState, useRef, useEffect } from "react";
import { useClaimVenueMutation } from "../api/venue.mutations";
import { useGetMeMutation } from "@/features/auth/api/auth.mutations";
import { useAppDispatch } from "@/store";
import { updateUser } from "@/store/slices/auth.slice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";

export interface ClaimFormModalProps {
    isOpen: boolean;
    venue?: any;
    onClose: () => void;
    onSubmitted?: () => void;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"];
const ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];

export function ClaimFormModal({ isOpen, venue, onClose, onSubmitted }: ClaimFormModalProps) {
    const { mutateAsync: claimVenue, isPending: isClaiming } = useClaimVenueMutation();
    const { mutateAsync: getMe, isPending: isFetchingMe } = useGetMeMutation();
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [hasDefaultFile, setHasDefaultFile] = useState(false);
    const [fileError, setFileError] = useState<string>("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(user?.name || "");
            setEmail(user?.email || "");
            setIsSubmitted(false);
            setUploadedFile(null);
            setHasDefaultFile(false);
            setFileError("");
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // 1. Check file size against allowed limit
            if (file.size > MAX_FILE_SIZE_BYTES) {
                const uploadedMb = (file.size / (1024 * 1024)).toFixed(1);
                const errorMsg = `File size exceeds the allowed limit of ${MAX_FILE_SIZE_MB}MB (${uploadedMb}MB uploaded). Please upload a smaller document.`;
                setFileError(errorMsg);
                toast.error(errorMsg);
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            // 2. Check file format / extension
            const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
            const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);
            const isValidMime = ALLOWED_MIME_TYPES.includes(file.type) || file.type === "";

            if (!isValidExtension && !isValidMime) {
                const errorMsg = "Invalid file type. Supported formats are PDF, PNG, JPG, and JPEG.";
                setFileError(errorMsg);
                toast.error(errorMsg);
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            setFileError("");
            setUploadedFile(file);
            setHasDefaultFile(true);
        }
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedFile(null);
        setHasDefaultFile(false);
        setFileError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!venue) {
            toast.error("No venue selected");
            return;
        }

        if (!uploadedFile) {
            setFileError("Please upload an ownership proof document.");
            toast.error("Please upload an ownership proof document.");
            return;
        }

        const formData = new FormData();
        formData.append("venueId", venue.id || venue._id || venue.placeId);
        formData.append("name", name || user?.name || "Owner");
        formData.append("email", email || user?.email || "");
        formData.append("ownershipProof", uploadedFile);

        try {
            setFileError("");
            await claimVenue(formData);
            
            // Hit /users API to fetch updated user state and update Redux
            const profileResponse = await getMe();
            if (profileResponse?.user) {
                dispatch(updateUser(profileResponse.user));
            } else if (profileResponse?.data?.user) {
                dispatch(updateUser(profileResponse.data.user));
            } else if (profileResponse?.data) {
                dispatch(updateUser(profileResponse.data));
            }

            toast.success("Ownership documents submitted successfully!");
            onClose();
            try {
                onSubmitted?.();
            } catch (cbErr) {
                console.error("Error in onSubmitted callback:", cbErr);
            }
        } catch (error: any) {
            console.error("Failed to claim venue:", error);
            const backendMsg = error?.response?.data?.message || error?.message || "";
            let displayMsg = backendMsg;

            if (
                error?.response?.status === 413 ||
                backendMsg.toLowerCase().includes("large") ||
                backendMsg.toLowerCase().includes("size") ||
                backendMsg.toLowerCase().includes("limit") ||
                backendMsg.toLowerCase().includes("entity") ||
                backendMsg.toLowerCase().includes("payload")
            ) {
                displayMsg = `File size exceeds the allowed limit of ${MAX_FILE_SIZE_MB}MB. Please choose a smaller document.`;
            } else if (!displayMsg) {
                displayMsg = "Failed to submit ownership documents. Please verify your file size and format.";
            }

            setFileError(displayMsg);
            toast.error(displayMsg);
        }
    };

    const venueName = venue?.name || venue?.title || "your venue";

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Modal Container */}
            <div className="relative w-full max-w-[490px] bg-[#05033A] border border-[rgba(124,58,237,0.3)] shadow-[0px_4px_30px_rgba(0,0,0,0.6)] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize">
                        {isSubmitted ? "Claim Under Review" : "Claim Form"}
                    </h2>

                    {/* Close Icon Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!isSubmitted ? (
                    /* Initial Form State: Document Upload */
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                        {/* Name Field */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/50 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/50 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                                required
                            />
                        </div>

                        {/* Ownership Proof Section */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Ownership Proof
                            </label>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {/* Upload Dropzone Box */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full h-[135px] rounded-[24px] bg-[rgba(124,58,237,0.12)] border ${fileError ? 'border-red-500/50 bg-red-500/5' : 'border-[rgba(124,58,237,0.25)]'} flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[rgba(124,58,237,0.18)] transition-all group p-4 text-center`}
                            >
                                <div className="w-[32px] h-[32px] flex items-center justify-center text-[#B45FF2]">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h3.93a2 2 0 011.66.9L15 8h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="font-medium text-[14px] leading-[19px] text-white/90 group-hover:text-white transition-colors">
                                    {hasDefaultFile ? "Change uploaded document" : "Choose document to upload"}
                                </span>
                                <span className="font-normal text-[12px] leading-[16px] text-white/50">
                                    Supports PDF, JPG, PNG up to {MAX_FILE_SIZE_MB}MB
                                </span>
                            </div>

                            {/* Inline File Error Banner */}
                            {fileError && (
                                <div className="flex items-start gap-2 p-3 rounded-[16px] bg-red-500/10 border border-red-500/25 text-red-400 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{fileError}</span>
                                </div>
                            )}

                            {/* Uploaded File Preview Card */}
                            {hasDefaultFile && uploadedFile && (
                                <div className="relative mt-1 p-3 rounded-[16px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 bg-[#DC1D00] rounded-lg shrink-0 flex flex-col items-center justify-center p-1 shadow">
                                            <span className="font-bold text-[8px] leading-[9px] text-white bg-white/20 px-1 py-0.5 rounded tracking-tighter uppercase">
                                                {uploadedFile.name.split('.').pop() || 'DOC'}
                                            </span>
                                            <svg className="w-3.5 h-3.5 text-white mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-semibold text-white truncate max-w-[240px]">
                                                {uploadedFile.name}
                                            </span>
                                            <span className="text-[11px] text-[#9D8FD0]">
                                                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                                        aria-label="Remove file"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Request CTA Button */}
                        <button
                            type="submit"
                            disabled={isClaiming || isFetchingMe || !hasDefaultFile}
                            className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5)] flex items-center justify-center font-bold text-[15px] leading-[22px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isClaiming || isFetchingMe ? "Submitting Documents..." : "Submit Request"}
                        </button>
                    </form>
                ) : (
                    /* Submitted State: Relevant Under-Review UI inside the modal */
                    <div className="w-full flex flex-col items-center text-center gap-5 py-2 animate-in fade-in duration-300">
                        {/* Glowing Animated Icon */}
                        <div className="relative w-20 h-20 flex items-center justify-center my-2">
                            <div className="absolute inset-0 bg-[#E8FF57] rounded-full blur-[24px] opacity-25 animate-pulse" />
                            <div className="w-16 h-16 rounded-full bg-[rgba(232,255,87,0.12)] border border-[rgba(232,255,87,0.4)] flex items-center justify-center z-10">
                                <svg className="w-8 h-8 text-[#E8FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="flex flex-col gap-2">
                            <h3 className="font-extrabold text-[22px] leading-[28px] text-white">
                                Documents Under Review
                            </h3>
                            <p className="text-[14px] leading-[22px] text-[#9D8FD0] max-w-[380px]">
                                Your claim request and ownership proof for <span className="text-white font-semibold">{venueName}</span> have been submitted successfully.
                            </p>
                        </div>

                        {/* Status Details Card */}
                        <div className="w-full p-4 rounded-[20px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] flex flex-col gap-3 text-left">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-medium text-[#C4B5FD]">Status</span>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8FF57]/15 border border-[#E8FF57]/30 text-[#E8FF57]">
                                    Pending Approval
                                </span>
                            </div>
                            <div className="h-[1px] w-full bg-[rgba(124,58,237,0.2)]" />
                            <div className="flex flex-col gap-1.5 text-[12px] leading-[18px] text-[#9D8FD0]">
                                <div className="flex items-start gap-2">
                                    <span className="text-[#E8FF57]">•</span>
                                    <span>Verification typically takes 24–48 hours.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-[#E8FF57]">•</span>
                                    <span>You will receive an email confirmation once verified.</span>
                                </div>
                            </div>
                        </div>

                        {/* Got It Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full h-[48px] rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] font-bold text-[14px] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-1"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClaimFormModal;
