import { PusherEvent } from "../types/pusher";
import { logger } from "@/client/utils/logger";
import { v4 as uuidv4 } from 'uuid';

export const pusherEvent = async <T>({event, conversationId, data, eventId: providedEventId}: Omit<PusherEvent<T>, 'eventId'> & { eventId?: string }) => {
    try {
      const eventId = providedEventId || uuidv4();
      logger.info(`🔄 Triggering Pusher event [${event}] id [${eventId}] for conversation [${conversationId}]:`, data);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: `private-${conversationId}`,
          event,
          data: {
            eventId,
            createdAt: new Date(),
            ...data
          },
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Erreur lors de l\'envoi de l\'événement');
      }

      const result = await response.json();
      return {
        eventId,
        data: result
      };
    } catch (error) {
      console.error('Error in pusherEvent:', error);
      throw error;
    }
};