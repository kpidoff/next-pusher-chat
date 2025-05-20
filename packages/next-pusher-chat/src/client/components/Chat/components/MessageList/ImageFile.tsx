import { Box, Typography } from "@mui/material";
import { ImageContainer, ImageOverlay, StyledImage } from "./styles";

import { ImageViewer } from "./ImageViewer";
import React from "react";

interface ImageFileProps {
  url: string;
  name: string;
  onLoad?: () => void;
}

export const ImageFile: React.FC<ImageFileProps> = ({ url, name, onLoad }) => {
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewerOpen(true);
  };

  return (
    <>
      <ImageContainer onClick={handleClick}>
        <StyledImage src={url} alt={name} onLoad={onLoad} />
        <ImageOverlay className="image-overlay">
          <Typography variant="body2" color="white">
            Cliquez pour agrandir
          </Typography>
        </ImageOverlay>
      </ImageContainer>
      <ImageViewer
        open={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        imageUrl={url}
        imageName={name}
      />
    </>
  );
};
