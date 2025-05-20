"use client";

import { ChatEventHandler, Message, SendMessageProps, UseChatProps, User } from '../types/chat';
import { eventMessageSeenEvent, eventSendMessageEvent, eventTypingEvent } from '../services/chat/event';
import { getOrCreateSubscription, pusherSubscriptions } from './useChatSubscribe';
import { useCallback, useEffect, useRef } from 'react';

import { logger } from '../utils/logger';
import { useNextPusherChat } from '../providers/NextPusherChatProvider';
import { v4 as uuidv4 } from 'uuid';

export const useChat = ({onMessageReceived, onTypingStatus, onError, conversationId, participants, onMessageSeen}: UseChatProps) => {
  const { pusher, isConnected, isLoading, error, connectionState, userId } = useNextPusherChat();
  const callbacksRef = useRef<UseChatProps>({
    conversationId,
    participants,
    onMessageReceived,
    onMessageSeen,
    onTypingStatus,
    onError,
  });

  // Mettre à jour les callbacks si nécessaire
  useEffect(() => {
    callbacksRef.current = {
      conversationId,
      participants,
      onMessageReceived,
      onMessageSeen,
      onTypingStatus,
      onError,
    };
  }, [conversationId, participants, onMessageReceived, onMessageSeen, onTypingStatus, onError]);

  // Gérer l'abonnement/désabonnement
  useEffect(() => {
    if (!isConnected || !pusher) return;

    // Obtenir ou créer la souscription
    const subscription = getOrCreateSubscription(conversationId, pusher, userId);
    subscription.callbacks.add(callbacksRef.current);

    logger.info(`🔄 [Chat] Ajout des callbacks pour la conversation ${conversationId}`);

    // Nettoyage lors du démontage
    return () => {
      const subscription = pusherSubscriptions.get(conversationId);
      if (subscription) {
        subscription.callbacks.delete(callbacksRef.current);
        if (subscription.callbacks.size === 0) {
          subscription.unsubscribe();
          pusherSubscriptions.delete(conversationId);
          logger.info(`🔄 [Chat] Désabonnement Pusher pour la conversation ${conversationId}`);
        }
      }
      logger.info(`🔄 [Chat] Suppression des callbacks pour la conversation ${conversationId}`);
    };
  }, [isConnected, conversationId, pusher, userId]);

  // Fonction pour envoyer un message
  const sendMessage = (message: SendMessageProps | Message) => {
    return eventSendMessageEvent(conversationId, {
        userId,
        content: message.content,
        attachmentsCount: message.attachments?.length || 0,
        id: message.id,
    })
  };

  // Fonction pour préparer un message sans l'envoyer
  const prepareMessage = ({content, attachments}: SendMessageProps) => {
    const eventId = generateUUID();
    return {
      eventId,
      data: {
        userId,
        content,
        attachmentsCount: attachments?.length || 0,
        createdAt: new Date(),
      }
    };
  };

  // Fonction pour mettre à jour le statut de frappe
  const updateTypingStatus = (isTyping: boolean) => {
    return eventTypingEvent(conversationId, {
        userId,
        isTyping,
    })
  }

  const getParticipant = (id: string): User => {
    return participants.find((participant) => participant.id === id) || {
      id: "unknown",
      name: "Unknown",
    };
  };

  const generateUUID = () => {
    return uuidv4();
  }

  // Fonction pour marquer un message comme vu
  const markMessageAsSeen = (messageId: string) => {
    return eventMessageSeenEvent(conversationId, {
      userId,
      seenAt: new Date()
    });
  };

  return {
    sendMessage,
    prepareMessage,
    updateTypingStatus,
    getParticipant,
    markMessageAsSeen,
    connection: {
      isConnected,
      isLoading,
      error,
      connectionState
    }
  };
}; 