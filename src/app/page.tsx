"use client";

import { Sidebar } from "@/components/sidebar";
import { ChatArea } from "@/components/chat-area";
import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { status } = useChat();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <ChatArea
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

      {status === "loading" && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
