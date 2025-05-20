import { Collapse, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { Container } from "./styles";
import { User } from "../../../../types/chat";
import { useChatContext } from "@/client/contexts/ChatContext";

export const TypingIndicator = () => {
  const { typingUsers, participants, userId } = useChatContext();
  const [isVisible, setIsVisible] = useState(false);

  //On supprime l'utilisateur actif du tableau
  const typingUsersWithoutCurrentUser = typingUsers.filter(
    (user: string) => user !== userId
  );

  useEffect(() => {
    if (typingUsersWithoutCurrentUser.length > 0) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [typingUsersWithoutCurrentUser]);

  const getTypingUsersNames = () => {
    if (!typingUsersWithoutCurrentUser.length) return "";

    const typingParticipants = participants.filter(
      (user: User) =>
        typingUsersWithoutCurrentUser.includes(user.id) && user.id !== userId
    );

    if (typingParticipants.length === 0) return "";

    const names = typingParticipants.map((user: User) => user.name);
    if (names.length === 1) {
      return `${names[0]} écrit...`;
    } else if (names.length === 2) {
      return `${names[0]} et ${names[1]} écrivent...`;
    } else {
      return `${names[0]}, ${names[1]} et ${
        names.length - 2
      } autre(s) écrivent...`;
    }
  };

  const typingText = getTypingUsersNames();

  return (
    <Collapse in={isVisible} sx={{ pl: 2 }}>
      <Container>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontStyle: "italic",
            fontSize: "0.75rem",
            opacity: typingText ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {typingText}
        </Typography>
      </Container>
    </Collapse>
  );
};
