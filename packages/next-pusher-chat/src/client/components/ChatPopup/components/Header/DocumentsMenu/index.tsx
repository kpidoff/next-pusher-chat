import { Box, IconButton, Typography } from "@mui/material";
import { MenuHeader, StyledList, StyledPopover } from "./styles";
import React, { useRef } from "react";

import { Attachment } from "@/client/types/chat";
import CloseIcon from "@mui/icons-material/Close";
import { FileItem } from "@/client/components/FileManager";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface DocumentsMenuProps {
  open: boolean;
  onClose: () => void;
  allAttachments?: Attachment[];
}

export const DocumentsMenu: React.FC<DocumentsMenuProps> = ({
  allAttachments,
  open,
  onClose,
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="small"
        sx={{
          color: (theme) => theme.palette.text.secondary,
          padding: 0.5,
          "&:hover": {
            color: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <InsertDriveFileIcon fontSize="small" />
      </IconButton>
      <StyledPopover
        open={open}
        anchorEl={anchorRef.current}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuHeader>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InsertDriveFileIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" fontWeight="bold">
              Documents ({allAttachments?.length || 0})
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </MenuHeader>
        <StyledList>
          {allAttachments?.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Aucun document partagé dans cette conversation
              </Typography>
            </Box>
          ) : (
            allAttachments?.map((file: Attachment, index: number) => (
              <FileItem key={index} file={file} />
            ))
          )}
        </StyledList>
      </StyledPopover>
    </>
  );
};
