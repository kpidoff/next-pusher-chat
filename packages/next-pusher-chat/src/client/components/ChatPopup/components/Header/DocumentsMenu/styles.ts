import { Box, List, Popover } from "@mui/material";
import { BoxProps, ListProps, PopoverProps } from "@mui/material";

import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const StyledPopover: StyledComponent<PopoverProps> = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: 280,
    maxHeight: 360,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    display: "flex",
    flexDirection: "column",
  },
}));

export const MenuHeader: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
}));

export const StyledList: StyledComponent<ListProps> = styled(List)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  py: 0,
})); 