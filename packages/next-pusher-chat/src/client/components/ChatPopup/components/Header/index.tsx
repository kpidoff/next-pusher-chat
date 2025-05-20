import { Attachment, Message, User } from "../../../../types/chat";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";

import Close from "@mui/icons-material/Close";
import CloseFullscreen from "@mui/icons-material/CloseFullscreen";
import { DocumentsMenu } from "./DocumentsMenu";
import { HeaderMenu } from "./HeaderMenu";
import OpenInFull from "@mui/icons-material/OpenInFull";
import { ParticipantsMenu } from "./ParticipantsMenu";
import { styled } from "@mui/material/styles";

const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const UserAvatar = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "0.9rem",
  fontWeight: 500,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const UserName = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: 600,
  margin: 0,
  lineHeight: 1.2,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: 0.5,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

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

const Header: React.FC<HeaderProps> = ({
  title,
  onClose,
  onExpand,
  isExpanded,
  avatar,
  participants = [],
  renderParticipant,
  allAttachments,
  conversationId,
}) => {
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  const handleDocumentClose = () => setIsDocumentsOpen(false);
  const handleParticipantsClose = () => setIsParticipantsOpen(false);

  const renderActionButtons = () => {
    if (isExpanded && conversationId) {
      return (
        <>
          <ActionButton size="small" onClick={() => setIsDocumentsOpen(true)}>
            <DocumentsMenu
              allAttachments={allAttachments}
              open={isDocumentsOpen}
              onClose={handleDocumentClose}
            />
          </ActionButton>
          <ActionButton
            size="small"
            onClick={() => setIsParticipantsOpen(true)}
          >
            <ParticipantsMenu
              participants={participants}
              renderParticipant={renderParticipant}
              open={isParticipantsOpen}
              onClose={handleParticipantsClose}
            />
          </ActionButton>
        </>
      );
    }

    if (conversationId) {
      return (
        <HeaderMenu
          allAttachments={allAttachments}
          participants={participants}
          renderParticipant={renderParticipant}
        />
      );
    }

    return null;
  };

  return (
    <HeaderContainer>
      <UserInfo>
        {avatar && (
          <UserAvatar>
            <img src={avatar} alt={"title"} />
          </UserAvatar>
        )}
        <Box>
          <UserName variant="subtitle1">{title}</UserName>
        </Box>
      </UserInfo>
      <Box sx={{ display: "flex", gap: 1 }}>
        {renderActionButtons()}
        {onExpand && (
          <ActionButton
            onClick={onExpand}
            size="small"
            sx={{
              transform: isExpanded ? "rotate(180deg)" : "none",
            }}
          >
            {isExpanded ? (
              <CloseFullscreen fontSize="small" />
            ) : (
              <OpenInFull fontSize="small" />
            )}
          </ActionButton>
        )}
        <ActionButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </ActionButton>
      </Box>
    </HeaderContainer>
  );
};

export default Header;
