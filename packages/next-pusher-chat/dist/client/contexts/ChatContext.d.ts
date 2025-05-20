import { ChatConfig, Message, OnMessageSeen, OnSendMessage, ReceiveMessage, SendMessageProps, User } from "../types/chat";
import React from "react";
interface ScrollManager {
    contentRef: React.RefObject<HTMLDivElement>;
    scrollToBottom: (behavior?: ScrollBehavior) => void;
    isAtBottom: boolean;
}
interface ChatContextType {
    messages: Message[];
    loadingSendMessage: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    typingUsers: string[];
    participants: User[];
    config?: ChatConfig;
    isLoading?: boolean;
    totalMessages?: number;
    sendMessage: (props: SendMessageProps) => Promise<void>;
    loadMoreMessages: () => Promise<void>;
    updateTypingStatus: (isTyping: boolean) => void;
    getParticipant: (userId: string) => User;
    userId: string;
    scrollManager: ScrollManager;
    currentMessagesCount: number;
}
export declare const useChatContext: () => ChatContextType;
export interface ChatProviderProps {
    conversationId: string;
    defaultMessages?: Message[];
    participants: User[];
    config?: ChatConfig;
    isLoading?: boolean;
    totalMessages?: number;
    onReceiveMessage?: (eventId: string, message: ReceiveMessage) => Promise<Message>;
    onSendMessage: (props: OnSendMessage) => Promise<Message>;
    onMessageSeen?: (props: OnMessageSeen) => void;
    onLoadMoreMessages: ({ oldestMessageId, previousMessages, }: {
        oldestMessageId: string;
        previousMessages: Message[];
    }) => Promise<Message[]>;
    children: React.ReactNode;
}
export declare const ChatProvider: React.FC<ChatProviderProps>;
export {};
