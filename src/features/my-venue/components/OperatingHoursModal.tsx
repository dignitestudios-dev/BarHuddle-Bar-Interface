"use client";

import React, { useState, useEffect } from "react";
import { useUpdateOperatingHoursMutation } from "@/features/venue-management/api/venue.mutations";
import { toast } from "sonner";

interface OperatingHoursModalProps {
    isOpen: boolean;
    onClose: () => void;
    venueId: string;
    currentHours: any[];
    onSuccess?: () => void;
}

interface DayHourState {
    day: number;
    open: string;
    close: string;
    isClosed: boolean;
}

const DAYS = [
    { day: 0, label: "Sunday" },
    { day: 1, label: "Monday" },
    { day: 2, label: "Tuesday" },
    { day: 3, label: "Wednesday" },
    { day: 4, label: "Thursday" },
    { day: 5, label: "Friday" },
    { day: 6, label: "Saturday" },
];

export function OperatingHoursModal({
    isOpen,
    onClose,
    venueId,
    currentHours,
    onSuccess,
}: OperatingHoursModalProps) {
    const [hours, setHours] = useState<DayHourState[]>([]);

    const updateHoursMutation = useUpdateOperatingHoursMutation(venueId);

    useEffect(() => {
        if (isOpen) {
            const rawHours = Array.isArray(currentHours) ? currentHours : [];
            const initialList: DayHourState[] = DAYS.map((d) => {
                const match = rawHours.find((h) => Number(h.day) === d.day);
                return {
                    day: d.day,
                    open: match?.open || "18:00",
                    close: match?.close || "02:00",
                    isClosed: match?.isClosed ?? false,
                };
            });
            setHours(initialList);
        }
    }, [isOpen, currentHours]);

    if (!isOpen) return null;

    const handleDayChange = (dayIdx: number, field: keyof DayHourState, val: any) => {
        setHours((prev) =>
            prev.map((h) => (h.day === dayIdx ? { ...h, [field]: val } : h))
        );
    };

    const handleApplyWeekdayDefaults = () => {
        setHours((prev) =>
            prev.map((h) => {
                if (h.day === 0 || h.day === 6) {
                    return { ...h, open: "16:00", close: "03:00", isClosed: false };
                }
                return { ...h, open: "18:00", close: "02:00", isClosed: false };
            })
        );
        toast.info("Standard bar hours applied to all days!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = hours.map((h) => ({
                day: h.day,
                open: h.open,
                close: h.close,
                isClosed: h.isClosed,
            }));

            await updateHoursMutation.mutateAsync({
                venueId,
                data: {
                    hours: payload,
                },
            });

            toast.success("Operating hours updated successfully!");
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error("Failed to update operating hours", error);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update operating hours.";
            toast.error(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative w-full max-w-[640px] rounded-[24px] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 shadow-[0px_16px_48px_rgba(0,0,0,0.6)] border border-[rgba(124,58,237,0.35)] max-h-[92vh] overflow-y-auto custom-scrollbar"
                style={{ background: "rgba(14, 7, 34, 0.96)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.4)] flex items-center justify-center text-[#E8FF57] shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-extrabold text-white">Operating Hours</h3>
                            <p className="text-xs text-[#8B7EC8] leading-tight mt-0.5">Configure open and close times for each day of the week</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors shrink-0"
                    >
                        ✕
                    </button>
                </div>

                {/* Quick actions template */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 py-2 px-3 rounded-xl bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)]">
                    <span className="text-xs text-[#C4B5FD]">Quick Template:</span>
                    <button
                        type="button"
                        onClick={handleApplyWeekdayDefaults}
                        className="text-xs font-semibold text-[#E8FF57] hover:underline text-left sm:text-right"
                    >
                        Apply Standard Bar Schedule (18:00 - 02:00)
                    </button>
                </div>

                {/* Hours Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 sm:gap-2.5">
                        {DAYS.map((d) => {
                            const current = hours.find((h) => h.day === d.day) || {
                                day: d.day,
                                open: "18:00",
                                close: "02:00",
                                isClosed: false,
                            };

                            return (
                                <div
                                    key={d.day}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-3 rounded-xl border gap-2.5 sm:gap-3 transition-all ${
                                        current.isClosed
                                            ? "bg-white/[0.02] border-white/10 opacity-70"
                                            : "bg-[#140E50]/70 border-[rgba(124,58,237,0.3)] shadow-sm"
                                    }`}
                                >
                                    {/* Day Name & Mobile Custom Closed Toggle */}
                                    <div className="flex items-center justify-between sm:w-28 md:w-32 shrink-0">
                                        <span className="font-bold text-sm text-white">{d.label}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDayChange(d.day, "isClosed", !current.isClosed)
                                            }
                                            className="flex items-center gap-1.5 cursor-pointer select-none sm:hidden group shrink-0"
                                            aria-label={`Toggle closed for ${d.label}`}
                                        >
                                            <div
                                                className={`w-4 h-4 min-w-[16px] min-h-[16px] rounded-[4px] flex items-center justify-center transition-all shrink-0 ${
                                                    current.isClosed
                                                        ? "bg-[#7C3AED] border border-[#A855F7] shadow-[0_0_8px_rgba(124,58,237,0.6)]"
                                                        : "bg-black/50 border border-white/25 group-hover:border-[#7C3AED]/70"
                                                }`}
                                            >
                                                {current.isClosed && (
                                                    <svg className="w-2.5 h-2 text-white fill-current shrink-0" viewBox="0 0 16 12">
                                                        <path d="M5.5 10.586L1.707 6.793A1 1 0 00.293 8.207l4.5 4.5a1 1 0 001.414 0l9-9A1 1 0 0013.793 2.293L5.5 10.586z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-xs font-semibold whitespace-nowrap transition-colors ${current.isClosed ? "text-[#E8FF57]" : "text-[#9D8FD0] group-hover:text-white"}`}>
                                                Closed
                                            </span>
                                        </button>
                                    </div>

                                    {/* Time Inputs */}
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-between sm:justify-end w-full sm:w-auto">
                                        {current.isClosed ? (
                                            <div className="w-full sm:w-auto flex items-center justify-start sm:justify-end py-1 sm:py-1.5">
                                                <span className="text-xs font-semibold text-[#9D8FD0] italic px-2.5 py-0.5 rounded-md bg-white/5 border border-white/5 sm:bg-transparent sm:border-0">
                                                    Closed all day
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2.5 w-full sm:flex sm:items-center sm:gap-3 sm:w-auto">
                                                {/* Open Time */}
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                                                    <span className="text-[10px] uppercase text-[#8B7EC8] font-bold shrink-0">Open</span>
                                                    <input
                                                        type="time"
                                                        value={current.open}
                                                        onChange={(e) =>
                                                            handleDayChange(d.day, "open", e.target.value)
                                                        }
                                                        className="w-full sm:w-[112px] md:w-[118px] h-9 px-2 sm:px-2.5 rounded-lg bg-black/40 border border-[rgba(124,58,237,0.4)] text-white text-xs focus:outline-none focus:border-[#E8FF57] [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer min-w-0 tracking-tight"
                                                        required={!current.isClosed}
                                                    />
                                                </div>

                                                {/* Close Time */}
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                                                    <span className="text-[10px] uppercase text-[#8B7EC8] font-bold shrink-0">Close</span>
                                                    <input
                                                        type="time"
                                                        value={current.close}
                                                        onChange={(e) =>
                                                            handleDayChange(d.day, "close", e.target.value)
                                                        }
                                                        className="w-full sm:w-[112px] md:w-[118px] h-9 px-2 sm:px-2.5 rounded-lg bg-black/40 border border-[rgba(124,58,237,0.4)] text-white text-xs focus:outline-none focus:border-[#E8FF57] [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer min-w-0 tracking-tight"
                                                        required={!current.isClosed}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Desktop Custom Closed Toggle */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDayChange(d.day, "isClosed", !current.isClosed)
                                            }
                                            className="hidden sm:flex items-center gap-1.5 ml-2.5 sm:ml-4 cursor-pointer select-none shrink-0 min-w-fit whitespace-nowrap group"
                                            aria-label={`Toggle closed for ${d.label}`}
                                        >
                                            <div
                                                className={`w-4 h-4 min-w-[16px] min-h-[16px] rounded-[4px] flex items-center justify-center transition-all shrink-0 ${
                                                    current.isClosed
                                                        ? "bg-[#7C3AED] border border-[#A855F7] shadow-[0_0_8px_rgba(124,58,237,0.6)]"
                                                        : "bg-black/50 border border-white/25 group-hover:border-[#7C3AED]/70"
                                                }`}
                                            >
                                                {current.isClosed && (
                                                    <svg className="w-2.5 h-2 text-white fill-current shrink-0" viewBox="0 0 16 12">
                                                        <path d="M5.5 10.586L1.707 6.793A1 1 0 00.293 8.207l4.5 4.5a1 1 0 001.414 0l9-9A1 1 0 0013.793 2.293L5.5 10.586z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-xs font-semibold whitespace-nowrap transition-colors ${current.isClosed ? "text-[#E8FF57]" : "text-[#9D8FD0] group-hover:text-white"}`}>
                                                Closed
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-[rgba(124,58,237,0.2)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#B7AADC] hover:text-white hover:bg-white/5 transition-all text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateHoursMutation.isPending}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] hover:brightness-110 active:scale-95 text-white shadow-[0px_4px_16px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:pointer-events-none transition-all text-center"
                        >
                            {updateHoursMutation.isPending ? "Updating..." : "Save Operating Hours"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OperatingHoursModal;
