"use client";
import { LoadMoreButton, LoadMoreContainer } from "./style";

import { useChatContext } from "@/client/contexts/ChatContext";
import { useRef } from "react";

const LoadMoreMessages = () => {
  const {
    isLoading,
    loadingMore,
    hasMore,
    totalMessages,
    currentMessagesCount,
    loadMoreMessages,
    scrollManager,
  } = useChatContext();

  const previousScrollHeight = useRef<number>(0);
  const previousScrollTop = useRef<number>(0);

  const handleLoadMore = async () => {
    if (scrollManager.contentRef.current) {
      previousScrollHeight.current =
        scrollManager.contentRef.current.scrollHeight;
      previousScrollTop.current = scrollManager.contentRef.current.scrollTop;
    }
    await loadMoreMessages();
    // Restaurer la position du scroll après le chargement
    if (scrollManager.contentRef.current) {
      requestAnimationFrame(() => {
        const newScrollHeight =
          scrollManager.contentRef.current?.scrollHeight || 0;
        const scrollDiff = newScrollHeight - previousScrollHeight.current;
        if (scrollManager.contentRef.current) {
          scrollManager.contentRef.current.scrollTop =
            previousScrollTop.current + scrollDiff;
        }
      });
    }
  };

  // Masquer le bouton si on a atteint le nombre total de messages
  if (
    !hasMore ||
    isLoading ||
    (totalMessages !== undefined && currentMessagesCount >= totalMessages)
  )
    return null;

  return (
    <LoadMoreContainer>
      <LoadMoreButton
        variant="outlined"
        onClick={handleLoadMore}
        disabled={loadingMore}
      >
        {loadingMore ? "Chargement..." : "Messages plus anciens"}
      </LoadMoreButton>
    </LoadMoreContainer>
  );
};

export default LoadMoreMessages;
