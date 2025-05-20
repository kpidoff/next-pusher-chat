import { Fab } from "@mui/material";
import { FabProps } from "@mui/material/Fab";
import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const StyledFab: StyledComponent<FabProps> = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1000,
})); 