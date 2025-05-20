import { Box, BoxProps, InputBase, InputBaseProps } from "@mui/material";

import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const InputContainer: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1),
  },
}));

export const StyledInput: StyledComponent<InputBaseProps> = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.background.default,
  borderRadius: 20,
  fontSize: "0.9rem",
  "& input": {
    padding: theme.spacing(0.5, 0),
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0.5, 1.5),
  },
})); 