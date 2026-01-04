"use client";

import { ArrowUp, Mic, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    onSend: (text: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput("");
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "inherit";
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
        }
    }, [input]);

    return (
        <div className="relative flex items-end w-full bg-sidebar border border-border rounded-2xl p-2 pr-3 focus-within:ring-1 focus-within:ring-ring transition-all duration-200">
            <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder="Message ChatGPT..."
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-3 text-sm max-h-[200px] outline-none"
            />
            <div className="flex items-center gap-2 pb-1.5 px-1">
                <button className="p-2 hover:bg-background/80 rounded-lg text-muted-foreground transition-colors">
                    <Mic className="h-5 w-5" />
                </button>
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={cn(
                        "p-2 rounded-xl transition-all duration-200",
                        input.trim()
                            ? "bg-foreground text-background"
                            : "bg-muted-foreground/20 text-muted-foreground/40 cursor-not-allowed"
                    )}
                >
                    <ArrowUp className="h-5 w-5 font-bold" />
                </button>
            </div>
        </div>
    );
}
