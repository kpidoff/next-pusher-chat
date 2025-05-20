import { Attachment } from "@/client/types/chat";
import React from "react";
interface MessageBubbleProps {
    isCurrentUser: boolean;
    userColor?: string;
    hasSpecialContent?: boolean;
    hasAudio?: boolean;
    content: string;
    attachments?: Attachment[];
    onImageLoad?: () => void;
}
export declare const MessageBubble: React.FC<MessageBubbleProps>;
export {};
