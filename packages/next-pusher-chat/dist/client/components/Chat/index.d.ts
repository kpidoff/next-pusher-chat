import React from "react";
import { ChatProps } from "../../types/chat";
export declare const Chat: React.FC<Omit<ChatProps, "conversationId"> & {
    conversationId?: string | null;
    buttonJoin?: React.ReactNode;
}>;
