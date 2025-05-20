import { Box, Chip } from "@mui/material";

interface FileListProps {
  attachments: File[];
  onRemoveFile: (file: File) => void;
}

const FileList = ({ attachments, onRemoveFile }: FileListProps) => {
  if (attachments.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {attachments.map((attachment, index) => (
        <Chip
          key={index}
          label={attachment.name}
          onDelete={() => onRemoveFile(attachment)}
          size="small"
          sx={{
            maxWidth: 200,
            position: "relative",
            zIndex: 1,
            "&:hover": {
              zIndex: 2,
            },
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
            "& .MuiChip-deleteIcon": {
              zIndex: 3,
            },
          }}
        />
      ))}
    </Box>
  );
};

export default FileList;
