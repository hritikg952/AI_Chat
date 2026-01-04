"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    className?: string;
    side?: "top" | "bottom";
}

export function Tooltip({ content, children, className, side = "top" }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <div
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 px-2 py-1.5 bg-zinc-800 text-zinc-100 text-[11px] font-medium rounded-md shadow-lg whitespace-nowrap transition-all duration-200 z-50 pointer-events-none border border-zinc-700/50",
                    side === "top" ? "bottom-full mb-2" : "top-full mt-2",
                    isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-95"
                )}
            >
                {content}
                <div className={cn(
                    "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
                    side === "top" ? "top-full border-t-zinc-800" : "bottom-full border-b-zinc-800"
                )} />
            </div>
        </div>
    );
}
