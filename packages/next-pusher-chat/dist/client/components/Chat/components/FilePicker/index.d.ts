interface FilePickerProps {
    onFilesSelect: (attachments: File[]) => void;
    disabled?: boolean;
}
export default function FilePicker({ onFilesSelect, disabled, }: FilePickerProps): import("react/jsx-runtime").JSX.Element;
export {};
