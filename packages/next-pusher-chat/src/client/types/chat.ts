import { ChatProviderProps } from "../contexts/ChatContext";

export type ChatProps = Omit<ChatProviderProps, 'children'>

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Attachment {
  url: string;
  name: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  type?: "message" | "system" | "MESSAGE" | "SYSTEM";
  attachmentsCount?: number;
  attachments?: Attachment[];
  seenBy?: {
    userId: string;
    seenAt: Date;
  }[];
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export type UseChatProps = {
  conversationId: string;
  onMessageReceived?: (message: ReceivedMessageEvent) => void;
  onMessageSeen?: (messageReceived:ReceivedMessageSeenEvent) => void;
  onTypingStatus?: (data: ReceivedTypingEvent) => void;
  onError?: (error: Error) => void;
  participants: User[];
}

export type ChatEventHandler = Omit<UseChatProps, 'participants'>



export interface SendMessageEvent {
  userId: string;
  content: string;
  attachmentsCount?: number;
  createdAt: Date;
  id?: string;
}

export type SendMessageProps = Omit<SendMessageEvent, 'userId' | 'attachmentsCount'> & {
  attachments?: File[];
}

export type SendMessage = SendMessageEvent & {
  id: string;
  attachments?: File[];
  createdAt: Date;
}

export type MessageSeen = {
  userId: string;
  seenAt: Date;
}

export interface ReceivedMessageEvent {
  userId: string;
  content: string;
  eventId: string;
  attachmentsCount?: number;
  createdAt: Date;
}

export interface TypingEvent {
  userId: string;
  isTyping: boolean;
}

export interface ReceivedTypingEvent {
  userId: string;
  isTyping: boolean;
  eventId: string;
}

export interface ReceivedMessageSeenEvent {
  userId: string;
  eventId: string;
  seenAt: Date;
}

export interface AuthEvent {
  userId: string;
  socketId: string;
  channel: string;
}

export interface ChatConfig {
  activeEmoji?: boolean;
  activeFile?: boolean;
  activeVoice?: boolean;
  activeUserColor?: boolean;
  welcomeMessage?: string;
  typingTimeout?: number;
  numberOfMessagesToLoad?: number;
}

export interface ReceiveMessage {
  id: string;
  content: string;
  userId: string;
  user: User;
  createdAt: Date;
  attachmentsCount?: number;
}

export type OnSendMessage = {
  eventId: string,
  message: SendMessage,
  conversationId: string
};

export type OnMessageSeen = {
  lastMessage: Message,
  conversationId: string,
  userId: string
}
