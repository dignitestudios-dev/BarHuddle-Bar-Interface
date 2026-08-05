import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-[24px] font-['Manrope',sans-serif] font-bold text-[16px] leading-[22px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] cursor-pointer",
    {
        variants: {
            variant: {
                gradient:
                    "bg-gradient-to-r from-[#7C3AED] to-[#9F4FFA] text-white shadow-[0px_0px_20px_rgba(124,58,237,0.5),0px_0px_40px_rgba(232,255,87,0.1)] hover:opacity-95 hover:shadow-[0px_0px_25px_rgba(124,58,237,0.7),0px_0px_45px_rgba(232,255,87,0.2)]",
                social:
                    "bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.25)] text-white font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[14px] leading-[18px] hover:bg-[rgba(124,58,237,0.2)] active:scale-[0.98]",
                outline:
                    "border border-white/20 bg-transparent text-white hover:bg-white/10",
                ghost:
                    "hover:bg-white/10 text-white",
                secondary:
                    "bg-purple-600/20 text-white hover:bg-purple-600/30",
            },
            size: {
                default: "h-[52px] px-6 py-3 w-full",
                sm: "h-9 px-4 text-xs rounded-lg",
                lg: "h-14 px-8 text-lg rounded-[24px]",
                icon: "h-[52px] w-[52px] p-0 rounded-[24px]",
            },
        },
        defaultVariants: {
            variant: "gradient",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
