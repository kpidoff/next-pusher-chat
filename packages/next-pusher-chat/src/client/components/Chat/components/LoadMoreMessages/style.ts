import { Box, BoxProps, Button, ButtonProps } from "@mui/material";

import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const LoadMoreContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

export const LoadMoreButton: StyledComponent<ButtonProps> = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  textTransform: "none",
  minWidth: "150px",
  maxWidth: "100%",
  fontSize: "0.9rem",
  padding: "6px 16px",
  [theme.breakpoints.up("sm")]: {
    minWidth: "180px",
    fontSize: "0.9rem",
    padding: "6px 16px",
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "150px",
    fontSize: "0.8rem",
    padding: "4px 8px",
  },
})); 