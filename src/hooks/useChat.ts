import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    fetchChatsAsync,
    createNewChatAsync,
    setActiveChat,
    sendMessageAsync,
    deleteChatAsync,
    updateModel,
} from "../store/chatSlice";

export const useChat = () => {
    const dispatch = useAppDispatch();
    const { chats, activeChatId, status, error } = useAppSelector((state) => state.chat);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchChatsAsync());
        }
    }, [status, dispatch]);

    const activeChat = chats.find((c) => c.id === activeChatId) || null;

    const createNewChat = useCallback(() => {
        dispatch(createNewChatAsync());
    }, [dispatch]);

    const selectChat = useCallback((id: string) => {
        dispatch(setActiveChat(id));
    }, [dispatch]);

    const sendMessage = useCallback((content: string) => {
        const model = activeChat?.model || "GPT-4o";
        dispatch(sendMessageAsync({ content, model }));
    }, [dispatch, activeChat]);

    const deleteChat = useCallback((id: string) => {
        dispatch(deleteChatAsync(id));
    }, [dispatch]);

    const changeModel = useCallback((model: string) => {
        dispatch(updateModel(model));
    }, [dispatch]);

    return {
        chats,
        activeChat,
        activeChatId,
        status,
        error,
        createNewChat,
        selectChat,
        sendMessage,
        deleteChat,
        changeModel,
    };
};
