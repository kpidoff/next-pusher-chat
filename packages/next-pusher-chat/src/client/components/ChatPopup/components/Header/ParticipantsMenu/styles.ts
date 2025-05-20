import { Box, List, ListItem, Popover } from "@mui/material";
import { BoxProps, ListItemProps, ListProps, PopoverProps } from "@mui/material";

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

export const ParticipantAvatar: StyledComponent<BoxProps> = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "0.9rem",
  fontWeight: 500,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

export const StyledListItem: StyledComponent<ListItemProps> = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledList: StyledComponent<ListProps> = styled(List)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  py: 0,
})); 