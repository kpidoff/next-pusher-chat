"use client";

import { ChatEventHandler, ReceivedMessageEvent, ReceivedMessageSeenEvent, ReceivedTypingEvent, TypingEvent } from '../../types/chat';

import Pusher from 'pusher-js';
import { logger } from '@/client/utils/logger';

// Set pour stocker les eventId déjà traités
const processedEventIds = new Set<string>();

export const createChatSubscribes = (
  pusher: Pusher,
  userId: string,
  handlers: ChatEventHandler,
 
) => {
  // Set pour stocker les canaux actifs
  const activeChannels = new Set<string>();



  const setupConversationSubscribes = (conversationId: string) => {
    const channelName = `private-${conversationId}`;
    
    // Vérifier si le canal est déjà actif
    if (activeChannels.has(channelName)) {
      return () => {};
    }

    const channel = pusher.subscribe(channelName);
    activeChannels.add(channelName);
    logger.info(`💬 [Subscribe] Nouveau canal actif: ${channelName}`);

    // Gestion des messages
    channel.bind('new-message', (props: ReceivedMessageEvent) => {
      const {eventId, userId: userIdReceived} = props;
     
      if (!eventId || processedEventIds.has(eventId) || userIdReceived === userId) {
        return;
      }
      processedEventIds.add(eventId);
      logger.info(`💬 [Message] Nouveau message`, props);
      handlers?.onMessageReceived?.(props);
    });

    // Gestion du statut de frappe autres que l'utilisateur actuel
    channel.bind('user-typing', (props: ReceivedTypingEvent) => {
      const {eventId, userId: userIdReceived} = props;
      if (!eventId || processedEventIds.has(eventId) || userIdReceived === userId || !handlers?.onTypingStatus) {
        return;
      }
      processedEventIds.add(eventId);
      logger.info(`💬 [Typing] Entrée de frappe`, props);
      handlers?.onTypingStatus?.(props);
    });

    // Gestion du statut de lecture
    channel.bind('message-seen', (props: ReceivedMessageSeenEvent) => {
      const {eventId, userId: userIdReceived} = props;
      if (!eventId || processedEventIds.has(eventId) || userIdReceived === userId || !handlers?.onMessageSeen) {
        return;
      }
      processedEventIds.add(eventId);
      logger.info(`💬 [MessageSeen] Message marqué comme lu`, props);
      handlers?.onMessageSeen?.(props);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      activeChannels.delete(channelName);
      logger.info(`💬 [Unsubscribe] Canal ${channelName} désactivé`);
    };
  };

  return {
    setupConversationSubscribes,
  };
}; 