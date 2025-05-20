import { ChatConfig } from "../types/chat";

export const DEFAULT_CHAT_CONFIG: ChatConfig = {
  activeEmoji: true,
  activeFile: true,
  activeVoice: true,
  activeUserColor: true,
  welcomeMessage: "Bienvenue dans la conversation",
  typingTimeout: 10000,
  numberOfMessagesToLoad: 30,
};
