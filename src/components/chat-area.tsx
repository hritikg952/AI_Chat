"use client";

import { MessageSquare, Share, MoreHorizontal, ChevronDown } from "lucide-react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { useState, useRef, useEffect } from "react";
import { Tooltip } from "./tooltip";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";

interface ChatAreaProps {
    onToggleSidebar: () => void;
}

export function ChatArea({ onToggleSidebar }: ChatAreaProps) {
    const { activeChat, sendMessage, changeModel } = useChat();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showModelSelector, setShowModelSelector] = useState(false);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);

    const models = ["GPT-4o", "GPT-4", "GPT-3.5", "o1-preview"];

    const handleSendMessage = (content: string) => {
        sendMessage(content);
    };

    const handleChangeModel = (model: string) => {
        changeModel(model);
        setShowModelSelector(false);
    };

    return (
        <main className="flex h-full flex-1 flex-col bg-background relative">
            {/* Header */}
            <header className="flex h-14 items-center justify-between px-4 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10 transition-all">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 hover:bg-sidebar rounded-lg md:hidden"
                    >
                        <MessageSquare className="h-5 w-5" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowModelSelector(!showModelSelector)}
                            className="flex items-center gap-1 px-3 py-1.5 hover:bg-sidebar rounded-xl text-sm font-semibold transition-colors"
                        >
                            {activeChat?.model || "GPT-4o"}
                            <ChevronDown className={cn("h-4 w-4 transition-transform", showModelSelector && "rotate-180")} />
                        </button>

                        {showModelSelector && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                {models.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => handleChangeModel(m)}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm hover:bg-sidebar transition-colors",
                                            (activeChat?.model || "GPT-4o") === m && "font-bold text-primary"
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip content="Share chat" side="bottom">
                        <button className="p-2 hover:bg-sidebar rounded-lg">
                            <Share className="h-4 w-4" />
                        </button>
                    </Tooltip>
                    <Tooltip content="More options" side="bottom">
                        <button className="p-2 hover:bg-sidebar rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </Tooltip>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border">
                <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
                    {(!activeChat || activeChat.messages.length === 0) ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                            <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center mb-2">
                                <MessageSquare className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-semibold">How can I help you today?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8 w-full max-w-2xl px-4">
                                {["Help me write", "Explain quantum physics", "Plan a trip", "Code a Python script"].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSendMessage(suggestion)}
                                        className="p-4 text-left text-sm border border-border rounded-xl hover:bg-sidebar transition-colors group relative"
                                    >
                                        <span className="font-medium">{suggestion}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeChat.messages.map((msg, i) => (
                                <ChatMessage key={msg.id || i} role={msg.role} content={msg.content} />
                            ))}
                            <div ref={scrollRef} className="h-1" />
                        </>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl">
                    <ChatInput onSend={handleSendMessage} />
                    <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
                        ChatGPT can make mistakes. Check important info.
                    </p>
                </div>
            </div>
        </main>
    );
}
