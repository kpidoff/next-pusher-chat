import { Avatar, Tooltip } from "@mui/material";

import React from "react";
import { User } from "../../../../types/chat";

interface UserAvatarProps {
  user: User;
  size?: number;
}

export const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ user, size = 32 }, ref) => {
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <Tooltip title={user.name} arrow placement="top">
        <Avatar
          ref={ref}
          src={user.avatar}
          alt={user.name}
          sx={{
            width: size,
            height: size,
            bgcolor: "grey.300",
            fontSize: `${size * 0.4}px`,
            cursor: "pointer",
          }}
        >
          {!user.avatar && getInitials(user.name)}
        </Avatar>
      </Tooltip>
    );
  }
);

UserAvatar.displayName = "UserAvatar";
