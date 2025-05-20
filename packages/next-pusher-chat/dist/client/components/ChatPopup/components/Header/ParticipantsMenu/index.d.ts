import React from "react";
import { User } from "@/client/types/chat";
interface ParticipantsMenuProps {
    participants: User[];
    renderParticipant?: (participant: User) => React.ReactNode;
    open: boolean;
    onClose: () => void;
}
export declare const ParticipantsMenu: React.FC<ParticipantsMenuProps>;
export {};
