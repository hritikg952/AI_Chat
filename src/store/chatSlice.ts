import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IChat, IChatState, IMessage } from "../types/chat";
import { ChatService } from "../services/chatService";
import { v4 as uuidv4 } from "uuid";

const initialState: IChatState = {
    chats: [],
    activeChatId: null,
    status: "idle",
    error: null,
};

export const fetchChatsAsync = createAsyncThunk("chat/fetchChats", async () => {
    return await ChatService.fetchChats();
});

export const createNewChatAsync = createAsyncThunk("chat/createNewChat", async (_, { dispatch }) => {
    const newChat: IChat = {
        id: uuidv4(),
        title: "New Chat",
        messages: [],
        model: "GPT-4o",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    await ChatService.saveChat(newChat);
    return newChat;
});

export const sendMessageAsync = createAsyncThunk(
    "chat/sendMessage",
    async ({ content, model }: { content: string; model: string }, { getState, dispatch }) => {
        const state = getState() as { chat: IChatState };
        let activeChat = state.chat.chats.find((c) => c.id === state.chat.activeChatId);

        const userMessage: IMessage = {
            id: uuidv4(),
            role: "user",
            content,
            timestamp: Date.now(),
        };

        const aiMessage: IMessage = {
            id: uuidv4(),
            role: "assistant",
            content: "I'm a static clone. I can't think yet!",
            timestamp: Date.now() + 500,
        };

        let updatedChat: IChat;

        if (!activeChat) {
            updatedChat = {
                id: uuidv4(),
                title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
                messages: [userMessage, aiMessage],
                model,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        } else {
            const messages = [...activeChat.messages, userMessage, aiMessage];
            const title = activeChat.messages.length === 0
                ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                : activeChat.title;

            updatedChat = {
                ...activeChat,
                title,
                messages,
                updatedAt: Date.now(),
            };
        }

        await ChatService.saveChat(updatedChat);
        return updatedChat;
    }
);

export const deleteChatAsync = createAsyncThunk("chat/deleteChat", async (id: string) => {
    await ChatService.deleteChat(id);
    return id;
});

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat(state, action: PayloadAction<string | null>) {
            state.activeChatId = action.payload;
        },
        updateModel(state, action: PayloadAction<string>) {
            if (state.activeChatId) {
                const chat = state.chats.find(c => c.id === state.activeChatId);
                if (chat) {
                    chat.model = action.payload;
                    ChatService.saveChat(chat);
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatsAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchChatsAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.chats = action.payload;
                if (action.payload.length > 0 && !state.activeChatId) {
                    state.activeChatId = action.payload[0].id;
                }
            })
            .addCase(createNewChatAsync.fulfilled, (state, action) => {
                state.chats.unshift(action.payload);
                state.activeChatId = action.payload.id;
            })
            .addCase(sendMessageAsync.fulfilled, (state, action) => {
                const index = state.chats.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.chats[index] = action.payload;
                } else {
                    state.chats.unshift(action.payload);
                }
                state.activeChatId = action.payload.id;
            })
            .addCase(deleteChatAsync.fulfilled, (state, action) => {
                state.chats = state.chats.filter((c) => c.id !== action.payload);
                if (state.activeChatId === action.payload) {
                    state.activeChatId = state.chats.length > 0 ? state.chats[0].id : null;
                }
            });
    },
});

export const { setActiveChat, updateModel } = chatSlice.actions;
export default chatSlice.reducer;
