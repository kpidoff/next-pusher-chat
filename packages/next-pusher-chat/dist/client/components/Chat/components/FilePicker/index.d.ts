interface FilePickerProps {
    onFilesSelect: (attachments: File[]) => void;
    disabled?: boolean;
}
export declare function FilePicker({ onFilesSelect, disabled, }: FilePickerProps): import("react/jsx-runtime").JSX.Element;
export {};
