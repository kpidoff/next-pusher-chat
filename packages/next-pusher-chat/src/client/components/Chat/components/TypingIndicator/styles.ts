import { Box } from "@mui/material";
import { StyledComponent } from "@emotion/styled";
import { styled } from "@mui/material/styles";

export const Container: StyledComponent<any> = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  height: "24px",
  display: "flex",
  alignItems: "center",
})); 