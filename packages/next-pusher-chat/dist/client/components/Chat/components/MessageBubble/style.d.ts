import { BoxProps } from "@mui/material";
import { StyledComponent } from "@emotion/styled";
export declare const StyledMessageBubble: StyledComponent<BoxProps & {
    isCurrentUser: boolean;
    userColor?: string;
    hasSpecialContent?: boolean;
    hasAudio?: boolean;
}>;
export declare const LinkContainer: StyledComponent<BoxProps>;
