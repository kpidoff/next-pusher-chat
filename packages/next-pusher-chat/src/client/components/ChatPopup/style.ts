import { Paper, PaperProps } from "@mui/material";

import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const StyledPaper: StyledComponent<PaperProps & { isClosing: boolean; isExpanded: boolean }> = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isClosing" && prop !== "isExpanded",
})<PaperProps & { isClosing: boolean; isExpanded: boolean }>(
  ({ theme, isClosing, isExpanded }) => ({
    position: "fixed",
    bottom: theme.spacing(12),
    right: theme.spacing(4),
    width: isExpanded ? "80%" : 350,
    height: isExpanded ? "80vh" : 500,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    overflow: "hidden",
    transformOrigin: "bottom right",
    borderRadius: "16px",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 0 0 1px ${theme.palette.primary.dark}33,
      0 0 0 2px ${theme.palette.primary.dark}11
    `,
    border: `1px solid ${theme.palette.primary.dark}33`,
    backdropFilter: "blur(10px)",
    background: `linear-gradient(180deg, 
      ${theme.palette.background.paper} 0%, 
      ${theme.palette.background.paper} 100%
    )`,
    transition: "all 0.3s ease-in-out",
    transform: isClosing ? "scale(0.95) translateY(20px)" : "scale(1)",
    opacity: isClosing ? 0 : 1,
    visibility: isClosing ? "hidden" : "visible",
    animation: !isClosing ? "popIn 0.3s ease-out" : "none",
    "&.loading": {
      overflow: "hidden",
    },
    "@keyframes popIn": {
      "0%": {
        transform: "scale(0.95) translateY(20px)",
        opacity: 0,
      },
      "100%": {
        transform: "scale(1) translateY(0)",
        opacity: 1,
      },
    },
  })
);
