"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX_IMAGES_COUNT = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const getTodayStart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const createPromotionSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(TITLE_MAX_LENGTH, `Title cannot exceed ${TITLE_MAX_LENGTH} characters`),
    promoType: z.string().min(1, "Promo type is required"),
    description: z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`),
    validFrom: z.date({
        message: "Valid From date is required",
    }).refine((date) => {
        return date >= getTodayStart();
    }, {
        message: "Start date must be today or in the future",
    }),
    validTo: z.date({
        message: "Valid To date is required",
    }).refine((date) => {
        return date >= getTodayStart();
    }, {
        message: "End date must be in the future",
    }),
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
        if (data.validFrom && data.validTo) {
            return data.validTo >= data.validFrom;
        }
        return true;
    },
    {
        message: "End date cannot be earlier than start date",
        path: ["validTo"],
    }
);

export type CreatePromotionFormValues = z.infer<typeof createPromotionSchema>;

export interface CreatePromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: (newPromotion: any) => void;
    onUpdate?: (id: string, updatedData: any) => void;
    promotionToEdit?: any | null;
    venueId?: string;
    isLoading?: boolean;
}

export function CreatePromotionModal({
    isOpen,
    onClose,
    onCreate,
    onUpdate,
    promotionToEdit,
    venueId,
    isLoading = false,
}: CreatePromotionModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isFromCalendarOpen, setIsFromCalendarOpen] = useState(false);
    const [isToCalendarOpen, setIsToCalendarOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        getValues,
        control,
        formState: { errors },
    } = useForm<CreatePromotionFormValues>({
        resolver: zodResolver(createPromotionSchema),
        defaultValues: {
            title: "",
            promoType: "Happy Hours",
            description: "",
            validFrom: undefined,
            validTo: undefined,
            images: [],
        },
    });

    const watchImages = watch("images");
    const watchTitle = watch("title");
    const watchPromoType = watch("promoType");
    const watchDescription = watch("description");
    const watchValidFrom = watch("validFrom");
    const watchValidTo = watch("validTo");

    // Pre-populate fields when in edit mode or when modal opens
    useEffect(() => {
        if (isOpen) {
            if (promotionToEdit) {
                const from = promotionToEdit.startAt || promotionToEdit.startDate;
                const to = promotionToEdit.endAt || promotionToEdit.endDate;

                reset({
                    title: promotionToEdit.title || promotionToEdit.name || "",
                    promoType: promotionToEdit.category || promotionToEdit.promoType || "Happy Hours",
                    description: promotionToEdit.description || "",
                    validFrom: from ? new Date(from) : undefined,
                    validTo: to ? new Date(to) : undefined,
                    images: [],
                });

                const existingImg = promotionToEdit.imageUrl || promotionToEdit.banner || promotionToEdit.image;
                if (existingImg) {
                    setImagePreviews([existingImg]);
                } else {
                    setImagePreviews([]);
                }
            } else {
                setStep(1);
                reset({
                    title: "",
                    promoType: "Happy Hours",
                    description: "",
                    validFrom: undefined,
                    validTo: undefined,
                    images: [],
                });
                setImagePreviews([]);
            }
        }
    }, [isOpen, promotionToEdit, reset]);

    // Handle image preview cleanup and generation
    useEffect(() => {
        if (!watchImages || watchImages.length === 0) {
            if (!promotionToEdit) {
                setImagePreviews([]);
            }
            return;
        }

        const newPreviews = watchImages.map((file) => {
            if (file instanceof File) {
                return URL.createObjectURL(file);
            }
            return file;
        });

        setImagePreviews(newPreviews);

        return () => {
            newPreviews.forEach((url) => {
                if (url && typeof url === "string" && url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [watchImages, promotionToEdit]);

    if (!isOpen) return null;

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

    const handleRemoveImage = (index: number) => {
        const newImages = [...(watchImages || [])];
        newImages.splice(index, 1);
        setValue("images", newImages, { shouldValidate: true });
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleContinueToPreview = () => {
        setStep(2);
    };

    const handlePublish = () => {
        const formValues = getValues();
        const startAt = formValues.validFrom ? formValues.validFrom.toISOString() : new Date().toISOString();
        const endAt = formValues.validTo ? formValues.validTo.toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const payload: any = {
            title: formValues.title,
            description: formValues.description,
            startAt: startAt,
            endAt: endAt,
            status: "active",
            images: formValues.images,
        };

        if (promotionToEdit) {
            // Edit mode: DO NOT send venueId
            const promoId = String(promotionToEdit._id || promotionToEdit.id);
            onUpdate?.(promoId, payload);
        } else {
            // Create mode: send venueId if available
            if (venueId) {
                payload.venueId = venueId;
            }
            onCreate?.(payload);
        }

        setStep(1);
        reset();
        onClose();
    };

    const handleCloseAll = () => {
        setStep(1);
        reset();
        onClose();
    };

    const datePreviewText = watchValidFrom || watchValidTo
        ? `${watchValidFrom ? format(watchValidFrom, "MMM d, yyyy") : "Start"} – ${watchValidTo ? format(watchValidTo, "MMM d, yyyy") : "End"}`
        : "Jun 1 – Jul 31";

    const isEditMode = Boolean(promotionToEdit);
    const currentImagesCount = (watchImages || []).length;
    const isMaxImagesReached = currentImagesCount >= MAX_IMAGES_COUNT;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseAll();
            }}
        >
            {/* Modal Container */}
            <div className="relative w-full max-w-[563px] bg-[#05033A] border border-[rgba(124,58,237,0.25)] shadow-[0px_4px_24px_rgba(0,0,0,0.5)] rounded-[24px] p-6 sm:p-[30px] flex flex-col gap-6 max-h-[92vh] overflow-y-auto scrollbar-none">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize tracking-tight">
                        {isEditMode ? "Edit Promotion" : "Create Promotion"}
                    </h2>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={handleCloseAll}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                        aria-label="Close modal"
                    >
                        <div className="w-[18px] h-[18px] border-[1.8px] border-white rounded-[1px] flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* STEP 1: FORM INPUTS */}
                {step === 1 && (
                    <form onSubmit={handleSubmit(handleContinueToPreview)} className="flex flex-col gap-5 w-full">
                        {/* Upload Images Section */}
                        <div className="flex flex-col gap-2 w-full">
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
                                    "w-full h-[151px] rounded-[24px] border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all group",
                                    isMaxImagesReached
                                        ? "bg-[rgba(124,58,237,0.06)] border-[rgba(124,58,237,0.2)] opacity-70 cursor-not-allowed"
                                        : "bg-[rgba(124,58,237,0.12)] border-[rgba(124,58,237,0.25)] hover:bg-[rgba(124,58,237,0.18)]"
                                )}
                            >
                                <div className="w-[30px] h-[30px] flex items-center justify-center text-[#B45FF2] mb-1">
                                    <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={1.5} 
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                        />
                                    </svg>
                                </div>

                                <span className="font-medium text-[15px] leading-[20px] text-white/80 group-hover:text-white transition-colors">
                                    {isMaxImagesReached ? "Maximum 5 images added" : "Upload Image"}
                                </span>
                                <span className="font-normal text-[13px] leading-[18px] text-white/60">
                                    {isMaxImagesReached
                                        ? "Remove an image below to upload a different one"
                                        : "Supports PNG, JPG, WEBP up to 20MB (Max 5 images)"}
                                </span>
                            </div>
                            {errors.images && <span className="text-red-400 text-xs mt-1">{errors.images.message as string}</span>}


                            {/* Thumbnails Row */}
                            {imagePreviews.length > 0 && (
                                <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pt-2 w-full">
                                    {imagePreviews.map((imgUrl, idx) => (
                                        <div
                                            key={idx}
                                            className="relative w-[76px] h-[76px] rounded-[16px] overflow-hidden shrink-0 border border-[rgba(124,58,237,0.3)] bg-purple-950/60"
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Promo preview ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
                                                aria-label="Remove image"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Row 1: Promo Title & Promo Type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {/* Promo Title */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <div className="flex items-center justify-between">
                                    <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                        PROMO TITLE
                                    </label>
                                    <span className="text-[11px] text-[#8B7EC8] font-medium">
                                        {(watchTitle || "").length}/{TITLE_MAX_LENGTH}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    {...register("title")}
                                    maxLength={TITLE_MAX_LENGTH}
                                    placeholder="e.g. Happy Hour Special"
                                    className="w-full h-[46px] px-5 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-[rgba(240,238,255,0.5)] text-[13px] leading-[18px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                                />
                                {errors.title && <span className="text-red-400 text-xs">{errors.title.message}</span>}
                            </div>

                            {/* Promo Type */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                    PROMO TYPE
                                </label>
                                <Controller
                                    control={control}
                                    name="promoType"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full h-[46px]! px-5 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-white focus:outline-none focus:border-[#B45FF2] transition-colors">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent side="bottom" alignItemWithTrigger={false} className="bg-[#0A074A] border-[rgba(124,58,237,0.25)] text-white p-2" style={{ zIndex: 9999 }}>
                                                {["Happy Hours", "Discounts", "Buy One Get One", "Special Offers"].map((type) => (
                                                    <SelectItem key={type} value={type} className="px-4 py-3 !text-white hover:!text-white focus:!text-white data-[highlighted]:!text-white hover:bg-purple-900/40 focus:bg-purple-900/40 cursor-pointer rounded-lg" style={{ color: "#ffffff" }}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.promoType && <span className="text-red-400 text-xs">{errors.promoType.message}</span>}
                            </div>
                        </div>

                        {/* Row 2: Description */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                    DESCRIPTION
                                </label>
                                <span className="text-[11px] text-[#8B7EC8] font-medium">
                                    {(watchDescription || "").length}/{DESCRIPTION_MAX_LENGTH}
                                </span>
                            </div>
                            <textarea
                                {...register("description")}
                                maxLength={DESCRIPTION_MAX_LENGTH}
                                placeholder="Describe your promotion in a few words…"
                                className="w-full h-[90px] p-4 rounded-[20px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-[rgba(240,238,255,0.5)] text-[13px] leading-[20px] focus:outline-none focus:border-[#B45FF2] transition-colors resize-none"
                            />
                            {errors.description && <span className="text-red-400 text-xs">{errors.description.message}</span>}
                        </div>

                        {/* Row 4: Valid From & Valid To */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {/* Valid From */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                    Valid From
                                </label>
                                <Controller
                                    control={control}
                                    name="validFrom"
                                    render={({ field }) => (
                                        <Popover open={isFromCalendarOpen} onOpenChange={setIsFromCalendarOpen}>
                                            <PopoverTrigger className="w-full text-left">
                                                <div
                                                    className={cn(
                                                        "w-full h-[46px] px-5 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-left flex items-center justify-between text-[13px] leading-[18px] transition-colors cursor-pointer",
                                                        !field.value ? "text-[rgba(240,238,255,0.5)]" : "text-white"
                                                    )}
                                                >
                                                    {field.value ? format(field.value, "PPP") : <span>mm/dd/yyyy</span>}
                                                    <CalendarIcon className="w-4 h-4 text-[#8B7EC8]" />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-[#0A074A] border border-[rgba(124,58,237,0.25)] text-white" align="start" style={{ zIndex: 9999 }}>
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    disabled={(date) => date < getTodayStart()}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setIsFromCalendarOpen(false);
                                                    }}
                                                    className="bg-[#0A074A] text-white"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {errors.validFrom && <span className="text-red-400 text-xs">{errors.validFrom.message}</span>}
                            </div>

                            {/* Valid To */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                    Valid To
                                </label>
                                <Controller
                                    control={control}
                                    name="validTo"
                                    render={({ field }) => (
                                        <Popover open={isToCalendarOpen} onOpenChange={setIsToCalendarOpen}>
                                            <PopoverTrigger className="w-full text-left">
                                                <div
                                                    className={cn(
                                                        "w-full h-[46px] px-5 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-left flex items-center justify-between text-[13px] leading-[18px] transition-colors cursor-pointer",
                                                        !field.value ? "text-[rgba(240,238,255,0.5)]" : "text-white"
                                                    )}
                                                >
                                                    {field.value ? format(field.value, "PPP") : <span>mm/dd/yyyy</span>}
                                                    <CalendarIcon className="w-4 h-4 text-[#8B7EC8]" />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-[#0A074A] border border-[rgba(124,58,237,0.25)] text-white" align="start" style={{ zIndex: 9999 }}>
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    disabled={(date) => date < (watchValidFrom ? watchValidFrom : getTodayStart())}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setIsToCalendarOpen(false);
                                                    }}
                                                    className="bg-[#0A074A] text-white"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {errors.validTo && <span className="text-red-400 text-xs">{errors.validTo.message}</span>}
                            </div>
                        </div>

                        {/* Notice Box */}
                        <div className="w-full rounded-[20px] bg-[rgba(232,255,87,0.06)] border border-[rgba(232,255,87,0.18)] p-4 flex items-start">
                            <p className="font-semibold text-[11px] leading-[16px] text-[#E8FF57]">
                                ✦ Promotions will appear on your venue page during selected days and will be visible to all BarHuddle users in your area.
                            </p>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            className="w-full h-[52px] rounded-[24px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] flex items-center justify-center font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-1"
                        >
                            Continue
                        </button>
                    </form>
                )}

                {/* STEP 2: PREVIEW & PUBLISH MODAL */}
                {step === 2 && (
                    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
                        {/* Promotion Card Preview Container */}
                        <div className="relative w-full h-[256px] bg-[rgba(10,6,48,0.8)] border border-[#2C166C] rounded-[24px] overflow-hidden flex flex-col justify-between p-0 shadow-lg">
                            
                            {/* Top Image Banner */}
                            <div className="relative w-full h-[163px] overflow-hidden rounded-t-[24px]">
                                <img
                                    src={imagePreviews[0] || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"}
                                    alt="Promotion preview cover"
                                    className="w-full h-full object-cover opacity-75"
                                />

                                {/* Gradient Cyan/Green Glow Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#4ADE80]/20 to-[#22D3EE]/12 opacity-50 pointer-events-none" />

                                {/* Promo Type Badge */}
                                <div className="absolute top-[18px] left-[19px] px-3 py-1 rounded-full bg-[#E8FF57] flex items-center justify-center">
                                    <span className="font-extrabold text-[12px] leading-[16px] text-[#04022E] tracking-tight">
                                        {watchPromoType || "Promotion"}
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Card Content Section */}
                            <div className="flex flex-col gap-1.5 px-[20px] pb-[18px] pt-1.5">
                                {/* Promotion Title */}
                                <h3 className="font-extrabold text-[14px] leading-[20px] text-white truncate">
                                    {watchTitle || "Your Promotion Title"}
                                </h3>

                                {/* Promotion Description */}
                                <p className="font-normal text-[13px] leading-[16px] text-[#8B7EC8] truncate">
                                    {watchDescription || "Your promotion description will appear here."}
                                </p>

                                {/* Date Range Row */}
                                <div className="flex items-center gap-1.5 text-[#8B7EC8] mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-[#DAB2FF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-normal text-[13px] leading-[15px]">
                                        {datePreviewText}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Row: Back + Publish */}
                        <div className="flex items-center gap-[15px] w-full mt-1">
                            {/* Back Button */}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-[91.6px] h-[52px] px-5 py-2.5 rounded-[24px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.22)] flex items-center justify-center font-bold text-[14px] leading-[20px] text-[#C4B5FD] hover:bg-[rgba(124,58,237,0.2)] transition-all cursor-pointer shrink-0"
                            >
                                ← Back
                            </button>

                            {/* Publish / Update Promotion Button */}
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={handlePublish}
                                className="flex-1 h-[52px] rounded-[24px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] flex items-center justify-center font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        <span>{isEditMode ? "Updating..." : "Publishing Promotion..."}</span>
                                    </div>
                                ) : isEditMode ? (
                                    "Update Promotion"
                                ) : (
                                    "Publish Promotion"
                                )}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default CreatePromotionModal;
