"use client";

import React, { useState, useRef } from "react";
import { SuccessModal } from "@/components/ui/success-modal";

export interface ClaimFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitted?: () => void;
}

export function ClaimFormModal({ isOpen, onClose, onSubmitted }: ClaimFormModalProps) {
    const [name, setName] = useState("James Smith");
    const [email, setEmail] = useState("jamessmith@gmail.com");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [hasDefaultFile, setHasDefaultFile] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
            setHasDefaultFile(true);
        }
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedFile(null);
        setHasDefaultFile(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
    };

    return (
        <>
            {/* Claim Form Modal Backdrop */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
                {/* Modal Container */}
                <div className="relative w-full max-w-[476px] bg-[#05033A] border border-[rgba(124,58,237,0.3)] shadow-[0px_4px_25px_rgba(0,0,0,0.5)] rounded-[16px] p-6 sm:p-7 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize">
                            Claim Form
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

                    {/* Form Fields */}
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
                                placeholder="James Smith"
                                className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
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
                                placeholder="jamessmith@gmail.com"
                                className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
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
                                className="w-full h-[151px] rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[rgba(124,58,237,0.18)] transition-all group"
                            >
                                {/* Folder Upload Icon */}
                                <div className="w-[29px] h-[29px] flex items-center justify-center text-[#B45FF2]">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h3.93a2 2 0 011.66.9L15 8h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="font-normal text-[15px] leading-[20px] text-white/80 group-hover:text-white transition-colors">
                                    Choose file to upload
                                </span>
                            </div>

                            {/* Uploaded File Preview Thumbnail (PDF format) */}
                            {hasDefaultFile && (
                                <div className="relative mt-2 w-[90px] h-[90px] rounded-[16px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex flex-col items-center justify-center gap-1">
                                    {/* Red Circular Close Badge */}
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                                        aria-label="Remove file"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    {/* Red PDF Icon Illustration */}
                                    <div className="w-10 h-12 bg-[#DC1D00] rounded-md relative flex flex-col items-center justify-center p-1 shadow">
                                        <span className="font-bold text-[9px] leading-[10px] text-white bg-white/20 px-1 py-0.5 rounded tracking-tighter">
                                            PDF
                                        </span>
                                        <svg className="w-4 h-4 text-white mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] text-white/70 truncate max-w-[80px]">
                                        {uploadedFile ? uploadedFile.name : "Proof.pdf"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Submit Request CTA Button */}
                        <button
                            type="submit"
                            className="w-full h-[48px] rounded-[24px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center font-semibold text-[16px] leading-[22px] text-white capitalize hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-2"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>

            {/* Success Modal Popup on Submission */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    onClose();
                    onSubmitted?.();
                }}
                title="Request Submitted"
                description="Your request has been sent to the admin for review. As soon as it is approved, you'll be notified via email."
            />
        </>
    );
}

export default ClaimFormModal;
