import { BoxProps, DialogProps, LinkProps, TypographyProps } from "@mui/material";
import { ImgHTMLAttributes } from "react";
import { StyledComponent } from "@emotion/styled";
export declare const MessageContainer: StyledComponent<BoxProps>;
export declare const MessageTime: StyledComponent<TypographyProps>;
export declare const MessageGroup: StyledComponent<BoxProps>;
export declare const SystemMessage: StyledComponent<BoxProps>;
export declare const MessageContent: StyledComponent<BoxProps>;
export declare const AudioContainer: StyledComponent<BoxProps>;
export declare const AudioProgress: StyledComponent<BoxProps>;
export declare const AudioProgressBar: StyledComponent<BoxProps & {
    progress: number;
}>;
export declare const ImageContainer: StyledComponent<BoxProps>;
export declare const StyledImage: StyledComponent<any>;
export declare const ImageOverlay: StyledComponent<BoxProps>;
export declare const StyledDialog: StyledComponent<DialogProps>;
export declare const ViewerImageContainer: StyledComponent<BoxProps>;
export declare const ViewerImage: StyledComponent<ImgHTMLAttributes<HTMLImageElement> & {
    scale: number;
}>;
export declare const ControlsContainer: StyledComponent<BoxProps>;
export declare const FileContainer: StyledComponent<BoxProps>;
export declare const FileLink: StyledComponent<LinkProps>;
export declare const FileName: StyledComponent<TypographyProps>;
export declare const IconWrapper: StyledComponent<any>;
