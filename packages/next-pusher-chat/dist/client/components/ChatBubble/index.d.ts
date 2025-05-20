import { Attachment, ChatProps, User } from "../../types/chat";
import React from "react";
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
export declare const ChatBubble: React.FC<ChatBubbleProps & Omit<ChatProps, "conversationId">>;
