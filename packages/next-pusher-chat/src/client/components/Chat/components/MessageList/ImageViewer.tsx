import { Box, IconButton, Tooltip } from "@mui/material";
import {
  ControlsContainer,
  StyledDialog,
  ViewerImage,
  ViewerImageContainer,
} from "./styles";

import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import React from "react";

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
              <ZoomIn size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom arrière">
            <IconButton onClick={handleZoomOut} sx={{ color: "white" }}>
              <ZoomOut size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Télécharger">
            <IconButton onClick={handleDownload} sx={{ color: "white" }}>
              <Download size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fermer">
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <X size={20} />
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
