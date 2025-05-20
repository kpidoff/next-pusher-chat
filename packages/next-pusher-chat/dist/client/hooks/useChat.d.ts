import { Message, SendMessageProps, UseChatProps, User } from '../types/chat';
export declare const useChat: ({ onMessageReceived, onTypingStatus, onError, conversationId, participants, onMessageSeen }: UseChatProps) => {
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
