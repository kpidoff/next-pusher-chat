import React from "react";
import { Options } from "pusher-js";
import Pusher from "pusher-js";
interface PusherConnectionState {
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    connectionState: string;
}
interface PusherContextType extends PusherConnectionState {
    pusher: Pusher | null;
    userId: string;
}
interface UseNextPusherChatProps {
    userId: string;
    options?: Partial<Options>;
    children: React.ReactNode;
}
export declare const NextPusherChatProvider: React.FC<UseNextPusherChatProps>;
export declare const useNextPusherChat: () => PusherContextType;
export {};
