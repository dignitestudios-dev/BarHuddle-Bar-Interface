"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const createEventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
    date: z.date({
        message: "Date is required",
    }),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    artist: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
    images: z.array(z.any()),
}).refine(
    (data) => {
        if (data.startTime && data.endTime) {
            return data.startTime !== data.endTime;
        }
        return true;
    },
    {
        message: "End time cannot be the same as start time",
        path: ["endTime"],
    }
);

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

export interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: (eventData: CreateEventFormValues) => void;
    onUpdate?: (id: string, eventData: CreateEventFormValues) => void;
    eventToEdit?: any | null;
}

export function CreateEventModal({
    isOpen,
    onClose,
    onCreate,
    onUpdate,
    eventToEdit,
}: CreateEventModalProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateEventFormValues>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            title: "",
            date: undefined,
            startTime: "",
            endTime: "",
            artist: "",
            description: "",
            images: [],
        },
    });

    const watchImages = watch("images");

    // Pre-populate fields if editing or reset if creating
    useEffect(() => {
        if (isOpen) {
            if (eventToEdit) {
                const startDate = eventToEdit.startAt || eventToEdit.date ? new Date(eventToEdit.startAt || eventToEdit.date) : undefined;
                const endDate = eventToEdit.endAt ? new Date(eventToEdit.endAt) : undefined;

                reset({
                    title: eventToEdit.title || eventToEdit.name || "",
                    date: startDate,
                    startTime: startDate ? format(startDate, "HH:mm") : "20:00",
                    endTime: endDate ? format(endDate, "HH:mm") : "02:00",
                    artist: eventToEdit.artist || "",
                    description: eventToEdit.description || "",
                    images: [],
                });

                const existingImg = eventToEdit.banner || eventToEdit.coverImage || eventToEdit.imageUrl || eventToEdit.images?.[0];
                if (existingImg) {
                    setImagePreviews([existingImg]);
                } else {
                    setImagePreviews([]);
                }
            } else {
                reset({
                    title: "",
                    date: undefined,
                    startTime: "",
                    endTime: "",
                    artist: "",
                    description: "",
                    images: [],
                });
                setImagePreviews([]);
            }
        }
    }, [isOpen, eventToEdit, reset]);

    // Update previews when images change
    useEffect(() => {
        if (!watchImages || watchImages.length === 0) {
            if (!eventToEdit) {
                setImagePreviews([]);
            }
            return;
        }

        const newPreviews = watchImages.map(file => {
            if (file instanceof File) {
                return URL.createObjectURL(file);
            }
            return file;
        });

        setImagePreviews(newPreviews);

        // Cleanup URLs to avoid memory leaks
        return () => {
            newPreviews.forEach(url => {
                if (url && typeof url === "string" && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [watchImages, eventToEdit]);

    if (!isOpen) return null;

    const handleRemoveImage = (index: number) => {
        const newImages = [...(watchImages || [])];
        newImages.splice(index, 1);
        setValue("images", newImages, { shouldValidate: true });
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setValue("images", [...(watchImages || []), ...newFiles], { shouldValidate: true });
        }
    };

    const onSubmit = (data: CreateEventFormValues) => {
        if (eventToEdit) {
            const eventId = String(eventToEdit._id || eventToEdit.id);
            onUpdate?.(eventId, data);
        } else {
            onCreate?.(data);
        }
        reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const isEditMode = Boolean(eventToEdit);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            {/* Modal Container */}
            <div className="relative w-full max-w-[562px] bg-[#05033A] border border-[rgba(124,58,237,0.3)] shadow-[0px_4px_25px_rgba(0,0,0,0.5)] rounded-[24px] p-6 sm:p-7 flex flex-col gap-6 max-h-[90vh] overflow-y-auto scrollbar-none">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize">
                        {isEditMode ? "Edit Event" : "Create Event"}
                    </h2>

                    {/* Close Icon Button */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
                    {/* Upload Images Section */}
                    <div className="flex flex-col gap-3 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Upload Images
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Dropzone Container */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-[151px] rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-[rgba(124,58,237,0.18)] transition-all group"
                        >
                            <div className="w-[30px] h-[30px] flex items-center justify-center text-[#B45FF2]">
                                <svg className="w-7.5 h-7.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-medium text-[15px] leading-[20px] text-white/80 group-hover:text-white transition-colors">
                                Upload Image
                            </span>
                            <span className="font-normal text-[15px] leading-[20px] text-white/80">
                                Upto 20 Mbs, JPG, PNG, WEBP
                            </span>
                        </div>
                        {errors.images && <span className="text-red-400 text-xs mt-1">{errors.images.message as string}</span>}

                        {/* Image Thumbnails Row */}
                        {imagePreviews.length > 0 && (
                            <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1.5 w-full">
                                {imagePreviews.map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        className="relative w-[76px] h-[90px] rounded-[12px] overflow-hidden shrink-0 border border-[rgba(124,58,237,0.3)] bg-purple-950/60"
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`Event ${idx + 1}`}
                                            className="w-full h-full object-cover opacity-80"
                                        />
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
                        )}
                    </div>

                    <hr className="border-t border-white/10 my-1" />

                    {/* Event Title */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Event Title
                        </label>
                        <input
                            type="text"
                            {...register("title")}
                            placeholder="Ladies Night"
                            className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                        />
                        {errors.title && (
                            <span className="text-red-400 text-xs px-2">{errors.title.message}</span>
                        )}
                    </div>

                    {/* Date Picker (Calendar) */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Date
                        </label>
                        <Controller
                            control={control}
                            name="date"
                            render={({ field }) => (
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger className="w-full text-left">
                                        <div
                                            className={cn(
                                                "w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex items-center justify-between text-[14px] leading-[19px] transition-colors cursor-pointer",
                                                !field.value ? "text-white/70" : "text-white"
                                            )}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="w-5 h-5 text-white/50" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-[#0A074A] border border-[rgba(124,58,237,0.25)] text-white" align="start" style={{ zIndex: 9999 }}>
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(date) => {
                                                field.onChange(date);
                                                setIsCalendarOpen(false);
                                            }}
                                            className="bg-[#0A074A] text-white"
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.date && <span className="text-red-400 text-xs">{errors.date.message}</span>}
                    </div>

                    {/* Start Time & End Time Row */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                        {/* Start Time */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Start Time
                            </label>
                            <input
                                type="time"
                                {...register("startTime")}
                                className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors [color-scheme:dark]"
                            />
                            {errors.startTime && <span className="text-red-400 text-xs">{errors.startTime.message}</span>}
                        </div>

                        {/* End Time */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                End Time
                            </label>
                            <input
                                type="time"
                                {...register("endTime")}
                                className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors [color-scheme:dark]"
                            />
                            {errors.endTime && <span className="text-red-400 text-xs">{errors.endTime.message}</span>}
                        </div>
                    </div>

                    {/* Artist Field */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Artist
                        </label>
                        <input
                            type="text"
                            {...register("artist")}
                            placeholder="Select Artist"
                            className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                        />
                    </div>



                    {/* Description Field */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-[14px] leading-[19px] text-white">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            placeholder="Write here"
                            className="w-full h-[120px] p-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors resize-none"
                        />
                        {errors.description && <span className="text-red-400 text-xs">{errors.description.message}</span>}
                    </div>

                    {/* Create / Update CTA Button */}
                    <button
                        type="submit"
                        className="w-full h-[48px] rounded-[24px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center font-semibold text-[16px] leading-[22px] text-white capitalize hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-2"
                    >
                        {isEditMode ? "Update Event" : "Create Now"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEventModal;
