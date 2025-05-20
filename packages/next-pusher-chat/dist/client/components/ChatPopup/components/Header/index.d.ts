import { Attachment, User } from "../../../../types/chat";
import React from "react";
interface HeaderProps {
    title: React.ReactNode;
    onClose: () => void;
    onExpand?: () => void;
    isExpanded?: boolean;
    avatar?: string;
    participants?: User[];
    renderParticipant?: (participant: User) => React.ReactNode;
    allAttachments?: Attachment[];
    conversationId?: string | null;
}
declare const Header: React.FC<HeaderProps>;
export default Header;
