import { Attachment, Message, User } from "../../../../types/chat";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { DocumentsMenu } from "./DocumentsMenu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ParticipantsMenu } from "./ParticipantsMenu";

interface HeaderMenuProps {
  allAttachments?: Attachment[];
  participants: User[];
  renderParticipant?: (participant: User) => React.ReactNode;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  participants,
  renderParticipant,
  allAttachments,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsDocumentsOpen(false);
    setIsParticipantsOpen(false);
  };

  const handleDocumentClick = (e: React.MouseEvent) => {
    setIsDocumentsOpen(true);
    setIsParticipantsOpen(false);
  };

  const handleParticipantsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsParticipantsOpen(true);
    setIsDocumentsOpen(false);
  };

  const handleDocumentClose = () => {
    setIsDocumentsOpen(false);
  };

  const handleParticipantsClose = () => {
    setIsParticipantsOpen(false);
  };

  return (
    <>
      <Tooltip title="Options">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            color: (theme) => theme.palette.text.secondary,
            padding: 0.5,
            "&:hover": {
              color: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
        <MenuItem onClick={handleDocumentClick}>
          <DocumentsMenu
            allAttachments={allAttachments}
            open={isDocumentsOpen}
            onClose={handleDocumentClose}
          />
          <Typography variant="body2">Documents</Typography>
        </MenuItem>
        <MenuItem onClick={handleParticipantsClick}>
          <ParticipantsMenu
            participants={participants}
            renderParticipant={renderParticipant}
            open={isParticipantsOpen}
            onClose={handleParticipantsClose}
          />
          <Typography variant="body2">Participants</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
