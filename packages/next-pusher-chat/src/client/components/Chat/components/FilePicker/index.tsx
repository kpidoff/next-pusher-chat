"use client";
import { Box, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";

// import AttachFileIcon from "@mui/icons-material/AttachFile";

interface FilePickerProps {
  onFilesSelect: (attachments: File[]) => void;
  disabled?: boolean;
}

export default function  FilePicker({
  onFilesSelect,
  disabled = false,
}: FilePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const attachments = event.target.files;
    if (attachments && attachments.length > 0) {
      onFilesSelect(Array.from(attachments));
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        style={{ display: "none" }}
      />
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
          },
        }}
        disabled={disabled}
      >
        <Paperclip size={20} />
      </IconButton>
    </Box>
  );
}