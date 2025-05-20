"use client";

import { ReceivedMessageEvent, ReceivedMessageSeenEvent, ReceivedTypingEvent } from '../types/chat';
import { useCallback, useEffect, useRef } from 'react';

import { createChatSubscribes } from '../services/chat/subscribe';
import { logger } from '../utils/logger';
import { useNextPusherChat } from '../providers/NextPusherChatProvider';

interface UseChatSubscribeProps {
  conversationId: string;
  onMessageReceived?: (message: ReceivedMessageEvent) => void;
  onMessageSeen?: (messageSeen: ReceivedMessageSeenEvent) => void;
  onTypingStatus?: (typingStatus: ReceivedTypingEvent) => void;
  onError?: (error: Error) => void;
}

// Map pour stocker les souscriptions Pusher par conversation
export const pusherSubscriptions = new Map<string, {
  unsubscribe: () => void;
  callbacks: Set<UseChatSubscribeProps>;
}>();

// Fonction pour créer ou récupérer une souscription Pusher
export const getOrCreateSubscription = (conversationId: string, pusher: any, userId: string) => {
  if (!pusherSubscriptions.has(conversationId)) {
    const events = createChatSubscribes(pusher, userId, {
      conversationId,
      onMessageReceived: (message) => {
        const subscription = pusherSubscriptions.get(conversationId);
        if (subscription) {
          // Utiliser Array.from pour créer une copie du Set et éviter les problèmes de mutation
          Array.from(subscription.callbacks).forEach((callback) => {
            if (callback.onMessageReceived) {
              callback.onMessageReceived(message);
            }
          });
        }
      },
      onMessageSeen: (messageSeen) => {
        const subscription = pusherSubscriptions.get(conversationId);
        if (subscription) {
          Array.from(subscription.callbacks).forEach((callback) => {
            if (callback.onMessageSeen) {
              callback.onMessageSeen(messageSeen);
            }
          });
        }
      },
      onTypingStatus: (typingStatus) => {
        const subscription = pusherSubscriptions.get(conversationId);
        if (subscription) {
          Array.from(subscription.callbacks).forEach((callback) => {
            if (callback.onTypingStatus) {
              callback.onTypingStatus(typingStatus);
            }
          });
        }
      },
      onError: (error) => {
        const subscription = pusherSubscriptions.get(conversationId);
        if (subscription) {
          Array.from(subscription.callbacks).forEach((callback) => {
            if (callback.onError) {
              callback.onError(error);
            }
          });
        }
      },
    });

    const unsubscribe = events.setupConversationSubscribes(conversationId);
    pusherSubscriptions.set(conversationId, {
      unsubscribe,
      callbacks: new Set(),
    });
  }
  return pusherSubscriptions.get(conversationId)!;
};

export const useChatSubscribe = ({
  conversationId,
  onMessageReceived,
  onMessageSeen,
  onTypingStatus,
  onError,
}: UseChatSubscribeProps) => {
  const { pusher, isConnected, userId } = useNextPusherChat();
  
  // Créer un objet stable pour les callbacks
  const callbacks = useCallback(() => ({
    conversationId,
    onMessageReceived,
    onMessageSeen,
    onTypingStatus,
    onError,
  }), [conversationId, onMessageReceived, onMessageSeen, onTypingStatus, onError]);

  // Gérer l'abonnement/désabonnement
  useEffect(() => {
    if (!isConnected || !pusher) return;

    // Obtenir ou créer la souscription
    const subscription = getOrCreateSubscription(conversationId, pusher, userId);
    const currentCallbacks = callbacks();
    
    // Ajouter les callbacks actuels
    subscription.callbacks.add(currentCallbacks);

    logger.info(`🔄 [ChatSubscribe] Ajout des callbacks pour la conversation ${conversationId}`);

    // Nettoyage lors du démontage
    return () => {
      const subscription = pusherSubscriptions.get(conversationId);
      if (subscription) {
        subscription.callbacks.delete(currentCallbacks);
        if (subscription.callbacks.size === 0) {
          subscription.unsubscribe();
          pusherSubscriptions.delete(conversationId);
          logger.info(`🔄 [ChatSubscribe] Désabonnement Pusher pour la conversation ${conversationId}`);
        }
      }
      logger.info(`🔄 [ChatSubscribe] Suppression des callbacks pour la conversation ${conversationId}`);
    };
  }, [isConnected, conversationId, pusher, userId, callbacks]);

  return {
    isConnected,
  };
}; 