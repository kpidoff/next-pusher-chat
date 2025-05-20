import { ActionsContainer, ScrollButton } from "./style";
import { useEffect, useState } from "react";

import { Fade } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useChatContext } from "@/client/contexts/ChatContext";

export const ChatActions = () => {
  const { scrollManager } = useChatContext();
  const { scrollToBottom, isAtBottom } = scrollManager;
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isAtBottom) {
      // On attend 500ms après la fin du scroll pour afficher le bouton
      timeoutId = setTimeout(() => {
        setShowButton(true);
      }, 500);
    } else {
      // On attend que le défilement soit terminé avant de cacher le bouton
      timeoutId = setTimeout(() => {
        setShowButton(false);
      }, 100);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAtBottom]);

  return (
    <ActionsContainer>
      <Fade in={showButton}>
        <ScrollButton
          onClick={() => scrollToBottom("smooth")}
          variant="contained"
        >
          <KeyboardArrowDownIcon />
        </ScrollButton>
      </Fade>
    </ActionsContainer>
  );
};
