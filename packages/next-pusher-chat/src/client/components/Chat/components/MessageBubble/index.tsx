import { Box, Link, Typography } from "@mui/material";
import { LinkContainer, StyledMessageBubble } from "./style";

import { Attachment } from "@/client/types/chat";
import LinkIcon from "@mui/icons-material/Link";
import { MessageFiles } from "../MessageList/MessageFiles";
import React from "react";

interface MessageBubbleProps {
  isCurrentUser: boolean;
  userColor?: string;
  hasSpecialContent?: boolean;
  hasAudio?: boolean;
  content: string;
  attachments?: Attachment[];
  onImageLoad?: () => void;
}

const detectUrls = (text: string, isCurrentUser: boolean) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  const matches = Array.from(text.matchAll(urlRegex)).map((match) => match[0]);

  return parts.map((part, index) => {
    if (matches.includes(part)) {
      return (
        <LinkContainer key={index}>
          <Link
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              color: isCurrentUser ? "inherit" : "primary.main",
              "&:hover": {
                color: isCurrentUser ? "inherit" : "primary.dark",
              },
            }}
          >
            {part}
          </Link>
          <LinkIcon
            onClick={() => window.open(part, "_blank", "noopener,noreferrer")}
            sx={{
              color: isCurrentUser ? "inherit" : "primary.main",
              opacity: 0.8,
              "&:hover": {
                opacity: 1,
              },
            }}
          />
        </LinkContainer>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  isCurrentUser,
  userColor,
  hasSpecialContent,
  hasAudio,
  content,
  attachments,
  onImageLoad,
}) => {
  return (
    <StyledMessageBubble
      isCurrentUser={isCurrentUser}
      userColor={userColor}
      hasSpecialContent={hasSpecialContent}
      hasAudio={hasAudio}
    >
      <Box component="div">
        <Typography
          component="span"
          variant="body1"
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {detectUrls(content, isCurrentUser)}
        </Typography>
        {attachments && (
          <MessageFiles attachments={attachments} onImageLoad={onImageLoad} />
        )}
      </Box>
    </StyledMessageBubble>
  );
};
