"use client";

import React, { createContext, useEffect, useState } from "react";

import { Options } from "pusher-js";
import Pusher from "pusher-js";
import { createPusherSubscribes } from "../services/pusher/subscribe";
import { logger } from "../utils/logger";
import { useContext } from "react";

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

const PusherContext = createContext<PusherContextType | null>(null);

interface UseNextPusherChatProps {
  userId: string;
  options?: Partial<Options>;
  children: React.ReactNode;
}

export const NextPusherChatProvider: React.FC<UseNextPusherChatProps> = ({
  userId,
  options,
  children,
}) => {
  const [connectionState, setConnectionState] = useState<PusherConnectionState>(
    {
      isConnected: false,
      isLoading: true,
      error: null,
      connectionState: "initializing",
    }
  );
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    logger.info("🚀 Initialisation de Pusher...");
    setConnectionState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      connectionState: "connecting",
    }));

    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
      authEndpoint: "/api/chat",
      auth: {
        headers: {
          "X-User-Id": userId,
        },
      },
      ...options,
    });

    const events = createPusherSubscribes(pusherClient, (newState) => {
      setConnectionState((prev) => ({
        ...prev,
        ...newState,
      }));
    });

    events.setupConnectionSubscribes();

    setPusher(pusherClient);

    return () => {
      logger.info("👋 Déconnexion de Pusher...");
      pusherClient.disconnect();
    };
  }, [userId, options]);

  return (
    <PusherContext.Provider value={{ ...connectionState, pusher, userId }}>
      {children}
    </PusherContext.Provider>
  );
};

export const useNextPusherChat = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error(
      "useNextPusherChat doit être utilisé à l'intérieur d'un NextPusherChatProvider"
    );
  }
  return context;
};
