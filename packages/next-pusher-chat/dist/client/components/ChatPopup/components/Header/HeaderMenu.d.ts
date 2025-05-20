import { Attachment, User } from "../../../../types/chat";
import React from "react";
interface HeaderMenuProps {
    allAttachments?: Attachment[];
    participants: User[];
    renderParticipant?: (participant: User) => React.ReactNode;
}
export declare const HeaderMenu: React.FC<HeaderMenuProps>;
export {};
