import { Box, Button, ButtonProps } from "@mui/material";

import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const ActionsContainer: StyledComponent<any> = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  zIndex: 1,
}));

export const ScrollButton: StyledComponent<ButtonProps> = styled(Button)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  boxShadow: theme.shadows[2],
  width: "40px",
  height: "40px",
  minWidth: "40px",
  padding: 0,
  borderRadius: "50%",
  backdropFilter: "blur(8px)",
  border: `1px solid ${theme.palette.primary.dark}33`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})); 