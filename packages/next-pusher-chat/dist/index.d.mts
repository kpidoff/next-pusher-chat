import React from 'react';
import Pusher, { Options } from 'pusher-js';
import { NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

interface ChatProviderProps {
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

type ChatProps = Omit<ChatProviderProps, 'children'>;
interface User {
    id: string;
    name: string;
    avatar?: string;
}
interface Attachment {
    url: string;
    name: string;
    type: string;
    size: number;
}
interface Message {
    id: string;
    content: string;
    userId: string;
    createdAt: Date;
    type?: "message" | "system" | "MESSAGE" | "SYSTEM";
    attachmentsCount?: number;
    attachments?: Attachment[];
    seenBy?: {
        userId: string;
        seenAt: Date;
    }[];
}
interface Conversation {
    id: string;
    name: string;
    participants: string[];
    lastMessage?: Message;
    unreadCount: number;
}
type UseChatProps = {
    conversationId: string;
    onMessageReceived?: (message: ReceivedMessageEvent) => void;
    onMessageSeen?: (messageReceived: ReceivedMessageSeenEvent) => void;
    onTypingStatus?: (data: ReceivedTypingEvent) => void;
    onError?: (error: Error) => void;
    participants: User[];
};
type ChatEventHandler = Omit<UseChatProps, 'participants'>;
interface SendMessageEvent {
    userId: string;
    content: string;
    attachmentsCount?: number;
    createdAt: Date;
    id?: string;
}
type SendMessageProps = Omit<SendMessageEvent, 'userId' | 'attachmentsCount'> & {
    attachments?: File[];
};
type SendMessage = SendMessageEvent & {
    id: string;
    attachments?: File[];
    createdAt: Date;
};
type MessageSeen = {
    userId: string;
    seenAt: Date;
};
interface ReceivedMessageEvent {
    userId: string;
    content: string;
    eventId: string;
    attachmentsCount?: number;
    createdAt: Date;
}
interface TypingEvent {
    userId: string;
    isTyping: boolean;
}
interface ReceivedTypingEvent {
    userId: string;
    isTyping: boolean;
    eventId: string;
}
interface ReceivedMessageSeenEvent {
    userId: string;
    eventId: string;
    seenAt: Date;
}
interface AuthEvent {
    userId: string;
    socketId: string;
    channel: string;
}
interface ChatConfig {
    activeEmoji?: boolean;
    activeFile?: boolean;
    activeVoice?: boolean;
    activeUserColor?: boolean;
    welcomeMessage?: string;
    typingTimeout?: number;
    numberOfMessagesToLoad?: number;
}
interface ReceiveMessage {
    id: string;
    content: string;
    userId: string;
    user: User;
    createdAt: Date;
    attachmentsCount?: number;
}
type OnSendMessage = {
    eventId: string;
    message: SendMessage;
    conversationId: string;
};
type OnMessageSeen = {
    lastMessage: Message;
    conversationId: string;
    userId: string;
};

declare const useChat: ({ onMessageReceived, onTypingStatus, onError, conversationId, participants, onMessageSeen }: UseChatProps) => {
    sendMessage: (message: SendMessageProps | Message) => Promise<{
        eventId: string;
        data: any;
    }>;
    prepareMessage: ({ content, attachments }: SendMessageProps) => {
        eventId: string;
        data: {
            userId: string;
            content: string;
            attachmentsCount: number;
            createdAt: Date;
        };
    };
    updateTypingStatus: (isTyping: boolean) => Promise<{
        eventId: string;
        data: any;
    }>;
    getParticipant: (id: string) => User;
    markMessageAsSeen: (messageId: string) => Promise<{
        eventId: string;
        data: any;
    }>;
    connection: {
        isConnected: boolean;
        isLoading: boolean;
        error: string | null;
        connectionState: string;
    };
};

interface UseChatSubscribeProps {
    conversationId: string;
    onMessageReceived?: (message: ReceivedMessageEvent) => void;
    onMessageSeen?: (messageSeen: ReceivedMessageSeenEvent) => void;
    onTypingStatus?: (typingStatus: ReceivedTypingEvent) => void;
    onError?: (error: Error) => void;
}
declare const pusherSubscriptions: Map<string, {
    unsubscribe: () => void;
    callbacks: Set<UseChatSubscribeProps>;
}>;
declare const getOrCreateSubscription: (conversationId: string, pusher: any, userId: string) => {
    unsubscribe: () => void;
    callbacks: Set<UseChatSubscribeProps>;
};
declare const useChatSubscribe: ({ conversationId, onMessageReceived, onMessageSeen, onTypingStatus, onError, }: UseChatSubscribeProps) => {
    isConnected: boolean;
};

interface PusherConnectionState {
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    connectionState: string;
}
interface PusherContextType extends PusherConnectionState {
    pusher: Pusher | null;
    userId: string;
}
interface UseNextPusherChatProps {
    userId: string;
    options?: Partial<Options>;
    children: React.ReactNode;
}
declare const NextPusherChatProvider: React.FC<UseNextPusherChatProps>;
declare const useNextPusherChat: () => PusherContextType;

declare const Chat: React.FC<Omit<ChatProps, "conversationId"> & {
    conversationId?: string | null;
    buttonJoin?: React.ReactNode;
}>;

interface ChatBubbleProps {
    onClick?: () => void;
    unreadCount?: number;
    color?: "primary" | "secondary";
    title?: string;
    renderParticipant?: (participant: User) => React.ReactNode;
    allAttachments?: Attachment[];
    conversationId?: string | null;
    buttonJoin?: React.ReactNode;
}
declare const ChatBubble: React.FC<ChatBubbleProps & Omit<ChatProps, "conversationId">>;

interface File$1 {
    url: string;
    name: string;
    type: string;
    size: number;
}
interface FileItemProps {
    file: File$1;
    onClick?: (file: File$1) => void;
}
declare const FileItem: React.FC<FileItemProps>;

declare function POST(request: NextRequest): Promise<Response>;

interface PusherEvent<T> {
    event: string;
    eventId: string;
    conversationId: string;
    data: T;
}

declare const pusherEvent: <T>({ event, conversationId, data, eventId: providedEventId }: Omit<PusherEvent<T>, "eventId"> & {
    eventId?: string;
}) => Promise<{
    eventId: string;
    data: any;
}>;

declare class PagesRouterAdapter {
    static convertRequest(req: NextApiRequest): NextRequest;
    static convertResponse(response: Response, res: NextApiResponse): Promise<void>;
}

export { type Attachment, type AuthEvent, Chat, ChatBubble, type ChatConfig, type ChatEventHandler, type ChatProps, type Conversation, FileItem, type Message, type MessageSeen, NextPusherChatProvider, type OnMessageSeen, type OnSendMessage, POST, PagesRouterAdapter, type PusherEvent, type ReceiveMessage, type ReceivedMessageEvent, type ReceivedMessageSeenEvent, type ReceivedTypingEvent, type SendMessage, type SendMessageEvent, type SendMessageProps, type TypingEvent, type UseChatProps, type User, getOrCreateSubscription, pusherEvent, pusherSubscriptions, useChat, useChatSubscribe, useNextPusherChat };
