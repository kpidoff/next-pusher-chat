"use client";

import { Chat, User, useChatSubscribe } from "@next-pusher-chat/core";
import React, { useEffect, useState } from "react";
import {
  getMessageByEventId,
  getMessages,
  getParticipants,
  getTotalMessages,
  markAllMessagesAsSeen,
  sendMessage,
} from "../actions/conversation";

import { Box } from "@mui/material";
import { Message as PrismaMessage } from "@prisma/client";
import _ from "lodash";
import { useMutation } from "@tanstack/react-query";

type MessageWithUser = PrismaMessage & {
  user: User;
  seenBy?: {
    userId: string;
    seenAt: Date;
  }[];
};

export default function Conversation({
  conversationId,
}: {
  conversationId: string;
}) {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [typingStatus, setTypingStatus] = useState<
    { isTyping: boolean; userId: string }[]
  >([]);

  useChatSubscribe({
    conversationId,
    onTypingStatus: ({ isTyping, userId }) => {
      setTypingStatus((prev) => {
        if (isTyping) {
          return [
            ...prev.filter((status) => status.userId !== userId),
            { isTyping, userId },
          ];
        }
        return prev.filter((status) => status.userId !== userId);
      });
    },
  });

  const mutation = useMutation({
    mutationFn: async ({
      id,
      oldestMessageId,
    }: {
      id: string;
      oldestMessageId?: string;
    }) => {
      return getMessages(id, oldestMessageId);
    },
    onSuccess: (data) => {
      if (data) {
        if (data.length > 0) {
          setMessages((prev) => {
            const newMessages = data.filter(
              (newMsg) =>
                !prev.some((existingMsg) => existingMsg.id === newMsg.id)
            );
            return [...prev, ...newMessages];
          });
        } else {
          setMessages(data);
        }
      }
    },
  });

  useEffect(() => {
    const loadParticipants = async () => {
      const data = await getParticipants(conversationId);
      if (data) setParticipants(data);
    };
    loadParticipants();
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      mutation.mutate({
        id: conversationId,
      });
    }
  }, [conversationId]);

  useEffect(() => {
    const fetchTotalMessages = async () => {
      const totalMessages = await getTotalMessages(conversationId);
      setTotalMessages(totalMessages);
    };
    fetchTotalMessages();
  }, [conversationId]);

  return (
    <Box sx={{ height: "60vh", display: "flex", flexDirection: "column" }}>
      {/* En-tête de la conversation */}
      Qui est en train de taper:
      {typingStatus.map((status) => (
        <div key={status.userId}>{status.userId} est en train de taper...</div>
      ))}
      <Chat
        totalMessages={totalMessages}
        onLoadMoreMessages={async ({ oldestMessageId }) => {
          const olderMessages = await getMessages(
            conversationId,
            oldestMessageId
          );
          return olderMessages.map((msg) => ({
            ...msg,
            type: msg.type as
              | "message"
              | "system"
              | "MESSAGE"
              | "SYSTEM"
              | undefined,
            seenBy: msg.seenBy || [],
          }));
        }}
        config={{
          activeEmoji: true,
          activeFile: true,
          activeVoice: true,
          activeUserColor: true,
          welcomeMessage: "Bienvenue dans la conversation",
          numberOfMessagesToLoad: 10,
        }}
        participants={participants}
        isLoading={mutation.isLoading}
        defaultMessages={messages.map((msg) => ({
          ...msg,
          type: msg.type as
            | "message"
            | "system"
            | "MESSAGE"
            | "SYSTEM"
            | undefined,
          seenBy: msg.seenBy || [],
        }))}
        conversationId={conversationId}
        onReceiveMessage={async (eventId, message) => {
          if (message.attachmentsCount && message.attachmentsCount > 0) {
            const messageFromDb = await getMessageByEventId(eventId);
            if (messageFromDb) {
              return {
                ...message,
                content: messageFromDb.content,
                attachments: messageFromDb.attachments,
              };
            }
          }
          return message;
        }}
        onSendMessage={async ({
          eventId,
          message,
          conversationId: sendConversationId,
        }) => {
          await sendMessage({
            content: message.content,
            userId: message.userId,
            conversationId: sendConversationId,
            eventId,
            attachments: _.map(message.attachments, (attachment) => ({
              // url: "https://mylogis-project.s3.eu-west-3.amazonaws.com/Record+(online-voice-recorder.com)+(9).mp3",
              // name: "Record+(online-voice-recorder.com)+(9).mp3",
              // type: "audio/webm",
              // size: 100,
              url: "https://mylogis-advertisements.s3.eu-west-3.amazonaws.com/0002b631-45d2-4bd8-b223-8f47e5409509.jpg",
              name: "0002b631-45d2-4bd8-b223-8f47e5409509.jpg",
              type: "image/jpeg",
              size: 100,
            })),
          });

          return {
            ...message,
            attachments: _.map(message.attachments, (attachment) => ({
              // url: "https://mylogis-project.s3.eu-west-3.amazonaws.com/Record+(online-voice-recorder.com)+(9).mp3",
              // name: "Record+(online-voice-recorder.com)+(9).mp3",
              // type: "audio/webm",
              // size: 100,
              url: "https://mylogis-advertisements.s3.eu-west-3.amazonaws.com/0002b631-45d2-4bd8-b223-8f47e5409509.jpg",
              name: "0002b631-45d2-4bd8-b223-8f47e5409509.jpg",
              type: "image/jpeg",

              size: 100,
            })),
          };
        }}
        onMessageSeen={async ({
          lastMessage,
          conversationId: seenConversationId,
          userId,
        }) => {
          try {
            if (!lastMessage) return;

            await markAllMessagesAsSeen(seenConversationId, userId);
          } catch (error) {
            console.error("Erreur lors de la lecture des messages:", error);
          }
        }}
      />
    </Box>
  );
}
