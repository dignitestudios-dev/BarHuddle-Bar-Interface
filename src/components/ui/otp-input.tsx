"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    boxClassName?: string;
}

export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
    (
        {
            length = 5,
            value,
            onChange,
            onComplete,
            disabled = false,
            className,
            boxClassName,
        },
        ref
    ) => {
        const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

        // Convert string value to array of characters padded to `length`
        const valueArray = React.useMemo(() => {
            const arr = value.split("").slice(0, length);
            while (arr.length < length) {
                arr.push("");
            }
            return arr;
        }, [value, length]);

        const handleChange = (
            e: React.ChangeEvent<HTMLInputElement>,
            index: number
        ) => {
            const val = e.target.value;
            if (disabled) return;

            // Take the last character entered if multiple characters (e.g. typing over existing)
            const digit = val.replace(/\D/g, "").slice(-1);

            const newValueArray = [...valueArray];
            newValueArray[index] = digit;
            const combinedValue = newValueArray.join("");

            onChange(combinedValue);

            // Auto-focus next input if a digit was entered
            if (digit && index < length - 1) {
                inputRefs.current[index + 1]?.focus();
            }

            if (combinedValue.length === length && !combinedValue.includes("")) {
                onComplete?.(combinedValue);
            }
        };

        const handleKeyDown = (
            e: React.KeyboardEvent<HTMLInputElement>,
            index: number
        ) => {
            if (disabled) return;

            if (e.key === "Backspace") {
                if (!valueArray[index] && index > 0) {
                    // Move focus to previous input on Backspace if current field is empty
                    inputRefs.current[index - 1]?.focus();
                }
            } else if (e.key === "ArrowLeft" && index > 0) {
                e.preventDefault();
                inputRefs.current[index - 1]?.focus();
            } else if (e.key === "ArrowRight" && index < length - 1) {
                e.preventDefault();
                inputRefs.current[index + 1]?.focus();
            }
        };

        const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (disabled) return;

            const pastedData = e.clipboardData
                .getData("text/plain")
                .replace(/\D/g, "")
                .slice(0, length);

            if (pastedData) {
                onChange(pastedData);
                const nextIndex = Math.min(pastedData.length, length - 1);
                inputRefs.current[nextIndex]?.focus();

                if (pastedData.length === length) {
                    onComplete?.(pastedData);
                }
            }
        };

        return (
            <div
                ref={ref}
                className={cn("flex items-center justify-center gap-3", className)}
                role="group"
                aria-label="OTP Verification Code Input"
            >
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={valueArray[index] || ""}
                        disabled={disabled}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onFocus={(e) => e.target.select()}
                        className={cn(
                            "w-[80px] h-[80px] sm:w-[80px] sm:h-[80px] w-14 h-14",
                            "bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] rounded-[24px]",
                            "font-['Manrope',sans-serif] font-semibold text-[28px] sm:text-[32px] text-white text-center",
                            "outline-none transition-all duration-200",
                            "focus:border-[#9F4FFA] focus:bg-[rgba(124,58,237,0.22)] focus:shadow-[0_0_20px_rgba(124,58,237,0.4)]",
                            "hover:border-[rgba(124,58,237,0.4)]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            boxClassName
                        )}
                    />
                ))}
            </div>
        );
    }
);

OtpInput.displayName = "OtpInput";
