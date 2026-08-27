"use client";

import { useGetOwnerVenuesQuery } from "@/features/venue-management/api/venue.queries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export interface CreatePromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: (newPromotion: any) => void;
}

export function CreatePromotionModal({
    isOpen,
    onClose,
    onCreate,
}: CreatePromotionModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [venueId, setVenueId] = useState("");
    const [promoTitle, setPromoTitle] = useState("");
    const [promoType, setPromoType] = useState("Happy Hours");
    const [offerLabel, setOfferLabel] = useState("");
    const [description, setDescription] = useState("");
    const [validFrom, setValidFrom] = useState<Date | undefined>(undefined);
    const [validTo, setValidTo] = useState<Date | undefined>(undefined);
    const [isFromCalendarOpen, setIsFromCalendarOpen] = useState(false);
    const [isToCalendarOpen, setIsToCalendarOpen] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { data: venues = [] } = useGetOwnerVenuesQuery();

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setImages((prev) => [...prev, ...filesArray]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleContinueToPreview = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePublish = () => {
        const selectedVenueId = venueId || ((venues as any[])[0]?.venue?._id || (venues as any[])[0]?.venue?.id || (venues as any[])[0]?._id || (venues as any[])[0]?.id || "");
        const startAt = validFrom ? validFrom.toISOString() : new Date().toISOString();
        const endAt = validTo ? validTo.toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        onCreate?.({
            venueId: selectedVenueId,
            title: promoTitle || "2 for 1",
            description: description || "Happy hour",
            startAt: startAt,
            endAt: endAt,
            status: "active",
        });

        // Reset state
        setStep(1);
        setVenueId("");
        setPromoTitle("");
        setOfferLabel("");
        setDescription("");
        setValidFrom(undefined);
        setValidTo(undefined);
        setImages([]);
        onClose();
    };

    const handleCloseAll = () => {
        setStep(1);
        onClose();
    };

    // Formatted date string for preview
    const datePreviewText = (validFrom || validTo)
        ? `${validFrom ? format(validFrom, "MMM d, yyyy") : "Start"} – ${validTo ? format(validTo, "MMM d, yyyy") : "End"}`
        : "Jun 1 – Jul 31";

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseAll();
            }}
        >
            {/* Modal Container: matching 563px width, background #05033A, border-radius 16px */}
            <div className="relative w-full max-w-[563px] bg-[#05033A] border border-[rgba(124,58,237,0.25)] shadow-[0px_4px_24px_rgba(0,0,0,0.5)] rounded-[16px] p-6 sm:p-[30px] flex flex-col gap-6 max-h-[92vh] overflow-y-auto scrollbar-none">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px] leading-[27px] text-white capitalize tracking-tight">
                        Create Promotion
                    </h2>

                    {/* Close Button (40x40 container) */}
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
                    <form onSubmit={handleContinueToPreview} className="flex flex-col gap-5 w-full">
                        
                        {/* Venue Selection */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                SELECT VENUE
                            </label>
                            <Select onValueChange={(val: any) => setVenueId(val || "")} value={venueId}>
                                <SelectTrigger className="w-full h-[44px] px-[14px] rounded-[12px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-white focus:outline-none focus:border-[#B45FF2] transition-colors">
                                    <SelectValue placeholder="Select a venue">
                                        {(() => {
                                            if (!venueId) return null;
                                            const selectedItem = (venues as any[])?.find((item: any) => {
                                                const venue = item.venue || item;
                                                return (venue?.id || venue?._id) === venueId;
                                            });
                                            const selectedVenue = selectedItem?.venue || selectedItem;
                                            return selectedVenue?.name || selectedVenue?.title || venueId;
                                        })()}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent side="bottom" alignItemWithTrigger={false} className="bg-[#0A074A] border-[rgba(124,58,237,0.25)] text-white p-2" style={{ zIndex: 9999 }}>
                                    {(venues as any[])?.length > 0 ? (venues as any[]).map((item: any) => {
                                        const venue = item.venue || item;
                                        const vId = venue?.id || venue?._id;
                                        const vName = venue?.name || venue?.title || "Unnamed Venue";
                                        if (!vId) return null;
                                        return (
                                            <SelectItem key={vId} value={vId} className="px-4 py-3 !text-white hover:!text-white focus:!text-white data-[highlighted]:!text-white hover:bg-purple-900/40 focus:bg-purple-900/40 cursor-pointer rounded-lg" style={{ color: "#ffffff" }}>
                                                {vName}
                                            </SelectItem>
                                        );
                                    }) : (
                                        <div className="p-4 text-center text-white/50 text-sm">No venues found</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Upload Images Section */}
                        <div className="flex flex-col gap-2 w-full">
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
                                className="w-full h-[151px] rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[rgba(124,58,237,0.18)] transition-all group"
                            >
                                {/* Gallery Icon */}
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
                                    Upload Image
                                </span>
                                <span className="font-normal text-[15px] leading-[20px] text-white/80">
                                    Upto 20 Mbs, PDF,JPG,PNG
                                </span>
                            </div>

                            {/* Thumbnails Row if images uploaded */}
                            {images.length > 0 && (
                                <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pt-2 w-full">
                                    {images.map((imgUrl, idx) => (
                                        <div
                                            key={idx}
                                            className="relative w-[76px] h-[76px] rounded-[12px] overflow-hidden shrink-0 border border-[rgba(124,58,237,0.3)] bg-purple-950/60"
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
                                <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                    PROMO TITLE
                                </label>
                                <input
                                    type="text"
                                    value={promoTitle}
                                    onChange={(e) => setPromoTitle(e.target.value)}
                                    placeholder="e.g. Happy Hour Special"
                                    className="w-full h-[44px] px-[14px] rounded-[12px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-[rgba(240,238,255,0.5)] text-[13px] leading-[18px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                                />
                            </div>

                            {/* Promo Type */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                    PROMO TYPE
                                </label>
                                <Select value={promoType} onValueChange={(val: any) => setPromoType(val || "")}>
                                    <SelectTrigger className="w-full h-[44px] px-[14px] rounded-[12px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-white focus:outline-none focus:border-[#B45FF2] transition-colors">
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
                            </div>
                        </div>

                        {/* Row 2: Discount / Offer Label */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                DISCOUNT / OFFER LABEL
                            </label>
                            <input
                                type="text"
                                value={offerLabel}
                                onChange={(e) => setOfferLabel(e.target.value)}
                                placeholder="e.g. 30% OFF, Buy 1 Get 1 Free, Free Drink"
                                className="w-full h-[41.1px] px-[14px] rounded-[12px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-[rgba(240,238,255,0.5)] text-[13px] leading-[18px] focus:outline-none focus:border-[#B45FF2] transition-colors"
                            />
                        </div>

                        {/* Row 3: Description */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                DESCRIPTION
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your promotion in a few words…"
                                className="w-full h-[86px] p-[14px] rounded-[12px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-white placeholder:text-[rgba(240,238,255,0.5)] text-[13px] leading-[20px] focus:outline-none focus:border-[#B45FF2] transition-colors resize-none"
                            />
                        </div>

                        {/* Row 4: Valid From & Valid To */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {/* Valid From */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                    Valid From
                                </label>
                                <Popover open={isFromCalendarOpen} onOpenChange={setIsFromCalendarOpen}>
                                    <PopoverTrigger className="w-full text-left">
                                        <div
                                            className={cn(
                                                "w-full h-[44px] px-[14px] rounded-[12px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-left flex items-center justify-between text-[13px] leading-[18px] transition-colors cursor-pointer",
                                                !validFrom ? "text-[rgba(240,238,255,0.5)]" : "text-white"
                                            )}
                                        >
                                            {validFrom ? format(validFrom, "PPP") : <span>mm/dd/yyyy</span>}
                                            <CalendarIcon className="w-4 h-4 text-[#8B7EC8]" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-[#0A074A] border border-[rgba(124,58,237,0.25)] text-white" align="start" style={{ zIndex: 9999 }}>
                                        <Calendar
                                            mode="single"
                                            selected={validFrom}
                                            onSelect={(date) => {
                                                setValidFrom(date);
                                                setIsFromCalendarOpen(false);
                                            }}
                                            className="bg-[#0A074A] text-white"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Valid To */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="font-bold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#8B7EC8]">
                                    Valid To
                                </label>
                                <Popover open={isToCalendarOpen} onOpenChange={setIsToCalendarOpen}>
                                    <PopoverTrigger className="w-full text-left">
                                        <div
                                            className={cn(
                                                "w-full h-[44px] px-[14px] rounded-[12px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.25)] text-left flex items-center justify-between text-[13px] leading-[18px] transition-colors cursor-pointer",
                                                !validTo ? "text-[rgba(240,238,255,0.5)]" : "text-white"
                                            )}
                                        >
                                            {validTo ? format(validTo, "PPP") : <span>mm/dd/yyyy</span>}
                                            <CalendarIcon className="w-4 h-4 text-[#8B7EC8]" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-[#0A074A] border border-[rgba(124,58,237,0.25)] text-white" align="start" style={{ zIndex: 9999 }}>
                                        <Calendar
                                            mode="single"
                                            selected={validTo}
                                            onSelect={(date) => {
                                                setValidTo(date);
                                                setIsToCalendarOpen(false);
                                            }}
                                            className="bg-[#0A074A] text-white"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Notice Box */}
                        <div className="w-full rounded-[14px] bg-[rgba(232,255,87,0.06)] border border-[rgba(232,255,87,0.18)] p-4 flex items-start">
                            <p className="font-semibold text-[11px] leading-[16px] text-[#E8FF57]">
                                ✦ Promotions will appear on your venue page during selected days and will be visible to all BarHuddle users in your area.
                            </p>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            className="w-full h-[52px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] flex items-center justify-center font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-1"
                        >
                            Continue
                        </button>
                    </form>
                )}

                {/* STEP 2: PREVIEW & PUBLISH MODAL */}
                {step === 2 && (
                    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
                        {/* Promotion Card Preview Container (503px x 256px) */}
                        <div className="relative w-full h-[256px] bg-[rgba(10,6,48,0.8)] border border-[#2C166C] rounded-[24px] overflow-hidden flex flex-col justify-between p-0 shadow-lg">
                            
                            {/* Top Image Banner (163px height) */}
                            <div className="relative w-full h-[163px] overflow-hidden rounded-t-[24px]">
                                <img
                                    src={images[0] || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"}
                                    alt="Promotion preview cover"
                                    className="w-full h-full object-cover opacity-75"
                                />

                                {/* Gradient Cyan/Green Glow Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#4ADE80]/20 to-[#22D3EE]/12 opacity-50 pointer-events-none" />

                                {/* Offer Tag Badge (e.g. 20% OFF) */}
                                <div className="absolute top-[18px] left-[19px] px-3 py-1 rounded-full bg-[#E8FF57] flex items-center justify-center">
                                    <span className="font-extrabold text-[12px] leading-[16px] text-[#04022E] tracking-tight">
                                        {offerLabel || "20% OFF"}
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Card Content Section */}
                            <div className="flex flex-col gap-1.5 px-[20px] pb-[18px] pt-1.5">
                                {/* Promotion Title */}
                                <h3 className="font-extrabold text-[14px] leading-[20px] text-white truncate">
                                    {promoTitle || "Your Promotion Title"}
                                </h3>

                                {/* Promotion Description */}
                                <p className="font-normal text-[13px] leading-[16px] text-[#8B7EC8] truncate">
                                    {description || "Your promotion description will appear here."}
                                </p>

                                {/* Date Range Row */}
                                <div className="flex items-center gap-1.5 text-[#8B7EC8] mt-0.5">
                                    {/* Solar Calendar Icon */}
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
                                className="w-[91.6px] h-[52px] px-5 py-2.5 rounded-[14px] bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.22)] flex items-center justify-center font-bold text-[14px] leading-[20px] text-[#C4B5FD] hover:bg-[rgba(124,58,237,0.2)] transition-all cursor-pointer shrink-0"
                            >
                                ← Back
                            </button>

                            {/* Publish Promotion Button */}
                            <button
                                type="button"
                                onClick={handlePublish}
                                className="flex-1 h-[52px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] shadow-[0px_0px_24px_rgba(124,58,237,0.45)] flex items-center justify-center font-extrabold text-[14px] leading-[20px] text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                            >
                                Publish Promotion
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default CreatePromotionModal;
