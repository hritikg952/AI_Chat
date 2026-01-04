"use client";

import { User, Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "./tooltip";
import { useState, useRef, useEffect } from "react";

interface ChatMessageProps {
    role: "user" | "assistant" | string;
    content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isAssistant = role === "assistant";
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isLong, setIsLong] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            // Check if content exceeds a certain height
            const hasOverflow = contentRef.current.scrollHeight > 320;
            setIsLong(hasOverflow);
        }
    }, [content]);

    return (
        <div className={cn("group w-full py-4", isAssistant ? "bg-background" : "bg-background")}>
            <div className="flex gap-4 md:gap-6">
                <div className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border mt-1",
                    isAssistant ? "bg-[#19c37d] text-white border-transparent" : "bg-sidebar border-border"
                )}>
                    {isAssistant ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div className="flex flex-col flex-1 gap-2 min-w-0">
                    <div className="font-semibold text-sm">
                        {isAssistant ? "ChatGPT" : "You"}
                    </div>
                    <div className="relative">
                        <div
                            ref={contentRef}
                            className={cn(
                                "text-sm leading-relaxed prose prose-neutral dark:prose-invert max-w-none break-words whitespace-pre-wrap overflow-hidden transition-[max-height] duration-300 ease-in-out",
                                isLong && isCollapsed ? "max-h-[300px]" : "max-h-[none]"
                            )}
                        >
                            {content}
                        </div>

                        {isLong && isCollapsed && (
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                        )}
                    </div>

                    {isLong && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-fit underline-offset-4 hover:underline"
                        >
                            {isCollapsed ? (
                                <>Read more <ChevronDown className="h-3 w-3" /></>
                            ) : (
                                <>Show less <ChevronUp className="h-3 w-3" /></>
                            )}
                        </button>
                    )}

                    {isAssistant && (
                        <div className={cn(
                            "flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
                            !isCollapsed && "pb-2"
                        )}>
                            <Tooltip content="Copy">
                                <button className="p-1 hover:bg-sidebar rounded text-muted-foreground transition-colors">
                                    <Copy className="h-3.5 w-3.5" />
                                </button>
                            </Tooltip>
                            <Tooltip content="Good response">
                                <button className="p-1 hover:bg-sidebar rounded text-muted-foreground transition-colors">
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                            </Tooltip>
                            <Tooltip content="Bad response">
                                <button className="p-1 hover:bg-sidebar rounded text-muted-foreground transition-colors">
                                    <ThumbsDown className="h-3.5 w-3.5" />
                                </button>
                            </Tooltip>
                            <Tooltip content="Regenerate">
                                <button className="p-1 hover:bg-sidebar rounded text-muted-foreground transition-colors">
                                    <RotateCcw className="h-3.5 w-3.5" />
                                </button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
