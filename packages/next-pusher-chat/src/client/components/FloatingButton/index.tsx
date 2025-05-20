import { SxProps, Theme, Zoom, useTheme } from "@mui/material";

import React from "react";
import { StyledFab } from "./styles";

export interface FloatingButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  color?:
    | "primary"
    | "secondary"
    | "default"
    | "success"
    | "error"
    | "info"
    | "warning";
  size?: "small" | "medium" | "large";
  sx?: SxProps<Theme>;
  tooltip?: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  onClick,
  color = "primary",
  size = "large",
  sx,
  tooltip,
}) => {
  const theme = useTheme();

  return (
    <Zoom
      in={true}
      timeout={{
        enter: 225,
        exit: 195,
      }}
      style={{
        transitionDelay: "0ms",
      }}
      unmountOnExit
    >
      <StyledFab
        onClick={onClick}
        color={color}
        size={size}
        aria-label={tooltip}
        sx={sx}
      >
        {icon}
      </StyledFab>
    </Zoom>
  );
};
