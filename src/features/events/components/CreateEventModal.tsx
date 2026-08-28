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
import { toast } from "sonner";

const MAX_IMAGES_COUNT = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

const TITLE_MAX_LENGTH = 100;
const ARTIST_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const getTodayStart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const createEventSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(TITLE_MAX_LENGTH, `Title cannot exceed ${TITLE_MAX_LENGTH} characters`),
    date: z.date({
        message: "Date is required",
    }).refine((date) => {
        return date >= getTodayStart();
    }, {
        message: "Event date must be today or in the future",
    }),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    artist: z
        .string()
        .max(ARTIST_MAX_LENGTH, `Artist name cannot exceed ${ARTIST_MAX_LENGTH} characters`)
        .optional(),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`),
    images: z
        .array(z.any())
        .max(MAX_IMAGES_COUNT, `You can upload a maximum of ${MAX_IMAGES_COUNT} images`)
        .refine(
            (files) =>
                files.every((file) => {
                    if (!(file instanceof File)) return true;
                    const ext = "." + file.name.split(".").pop()?.toLowerCase();
                    return ACCEPTED_IMAGE_EXTENSIONS.includes(ext) || ACCEPTED_IMAGE_TYPES.includes(file.type);
                }),
            {
                message: "Only PNG, JPG, and WEBP images are allowed",
            }
        ),
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
    onCreate?: (eventData: any) => void;
    onUpdate?: (id: string, eventData: any) => void;
    eventToEdit?: any | null;
    venueId?: string;
    isLoading?: boolean;
}

export function CreateEventModal({
    isOpen,
    onClose,
    onCreate,
    onUpdate,
    eventToEdit,
    venueId,
    isLoading = false,
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
    const watchTitle = watch("title") || "";
    const watchArtist = watch("artist") || "";
    const watchDescription = watch("description") || "";

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
            const rawFiles = Array.from(e.target.files);
            const currentImages = watchImages || [];

            // 1. Filter only accepted formats (PNG, JPG, WEBP)
            const validFiles: File[] = [];
            const invalidFormatNames: string[] = [];

            rawFiles.forEach((file) => {
                const ext = "." + file.name.split(".").pop()?.toLowerCase();
                const isValidMime = ACCEPTED_IMAGE_TYPES.includes(file.type);
                const isValidExt = ACCEPTED_IMAGE_EXTENSIONS.includes(ext);

                if (!isValidMime && !isValidExt) {
                    invalidFormatNames.push(file.name);
                } else if (file.size > MAX_FILE_SIZE) {
                    toast.error(`"${file.name}" exceeds the 20MB size limit.`);
                } else {
                    validFiles.push(file);
                }
            });

            if (invalidFormatNames.length > 0) {
                toast.error(
                    `Only PNG, JPG, and WEBP images are allowed. Rejected: ${invalidFormatNames.join(", ")}`
                );
            }

            if (validFiles.length === 0) {
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            // 2. Enforce maximum 5 images limit
            const availableSlots = MAX_IMAGES_COUNT - currentImages.length;
            if (availableSlots <= 0) {
                toast.error(`Maximum of ${MAX_IMAGES_COUNT} images allowed.`);
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            if (validFiles.length > availableSlots) {
                toast.warning(`Only ${availableSlots} more image(s) could be added (max ${MAX_IMAGES_COUNT} allowed).`);
            }

            const filesToAdd = validFiles.slice(0, availableSlots);
            setValue("images", [...currentImages, ...filesToAdd], { shouldValidate: true });

            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const onSubmit = (data: CreateEventFormValues) => {
        if (eventToEdit) {
            // Edit mode: DO NOT send venueId
            const eventId = String(eventToEdit._id || eventToEdit.id);
            onUpdate?.(eventId, data);
        } else {
            // Create mode: attach venueId if present
            const createData: any = { ...data };
            if (venueId) {
                createData.venueId = venueId;
            }
            onCreate?.(createData);
        }
        reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const isEditMode = Boolean(eventToEdit);
    const currentImagesCount = (watchImages || []).length;
    const isMaxImagesReached = currentImagesCount >= MAX_IMAGES_COUNT;

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
                        <div className="flex items-center justify-between">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Upload Images
                            </label>
                            <span className={cn(
                                "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
                                isMaxImagesReached
                                    ? "bg-purple-500/20 text-[#E8FF57] border-[#E8FF57]/40"
                                    : "bg-[rgba(124,58,237,0.15)] text-[#C4B5FD] border-[rgba(124,58,237,0.3)]"
                            )}>
                                {currentImagesCount}/{MAX_IMAGES_COUNT} images
                            </span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isMaxImagesReached}
                        />

                        {/* Dropzone Container */}
                        <div
                            onClick={() => {
                                if (isMaxImagesReached) {
                                    toast.error(`Maximum of ${MAX_IMAGES_COUNT} images reached. Remove an image to upload a new one.`);
                                } else {
                                    fileInputRef.current?.click();
                                }
                            }}
                            className={cn(
                                "w-full h-[145px] rounded-[24px] border flex flex-col items-center justify-center gap-1.5 transition-all p-4 text-center",
                                isMaxImagesReached
                                    ? "bg-[rgba(124,58,237,0.06)] border-[rgba(124,58,237,0.2)] opacity-70 cursor-not-allowed"
                                    : "bg-[rgba(124,58,237,0.12)] border-[rgba(124,58,237,0.25)] hover:bg-[rgba(124,58,237,0.18)] cursor-pointer group"
                            )}
                        >
                            <div className="w-[30px] h-[30px] flex items-center justify-center text-[#B45FF2]">
                                <svg className="w-7.5 h-7.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-medium text-[15px] leading-[20px] text-white/90 group-hover:text-white transition-colors">
                                {isMaxImagesReached ? "Maximum 5 images added" : "Upload Images"}
                            </span>
                            <span className="font-normal text-[12px] sm:text-[13px] leading-[18px] text-white/60">
                                {isMaxImagesReached
                                    ? "Remove an image below to upload a different one"
                                    : "Supports PNG, JPG, WEBP up to 20MB (Max 5 images)"}
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
                        <div className="flex items-center justify-between">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Event Title
                            </label>
                            <span className="text-xs text-[#9D8FD0] font-medium">
                                {watchTitle.length}/{TITLE_MAX_LENGTH}
                            </span>
                        </div>
                        <input
                            type="text"
                            {...register("title")}
                            maxLength={TITLE_MAX_LENGTH}
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
                                            disabled={(date) => date < getTodayStart()}
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
                        <div className="flex items-center justify-between">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Artist
                            </label>
                            <span className="text-xs text-[#9D8FD0] font-medium">
                                {watchArtist.length}/{ARTIST_MAX_LENGTH}
                            </span>
                        </div>
                        <input
                            type="text"
                            {...register("artist")}
                            maxLength={ARTIST_MAX_LENGTH}
                            placeholder="Select Artist"
                            className="w-full h-12 px-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                        />
                        {errors.artist && (
                            <span className="text-red-400 text-xs px-2">{errors.artist.message}</span>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between">
                            <label className="font-semibold text-[14px] leading-[19px] text-white">
                                Description
                            </label>
                            <span className="text-xs text-[#9D8FD0] font-medium">
                                {watchDescription.length}/{DESCRIPTION_MAX_LENGTH}
                            </span>
                        </div>
                        <textarea
                            {...register("description")}
                            maxLength={DESCRIPTION_MAX_LENGTH}
                            placeholder="Write here"
                            className="w-full h-[120px] p-4 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-white/70 text-[14px] leading-[19px] focus:outline-none focus:border-[#B45FF2] transition-colors resize-none"
                        />
                        {errors.description && <span className="text-red-400 text-xs">{errors.description.message}</span>}
                    </div>

                    {/* Create / Update CTA Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[48px] rounded-[24px] bg-gradient-to-br from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.5),0px_0px_48px_rgba(232,255,87,0.1)] flex items-center justify-center font-semibold text-[16px] leading-[22px] text-white capitalize hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <span>{isEditMode ? "Updating..." : "Creating Event..."}</span>
                            </div>
                        ) : isEditMode ? (
                            "Update Event"
                        ) : (
                            "Create Now"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEventModal;
