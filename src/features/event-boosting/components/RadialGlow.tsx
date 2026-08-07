"use client";

import React from "react";

export interface RadialGlowProps {
    color: string;
    size?: string;
    opacity?: string;
    positionClass?: string;
    className?: string;
}

export function RadialGlow({
    color,
    size = "w-[256px] h-[256px]",
    opacity = "opacity-[0.15]",
    positionClass = "",
    className = "",
}: RadialGlowProps) {
    return (
        <div
            className={`absolute pointer-events-none rounded-full ${size} ${opacity} ${positionClass} ${className}`}
            style={{
                background: `radial-gradient(70.71% 70.71% at 50% 50%, ${color} 0%, rgba(0, 0, 0, 0) 70%)`,
            }}
        />
    );
}

export default RadialGlow;
