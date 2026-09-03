"use client";

import React, { useState, useRef } from "react";
import { cleanImageUrl, DEFAULT_VENUE_IMAGE, handleImageError } from "@/utils/image";

export interface EditDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
}

const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=300&q=80",
];

const DAYS = [
    { label: "M", full: "Monday" },
    { label: "T", full: "Tuesday" },
    { label: "W", full: "Wednesday" },
    { label: "T", full: "Thursday" },
    { label: "F", full: "Friday" },
    { label: "S", full: "Saturday" },
    { label: "S", full: "Sunday" },
];

export function EditDetailsModal({ isOpen, onClose, onSave }: EditDetailsModalProps) {
    const [name, setName] = useState("James Smith");
    const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5]); // M, T, W, T, F, S active
    const [fromTime, setFromTime] = useState("06:00");
    const [fromPeriod, setFromPeriod] = useState("AM");
    const [toTime, setToTime] = useState("06:00");
    const [toPeriod, setToPeriod] = useState("AM");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    if (!isOpen) return null;

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleDay = (dayIdx: number) => {
        setSelectedDays((prev) =>
            prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx]
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setImages((prev) => [...prev, ...newFiles]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Modal Container */}
            <div className="relative w-full max-w-[476px] bg-[#05033A] border border-[rgba(124,58,237,0.3)] shadow-[0px_4px_25px_rgba(0,0,0,0.5)] rounded-[16px] p-6 sm:p-7 flex flex-col gap-6 max-h-[90vh] overflow-y-auto scrollbar-none">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize">
                        Edit Details
                    </h2>

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

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
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

                    {/* Upload Images Section */}
                    <div className="flex flex-col gap-3 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Upload Images
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Dropzone Container */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-[151px] rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-[rgba(124,58,237,0.18)] transition-all group"
                        >
                            {/* Gallery Icon */}
                            <div className="w-[30px] h-[30px] flex items-center justify-center text-[#B45FF2]">
                                <svg className="w-7.5 h-7.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-medium text-[15px] leading-[20px] text-white/80 group-hover:text-white transition-colors">
                                Upload Image
                            </span>
                            <span className="font-normal text-[15px] leading-[20px] text-white/80">
                                Upto 20 Mbs, PDF,JPG,PNG
                            </span>
                        </div>

                        {/* Image Thumbnails Row */}
                        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1.5 w-full">
                            {images.map((imgUrl, idx) => (
                                <div
                                    key={idx}
                                    className="relative w-[76px] h-[90px] rounded-[12px] overflow-hidden shrink-0 border border-[rgba(124,58,237,0.3)] bg-purple-950/60"
                                >
                                    <img
                                        src={cleanImageUrl(imgUrl, DEFAULT_VENUE_IMAGE)}
                                        alt=""
                                        onError={(e) => handleImageError(e, DEFAULT_VENUE_IMAGE)}
                                        className="w-full h-full object-cover opacity-80"
                                    />

                                    {/* Red Close Circle Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                                        aria-label="Remove image"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-white/10 my-1" />

                    {/* Operating Hours Section */}
                    <div className="flex flex-col gap-4 w-full">
                        <h3 className="font-bold text-[18px] leading-[25px] text-white">
                            Operating Hours
                        </h3>

                        {/* Select Days */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Select Days
                            </label>
                            <div className="flex items-center justify-between gap-1.5 w-full">
                                {DAYS.map((day, idx) => {
                                    const isSelected = selectedDays.includes(idx);
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => toggleDay(idx)}
                                            className={`flex-1 h-10 rounded-[12px] flex items-center justify-center font-semibold text-[14px] leading-[19px] transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-[rgba(124,58,237,0.12)] border border-[#B45FF2] shadow-[0px_1px_10.5px_rgba(194,122,255,0.38)] text-[#E8C7FF]"
                                                    : "bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white/70 hover:text-white"
                                            }`}
                                        >
                                            {day.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* From & To Time Inputs Row */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {/* From Time */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-semibold text-[14px] leading-[19px] text-white">
                                    From
                                </label>
                                <div className="flex items-center justify-between h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)]">
                                    <input
                                        type="text"
                                        value={fromTime}
                                        onChange={(e) => setFromTime(e.target.value)}
                                        className="w-16 bg-transparent text-white text-[14px] leading-[19px] focus:outline-none"
                                    />
                                    <div className="flex items-center gap-1">
                                        <span className="h-4 w-[1px] bg-white/20 mr-1" />
                                        <select
                                            value={fromPeriod}
                                            onChange={(e) => setFromPeriod(e.target.value)}
                                            className="bg-transparent text-white text-[14px] font-medium focus:outline-none cursor-pointer"
                                        >
                                            <option value="AM" className="bg-[#05033A] text-white">AM</option>
                                            <option value="PM" className="bg-[#05033A] text-white">PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* To Time */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-semibold text-[14px] leading-[19px] text-white">
                                    To
                                </label>
                                <div className="flex items-center justify-between h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)]">
                                    <input
                                        type="text"
                                        value={toTime}
                                        onChange={(e) => setToTime(e.target.value)}
                                        className="w-16 bg-transparent text-white text-[14px] leading-[19px] focus:outline-none"
                                    />
                                    <div className="flex items-center gap-1">
                                        <span className="h-4 w-[1px] bg-white/20 mr-1" />
                                        <select
                                            value={toPeriod}
                                            onChange={(e) => setToPeriod(e.target.value)}
                                            className="bg-transparent text-white text-[14px] font-medium focus:outline-none cursor-pointer"
                                        >
                                            <option value="AM" className="bg-[#05033A] text-white">AM</option>
                                            <option value="PM" className="bg-[#05033A] text-white">PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save CTA Button */}
                    <button
                        type="submit"
                        className="w-full h-[48px] rounded-[24px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center font-semibold text-[16px] leading-[22px] text-white capitalize hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-2"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditDetailsModal;
