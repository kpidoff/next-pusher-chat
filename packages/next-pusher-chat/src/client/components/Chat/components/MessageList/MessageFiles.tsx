import { isAudio, isImage } from "../../../../utils/fileUtils";

import { Attachment } from "../../../../types/chat";
import { AudioMessage } from "./AudioMessage";
import { FileContainer } from "./styles";
import { ImageFile } from "./ImageFile";
import { RegularFile } from "./RegularFile";

interface MessageFilesProps {
  attachments: Attachment[];
  onImageLoad?: () => void;
}

export const MessageFiles: React.FC<MessageFilesProps> = ({
  attachments,
  onImageLoad,
}) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <FileContainer>
      {attachments.map((attachment, index) => {
        if (isImage(attachment.name)) {
          return (
            <ImageFile
              key={index}
              url={attachment.url}
              name={attachment.name}
              onLoad={onImageLoad}
            />
          );
        } else if (isAudio(attachment.name)) {
          return <AudioMessage key={index} url={attachment.url} />;
        } else {
          return (
            <RegularFile
              key={index}
              url={attachment.url}
              name={attachment.name}
            />
          );
        }
      })}
    </FileContainer>
  );
};
