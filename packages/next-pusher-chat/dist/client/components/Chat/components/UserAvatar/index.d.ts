import React from "react";
import { User } from "../../../../types/chat";
interface UserAvatarProps {
    user: User;
    size?: number;
}
export declare const UserAvatar: React.ForwardRefExoticComponent<UserAvatarProps & React.RefAttributes<HTMLDivElement>>;
export {};
