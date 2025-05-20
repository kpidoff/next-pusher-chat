import { SxProps, Theme } from "@mui/material";
import React from "react";
export interface FloatingButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    color?: "primary" | "secondary" | "default" | "success" | "error" | "info" | "warning";
    size?: "small" | "medium" | "large";
    sx?: SxProps<Theme>;
    tooltip?: string;
}
export declare const FloatingButton: React.FC<FloatingButtonProps>;
