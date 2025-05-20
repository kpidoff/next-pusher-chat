import "moment/locale/fr";

import { Box, CircularProgress, Typography } from "@mui/material";
import {
  MessageContainer,
  MessageContent,
  MessageGroup,
  MessageTime,
  SystemMessage,
} from "./styles";

import { MessageBubble } from "../MessageBubble";
import React from "react";
import { SeenBy } from "../SeenBy";
import { UserAvatar } from "../UserAvatar";
import { generateColorFromId } from "@/client/utils/color";
import moment from "moment";
import { useChatContext } from "@/client/contexts/ChatContext";

moment.locale("fr");

export const MessageList = () => {
  const {
    messages,
    participants,
    getParticipant,
    isLoading,
    config,
    userId,
    scrollManager,
  } = useChatContext();
  const messageEndRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [shouldShowContent, setShouldShowContent] = React.useState(false);
  const isFirstLoadRef = React.useRef(true);

  React.useEffect(() => {
    if (!isLoading) {
      setShouldShowContent(true);
    } else {
      setShouldShowContent(false);
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (shouldShowContent && isFirstLoadRef.current && messages.length > 0) {
      const checkAndScroll = () => {
        if (containerRef.current) {
          const containerHeight = containerRef.current.scrollHeight;
          if (containerHeight > 0) {
            scrollManager.scrollToBottom("instant");
            isFirstLoadRef.current = false;
          } else {
            requestAnimationFrame(checkAndScroll);
          }
        }
      };
      requestAnimationFrame(checkAndScroll);
    }
  }, [shouldShowContent, messages.length, scrollManager]);

  if (isLoading || !shouldShowContent) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoading && messages.length === 0) {
    return (
      <MessageContainer ref={containerRef}>
        <SystemMessage>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontStyle: "italic",
              opacity: 0.7,
              fontSize: "0.85rem",
            }}
          >
            {config?.welcomeMessage || "Aucun message pour le moment"}
          </Typography>
        </SystemMessage>
        <div ref={messageEndRef} />
      </MessageContainer>
    );
  }

  return (
    <MessageContainer ref={containerRef} className={isLoading ? "loading" : ""}>
      {messages.map((message, index) => {
        const isCurrentUser = message.userId === userId;
        const userColor =
          !isCurrentUser && config?.activeUserColor
            ? generateColorFromId(message.userId)
            : undefined;
        const showTime =
          index === messages.length - 1 ||
          messages[index + 1]?.userId !== message.userId ||
          moment(messages[index + 1]?.createdAt).diff(
            moment(message.createdAt),
            "minutes"
          ) > 5;

        const hasSpecialContent =
          message.attachments && message.attachments.length > 0;
        const hasAudio = message.attachments?.some((attachment) =>
          attachment.name.match(/\.(mp3|wav|ogg|m4a)$/i)
        );

        if (message.type?.toLowerCase() === "system") {
          return (
            <SystemMessage key={message.id}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontStyle: "italic",
                  opacity: 0.7,
                  fontSize: "0.85rem",
                }}
              >
                {message.content}
              </Typography>
            </SystemMessage>
          );
        }

        return (
          <MessageGroup
            key={message.id}
            className="message-group"
            data-message-id={message.id}
          >
            <MessageContent>
              {!isCurrentUser && (
                <Box sx={{ flexShrink: 0 }}>
                  <UserAvatar user={getParticipant(message.userId)} />
                </Box>
              )}
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <MessageBubble
                  isCurrentUser={isCurrentUser}
                  userColor={userColor}
                  hasSpecialContent={hasSpecialContent}
                  hasAudio={hasAudio}
                  content={message.content}
                  attachments={message.attachments}
                />
                {showTime && (
                  <MessageTime
                    variant="caption"
                    sx={{
                      alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <span>
                      {moment(new Date(message.createdAt)).format("HH:mm")}
                    </span>
                    {isCurrentUser && (
                      <SeenBy
                        message={message}
                        userId={userId}
                        getParticipant={getParticipant}
                        totalParticipants={participants.length}
                      />
                    )}
                  </MessageTime>
                )}
              </Box>
              {isCurrentUser && (
                <Box sx={{ flexShrink: 0 }}>
                  <UserAvatar user={getParticipant(message.userId)} />
                </Box>
              )}
            </MessageContent>
          </MessageGroup>
        );
      })}
      <div ref={messageEndRef} />
    </MessageContainer>
  );
};
