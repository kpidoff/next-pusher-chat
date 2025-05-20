import { ChatConfig } from "../types/chat";
import { DEFAULT_CHAT_CONFIG } from "../constants/constants";

export const mergeConfigWithDefaults = (config: ChatConfig): ChatConfig => {
  return {
    ...DEFAULT_CHAT_CONFIG,
    ...config,
  };
}; 