import { Box, BoxProps } from "@mui/material";

import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const Content: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: "auto",
  backgroundColor: theme.palette.background.paper,
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
    "&:hover": {
      background: theme.palette.primary.dark,
    },
  },
}));

export const WaitingMessageContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  gap: theme.spacing(2)
}));

export const WaitingMessageEmoji: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2)
}));

export const WaitingMessageTitle: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  fontSize: '1.5rem',
  margin: 0,
  color: theme.palette.text.primary
}));

export const WaitingMessageText: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  fontSize: '1rem',
  maxWidth: '400px',
  lineHeight: 1.5
})); 