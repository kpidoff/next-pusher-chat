import { Attachment, ChatProps, User } from "../../types/chat";
import React, { useState } from "react";

import { Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { ChatPopup } from "../ChatPopup";
import { FloatingButton } from "../FloatingButton";

export interface ChatBubbleProps {
  onClick?: () => void;
  unreadCount?: number;
  color?: "primary" | "secondary";
  title?: string;
  renderParticipant?: (participant: User) => React.ReactNode;
  allAttachments?: Attachment[];
  conversationId?: string | null;
  buttonJoin?: React.ReactNode;
}

export const ChatBubble: React.FC<
  ChatBubbleProps & Omit<ChatProps, "conversationId">
> = ({
  onClick,
  unreadCount = 0,
  color = "primary",
  title = "Chat",
  conversationId,
  defaultMessages,
  participants,
  onReceiveMessage,
  onSendMessage,
  renderParticipant,
  config,
  isLoading,
  onMessageSeen,
  onLoadMoreMessages,
  allAttachments,
  totalMessages,
  buttonJoin,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  const icon =
    unreadCount > 0 ? (
      <Badge badgeContent={unreadCount} color="error" max={99}>
        <ChatIcon />
      </Badge>
    ) : (
      <ChatIcon />
    );
  return (
    <>
      <FloatingButton
        icon={icon}
        onClick={handleClick}
        color={color}
        tooltip="Ouvrir le chat"
        sx={{
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />
      <ChatPopup
        participants={participants}
        renderParticipant={renderParticipant}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        conversationId={conversationId}
        defaultMessages={defaultMessages}
        onReceiveMessage={onReceiveMessage}
        onSendMessage={onSendMessage}
        onMessageSeen={onMessageSeen}
        config={config}
        isLoading={isLoading}
        onLoadMoreMessages={onLoadMoreMessages}
        allAttachments={allAttachments}
        totalMessages={totalMessages}
        buttonJoin={buttonJoin}
      />
    </>
  );
};
