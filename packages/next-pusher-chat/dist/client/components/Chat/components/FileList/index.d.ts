interface FileListProps {
    attachments: File[];
    onRemoveFile: (file: File) => void;
}
declare const FileList: ({ attachments, onRemoveFile }: FileListProps) => import("react/jsx-runtime").JSX.Element | null;
export default FileList;
