"use client";

import { Attachment, ChatBubble, User } from "@next-pusher-chat/core";
import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getAttachments,
  getMessageByEventId,
  getMessages,
  getParticipants,
  getTotalMessages,
  markAllMessagesAsSeen,
  sendMessage,
} from "../actions/conversation";

import { Message as PrismaMessage } from "@prisma/client";
import _ from "lodash";

type MessageWithUser = PrismaMessage & {
  user: User;
  seenBy?: {
    userId: string;
    seenAt: Date;
  }[];
};
export default function Bubble({
  conversationId,
}: {
  conversationId?: string | null;
}) {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  useEffect(() => {
    const loadParticipants = async () => {
      setIsLoading(true);
      const data = conversationId && (await getParticipants(conversationId));
      if (data) setParticipants(data);
      setIsLoading(false);
    };
    loadParticipants();
  }, [conversationId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = conversationId && (await getMessages(conversationId));
      if (messages) setMessages(messages);
    };
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    const fetchAttachments = async () => {
      const attachments =
        conversationId && (await getAttachments(conversationId));
      if (attachments) setAttachments(attachments);
    };
    fetchAttachments();
  }, [conversationId]);

  useEffect(() => {
    const fetchTotalMessages = async () => {
      const totalMessages =
        conversationId && (await getTotalMessages(conversationId));
      if (totalMessages) setTotalMessages(totalMessages);
    };
    fetchTotalMessages();
  }, [conversationId]);

  return (
    <ChatBubble
      totalMessages={totalMessages}
      allAttachments={attachments}
      participants={participants}
      isLoading={isLoading}
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
      buttonJoin={
        <Button fullWidth variant="contained" color="primary">
          Rejoindre la conversation
        </Button>
      }
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
      onSendMessage={async ({ eventId, message, conversationId }) => {
        await sendMessage({
          content: message.content,
          userId: message.userId,
          conversationId,
          eventId,
          attachments: _.map(message.attachments, (attachment) => ({
            url: "https://mylogis-project.s3.eu-west-3.amazonaws.com/9c52b6d9-8a26-480a-850b-d0fb8f24ea58.webm",
            name: "Record+(online-voice-recorder.com)+(9).mp3",
            type: "audio/webm",
            size: 100,
          })),
        });

        return {
          ...message,
          attachments: _.map(message.attachments, (attachment) => ({
            url: "https://mylogis-project.s3.eu-west-3.amazonaws.com/9c52b6d9-8a26-480a-850b-d0fb8f24ea58.webm",
            name: "Record+(online-voice-recorder.com)+(9).mp3",
            type: "audio/webm",
            size: 100,
          })),
        };
      }}
      onMessageSeen={async ({ lastMessage, conversationId, userId }) => {
        try {
          if (!lastMessage) return;

          await markAllMessagesAsSeen(conversationId, userId);
        } catch (error) {
          console.error("Erreur lors de la lecture des messages:", error);
        }
      }}
      onLoadMoreMessages={async ({ oldestMessageId }) => {
        if (!conversationId) return [];
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
    />
  );
}
