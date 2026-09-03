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
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative w-full max-w-[620px] rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 shadow-[0px_16px_48px_rgba(0,0,0,0.6)] border border-[rgba(124,58,237,0.35)] max-h-[90vh] overflow-y-auto custom-scrollbar"
                style={{ background: "rgba(14, 7, 34, 0.95)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.4)] flex items-center justify-center text-[#E8FF57]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-white">Operating Hours</h3>
                            <p className="text-xs text-[#8B7EC8]">Configure open and close times for each day of the week</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Quick actions */}
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)]">
                    <span className="text-xs text-[#C4B5FD]">Quick Template:</span>
                    <button
                        type="button"
                        onClick={handleApplyWeekdayDefaults}
                        className="text-xs font-semibold text-[#E8FF57] hover:underline"
                    >
                        Apply Standard Bar Schedule (18:00 - 02:00)
                    </button>
                </div>

                {/* Hours Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2.5">
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
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                                        current.isClosed
                                            ? "bg-white/[0.02] border-white/10 opacity-70"
                                            : "bg-[#140E50]/70 border-[rgba(124,58,237,0.3)] shadow-sm"
                                    }`}
                                >
                                    {/* Day Name & Closed Toggle */}
                                    <div className="flex items-center justify-between sm:w-40">
                                        <span className="font-bold text-sm text-white">{d.label}</span>
                                        <label className="flex items-center gap-2 cursor-pointer sm:hidden">
                                            <input
                                                type="checkbox"
                                                checked={current.isClosed}
                                                onChange={(e) =>
                                                    handleDayChange(d.day, "isClosed", e.target.checked)
                                                }
                                                className="rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-xs text-[#9D8FD0]">Closed</span>
                                        </label>
                                    </div>

                                    {/* Time Inputs */}
                                    <div className="flex items-center gap-2.5 mt-2 sm:mt-0 flex-1 justify-end">
                                        {current.isClosed ? (
                                            <span className="text-xs font-semibold text-[#9D8FD0] italic py-1.5">
                                                Closed all day
                                            </span>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] uppercase text-[#8B7EC8] font-bold">Open</span>
                                                    <input
                                                        type="time"
                                                        value={current.open}
                                                        onChange={(e) =>
                                                            handleDayChange(d.day, "open", e.target.value)
                                                        }
                                                        className="h-9 px-2.5 rounded-lg bg-black/40 border border-[rgba(124,58,237,0.4)] text-white text-xs focus:outline-none focus:border-[#E8FF57]"
                                                        required={!current.isClosed}
                                                    />
                                                </div>
                                                <span className="text-white/40 text-xs">-</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] uppercase text-[#8B7EC8] font-bold">Close</span>
                                                    <input
                                                        type="time"
                                                        value={current.close}
                                                        onChange={(e) =>
                                                            handleDayChange(d.day, "close", e.target.value)
                                                        }
                                                        className="h-9 px-2.5 rounded-lg bg-black/40 border border-[rgba(124,58,237,0.4)] text-white text-xs focus:outline-none focus:border-[#E8FF57]"
                                                        required={!current.isClosed}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <label className="hidden sm:flex items-center gap-1.5 ml-3 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={current.isClosed}
                                                onChange={(e) =>
                                                    handleDayChange(d.day, "isClosed", e.target.checked)
                                                }
                                                className="w-4 h-4 rounded bg-purple-900 border-purple-600 text-purple-500 focus:ring-0 cursor-pointer"
                                            />
                                            <span className="text-xs text-[#9D8FD0]">Closed</span>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[rgba(124,58,237,0.2)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#B7AADC] hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateHoursMutation.isPending}
                            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] hover:brightness-110 active:scale-95 text-white shadow-[0px_4px_16px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:pointer-events-none transition-all"
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
