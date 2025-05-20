import { Attachment, ChatProps, Message, OnSendMessage, ReceiveMessage, User } from "../../types/chat";
import React from "react";
interface ChatPopupProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    avatar?: string;
    allAttachments?: Attachment[];
    renderParticipant?: (participant: User) => React.ReactNode;
    onReceiveMessage?: (eventId: string, message: ReceiveMessage) => Promise<Message>;
    onSendMessage: (props: OnSendMessage) => Promise<Message>;
    onMessageSeen?: ({ lastMessage, conversationId, userId, }: {
        lastMessage: Message;
        conversationId: string;
        userId: string;
    }) => void;
    buttonJoin?: React.ReactNode;
}
export declare const ChatPopup: ({ open, onClose, conversationId, title, avatar, defaultMessages, participants, onReceiveMessage, onSendMessage, config, renderParticipant, isLoading, onMessageSeen, onLoadMoreMessages, allAttachments, totalMessages, buttonJoin, }: ChatPopupProps & Omit<ChatProps, "conversationId"> & {
    conversationId?: string | null;
}) => import("react/jsx-runtime").JSX.Element;
export {};
