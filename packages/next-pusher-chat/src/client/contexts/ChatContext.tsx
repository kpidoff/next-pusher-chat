import {
  ChatConfig,
  Message,
  OnMessageSeen,
  OnSendMessage,
  ReceiveMessage,
  SendMessage,
  SendMessageProps,
  User,
} from "../types/chat";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { DEFAULT_CHAT_CONFIG } from "../constants/constants";
import _ from "lodash";
import { logger } from "../utils/logger";
import { mergeConfigWithDefaults } from "../utils/config";
import { useChat } from "../hooks/useChat";
import { useNextPusherChat } from "../providers/NextPusherChatProvider";

interface ScrollManager {
  contentRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  isAtBottom: boolean;
}

interface ChatContextType {
  messages: Message[];
  loadingSendMessage: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  typingUsers: string[];
  participants: User[];
  config?: ChatConfig;
  isLoading?: boolean;
  totalMessages?: number;
  sendMessage: (props: SendMessageProps) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  updateTypingStatus: (isTyping: boolean) => void;
  getParticipant: (userId: string) => User;
  userId: string;
  scrollManager: ScrollManager;
  currentMessagesCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export interface ChatProviderProps {
  conversationId: string;
  defaultMessages?: Message[];
  participants: User[];
  config?: ChatConfig;
  isLoading?: boolean;
  totalMessages?: number;
  onReceiveMessage?: (
    eventId: string,
    message: ReceiveMessage
  ) => Promise<Message>;
  onSendMessage: (props: OnSendMessage) => Promise<Message>;
  onMessageSeen?: (props: OnMessageSeen) => void;
  onLoadMoreMessages: ({
    oldestMessageId,
    previousMessages,
  }: {
    oldestMessageId: string;
    previousMessages: Message[];
  }) => Promise<Message[]>;
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  conversationId,
  defaultMessages,
  participants,
  config,
  isLoading,
  totalMessages,
  onReceiveMessage,
  onSendMessage,
  onMessageSeen,
  onLoadMoreMessages,
  children,
}) => {
  const mergedConfig = useMemo(
    () => mergeConfigWithDefaults(config || DEFAULT_CHAT_CONFIG),
    [config]
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loadingSendMessage, setLoadingSendMessage] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [typingUsers, setTypingUsers] = React.useState<string[]>([]);
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const { userId } = useNextPusherChat();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = React.useState(false);
  const SCROLL_THRESHOLD = 10; // pixels de marge pour considérer qu'on est en bas
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout>();

  const lastMessageSeenRef = useRef<string | null>(null);
  const isProcessingRef = useRef(false);

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      if (contentRef.current) {
        // Attendre que toutes les images soient chargées
        const images = contentRef.current.getElementsByTagName("img");
        const imageLoadPromises = Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // En cas d'erreur, on continue quand même
          });
        });

        Promise.all(imageLoadPromises).then(() => {
          contentRef.current?.scrollTo({
            top: contentRef.current.scrollHeight,
            behavior,
          });
        });
      }
    },
    []
  );

  const handleScroll = React.useCallback(() => {
    if (!contentRef.current) return;

    // Annuler le timeout précédent s'il existe
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Définir un nouveau timeout pour mettre à jour l'état
    scrollTimeoutRef.current = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current!;
      const isBottom =
        Math.abs(scrollHeight - scrollTop - clientHeight) < SCROLL_THRESHOLD;
      setIsAtBottom(isBottom);
    }, 100); // Délai de 100ms pour réduire les mises à jour
  }, []);

  React.useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => {
        content.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [handleScroll]);

  React.useEffect(() => {
    if (shouldScrollToBottom) {
      // Petit délai pour laisser le temps au message de s'afficher
      requestAnimationFrame(() => {
        scrollToBottom();
      });
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom, scrollToBottom]);

  //On recupère les messages
  useEffect(() => {
    if (messages.length === 0 && defaultMessages) {
      setMessages(defaultMessages);
    }
  }, [defaultMessages]);

  useEffect(() => {
    logger.info("[ChatContext] Liste des messages", {
      messages,
    });
  }, [messages]);

  const {
    prepareMessage,
    sendMessage: sendPusherMessage,
    updateTypingStatus: updatePusherTypingStatus,
    getParticipant,
    markMessageAsSeen,
  } = useChat({
    conversationId,
    participants,
    onTypingStatus: ({ isTyping, userId }) => {
      setTypingUsers((prev) =>
        isTyping ? [...prev, userId] : prev.filter((id) => id !== userId)
      );
    },
    onMessageReceived: (props) => {
      const { userId: userIdReceived, eventId } = props;
      if (userIdReceived !== userId) {
        onReceiveMessage?.(eventId, {
          ...props,
          user: getParticipant(userIdReceived),
          id: eventId,
        }).then((message) => {
          setMessages((prev) => {
            const newMessages = [...prev, message];
            if (isAtBottom) {
              setShouldScrollToBottom(true);
            }
            return newMessages.slice(
              -(mergedConfig?.numberOfMessagesToLoad || 30)
            );
          });
        });
      }
    },
    onMessageSeen: (messageSeen) => {
      const { userId: seenByUserId } = messageSeen;
      const seenAt = new Date();
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          // Vérifier si l'utilisateur a déjà vu le message
          if (message.seenBy?.some((seen) => seen.userId === seenByUserId)) {
            return message;
          }
          return {
            ...message,
            seenBy: [
              ...(message.seenBy || []),
              {
                userId: seenByUserId,
                seenAt,
              },
            ],
          };
        })
      );
    },
  });

  const sendMessage = useCallback(
    async (props: SendMessageProps) => {
      const { content, attachments, createdAt } = props;
      if (!content.trim() && !attachments?.length) return;

      try {
        setLoadingSendMessage(true);
        const { data, eventId } = prepareMessage(props);

        // Envoyer d'abord le message au serveur
        const updatedMessage = await onSendMessage({
          conversationId,
          eventId,
          message: {
            id: eventId,
            ...data,
            ...props,
            userId,
            createdAt,
          },
        });

        // Envoyer ensuite le message via Pusher
        await sendPusherMessage({
          ...data,
          ...props,
          id: eventId,
          userId,
          createdAt,
        });

        setMessages((prev) => {
          const newMessages = [...prev, updatedMessage];
          setShouldScrollToBottom(true);
          return newMessages.slice(
            -(mergedConfig?.numberOfMessagesToLoad || 30)
          );
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      } finally {
        setLoadingSendMessage(false);
      }
    },
    [
      prepareMessage,
      sendPusherMessage,
      onSendMessage,
      userId,
      mergedConfig?.numberOfMessagesToLoad,
    ]
  );

  const loadMoreMessages = useCallback(async () => {
    if (!onLoadMoreMessages || loadingMore || !hasMore) {
      return;
    }

    const oldestMessage = messages[0];
    if (!oldestMessage) {
      setHasMore(false);
      return;
    }

    try {
      setLoadingMore(true);
      const olderMessages = await onLoadMoreMessages({
        oldestMessageId: oldestMessage.id,
        previousMessages: messages,
      });

      logger.info("[ChatContext] On recupère les messages plus anciens", {
        olderMessages,
      });

      if (!olderMessages || olderMessages.length === 0) {
        setHasMore(false);
        logger.info("[ChatContext] On n'a plus de messages", {
          olderMessages,
        });
        return;
      }

      logger.info("[ChatContext] On a des messages plus anciens", {
        olderMessages,
        messages,
      });

      setMessages((prevMessages) => _.concat(olderMessages, prevMessages));
    } catch (error) {
      console.error(
        "Erreur lors du chargement des messages plus anciens:",
        error
      );
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [onLoadMoreMessages, loadingMore, hasMore, messages]);

  const markLastMessageAsSeen = useCallback(
    (message: Message) => {
      if (
        isProcessingRef.current ||
        lastMessageSeenRef.current === message.id ||
        message.userId === userId
      ) {
        return;
      }

      if (!_.find(message.seenBy, { userId })) {
        isProcessingRef.current = true;
        lastMessageSeenRef.current = message.id;
        markMessageAsSeen(message.id);
        onMessageSeen?.({ lastMessage: message, conversationId, userId });
        isProcessingRef.current = false;
      }
    },
    [userId, conversationId, markMessageAsSeen, onMessageSeen]
  );

  useEffect(() => {
    if (!messages.length || !onMessageSeen) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    markLastMessageAsSeen(lastMessage);
  }, [messages, markLastMessageAsSeen]);

  const scrollManager: ScrollManager = {
    contentRef,
    scrollToBottom,
    isAtBottom,
  };

  return (
    <ChatContext.Provider
      value={{
        userId,
        messages,
        loadingSendMessage,
        loadingMore,
        hasMore,
        typingUsers,
        participants,
        config: mergedConfig,
        isLoading,
        totalMessages,
        sendMessage,
        loadMoreMessages,
        updateTypingStatus: updatePusherTypingStatus,
        getParticipant,
        scrollManager,
        currentMessagesCount: messages.length,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
