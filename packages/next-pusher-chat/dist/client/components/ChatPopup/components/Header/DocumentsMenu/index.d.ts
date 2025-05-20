import React from "react";
import { Attachment } from "@/client/types/chat";
interface DocumentsMenuProps {
    open: boolean;
    onClose: () => void;
    allAttachments?: Attachment[];
}
export declare const DocumentsMenu: React.FC<DocumentsMenuProps>;
export {};
