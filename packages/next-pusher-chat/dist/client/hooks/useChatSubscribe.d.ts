import { ReceivedMessageEvent, ReceivedMessageSeenEvent, ReceivedTypingEvent } from '../types/chat';
interface UseChatSubscribeProps {
    conversationId: string;
    onMessageReceived?: (message: ReceivedMessageEvent) => void;
    onMessageSeen?: (messageSeen: ReceivedMessageSeenEvent) => void;
    onTypingStatus?: (typingStatus: ReceivedTypingEvent) => void;
    onError?: (error: Error) => void;
}
export declare const pusherSubscriptions: Map<string, {
    unsubscribe: () => void;
    callbacks: Set<UseChatSubscribeProps>;
}>;
export declare const getOrCreateSubscription: (conversationId: string, pusher: any, userId: string) => {
    unsubscribe: () => void;
    callbacks: Set<UseChatSubscribeProps>;
};
export declare const useChatSubscribe: ({ conversationId, onMessageReceived, onMessageSeen, onTypingStatus, onError, }: UseChatSubscribeProps) => {
    isConnected: boolean;
};
export {};
