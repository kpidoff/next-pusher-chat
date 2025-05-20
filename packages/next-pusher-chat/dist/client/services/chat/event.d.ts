import { AuthEvent, MessageSeen, SendMessageEvent, TypingEvent } from "../../types/chat";
export declare const eventSendMessageEvent: (conversationId: string, data: Omit<SendMessageEvent, "createdAt">) => Promise<{
    eventId: string;
    data: any;
}>;
export declare const eventTypingEvent: (conversationId: string, data: TypingEvent) => Promise<{
    eventId: string;
    data: any;
}>;
export declare const eventMessageSeenEvent: (conversationId: string, data: MessageSeen) => Promise<{
    eventId: string;
    data: any;
}>;
export declare const eventAuthEvent: (conversationId: string, data: AuthEvent) => Promise<{
    eventId: string;
    data: any;
}>;
