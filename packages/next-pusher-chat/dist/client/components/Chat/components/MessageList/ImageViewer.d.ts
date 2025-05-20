import React from "react";
interface ImageViewerProps {
    open: boolean;
    onClose: () => void;
    imageUrl: string;
    imageName: string;
}
export declare const ImageViewer: React.FC<ImageViewerProps>;
export {};
