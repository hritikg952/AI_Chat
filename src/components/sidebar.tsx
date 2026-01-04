"use client";

import { MessageSquare, Plus, X, Settings, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tooltip } from "./tooltip";
import { useChat } from "@/hooks/useChat";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { chats, activeChatId, createNewChat, selectChat, deleteChat } = useChat();

    const handleNewChat = () => {
        createNewChat();
        setIsOpen(false);
    };

    const handleSelectChat = (id: string) => {
        selectChat(id);
        setIsOpen(false);
    };

    const handleDeleteChat = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteChat(id);
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-full w-[260px] flex-col bg-sidebar border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-2 rounded-lg border border-border p-2 px-3 text-sm font-medium hover:bg-background/80 transition-colors w-full"
                    >
                        <Plus className="h-4 w-4" />
                        New chat
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-2 hover:bg-background/80 rounded-lg ml-2"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-border">
                    <div className="space-y-1">
                        {chats.length > 0 && (
                            <p className="px-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 mt-4">History</p>
                        )}
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleSelectChat(chat.id);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                className={cn(
                                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors truncate group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    activeChatId === chat.id ? "bg-background shadow-sm" : "hover:bg-background/80"
                                )}
                            >
                                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate pr-6">{chat.title}</span>
                                <div className={cn(
                                    "absolute right-2 transition-opacity",
                                    activeChatId === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}>
                                    <Tooltip content="Delete">
                                        <button
                                            onClick={(e) => handleDeleteChat(e, chat.id)}
                                            className="p-1 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                        {chats.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-20 text-center px-4">
                                <p className="text-xs text-muted-foreground">No recent chats. Start a new one!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto p-4 space-y-2 border-t border-border">
                    <div className="flex items-center justify-between">
                        <Tooltip content="Switch theme">
                            <ThemeToggle />
                        </Tooltip>
                        <Tooltip content="Settings">
                            <button className="p-2 hover:bg-background/80 rounded-lg">
                                <Settings className="h-5 w-5" />
                            </button>
                        </Tooltip>
                    </div>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-background/80 transition-colors">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">
                            <User className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Guest User</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
