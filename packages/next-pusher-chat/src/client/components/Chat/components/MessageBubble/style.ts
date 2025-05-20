import { Box, BoxProps, Link, Typography } from "@mui/material";

import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const StyledMessageBubble: StyledComponent<BoxProps & {
  isCurrentUser: boolean;
  userColor?: string;
  hasSpecialContent?: boolean;
  hasAudio?: boolean;
}> = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isCurrentUser" &&
    prop !== "userColor" &&
    prop !== "hasSpecialContent" &&
    prop !== "hasAudio",
})<{
  isCurrentUser: boolean;
  userColor?: string;
  hasSpecialContent?: boolean;
  hasAudio?: boolean;
}>(
  ({
    theme,
    isCurrentUser,
    userColor,
    hasSpecialContent = false,
    hasAudio = false,
  }) => ({
    position: "relative",
    padding: theme.spacing(1.5, 2),
    borderRadius: isCurrentUser
      ? `${theme.spacing(2)} 0 ${theme.spacing(2)} ${theme.spacing(2)}`
      : `0 ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)}`,
    width: hasAudio ? "calc(100% - 48px)" : "fit-content",
    maxWidth: hasAudio ? "calc(100% - 48px)" : "70%",
    wordBreak: "break-word",
    marginBottom: theme.spacing(1),
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
    backgroundColor: isCurrentUser
      ? theme.palette.primary.main
      : userColor || theme.palette.grey[100],
    color: isCurrentUser ? theme.palette.primary.contrastText : "inherit",
    textAlign: "left",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      width: 0,
      height: 0,
      border: "6px solid transparent",
      borderBottom: 0,
      [isCurrentUser ? "right" : "left"]: 12,
      borderTopColor: isCurrentUser
        ? theme.palette.primary.main
        : userColor || theme.palette.grey[100],
    },
    [theme.breakpoints.up("sm")]: {
      width: hasAudio ? "70%" : "fit-content",
      maxWidth: "70%",
    },
  })
);

export const LinkContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "& .MuiSvgIcon-root": {
    fontSize: "0.9em",
    cursor: "pointer",
  },
})); 