import { Box, BoxProps, Dialog, DialogProps, Link, LinkProps, Typography, TypographyProps } from "@mui/material";

import { ImgHTMLAttributes } from "react";
import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const MessageContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
  overflowX: "hidden",
  overflowY: "auto",
  "&.loading": {
    overflow: "hidden",
  },
}));

export const MessageTime: StyledComponent<TypographyProps> = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
}));

export const MessageGroup: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(2),
  width: "100%",
  overflow: "hidden",
}));

export const SystemMessage: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  margin: theme.spacing(2, 0),
  "&::before, &::after": {
    content: '""',
    flex: 1,
    height: "1px",
    backgroundColor: theme.palette.divider,
    margin: theme.spacing(0, 2),
    opacity: 0.5,
  },
}));

export const MessageContent: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "flex-start",
  width: "100%",
  overflow: "hidden",
}));

export const AudioContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  overflow: "hidden",
  boxSizing: "border-box",
}));

export const AudioProgress: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 6,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 3,
  position: "relative",
  overflow: "hidden",
  minWidth: 0,
}));

export const AudioProgressBar: StyledComponent<BoxProps & { progress: number }> = styled(Box)<{ progress: number }>(
  ({ theme, progress }) => ({
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: `${progress}%`,
    backgroundColor: theme.palette.primary.main,
    transition: "width 0.1s linear",
  })
);

export const ImageContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxHeight: "300px",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  cursor: "pointer",
  "&:hover": {
    "& .image-overlay": {
      opacity: 1,
    },
  },
}));

export const StyledImage: StyledComponent<any> = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const ImageOverlay: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.2s ease-in-out",
}));

export const StyledDialog: StyledComponent<DialogProps> = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    maxWidth: "100vw",
    maxHeight: "100vh",
    margin: 0,
    borderRadius: 0,
    overflow: "hidden",
  },
  "& .MuiDialog-container": {
    overflow: "hidden",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
}));

export const ViewerImageContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  overflow: "hidden",
}));

export const ViewerImage: StyledComponent<ImgHTMLAttributes<HTMLImageElement> & { scale: number }> = styled("img")<{ scale: number }>(
  ({ scale }) => ({
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    transform: `scale(${scale})`,
    transition: "transform 0.2s ease-in-out",
  })
);

export const ControlsContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: theme.spacing(1),
  zIndex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

export const FileContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

export const FileLink: StyledComponent<LinkProps> = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
  textDecoration: "none",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    textDecoration: "none",
  },
}));

export const FileName: StyledComponent<TypographyProps> = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "200px",
}));

export const IconWrapper: StyledComponent<any> = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
})); 