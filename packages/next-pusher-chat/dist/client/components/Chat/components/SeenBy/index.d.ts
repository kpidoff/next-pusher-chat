import { Message, User } from "../../../../types/chat";
import React from "react";
interface SeenByProps {
    message: Message;
    userId: string;
    getParticipant: (id: string) => User;
    totalParticipants: number;
}
export declare const SeenBy: React.FC<SeenByProps>;
export {};
