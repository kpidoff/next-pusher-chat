import { isAudio, isImage } from "../../utils/fileUtils";

import { AudioMessage } from "../Chat/components/MessageList/AudioMessage";
import { FileContainer } from "./styles";
import { ImageFile } from "../Chat/components/MessageList/ImageFile";
import React from "react";
import { RegularFile } from "../Chat/components/MessageList/RegularFile";

export interface File {
  url: string;
  name: string;
  type: string;
  size: number;
}

interface FileItemProps {
  file: File;
  onClick?: (file: File) => void;
}

export const FileItem: React.FC<FileItemProps> = ({ file, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Si c'est un fichier audio, on ne fait rien au clic sur le conteneur
    if (isAudio(file.name)) {
      return;
    }

    if (onClick) {
      onClick(file);
    } else {
      window.open(file.url, "_blank");
    }
  };

  return (
    <FileContainer onClick={handleClick}>
      {isImage(file.name) ? (
        <ImageFile url={file.url} name={file.name} />
      ) : isAudio(file.name) ? (
        <AudioMessage url={file.url} />
      ) : (
        <RegularFile url={file.url} name={file.name} />
      )}
    </FileContainer>
  );
};
