export interface IMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export interface IChat {
    id: string;
    title: string;
    messages: IMessage[];
    model: string;
    createdAt: number;
    updatedAt: number;
}

export interface IChatState {
    chats: IChat[];
    activeChatId: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}
