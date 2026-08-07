"use client";

import React, { useState, useRef } from "react";

export interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: (eventData: any) => void;
}

const DEFAULT_EVENT_IMAGES = [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80",
];

export function CreateEventModal({
    isOpen,
    onClose,
    onCreate,
}: CreateEventModalProps) {
    const [eventName, setEventName] = useState("Ladies Night");
    const [date, setDate] = useState("Fri Jun 27, 2026");
    const [startTime, setStartTime] = useState("09:00 PM");
    const [endTime, setEndTime] = useState("02:00 AM");
    const [artist, setArtist] = useState("");
    const [dj, setDj] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<string[]>(DEFAULT_EVENT_IMAGES);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    if (!isOpen) return null;

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
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
        onCreate?.({
            eventName,
            date,
            startTime,
            endTime,
            artist,
            dj,
            description,
            images,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Modal Container (562px width) */}
            <div className="relative w-full max-w-[562px] bg-[#05033A] border border-[rgba(124,58,237,0.3)] shadow-[0px_4px_25px_rgba(0,0,0,0.5)] rounded-[16px] p-6 sm:p-7 flex flex-col gap-6 max-h-[90vh] overflow-y-auto scrollbar-none">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize">
                        Create Event
                    </h2>

                    {/* Close Icon Button (40x40) */}
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

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
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
                                        src={imgUrl}
                                        alt={`Event ${idx + 1}`}
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

                    {/* Event Name Field */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Event Name
                        </label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Ladies Night"
                            className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                            required
                        />
                    </div>

                    {/* Date Field */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Date
                        </label>
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="Fri Jun 27, 2026"
                            className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                            required
                        />
                    </div>

                    {/* Start Time & End Time Row */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                        {/* Start Time */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Start Time
                            </label>
                            <input
                                type="text"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="09:00 PM"
                                className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                                required
                            />
                        </div>

                        {/* End Time */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                End Time
                            </label>
                            <input
                                type="text"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="02:00 AM"
                                className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Artist Field */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Artist
                        </label>
                        <input
                            type="text"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            placeholder="Select Artist"
                            className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                        />
                    </div>

                    {/* DJ Field */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            DJ
                        </label>
                        <input
                            type="text"
                            value={dj}
                            onChange={(e) => setDj(e.target.value)}
                            placeholder="Select DJ"
                            className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                        />
                    </div>

                    {/* Description Field */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write here"
                            className="w-full h-[120px] p-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors resize-none"
                        />
                    </div>

                    {/* Create Now CTA Button */}
                    <button
                        type="submit"
                        className="w-full h-[48px] rounded-[24px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center font-semibold text-[16px] leading-[22px] text-white capitalize hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-2"
                    >
                        Create Now
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEventModal;
