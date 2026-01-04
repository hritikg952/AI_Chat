import { IChat, IMessage } from "../types/chat";

const STORAGE_KEY = "chat_clone_data_v2";

export class ChatService {
    private static getStoredData(): { chats: IChat[] } {
        if (typeof window === "undefined") return { chats: [] };
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { chats: [] };
    }

    private static setStoredData(data: { chats: IChat[] }): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    public static async fetchChats(): Promise<IChat[]> {
        return new Promise((resolve) => {
            const data = this.getStoredData();
            resolve(data.chats);
        });
    }

    public static async saveChat(chat: IChat): Promise<void> {
        return new Promise((resolve) => {
            const data = this.getStoredData();
            const index = data.chats.findIndex((c) => c.id === chat.id);
            if (index !== -1) {
                data.chats[index] = chat;
            } else {
                data.chats.unshift(chat);
            }
            this.setStoredData(data);
            resolve();
        });
    }

    public static async deleteChat(id: string): Promise<void> {
        return new Promise((resolve) => {
            const data = this.getStoredData();
            data.chats = data.chats.filter((c) => c.id !== id);
            this.setStoredData(data);
            resolve();
        });
    }

    public static async updateChat(id: string, updates: Partial<IChat>): Promise<void> {
        return new Promise((resolve) => {
            const data = this.getStoredData();
            data.chats = data.chats.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c));
            this.setStoredData(data);
            resolve();
        });
    }
}
