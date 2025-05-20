import React from "react";
interface ImageFileProps {
    url: string;
    name: string;
    onLoad?: () => void;
}
export declare const ImageFile: React.FC<ImageFileProps>;
export {};
