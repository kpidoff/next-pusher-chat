import { Attachment } from "../../../../types/chat";
interface MessageFilesProps {
    attachments: Attachment[];
    onImageLoad?: () => void;
}
export declare const MessageFiles: React.FC<MessageFilesProps>;
export {};
