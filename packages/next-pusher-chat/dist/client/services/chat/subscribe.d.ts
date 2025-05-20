import { ChatEventHandler } from '../../types/chat';
import Pusher from 'pusher-js';
export declare const createChatSubscribes: (pusher: Pusher, userId: string, handlers: ChatEventHandler) => {
    setupConversationSubscribes: (conversationId: string) => () => void;
};
