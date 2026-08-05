import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelClassName?: string;
    error?: string;
    helperText?: string;
    containerClassName?: string;
    rightElement?: React.ReactNode;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    (
        {
            className,
            containerClassName,
            labelClassName,
            label,
            error,
            helperText,
            rightElement,
            type = "text",
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;

        return (
            <div className={cn("flex flex-col gap-2 w-full", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "font-['Manrope',sans-serif] font-semibold text-[14px] leading-[19px] text-white",
                            labelClassName
                        )}
                    >
                        {label}
                    </label>
                )}
                <div className="relative w-full flex items-center">
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            "w-full h-[52px] px-6 rounded-[24px] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white placeholder-white/70 font-['Manrope',sans-serif] text-[14px] focus:outline-none focus:border-[rgba(124,58,237,0.6)] focus:ring-1 focus:ring-[rgba(124,58,237,0.6)] transition-all disabled:cursor-not-allowed disabled:opacity-50",
                            rightElement && "pr-12",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-4 flex items-center justify-center text-white/70">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error ? (
                    <span className="font-['Manrope',sans-serif] text-xs text-red-400">
                        {error}
                    </span>
                ) : helperText ? (
                    <span className="font-['Manrope',sans-serif] text-xs text-white/60">
                        {helperText}
                    </span>
                ) : null}
            </div>
        );
    }
);

InputField.displayName = "InputField";

export { InputField };
