import { Box, Tooltip, Typography } from "@mui/material";
import { Message, User } from "../../../../types/chat";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import React from "react";
import { SeenContainer } from "./style";
import moment from "moment";

interface SeenByProps {
  message: Message;
  userId: string;
  getParticipant: (id: string) => User;
  totalParticipants: number;
}

export const SeenBy: React.FC<SeenByProps> = ({
  message,
  userId,
  getParticipant,
  totalParticipants,
}) => {
  if (!message.seenBy?.length) return null;

  const seenParticipants = message.seenBy
    .filter((seen) => seen.userId !== userId)
    .map((seen) => ({
      ...getParticipant(seen.userId),
      seenAt: seen.seenAt,
    }));

  if (seenParticipants.length === 0) return null;

  const allParticipantsHaveSeen =
    seenParticipants.length === totalParticipants - 1; // -1 pour exclure l'expéditeur

  const tooltipContent = (
    <Box>
      {seenParticipants.map((participant) => (
        <Typography
          key={participant.id}
          variant="caption"
          sx={{ display: "block" }}
        >
          {participant.name} - {moment(participant.seenAt).isBefore(moment().subtract(1, 'day'))
            ? moment(participant.seenAt).format("DD/MM/YYYY HH:mm")
            : moment(participant.seenAt).format("HH:mm")}
        </Typography>
      ))}
    </Box>
  );

  return (
    <SeenContainer>
      <Tooltip title={tooltipContent}>
        {allParticipantsHaveSeen ? (
          <CheckCircleIcon />
        ) : (
          <CheckCircleOutlineIcon />
        )}
      </Tooltip>
    </SeenContainer>
  );
};
