import React from "react";
export interface File {
    url: string;
    name: string;
    type: string;
    size: number;
}
interface FileItemProps {
    file: File;
    onClick?: (file: File) => void;
}
export declare const FileItem: React.FC<FileItemProps>;
export {};
