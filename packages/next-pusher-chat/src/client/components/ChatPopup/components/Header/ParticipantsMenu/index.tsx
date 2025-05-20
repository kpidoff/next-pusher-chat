import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  MenuHeader,
  ParticipantAvatar,
  StyledList,
  StyledListItem,
  StyledPopover,
} from "./styles";
import React, { useRef } from "react";

import GroupIcon from "@mui/icons-material/Group";
import { User } from "@/client/types/chat";

interface ParticipantsMenuProps {
  participants: User[];
  renderParticipant?: (participant: User) => React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export const ParticipantsMenu: React.FC<ParticipantsMenuProps> = ({
  participants,
  renderParticipant,
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
        <GroupIcon fontSize="small" />
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
            <GroupIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" fontWeight="bold">
              Participants ({participants.length})
            </Typography>
          </Box>
        </MenuHeader>
        <StyledList>
          {participants.map((participant) => (
            <StyledListItem key={participant.id}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {renderParticipant ? (
                  renderParticipant(participant)
                ) : (
                  <ParticipantAvatar>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                    >
                      {participant.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </Typography>
                  </ParticipantAvatar>
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500}>
                    {participant.name}
                  </Typography>
                }
              />
            </StyledListItem>
          ))}
        </StyledList>
      </StyledPopover>
    </>
  );
};
