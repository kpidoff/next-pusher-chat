import { Box, BoxProps } from "@mui/material";

import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const SeenContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "& .MuiSvgIcon-root": {
    fontSize: "1rem",
    color: theme.palette.text.secondary,
  },
})); 