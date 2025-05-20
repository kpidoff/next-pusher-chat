import { ChatProvider, useChatContext } from "@/client/contexts/ChatContext";
import {
  Content,
  WaitingMessageContainer,
  WaitingMessageEmoji,
  WaitingMessageText,
  WaitingMessageTitle,
} from "./style";
import React, { useEffect, useRef, useState } from "react";

import { ChatActions } from "./components/ChatActions";
import { ChatProps } from "../../types/chat";
import { LoadMoreMessages } from "./components/LoadMoreMessages";
import MessageInput from "./components/MessageInput";
import { MessageList } from "./components/MessageList";
import { TypingIndicator } from "./components/TypingIndicator";

const ChatConversationContent: React.FC = () => {
  const { scrollManager } = useChatContext();
  const { contentRef } = scrollManager;

  return (
    <>
      <Content ref={contentRef}>
        <LoadMoreMessages />

        <MessageList />
      </Content>
      <ChatActions />
      <TypingIndicator />
      <MessageInput />
    </>
  );
};

const ChatNoConversationContent: React.FC<{
  buttonJoin?: React.ReactNode;
}> = ({ buttonJoin }) => {
  return (
    <>
      <Content>
        {buttonJoin ? (
          buttonJoin
        ) : (
          <WaitingMessageContainer>
            <WaitingMessageEmoji>💭</WaitingMessageEmoji>
            <WaitingMessageTitle>
              En attente de conversation
            </WaitingMessageTitle>
            <WaitingMessageText>
              La conversation n'est pas encore active. Revenez bientôt pour
              discuter !
            </WaitingMessageText>
          </WaitingMessageContainer>
        )}
      </Content>
    </>
  );
};

export const Chat: React.FC<
  Omit<ChatProps, "conversationId"> & {
    conversationId?: string | null;
    buttonJoin?: React.ReactNode;
  }
> = (props) => {
  const { conversationId, buttonJoin, ...rest } = props;

  if (conversationId) {
    return (
      <ChatProvider {...rest} conversationId={conversationId}>
        <ChatConversationContent />
      </ChatProvider>
    );
  }

  return <ChatNoConversationContent buttonJoin={buttonJoin} />;
};
