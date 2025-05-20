import { Box, Link, Typography } from "@mui/material";
import { FileContainer, FileLink, FileName, IconWrapper } from "./styles";

import { Attachment } from "@/client/types/chat";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import React from "react";

type RegularFileProps = Pick<Attachment, "name" | "url">;

export const RegularFile: React.FC<RegularFileProps> = ({ name, url }) => {
  return (
    <FileContainer>
      <IconWrapper>
        <InsertDriveFileIcon />
      </IconWrapper>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <FileLink href={url} target="_blank" rel="noopener noreferrer">
          <FileName variant="body2" noWrap>
            {name}
          </FileName>
        </FileLink>
      </Box>
    </FileContainer>
  );
};
