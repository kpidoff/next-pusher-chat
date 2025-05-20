import { Box, IconButton, Tooltip } from "@mui/material";
import {
  ControlsContainer,
  StyledDialog,
  ViewerImage,
  ViewerImageContainer,
} from "./styles";

import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import React from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

interface ImageViewerProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  open,
  onClose,
  imageUrl,
  imageName,
}) => {
  const [scale, setScale] = React.useState(1);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleClose = () => {
    setScale(1);
    onClose();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      fullScreen
      onClick={handleClose}
      disableEnforceFocus
      disableAutoFocus
    >
      <ViewerImageContainer onClick={(e) => e.stopPropagation()}>
        <ControlsContainer>
          <Tooltip title="Zoom avant">
            <IconButton onClick={handleZoomIn} sx={{ color: "white" }}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom arrière">
            <IconButton onClick={handleZoomOut} sx={{ color: "white" }}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Télécharger">
            <IconButton onClick={handleDownload} sx={{ color: "white" }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fermer">
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </ControlsContainer>
        <ViewerImage
          src={imageUrl}
          alt={imageName}
          scale={scale}
          onClick={(e) => e.stopPropagation()}
        />
      </ViewerImageContainer>
    </StyledDialog>
  );
};
