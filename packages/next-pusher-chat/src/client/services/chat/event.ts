"use client";

import { AuthEvent, MessageSeen, SendMessageEvent, TypingEvent } from "../../types/chat";

import { pusherEvent } from "@/server";

export const eventSendMessageEvent = async (conversationId: string, data: Omit<SendMessageEvent, 'createdAt'>) => {
    const {data: result, eventId} = await pusherEvent<SendMessageEvent>({
        eventId: data.id,
        event: 'new-message',
        conversationId,
        data: {
            ...data,
            createdAt: new Date()
        }
    });
    //On retourne l'eventId pour que le composant Conversation puisse l'utiliser
    return {
      eventId,
      data: result
    };
  };

export const eventTypingEvent = async (conversationId: string, data: TypingEvent) => {  
    const {data: result, eventId} = await pusherEvent({
        event: 'user-typing',
        conversationId,
        data: data
    });
    return {
        eventId,
        data: result
    };
  }

export const eventMessageSeenEvent = async (conversationId: string, data: MessageSeen) => {
    const {data: result, eventId} = await pusherEvent({
        event: 'message-seen',
        conversationId,
        data: data
    });
    return {
        eventId,
        data: result
    };
}

export const eventAuthEvent = async (conversationId: string, data: AuthEvent) => {  
    const {data: result, eventId} = await pusherEvent({
        event: 'auth',
        conversationId,
        data: data
    });
    return {
        eventId,
        data: result
    };
}
