import { Box, IconButton, Popover } from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useState } from "react";

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  disabled?: boolean;
}

const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({
  onEmojiClick,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiClick(emojiData.emoji);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <IconButton
        disabled={disabled}
        onClick={handleClick}
        size="small"
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        <SentimentSatisfiedAltIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width={300}
          height={400}
          searchPlaceholder="Rechercher un emoji..."
        />
      </Popover>
    </Box>
  );
};

export default EmojiPickerComponent;
