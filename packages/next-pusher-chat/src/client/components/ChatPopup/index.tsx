import {
  Attachment,
  ChatConfig,
  ChatProps,
  Message,
  OnSendMessage,
  ReceiveMessage,
  SendMessage,
  User,
} from "../../types/chat";
import React, { useEffect } from "react";

import { Chat } from "../Chat";
import Header from "./components/Header";
import { StyledPaper } from "./style";

interface ChatPopupProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  avatar?: string;
  allAttachments?: Attachment[];
  renderParticipant?: (participant: User) => React.ReactNode;
  onReceiveMessage?: (
    eventId: string,
    message: ReceiveMessage
  ) => Promise<Message>;
  onSendMessage: (props: OnSendMessage) => Promise<Message>;
  onMessageSeen?: ({
    lastMessage,
    conversationId,
    userId,
  }: {
    lastMessage: Message;
    conversationId: string;
    userId: string;
  }) => void;
  buttonJoin?: React.ReactNode;
}

export const ChatPopup = ({
  open,
  onClose,
  conversationId,
  title = "Chat",
  avatar,
  defaultMessages,
  participants,
  onReceiveMessage,
  onSendMessage,
  config,
  renderParticipant,
  isLoading,
  onMessageSeen,
  onLoadMoreMessages,
  allAttachments,
  totalMessages,
  buttonJoin,
}: ChatPopupProps &
  Omit<ChatProps, "conversationId"> & {
    conversationId?: string | null;
  }) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  useEffect(() => {
    if (!open) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <StyledPaper
      elevation={3}
      isClosing={isClosing}
      isExpanded={isExpanded}
      style={{
        display: !open && !isClosing ? "none" : "flex",
        pointerEvents: !open && !isClosing ? "none" : "auto",
      }}
    >
      <Header
        title={title}
        onClose={() => {
          setIsClosing(true);
          setTimeout(() => {
            onClose();
          }, 300);
        }}
        allAttachments={allAttachments}
        onExpand={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        avatar={avatar}
        conversationId={conversationId}
        participants={participants}
        renderParticipant={renderParticipant}
      />
      <Chat
        config={config}
        participants={participants}
        isLoading={isLoading}
        defaultMessages={defaultMessages}
        conversationId={conversationId}
        onReceiveMessage={onReceiveMessage}
        onSendMessage={onSendMessage}
        onMessageSeen={onMessageSeen}
        onLoadMoreMessages={onLoadMoreMessages}
        totalMessages={totalMessages}
        buttonJoin={buttonJoin}
      />
    </StyledPaper>
  );
};
