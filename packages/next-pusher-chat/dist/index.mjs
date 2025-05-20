var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/server/api/auth/route.ts
import Pusher from "pusher";
var pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
});
async function POST(request) {
  const requestData = await request.formData();
  const socketId = requestData.get("socket_id");
  const channel = requestData.get("channel_name");
  const userId = request.headers.get("x-user-id");
  if (!socketId || !channel || !userId) {
    return new Response(JSON.stringify({ error: "Param\xE8tres manquants" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    if (!channel.startsWith("private-")) {
      return new Response(JSON.stringify({ error: "Canal non autoris\xE9" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const auth = pusher.authorizeChannel(socketId, channel);
    return new Response(JSON.stringify(auth), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("\u26A0\uFE0F Auth failed:", err);
    return new Response(
      JSON.stringify({
        error: "\xC9chec de l'authentification",
        details: err instanceof Error ? err.message : "Inconnu"
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}

// src/server/api/events/route.ts
import Pusher2 from "pusher";
var pusher2 = new Pusher2({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
});
async function POST2(request) {
  try {
    const { event, channel, data } = await request.json();
    if (!event || !channel || !data) {
      return new Response(JSON.stringify({ error: "Event, channel, and data are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await pusher2.trigger(channel, event, data);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// src/server/api/index.ts
async function POST3(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return POST(request);
  }
  return POST2(request);
}

// src/client/utils/logger.ts
var Logger = class {
  constructor() {
    this.config = {
      enabled: process.env.NEXT_PUBLIC_ENABLE_LOGS === "true",
      level: process.env.NEXT_PUBLIC_LOG_LEVEL || "info"
    };
  }
  shouldLog(level) {
    if (!this.config.enabled) return false;
    const levels = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.config.level);
  }
  formatMessage(level, message, ...args) {
    return `[${level.toUpperCase()}] ${message}`;
  }
  debug(message, ...args) {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message), ...args);
    }
  }
  info(message, ...args) {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message), ...args);
    }
  }
  warn(message, ...args) {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message), ...args);
    }
  }
  error(message, ...args) {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message), ...args);
    }
  }
};
var logger = new Logger();

// src/server/service/event.ts
import { v4 as uuidv4 } from "uuid";
var pusherEvent = async ({ event, conversationId, data, eventId: providedEventId }) => {
  try {
    const eventId = providedEventId || uuidv4();
    logger.info(`\u{1F504} Triggering Pusher event [${event}] id [${eventId}] for conversation [${conversationId}]:`, data);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channel: `private-${conversationId}`,
        event,
        data: __spreadValues({
          eventId,
          createdAt: /* @__PURE__ */ new Date()
        }, data)
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || "Erreur lors de l'envoi de l'\xE9v\xE9nement");
    }
    const result = await response.json();
    return {
      eventId,
      data: result
    };
  } catch (error) {
    console.error("Error in pusherEvent:", error);
    throw error;
  }
};

// src/adapters/pages-router.ts
import { NextRequest } from "next/server";
var PagesRouterAdapter = class {
  static convertRequest(req) {
    const origin = req.headers.origin || "http://localhost:3000";
    const url = new URL(req.url, origin);
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.append(key, Array.isArray(value) ? value.join(", ") : value);
      }
    });
    let body;
    const contentType = headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = new URLSearchParams();
      if (req.body) {
        Object.entries(req.body).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }
      body = formData.toString();
    } else if (req.body) {
      body = JSON.stringify(req.body);
    }
    return new NextRequest(url.toString(), {
      method: req.method || "GET",
      headers,
      body
    });
  }
  static async convertResponse(response, res) {
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.status(response.status);
    const data = await response.json();
    res.json(data);
  }
};

// src/client/services/chat/event.ts
var eventSendMessageEvent = async (conversationId, data) => {
  const { data: result, eventId } = await pusherEvent({
    eventId: data.id,
    event: "new-message",
    conversationId,
    data: __spreadProps(__spreadValues({}, data), {
      createdAt: /* @__PURE__ */ new Date()
    })
  });
  return {
    eventId,
    data: result
  };
};
var eventTypingEvent = async (conversationId, data) => {
  const { data: result, eventId } = await pusherEvent({
    event: "user-typing",
    conversationId,
    data
  });
  return {
    eventId,
    data: result
  };
};
var eventMessageSeenEvent = async (conversationId, data) => {
  const { data: result, eventId } = await pusherEvent({
    event: "message-seen",
    conversationId,
    data
  });
  return {
    eventId,
    data: result
  };
};

// src/client/hooks/useChatSubscribe.ts
import { useCallback, useEffect as useEffect2 } from "react";

// src/client/services/chat/subscribe.ts
var processedEventIds = /* @__PURE__ */ new Set();
var createChatSubscribes = (pusher3, userId, handlers) => {
  const activeChannels = /* @__PURE__ */ new Set();
  const setupConversationSubscribes = (conversationId) => {
    const channelName = `private-${conversationId}`;
    if (activeChannels.has(channelName)) {
      return () => {
      };
    }
    const channel = pusher3.subscribe(channelName);
    activeChannels.add(channelName);
    logger.info(`\u{1F4AC} [Subscribe] Nouveau canal actif: ${channelName}`);
    channel.bind("new-message", (props) => {
      var _a;
      const { eventId, userId: userIdReceived } = props;
      if (!eventId || processedEventIds.has(eventId) || userIdReceived === userId) {
        return;
      }
      processedEventIds.add(eventId);
      logger.info(`\u{1F4AC} [Message] Nouveau message`, props);
      (_a = handlers == null ? void 0 : handlers.onMessageReceived) == null ? void 0 : _a.call(handlers, props);
    });
    channel.bind("user-typing", (props) => {
      var _a;
      const { eventId, userId: userIdReceived } = props;
      if (!eventId || processedEventIds.has(eventId) || userIdReceived === userId || !(handlers == null ? void 0 : handlers.onTypingStatus)) {
        return;
      }
      processedEventIds.add(eventId);
      logger.info(`\u{1F4AC} [Typing] Entr\xE9e de frappe`, props);
      (_a = handlers == null ? void 0 : handlers.onTypingStatus) == null ? void 0 : _a.call(handlers, props);
    });
    channel.bind("message-seen", (props) => {
      var _a;
      const { eventId, userId: userIdReceived } = props;
      if (!eventId || processedEventIds.has(eventId) || userIdReceived === userId || !(handlers == null ? void 0 : handlers.onMessageSeen)) {
        return;
      }
      processedEventIds.add(eventId);
      logger.info(`\u{1F4AC} [MessageSeen] Message marqu\xE9 comme lu`, props);
      (_a = handlers == null ? void 0 : handlers.onMessageSeen) == null ? void 0 : _a.call(handlers, props);
    });
    return () => {
      channel.unbind_all();
      pusher3.unsubscribe(channelName);
      activeChannels.delete(channelName);
      logger.info(`\u{1F4AC} [Unsubscribe] Canal ${channelName} d\xE9sactiv\xE9`);
    };
  };
  return {
    setupConversationSubscribes
  };
};

// src/client/providers/NextPusherChatProvider.tsx
import { createContext, useEffect, useState } from "react";
import Pusher3 from "pusher-js";

// src/client/services/pusher/subscribe.ts
var createPusherSubscribes = (pusher3, onConnectionStateChange) => {
  const setupConnectionSubscribes = () => {
    const connection = pusher3.connection;
    connection.bind("connected", () => {
      logger.info("\u2705 Pusher connect\xE9 avec succ\xE8s!");
      onConnectionStateChange({
        isConnected: true,
        isLoading: false,
        error: null,
        connectionState: "connected"
      });
    });
    connection.bind("connecting", () => {
      logger.info("\u{1F504} Tentative de connexion \xE0 Pusher...");
      onConnectionStateChange({
        isLoading: true,
        connectionState: "connecting"
      });
    });
    connection.bind("disconnected", () => {
      logger.info("\u274C Pusher d\xE9connect\xE9");
      onConnectionStateChange({
        isConnected: false,
        isLoading: false,
        connectionState: "disconnected"
      });
    });
    connection.bind("error", (err) => {
      console.error("\u26A0\uFE0F Erreur de connexion Pusher:", err);
      onConnectionStateChange({
        isConnected: false,
        isLoading: false,
        error: err.message || "Erreur de connexion",
        connectionState: "error"
      });
    });
    connection.bind("state_change", (states) => {
      logger.info("\u{1F504} Changement d'\xE9tat Pusher:", states);
    });
  };
  return {
    setupConnectionSubscribes
  };
};

// src/client/providers/NextPusherChatProvider.tsx
import { useContext } from "react";
import { jsx } from "react/jsx-runtime";
var PusherContext = createContext(null);
var NextPusherChatProvider = ({
  userId,
  options,
  children
}) => {
  const [connectionState, setConnectionState] = useState(
    {
      isConnected: false,
      isLoading: true,
      error: null,
      connectionState: "initializing"
    }
  );
  const [pusher3, setPusher] = useState(null);
  useEffect(() => {
    logger.info("\u{1F680} Initialisation de Pusher...");
    setConnectionState((prev) => __spreadProps(__spreadValues({}, prev), {
      isLoading: true,
      error: null,
      connectionState: "connecting"
    }));
    const pusherClient = new Pusher3(process.env.NEXT_PUBLIC_PUSHER_KEY || "", __spreadValues({
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
      authEndpoint: "/api/chat",
      auth: {
        headers: {
          "X-User-Id": userId
        }
      }
    }, options));
    const events = createPusherSubscribes(pusherClient, (newState) => {
      setConnectionState((prev) => __spreadValues(__spreadValues({}, prev), newState));
    });
    events.setupConnectionSubscribes();
    setPusher(pusherClient);
    return () => {
      logger.info("\u{1F44B} D\xE9connexion de Pusher...");
      pusherClient.disconnect();
    };
  }, [userId, options]);
  return /* @__PURE__ */ jsx(PusherContext.Provider, { value: __spreadProps(__spreadValues({}, connectionState), { pusher: pusher3, userId }), children });
};
var useNextPusherChat = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error(
      "useNextPusherChat doit \xEAtre utilis\xE9 \xE0 l'int\xE9rieur d'un NextPusherChatProvider"
    );
  }
  return context;
};

// src/client/hooks/useChatSubscribe.ts
var pusherSubscriptions = /* @__PURE__ */ new Map();
var getOrCreateSubscription = (conversationId, pusher3, userId) => {
  if (!pusherSubscriptions.has(conversationId)) {
    const events = createChatSubscribes(pusher3, userId, {
      conversationId,
      onMessageReceived: (message) => {
        const subscription = pusherSubscriptions.get(conversationId);
        if (subscription) {
          Array.from(subscription.callbacks).forEach((callback) => {
            if (callback.onMessageReceived) {
              callback.onMessageReceived(message);
            }
          });
        }
      },
      onMessageSeen: (messageSeen) => {
        const subscription = pusherSubscriptions.get(conversationId);
        if (subscription) {
          Array.from(subscription.callbacks).forEach((callback) => {
            if (callback.onMessageSeen) {
              callback.onMessageSeen(messageSeen);
            }
          });
        }
      },
      onTypingStatus: (typingStatus) => {
        const subscription = pusherSubscriptions.get(conversationId);
        if (subscription) {
          Array.from(subscription.callbacks).forEach((callback) => {
            if (callback.onTypingStatus) {
              callback.onTypingStatus(typingStatus);
            }
          });
        }
      },
      onError: (error) => {
        const subscription = pusherSubscriptions.get(conversationId);
        if (subscription) {
          Array.from(subscription.callbacks).forEach((callback) => {
            if (callback.onError) {
              callback.onError(error);
            }
          });
        }
      }
    });
    const unsubscribe = events.setupConversationSubscribes(conversationId);
    pusherSubscriptions.set(conversationId, {
      unsubscribe,
      callbacks: /* @__PURE__ */ new Set()
    });
  }
  return pusherSubscriptions.get(conversationId);
};
var useChatSubscribe = ({
  conversationId,
  onMessageReceived,
  onMessageSeen,
  onTypingStatus,
  onError
}) => {
  const { pusher: pusher3, isConnected, userId } = useNextPusherChat();
  const callbacks = useCallback(() => ({
    conversationId,
    onMessageReceived,
    onMessageSeen,
    onTypingStatus,
    onError
  }), [conversationId, onMessageReceived, onMessageSeen, onTypingStatus, onError]);
  useEffect2(() => {
    if (!isConnected || !pusher3) return;
    const subscription = getOrCreateSubscription(conversationId, pusher3, userId);
    const currentCallbacks = callbacks();
    subscription.callbacks.add(currentCallbacks);
    logger.info(`\u{1F504} [ChatSubscribe] Ajout des callbacks pour la conversation ${conversationId}`);
    return () => {
      const subscription2 = pusherSubscriptions.get(conversationId);
      if (subscription2) {
        subscription2.callbacks.delete(currentCallbacks);
        if (subscription2.callbacks.size === 0) {
          subscription2.unsubscribe();
          pusherSubscriptions.delete(conversationId);
          logger.info(`\u{1F504} [ChatSubscribe] D\xE9sabonnement Pusher pour la conversation ${conversationId}`);
        }
      }
      logger.info(`\u{1F504} [ChatSubscribe] Suppression des callbacks pour la conversation ${conversationId}`);
    };
  }, [isConnected, conversationId, pusher3, userId, callbacks]);
  return {
    isConnected
  };
};

// src/client/hooks/useChat.ts
import { useEffect as useEffect3, useRef as useRef2 } from "react";
import { v4 as uuidv42 } from "uuid";
var useChat = ({ onMessageReceived, onTypingStatus, onError, conversationId, participants, onMessageSeen }) => {
  const { pusher: pusher3, isConnected, isLoading, error, connectionState, userId } = useNextPusherChat();
  const callbacksRef = useRef2({
    conversationId,
    participants,
    onMessageReceived,
    onMessageSeen,
    onTypingStatus,
    onError
  });
  useEffect3(() => {
    callbacksRef.current = {
      conversationId,
      participants,
      onMessageReceived,
      onMessageSeen,
      onTypingStatus,
      onError
    };
  }, [conversationId, participants, onMessageReceived, onMessageSeen, onTypingStatus, onError]);
  useEffect3(() => {
    if (!isConnected || !pusher3) return;
    const subscription = getOrCreateSubscription(conversationId, pusher3, userId);
    subscription.callbacks.add(callbacksRef.current);
    logger.info(`\u{1F504} [Chat] Ajout des callbacks pour la conversation ${conversationId}`);
    return () => {
      const subscription2 = pusherSubscriptions.get(conversationId);
      if (subscription2) {
        subscription2.callbacks.delete(callbacksRef.current);
        if (subscription2.callbacks.size === 0) {
          subscription2.unsubscribe();
          pusherSubscriptions.delete(conversationId);
          logger.info(`\u{1F504} [Chat] D\xE9sabonnement Pusher pour la conversation ${conversationId}`);
        }
      }
      logger.info(`\u{1F504} [Chat] Suppression des callbacks pour la conversation ${conversationId}`);
    };
  }, [isConnected, conversationId, pusher3, userId]);
  const sendMessage = (message) => {
    var _a;
    return eventSendMessageEvent(conversationId, {
      userId,
      content: message.content,
      attachmentsCount: ((_a = message.attachments) == null ? void 0 : _a.length) || 0,
      id: message.id
    });
  };
  const prepareMessage = ({ content, attachments }) => {
    const eventId = generateUUID();
    return {
      eventId,
      data: {
        userId,
        content,
        attachmentsCount: (attachments == null ? void 0 : attachments.length) || 0,
        createdAt: /* @__PURE__ */ new Date()
      }
    };
  };
  const updateTypingStatus = (isTyping) => {
    return eventTypingEvent(conversationId, {
      userId,
      isTyping
    });
  };
  const getParticipant = (id) => {
    return participants.find((participant) => participant.id === id) || {
      id: "unknown",
      name: "Unknown"
    };
  };
  const generateUUID = () => {
    return uuidv42();
  };
  const markMessageAsSeen = (messageId) => {
    return eventMessageSeenEvent(conversationId, {
      userId,
      seenAt: /* @__PURE__ */ new Date()
    });
  };
  return {
    sendMessage,
    prepareMessage,
    updateTypingStatus,
    getParticipant,
    markMessageAsSeen,
    connection: {
      isConnected,
      isLoading,
      error,
      connectionState
    }
  };
};

// src/client/contexts/ChatContext.tsx
import React2, {
  createContext as createContext2,
  useCallback as useCallback3,
  useContext as useContext2,
  useEffect as useEffect4,
  useMemo,
  useRef as useRef3
} from "react";

// src/client/constants/constants.ts
var DEFAULT_CHAT_CONFIG = {
  activeEmoji: true,
  activeFile: true,
  activeVoice: true,
  activeUserColor: true,
  welcomeMessage: "Bienvenue dans la conversation",
  typingTimeout: 1e4,
  numberOfMessagesToLoad: 30
};

// src/client/contexts/ChatContext.tsx
import _ from "lodash";

// src/client/utils/config.ts
var mergeConfigWithDefaults = (config) => {
  return __spreadValues(__spreadValues({}, DEFAULT_CHAT_CONFIG), config);
};

// src/client/contexts/ChatContext.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var ChatContext = createContext2(void 0);
var useChatContext = () => {
  const context = useContext2(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
var ChatProvider = ({
  conversationId,
  defaultMessages,
  participants,
  config,
  isLoading,
  totalMessages,
  onReceiveMessage,
  onSendMessage,
  onMessageSeen,
  onLoadMoreMessages,
  children
}) => {
  const mergedConfig = useMemo(
    () => mergeConfigWithDefaults(config || DEFAULT_CHAT_CONFIG),
    [config]
  );
  const [messages, setMessages] = React2.useState([]);
  const [loadingSendMessage, setLoadingSendMessage] = React2.useState(false);
  const [loadingMore, setLoadingMore] = React2.useState(false);
  const [hasMore, setHasMore] = React2.useState(true);
  const [typingUsers, setTypingUsers] = React2.useState([]);
  const [isAtBottom, setIsAtBottom] = React2.useState(true);
  const { userId } = useNextPusherChat();
  const contentRef = React2.useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = React2.useState(false);
  const SCROLL_THRESHOLD = 10;
  const scrollTimeoutRef = React2.useRef();
  const lastMessageSeenRef = useRef3(null);
  const isProcessingRef = useRef3(false);
  const scrollToBottom = React2.useCallback(
    (behavior = "smooth") => {
      if (contentRef.current) {
        const images = contentRef.current.getElementsByTagName("img");
        const imageLoadPromises = Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        });
        Promise.all(imageLoadPromises).then(() => {
          var _a;
          (_a = contentRef.current) == null ? void 0 : _a.scrollTo({
            top: contentRef.current.scrollHeight,
            behavior
          });
        });
      }
    },
    []
  );
  const handleScroll = React2.useCallback(() => {
    if (!contentRef.current) return;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < SCROLL_THRESHOLD;
      setIsAtBottom(isBottom);
    }, 100);
  }, []);
  React2.useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", handleScroll);
      return () => {
        content.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [handleScroll]);
  React2.useEffect(() => {
    if (shouldScrollToBottom) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom, scrollToBottom]);
  useEffect4(() => {
    if (messages.length === 0 && defaultMessages) {
      setMessages(defaultMessages);
    }
  }, [defaultMessages]);
  useEffect4(() => {
    logger.info("[ChatContext] Liste des messages", {
      messages
    });
  }, [messages]);
  const {
    prepareMessage,
    sendMessage: sendPusherMessage,
    updateTypingStatus: updatePusherTypingStatus,
    getParticipant,
    markMessageAsSeen
  } = useChat({
    conversationId,
    participants,
    onTypingStatus: ({ isTyping, userId: userId2 }) => {
      setTypingUsers(
        (prev) => isTyping ? [...prev, userId2] : prev.filter((id) => id !== userId2)
      );
    },
    onMessageReceived: (props) => {
      const { userId: userIdReceived, eventId } = props;
      if (userIdReceived !== userId) {
        onReceiveMessage == null ? void 0 : onReceiveMessage(eventId, __spreadProps(__spreadValues({}, props), {
          user: getParticipant(userIdReceived),
          id: eventId
        })).then((message) => {
          setMessages((prev) => {
            const newMessages = [...prev, message];
            if (isAtBottom) {
              setShouldScrollToBottom(true);
            }
            return newMessages.slice(
              -((mergedConfig == null ? void 0 : mergedConfig.numberOfMessagesToLoad) || 30)
            );
          });
        });
      }
    },
    onMessageSeen: (messageSeen) => {
      const { userId: seenByUserId } = messageSeen;
      const seenAt = /* @__PURE__ */ new Date();
      setMessages(
        (prevMessages) => prevMessages.map((message) => {
          var _a;
          if ((_a = message.seenBy) == null ? void 0 : _a.some((seen) => seen.userId === seenByUserId)) {
            return message;
          }
          return __spreadProps(__spreadValues({}, message), {
            seenBy: [
              ...message.seenBy || [],
              {
                userId: seenByUserId,
                seenAt
              }
            ]
          });
        })
      );
    }
  });
  const sendMessage = useCallback3(
    async (props) => {
      const { content, attachments, createdAt } = props;
      if (!content.trim() && !(attachments == null ? void 0 : attachments.length)) return;
      try {
        setLoadingSendMessage(true);
        const { data, eventId } = prepareMessage(props);
        const updatedMessage = await onSendMessage({
          conversationId,
          eventId,
          message: __spreadProps(__spreadValues(__spreadValues({
            id: eventId
          }, data), props), {
            userId,
            createdAt
          })
        });
        await sendPusherMessage(__spreadProps(__spreadValues(__spreadValues({}, data), props), {
          id: eventId,
          userId,
          createdAt
        }));
        setMessages((prev) => {
          const newMessages = [...prev, updatedMessage];
          setShouldScrollToBottom(true);
          return newMessages.slice(
            -((mergedConfig == null ? void 0 : mergedConfig.numberOfMessagesToLoad) || 30)
          );
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      } finally {
        setLoadingSendMessage(false);
      }
    },
    [
      prepareMessage,
      sendPusherMessage,
      onSendMessage,
      userId,
      mergedConfig == null ? void 0 : mergedConfig.numberOfMessagesToLoad
    ]
  );
  const loadMoreMessages = useCallback3(async () => {
    if (!onLoadMoreMessages || loadingMore || !hasMore) {
      return;
    }
    const oldestMessage = messages[0];
    if (!oldestMessage) {
      setHasMore(false);
      return;
    }
    try {
      setLoadingMore(true);
      const olderMessages = await onLoadMoreMessages({
        oldestMessageId: oldestMessage.id,
        previousMessages: messages
      });
      logger.info("[ChatContext] On recup\xE8re les messages plus anciens", {
        olderMessages
      });
      if (!olderMessages || olderMessages.length === 0) {
        setHasMore(false);
        logger.info("[ChatContext] On n'a plus de messages", {
          olderMessages
        });
        return;
      }
      logger.info("[ChatContext] On a des messages plus anciens", {
        olderMessages,
        messages
      });
      setMessages((prevMessages) => _.concat(olderMessages, prevMessages));
    } catch (error) {
      console.error(
        "Erreur lors du chargement des messages plus anciens:",
        error
      );
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [onLoadMoreMessages, loadingMore, hasMore, messages]);
  const markLastMessageAsSeen = useCallback3(
    (message) => {
      if (isProcessingRef.current || lastMessageSeenRef.current === message.id || message.userId === userId) {
        return;
      }
      if (!_.find(message.seenBy, { userId })) {
        isProcessingRef.current = true;
        lastMessageSeenRef.current = message.id;
        markMessageAsSeen(message.id);
        onMessageSeen == null ? void 0 : onMessageSeen({ lastMessage: message, conversationId, userId });
        isProcessingRef.current = false;
      }
    },
    [userId, conversationId, markMessageAsSeen, onMessageSeen]
  );
  useEffect4(() => {
    if (!messages.length || !onMessageSeen) {
      return;
    }
    const lastMessage = messages[messages.length - 1];
    markLastMessageAsSeen(lastMessage);
  }, [messages, markLastMessageAsSeen]);
  const scrollManager = {
    contentRef,
    scrollToBottom,
    isAtBottom
  };
  return /* @__PURE__ */ jsx2(
    ChatContext.Provider,
    {
      value: {
        userId,
        messages,
        loadingSendMessage,
        loadingMore,
        hasMore,
        typingUsers,
        participants,
        config: mergedConfig,
        isLoading,
        totalMessages,
        sendMessage,
        loadMoreMessages,
        updateTypingStatus: updatePusherTypingStatus,
        getParticipant,
        scrollManager,
        currentMessagesCount: messages.length
      },
      children
    }
  );
};

// src/client/components/Chat/style.ts
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
var Content = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: "auto",
  backgroundColor: theme.palette.background.paper,
  "&::-webkit-scrollbar": {
    width: "8px"
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px"
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
    "&:hover": {
      background: theme.palette.primary.dark
    }
  }
}));
var WaitingMessageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
  gap: theme.spacing(2)
}));
var WaitingMessageEmoji = styled(Box)(({ theme }) => ({
  fontSize: "3rem",
  marginBottom: theme.spacing(2)
}));
var WaitingMessageTitle = styled(Box)(({ theme }) => ({
  fontSize: "1.5rem",
  margin: 0,
  color: theme.palette.text.primary
}));
var WaitingMessageText = styled(Box)(({ theme }) => ({
  fontSize: "1rem",
  maxWidth: "400px",
  lineHeight: 1.5
}));

// src/client/components/Chat/components/ChatActions/style.ts
import { Box as Box2, Button } from "@mui/material";
import { styled as styled2 } from "@mui/material/styles";
var ActionsContainer = styled2(Box2)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  zIndex: 1
}));
var ScrollButton = styled2(Button)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark
  },
  boxShadow: theme.shadows[2],
  width: "40px",
  height: "40px",
  minWidth: "40px",
  padding: 0,
  borderRadius: "50%",
  backdropFilter: "blur(8px)",
  border: `1px solid ${theme.palette.primary.dark}33`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

// src/client/components/Chat/components/ChatActions/index.tsx
import { useEffect as useEffect5, useState as useState2 } from "react";
import { Fade } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { jsx as jsx3 } from "react/jsx-runtime";
var ChatActions = () => {
  const { scrollManager } = useChatContext();
  const { scrollToBottom, isAtBottom } = scrollManager;
  const [showButton, setShowButton] = useState2(false);
  useEffect5(() => {
    let timeoutId;
    if (!isAtBottom) {
      timeoutId = setTimeout(() => {
        setShowButton(true);
      }, 500);
    } else {
      timeoutId = setTimeout(() => {
        setShowButton(false);
      }, 100);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAtBottom]);
  return /* @__PURE__ */ jsx3(ActionsContainer, { children: /* @__PURE__ */ jsx3(Fade, { in: showButton, children: /* @__PURE__ */ jsx3(
    ScrollButton,
    {
      onClick: () => scrollToBottom("smooth"),
      variant: "contained",
      children: /* @__PURE__ */ jsx3(KeyboardArrowDownIcon, {})
    }
  ) }) });
};

// src/client/components/Chat/components/LoadMoreMessages/style.ts
import { Box as Box3, Button as Button2 } from "@mui/material";
import { styled as styled3 } from "@mui/material/styles";
var LoadMoreContainer = styled3(Box3)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2)
}));
var LoadMoreButton = styled3(Button2)(({ theme }) => ({
  borderRadius: "20px",
  textTransform: "none",
  minWidth: "150px",
  maxWidth: "100%",
  fontSize: "0.9rem",
  padding: "6px 16px",
  [theme.breakpoints.up("sm")]: {
    minWidth: "180px",
    fontSize: "0.9rem",
    padding: "6px 16px"
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "150px",
    fontSize: "0.8rem",
    padding: "4px 8px"
  }
}));

// src/client/components/Chat/components/LoadMoreMessages/index.tsx
import { CircularProgress } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRef as useRef4 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var LoadMoreMessages = () => {
  const {
    isLoading,
    loadingMore,
    hasMore,
    totalMessages,
    currentMessagesCount,
    loadMoreMessages,
    scrollManager
  } = useChatContext();
  const previousScrollHeight = useRef4(0);
  const previousScrollTop = useRef4(0);
  const handleLoadMore = async () => {
    if (scrollManager.contentRef.current) {
      previousScrollHeight.current = scrollManager.contentRef.current.scrollHeight;
      previousScrollTop.current = scrollManager.contentRef.current.scrollTop;
    }
    await loadMoreMessages();
    if (scrollManager.contentRef.current) {
      requestAnimationFrame(() => {
        var _a;
        const newScrollHeight = ((_a = scrollManager.contentRef.current) == null ? void 0 : _a.scrollHeight) || 0;
        const scrollDiff = newScrollHeight - previousScrollHeight.current;
        if (scrollManager.contentRef.current) {
          scrollManager.contentRef.current.scrollTop = previousScrollTop.current + scrollDiff;
        }
      });
    }
  };
  if (!hasMore || isLoading || totalMessages !== void 0 && currentMessagesCount >= totalMessages)
    return null;
  return /* @__PURE__ */ jsx4(LoadMoreContainer, { children: /* @__PURE__ */ jsx4(
    LoadMoreButton,
    {
      variant: "outlined",
      onClick: handleLoadMore,
      disabled: loadingMore,
      startIcon: loadingMore ? /* @__PURE__ */ jsx4(CircularProgress, { size: 20 }) : /* @__PURE__ */ jsx4(KeyboardArrowUpIcon, {}),
      children: loadingMore ? "Chargement..." : "Messages plus anciens"
    }
  ) });
};

// src/client/components/Chat/components/MessageInput/style.ts
import { Box as Box4, InputBase } from "@mui/material";
import { styled as styled4 } from "@mui/material/styles";
var InputContainer = styled4(Box4)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1)
  }
}));
var StyledInput = styled4(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.background.default,
  borderRadius: 20,
  fontSize: "0.9rem",
  "& input": {
    padding: theme.spacing(0.5, 0)
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0.5, 1.5)
  }
}));

// src/client/components/Chat/components/MessageInput/index.tsx
import { useEffect as useEffect6, useRef as useRef7, useState as useState6 } from "react";
import { Box as Box9 } from "@mui/material";
import { Button as Button3 } from "@mui/material";

// src/client/components/Chat/components/EmojiPicker/index.tsx
import { Box as Box5, IconButton, Popover } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useState as useState3 } from "react";
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
var EmojiPickerComponent = ({
  onEmojiClick,
  disabled = false
}) => {
  const [anchorEl, setAnchorEl] = useState3(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEmojiClick = (emojiData) => {
    onEmojiClick(emojiData.emoji);
    handleClose();
  };
  const open = Boolean(anchorEl);
  return /* @__PURE__ */ jsxs(Box5, { children: [
    /* @__PURE__ */ jsx5(
      IconButton,
      {
        disabled,
        onClick: handleClick,
        size: "small",
        sx: {
          color: "text.secondary",
          "&:hover": {
            color: "primary.main"
          }
        },
        children: /* @__PURE__ */ jsx5(SentimentSatisfiedAltIcon, {})
      }
    ),
    /* @__PURE__ */ jsx5(
      Popover,
      {
        open,
        anchorEl,
        onClose: handleClose,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        },
        transformOrigin: {
          vertical: "bottom",
          horizontal: "left"
        },
        children: /* @__PURE__ */ jsx5(
          EmojiPicker,
          {
            onEmojiClick: handleEmojiClick,
            width: 300,
            height: 400,
            searchPlaceholder: "Rechercher un emoji..."
          }
        )
      }
    )
  ] });
};
var EmojiPicker_default = EmojiPickerComponent;

// src/client/components/Chat/components/FileList/index.tsx
import { Box as Box6, Chip } from "@mui/material";
import { jsx as jsx6 } from "react/jsx-runtime";
var FileList = ({ attachments, onRemoveFile }) => {
  if (attachments.length === 0) return null;
  return /* @__PURE__ */ jsx6(
    Box6,
    {
      sx: {
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider"
      },
      children: attachments.map((attachment, index) => /* @__PURE__ */ jsx6(
        Chip,
        {
          label: attachment.name,
          onDelete: () => onRemoveFile(attachment),
          size: "small",
          sx: {
            maxWidth: 200,
            position: "relative",
            zIndex: 1,
            "&:hover": {
              zIndex: 2
            },
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            },
            "& .MuiChip-deleteIcon": {
              zIndex: 3
            }
          }
        },
        index
      ))
    }
  );
};
var FileList_default = FileList;

// src/client/components/Chat/components/FilePicker/index.tsx
import { Box as Box7, IconButton as IconButton2 } from "@mui/material";
import { useRef as useRef5, useState as useState4 } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
function FilePicker({
  onFilesSelect,
  disabled = false
}) {
  const [anchorEl, setAnchorEl] = useState4(null);
  const fileInputRef = useRef5(null);
  const handleClick = (event) => {
    var _a;
    setAnchorEl(event.currentTarget);
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFileChange = (event) => {
    const attachments = event.target.files;
    if (attachments && attachments.length > 0) {
      onFilesSelect(Array.from(attachments));
    }
    handleClose();
  };
  const open = Boolean(anchorEl);
  return /* @__PURE__ */ jsxs2(Box7, { children: [
    /* @__PURE__ */ jsx7(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        onChange: handleFileChange,
        multiple: true,
        style: { display: "none" }
      }
    ),
    /* @__PURE__ */ jsx7(
      IconButton2,
      {
        onClick: handleClick,
        size: "small",
        sx: {
          color: "text.secondary",
          "&:hover": {
            color: "primary.main"
          }
        },
        disabled,
        children: /* @__PURE__ */ jsx7(AttachFileIcon, {})
      }
    )
  ] });
}

// src/client/components/Chat/components/MessageInput/index.tsx
import SendIcon from "@mui/icons-material/Send";

// src/client/components/Chat/components/VoiceRecorder/index.tsx
import { Box as Box8, CircularProgress as CircularProgress2, IconButton as IconButton3 } from "@mui/material";
import { useRef as useRef6, useState as useState5 } from "react";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
function VoiceRecorder({
  onRecordingComplete,
  disabled = false
}) {
  const [isRecording, setIsRecording] = useState5(false);
  const [recordingTime, setRecordingTime] = useState5(0);
  const mediaRecorderRef = useRef6(null);
  const timerRef = useRef6();
  const audioChunksRef = useRef6([]);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm"
        });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
        setRecordingTime(0);
      };
      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1e3);
    } catch (error) {
      console.error("Erreur lors de l'acc\xE8s au microphone:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  const formatTime2 = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return /* @__PURE__ */ jsxs3(Box8, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
    /* @__PURE__ */ jsx8(
      IconButton3,
      {
        onClick: isRecording ? stopRecording : startRecording,
        size: "small",
        sx: {
          color: isRecording ? "error.main" : "text.secondary",
          "&:hover": {
            color: isRecording ? "error.dark" : "primary.main"
          }
        },
        disabled,
        children: isRecording ? /* @__PURE__ */ jsx8(StopIcon, {}) : /* @__PURE__ */ jsx8(MicIcon, {})
      }
    ),
    isRecording && /* @__PURE__ */ jsxs3(Box8, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
      /* @__PURE__ */ jsx8(CircularProgress2, { size: 16, color: "error" }),
      /* @__PURE__ */ jsx8("span", { style: { fontSize: "0.8rem", color: "error.main" }, children: formatTime2(recordingTime) })
    ] })
  ] });
}

// src/client/components/Chat/components/MessageInput/index.tsx
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
function MessageInput() {
  const { sendMessage, updateTypingStatus, config, loadingSendMessage } = useChatContext();
  const inputRef = useRef7(null);
  const [message, setMessage] = useState6("");
  const [isTyping, setIsTyping] = useState6(false);
  const typingTimeoutRef = useRef7();
  const isTypingDisabledRef = useRef7(false);
  const [selectedFiles, setSelectedFiles] = useState6([]);
  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.trim() || selectedFiles.length > 0) {
      clearTypingTimeout();
      isTypingDisabledRef.current = true;
      setIsTyping(false);
      updateTypingStatus(false);
      sendMessage({
        content: trimmedMessage,
        attachments: selectedFiles,
        createdAt: /* @__PURE__ */ new Date()
      }).finally(() => {
        setMessage("");
        setSelectedFiles([]);
        setTimeout(() => {
          var _a;
          (_a = inputRef.current) == null ? void 0 : _a.focus();
        }, 0);
      });
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };
  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
  };
  const handleMessageChange = (e) => {
    const newValue = e.target.value;
    const capitalizedValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
    setMessage(capitalizedValue);
    if (newValue.length > 0) {
      isTypingDisabledRef.current = false;
      if (!isTyping) {
        setIsTyping(true);
        updateTypingStatus(true);
      }
    }
  };
  useEffect6(() => {
    const newIsTyping = message.length > 0 && !isTypingDisabledRef.current;
    if (newIsTyping !== isTyping) {
      setIsTyping(newIsTyping);
      updateTypingStatus(newIsTyping);
    }
  }, [message, isTyping, updateTypingStatus]);
  const handleBlur = () => {
    clearTypingTimeout();
    typingTimeoutRef.current = setTimeout(() => {
      isTypingDisabledRef.current = true;
      setIsTyping(false);
      updateTypingStatus(false);
    }, config == null ? void 0 : config.typingTimeout);
  };
  const handleFocus = () => {
    if (typingTimeoutRef.current) {
      return;
    }
    isTypingDisabledRef.current = false;
    if (message.length > 0) {
      setIsTyping(true);
      updateTypingStatus(true);
    }
  };
  useEffect6(() => {
    return () => {
      clearTypingTimeout();
    };
  }, []);
  const handleFilesSelect = (attachments) => {
    setSelectedFiles((prev) => [...prev, ...attachments]);
  };
  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };
  const handleVoiceRecording = (audioBlob) => {
    const audioFile = new File(
      [audioBlob],
      `voice-message-${Date.now()}.webm`,
      {
        type: "audio/webm"
      }
    );
    setSelectedFiles((prev) => [...prev, audioFile]);
  };
  return /* @__PURE__ */ jsxs4(Box9, { children: [
    /* @__PURE__ */ jsx9(FileList_default, { attachments: selectedFiles, onRemoveFile: handleRemoveFile }),
    /* @__PURE__ */ jsxs4(InputContainer, { children: [
      (config == null ? void 0 : config.activeEmoji) && /* @__PURE__ */ jsx9(
        EmojiPicker_default,
        {
          onEmojiClick: handleEmojiClick,
          disabled: loadingSendMessage
        }
      ),
      (config == null ? void 0 : config.activeFile) && /* @__PURE__ */ jsx9(
        FilePicker,
        {
          onFilesSelect: handleFilesSelect,
          disabled: loadingSendMessage
        }
      ),
      (config == null ? void 0 : config.activeVoice) && /* @__PURE__ */ jsx9(
        VoiceRecorder,
        {
          onRecordingComplete: handleVoiceRecording,
          disabled: loadingSendMessage
        }
      ),
      /* @__PURE__ */ jsx9(
        StyledInput,
        {
          inputProps: { ref: inputRef },
          disabled: loadingSendMessage,
          fullWidth: true,
          placeholder: "\xC9crivez un message...",
          value: message,
          onChange: handleMessageChange,
          onFocus: handleFocus,
          onBlur: handleBlur,
          onKeyDown: handleKeyPress,
          multiline: true,
          autoFocus: true,
          maxRows: 4
        }
      ),
      /* @__PURE__ */ jsx9(
        Button3,
        {
          loading: loadingSendMessage,
          size: "small",
          onClick: handleSend,
          color: "primary",
          sx: {
            minWidth: { xs: "36px", sm: "48px" },
            height: { xs: "36px", sm: "48px" }
          },
          children: /* @__PURE__ */ jsx9(SendIcon, { fontSize: "small" })
        }
      )
    ] })
  ] });
}

// src/client/components/Chat/components/MessageList/index.tsx
import "moment/locale/fr";
import { Box as Box19, CircularProgress as CircularProgress3, Typography as Typography8 } from "@mui/material";

// src/client/components/Chat/components/MessageList/styles.ts
import { Box as Box10, Dialog, Link, Typography } from "@mui/material";
import { styled as styled5 } from "@mui/material/styles";
var MessageContainer = styled5(Box10)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
  overflowX: "hidden",
  overflowY: "auto",
  "&.loading": {
    overflow: "hidden"
  }
}));
var MessageTime = styled5(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center"
}));
var MessageGroup = styled5(Box10)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(2),
  width: "100%",
  overflow: "hidden"
}));
var SystemMessage = styled5(Box10)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  margin: theme.spacing(2, 0),
  "&::before, &::after": {
    content: '""',
    flex: 1,
    height: "1px",
    backgroundColor: theme.palette.divider,
    margin: theme.spacing(0, 2),
    opacity: 0.5
  }
}));
var MessageContent = styled5(Box10)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "flex-start",
  width: "100%",
  overflow: "hidden"
}));
var AudioContainer = styled5(Box10)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  overflow: "hidden",
  boxSizing: "border-box"
}));
var AudioProgress = styled5(Box10)(({ theme }) => ({
  flex: 1,
  height: 6,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 3,
  position: "relative",
  overflow: "hidden",
  minWidth: 0
}));
var AudioProgressBar = styled5(Box10)(
  ({ theme, progress }) => ({
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: `${progress}%`,
    backgroundColor: theme.palette.primary.main,
    transition: "width 0.1s linear"
  })
);
var ImageContainer = styled5(Box10)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxHeight: "300px",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  cursor: "pointer",
  "&:hover": {
    "& .image-overlay": {
      opacity: 1
    }
  }
}));
var StyledImage = styled5("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover"
});
var ImageOverlay = styled5(Box10)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.2s ease-in-out"
}));
var StyledDialog = styled5(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    maxWidth: "100vw",
    maxHeight: "100vh",
    margin: 0,
    borderRadius: 0,
    overflow: "hidden"
  },
  "& .MuiDialog-container": {
    overflow: "hidden"
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.9)"
  }
}));
var ViewerImageContainer = styled5(Box10)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  overflow: "hidden"
}));
var ViewerImage = styled5("img")(
  ({ scale }) => ({
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    transform: `scale(${scale})`,
    transition: "transform 0.2s ease-in-out"
  })
);
var ControlsContainer = styled5(Box10)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: theme.spacing(1),
  zIndex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius
}));
var FileContainer = styled5(Box10)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`
}));
var FileLink = styled5(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
  textDecoration: "none",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    textDecoration: "none"
  }
}));
var FileName = styled5(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "200px"
}));
var IconWrapper = styled5("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px"
}));

// src/client/components/Chat/components/MessageBubble/index.tsx
import { Box as Box16, Link as Link4, Typography as Typography6 } from "@mui/material";

// src/client/components/Chat/components/MessageBubble/style.ts
import { Box as Box11 } from "@mui/material";
import { styled as styled6 } from "@mui/material/styles";
var StyledMessageBubble = styled6(Box11, {
  shouldForwardProp: (prop) => prop !== "isCurrentUser" && prop !== "userColor" && prop !== "hasSpecialContent" && prop !== "hasAudio"
})(
  ({
    theme,
    isCurrentUser,
    userColor,
    hasSpecialContent = false,
    hasAudio = false
  }) => ({
    position: "relative",
    padding: theme.spacing(1.5, 2),
    borderRadius: isCurrentUser ? `${theme.spacing(2)} 0 ${theme.spacing(2)} ${theme.spacing(2)}` : `0 ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)}`,
    width: hasAudio ? "calc(100% - 48px)" : "fit-content",
    maxWidth: hasAudio ? "calc(100% - 48px)" : "70%",
    wordBreak: "break-word",
    marginBottom: theme.spacing(1),
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
    backgroundColor: isCurrentUser ? theme.palette.primary.main : userColor || theme.palette.grey[100],
    color: isCurrentUser ? theme.palette.primary.contrastText : "inherit",
    textAlign: "left",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      width: 0,
      height: 0,
      border: "6px solid transparent",
      borderBottom: 0,
      [isCurrentUser ? "right" : "left"]: 12,
      borderTopColor: isCurrentUser ? theme.palette.primary.main : userColor || theme.palette.grey[100]
    },
    [theme.breakpoints.up("sm")]: {
      width: hasAudio ? "70%" : "fit-content",
      maxWidth: "70%"
    }
  })
);
var LinkContainer = styled6(Box11)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "& .MuiSvgIcon-root": {
    fontSize: "0.9em",
    cursor: "pointer"
  }
}));

// src/client/components/Chat/components/MessageBubble/index.tsx
import LinkIcon from "@mui/icons-material/Link";

// src/client/utils/fileUtils.ts
var isImage = (fileName) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
};
var isAudio = (fileName) => {
  const audioExtensions = [".mp3", ".wav", ".ogg", ".webm"];
  return audioExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
};

// src/client/components/Chat/components/MessageList/AudioMessage.tsx
import { Box as Box12, IconButton as IconButton4, Typography as Typography3 } from "@mui/material";
import { useRef as useRef8, useState as useState7 } from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
var formatTime = (seconds) => {
  if (!isFinite(seconds) || isNaN(seconds)) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
var AudioMessage = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState7(false);
  const [currentTime, setCurrentTime] = useState7(0);
  const [duration, setDuration] = useState7(0);
  const audioRef = useRef8(null);
  const handlePlayPause = () => {
    var _a, _b;
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.addEventListener("error", (e) => {
        console.error("Erreur de chargement audio:", e);
      });
      audioRef.current.addEventListener("durationchange", () => {
        if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
          setDuration(audioRef.current.duration);
        }
      });
      audioRef.current.addEventListener("progress", () => {
        if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
          setDuration(audioRef.current.duration);
        }
      });
      audioRef.current.load();
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
    if (isPlaying) {
      (_a = audioRef.current) == null ? void 0 : _a.pause();
    } else {
      (_b = audioRef.current) == null ? void 0 : _b.play();
    }
    setIsPlaying(!isPlaying);
  };
  const progress = duration > 0 ? currentTime / duration * 100 : 0;
  return /* @__PURE__ */ jsxs5(AudioContainer, { children: [
    /* @__PURE__ */ jsx10(
      IconButton4,
      {
        size: "medium",
        onClick: handlePlayPause,
        sx: {
          color: "primary.main",
          "&:hover": {
            backgroundColor: "action.hover"
          },
          flexShrink: 0,
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 }
        },
        children: isPlaying ? /* @__PURE__ */ jsx10(PauseIcon, {}) : /* @__PURE__ */ jsx10(PlayArrowIcon, {})
      }
    ),
    /* @__PURE__ */ jsxs5(Box12, { sx: { flex: 1, minWidth: 0, pr: 1, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx10(AudioProgress, { children: /* @__PURE__ */ jsx10(AudioProgressBar, { progress }) }),
      /* @__PURE__ */ jsxs5(
        Box12,
        {
          sx: {
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            width: "100%",
            gap: 1
          },
          children: [
            /* @__PURE__ */ jsx10(
              Typography3,
              {
                variant: "caption",
                color: "text.secondary",
                sx: {
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  minWidth: { xs: "30px", sm: "40px" }
                },
                children: formatTime(currentTime)
              }
            ),
            /* @__PURE__ */ jsx10(
              Typography3,
              {
                variant: "caption",
                color: "text.secondary",
                sx: {
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  minWidth: { xs: "30px", sm: "40px" },
                  textAlign: "right"
                },
                children: formatTime(duration)
              }
            )
          ]
        }
      )
    ] })
  ] });
};

// src/client/components/Chat/components/MessageList/ImageFile.tsx
import { Typography as Typography4 } from "@mui/material";

// src/client/components/Chat/components/MessageList/ImageViewer.tsx
import { IconButton as IconButton5, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import React4 from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
var ImageViewer = ({
  open,
  onClose,
  imageUrl,
  imageName
}) => {
  const [scale, setScale] = React4.useState(1);
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };
  const handleClose = () => {
    setScale(1);
    onClose();
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return /* @__PURE__ */ jsx11(
    StyledDialog,
    {
      open,
      onClose: handleClose,
      fullScreen: true,
      onClick: handleClose,
      disableEnforceFocus: true,
      disableAutoFocus: true,
      children: /* @__PURE__ */ jsxs6(ViewerImageContainer, { onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxs6(ControlsContainer, { children: [
          /* @__PURE__ */ jsx11(Tooltip, { title: "Zoom avant", children: /* @__PURE__ */ jsx11(IconButton5, { onClick: handleZoomIn, sx: { color: "white" }, children: /* @__PURE__ */ jsx11(ZoomInIcon, {}) }) }),
          /* @__PURE__ */ jsx11(Tooltip, { title: "Zoom arri\xE8re", children: /* @__PURE__ */ jsx11(IconButton5, { onClick: handleZoomOut, sx: { color: "white" }, children: /* @__PURE__ */ jsx11(ZoomOutIcon, {}) }) }),
          /* @__PURE__ */ jsx11(Tooltip, { title: "T\xE9l\xE9charger", children: /* @__PURE__ */ jsx11(IconButton5, { onClick: handleDownload, sx: { color: "white" }, children: /* @__PURE__ */ jsx11(DownloadIcon, {}) }) }),
          /* @__PURE__ */ jsx11(Tooltip, { title: "Fermer", children: /* @__PURE__ */ jsx11(IconButton5, { onClick: handleClose, sx: { color: "white" }, children: /* @__PURE__ */ jsx11(CloseIcon, {}) }) })
        ] }),
        /* @__PURE__ */ jsx11(
          ViewerImage,
          {
            src: imageUrl,
            alt: imageName,
            scale,
            onClick: (e) => e.stopPropagation()
          }
        )
      ] })
    }
  );
};

// src/client/components/Chat/components/MessageList/ImageFile.tsx
import React5 from "react";
import { Fragment, jsx as jsx12, jsxs as jsxs7 } from "react/jsx-runtime";
var ImageFile = ({ url, name, onLoad }) => {
  const [isViewerOpen, setIsViewerOpen] = React5.useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setIsViewerOpen(true);
  };
  return /* @__PURE__ */ jsxs7(Fragment, { children: [
    /* @__PURE__ */ jsxs7(ImageContainer, { onClick: handleClick, children: [
      /* @__PURE__ */ jsx12(StyledImage, { src: url, alt: name, onLoad }),
      /* @__PURE__ */ jsx12(ImageOverlay, { className: "image-overlay", children: /* @__PURE__ */ jsx12(Typography4, { variant: "body2", color: "white", children: "Cliquez pour agrandir" }) })
    ] }),
    /* @__PURE__ */ jsx12(
      ImageViewer,
      {
        open: isViewerOpen,
        onClose: () => setIsViewerOpen(false),
        imageUrl: url,
        imageName: name
      }
    )
  ] });
};

// src/client/components/Chat/components/MessageList/RegularFile.tsx
import { Box as Box15 } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { jsx as jsx13, jsxs as jsxs8 } from "react/jsx-runtime";
var RegularFile = ({ name, url }) => {
  return /* @__PURE__ */ jsxs8(FileContainer, { children: [
    /* @__PURE__ */ jsx13(IconWrapper, { children: /* @__PURE__ */ jsx13(InsertDriveFileIcon, {}) }),
    /* @__PURE__ */ jsx13(Box15, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsx13(FileLink, { href: url, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx13(FileName, { variant: "body2", noWrap: true, children: name }) }) })
  ] });
};

// src/client/components/Chat/components/MessageList/MessageFiles.tsx
import { jsx as jsx14 } from "react/jsx-runtime";
var MessageFiles = ({
  attachments,
  onImageLoad
}) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx14(FileContainer, { children: attachments.map((attachment, index) => {
    if (isImage(attachment.name)) {
      return /* @__PURE__ */ jsx14(
        ImageFile,
        {
          url: attachment.url,
          name: attachment.name,
          onLoad: onImageLoad
        },
        index
      );
    } else if (isAudio(attachment.name)) {
      return /* @__PURE__ */ jsx14(AudioMessage, { url: attachment.url }, index);
    } else {
      return /* @__PURE__ */ jsx14(
        RegularFile,
        {
          url: attachment.url,
          name: attachment.name
        },
        index
      );
    }
  }) });
};

// src/client/components/Chat/components/MessageBubble/index.tsx
import React6 from "react";
import { jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
var detectUrls = (text, isCurrentUser) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  const matches = Array.from(text.matchAll(urlRegex)).map((match) => match[0]);
  return parts.map((part, index) => {
    if (matches.includes(part)) {
      return /* @__PURE__ */ jsxs9(LinkContainer, { children: [
        /* @__PURE__ */ jsx15(
          Link4,
          {
            href: part,
            target: "_blank",
            rel: "noopener noreferrer",
            underline: "hover",
            sx: {
              color: isCurrentUser ? "inherit" : "primary.main",
              "&:hover": {
                color: isCurrentUser ? "inherit" : "primary.dark"
              }
            },
            children: part
          }
        ),
        /* @__PURE__ */ jsx15(
          LinkIcon,
          {
            onClick: () => window.open(part, "_blank", "noopener,noreferrer"),
            sx: {
              color: isCurrentUser ? "inherit" : "primary.main",
              opacity: 0.8,
              "&:hover": {
                opacity: 1
              }
            }
          }
        )
      ] }, index);
    }
    return /* @__PURE__ */ jsx15(React6.Fragment, { children: part }, index);
  });
};
var MessageBubble = ({
  isCurrentUser,
  userColor,
  hasSpecialContent,
  hasAudio,
  content,
  attachments,
  onImageLoad
}) => {
  return /* @__PURE__ */ jsx15(
    StyledMessageBubble,
    {
      isCurrentUser,
      userColor,
      hasSpecialContent,
      hasAudio,
      children: /* @__PURE__ */ jsxs9(Box16, { component: "div", children: [
        /* @__PURE__ */ jsx15(
          Typography6,
          {
            component: "span",
            variant: "body1",
            sx: { whiteSpace: "pre-wrap" },
            children: detectUrls(content, isCurrentUser)
          }
        ),
        attachments && /* @__PURE__ */ jsx15(MessageFiles, { attachments, onImageLoad })
      ] })
    }
  );
};

// src/client/components/Chat/components/MessageList/index.tsx
import React8 from "react";

// src/client/components/Chat/components/SeenBy/index.tsx
import { Box as Box18, Tooltip as Tooltip2, Typography as Typography7 } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// src/client/components/Chat/components/SeenBy/style.ts
import { Box as Box17 } from "@mui/material";
import { styled as styled7 } from "@mui/material/styles";
var SeenContainer = styled7(Box17)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "& .MuiSvgIcon-root": {
    fontSize: "1rem",
    color: theme.palette.text.secondary
  }
}));

// src/client/components/Chat/components/SeenBy/index.tsx
import moment from "moment";
import { jsx as jsx16, jsxs as jsxs10 } from "react/jsx-runtime";
var SeenBy = ({
  message,
  userId,
  getParticipant,
  totalParticipants
}) => {
  var _a;
  if (!((_a = message.seenBy) == null ? void 0 : _a.length)) return null;
  const seenParticipants = message.seenBy.filter((seen) => seen.userId !== userId).map((seen) => __spreadProps(__spreadValues({}, getParticipant(seen.userId)), {
    seenAt: seen.seenAt
  }));
  if (seenParticipants.length === 0) return null;
  const allParticipantsHaveSeen = seenParticipants.length === totalParticipants - 1;
  const tooltipContent = /* @__PURE__ */ jsx16(Box18, { children: seenParticipants.map((participant) => /* @__PURE__ */ jsxs10(
    Typography7,
    {
      variant: "caption",
      sx: { display: "block" },
      children: [
        participant.name,
        " - ",
        moment(participant.seenAt).isBefore(moment().subtract(1, "day")) ? moment(participant.seenAt).format("DD/MM/YYYY HH:mm") : moment(participant.seenAt).format("HH:mm")
      ]
    },
    participant.id
  )) });
  return /* @__PURE__ */ jsx16(SeenContainer, { children: /* @__PURE__ */ jsx16(Tooltip2, { title: tooltipContent, children: allParticipantsHaveSeen ? /* @__PURE__ */ jsx16(CheckCircleIcon, {}) : /* @__PURE__ */ jsx16(CheckCircleOutlineIcon, {}) }) });
};

// src/client/components/Chat/components/UserAvatar/index.tsx
import { Avatar, Tooltip as Tooltip3 } from "@mui/material";
import React7 from "react";
import { jsx as jsx17 } from "react/jsx-runtime";
var UserAvatar = React7.forwardRef(
  ({ user, size = 32 }, ref) => {
    const getInitials = (name) => {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };
    return /* @__PURE__ */ jsx17(Tooltip3, { title: user.name, arrow: true, placement: "top", children: /* @__PURE__ */ jsx17(
      Avatar,
      {
        ref,
        src: user.avatar,
        alt: user.name,
        sx: {
          width: size,
          height: size,
          bgcolor: "grey.300",
          fontSize: `${size * 0.4}px`,
          cursor: "pointer"
        },
        children: !user.avatar && getInitials(user.name)
      }
    ) });
  }
);
UserAvatar.displayName = "UserAvatar";

// src/client/utils/color.ts
var generateColorFromId = (id) => {
  const hash = id.split("").reduce((acc, char) => {
    const charCode = char.charCodeAt(0);
    return (acc << 5) - acc + charCode;
  }, 0);
  const goldenRatio = 0.618033988749895;
  const hue = hash * goldenRatio % 360;
  return `hsl(${hue}, 85%, 75%)`;
};

// src/client/components/Chat/components/MessageList/index.tsx
import moment2 from "moment";
import { jsx as jsx18, jsxs as jsxs11 } from "react/jsx-runtime";
moment2.locale("fr");
var MessageList = () => {
  const {
    messages,
    participants,
    getParticipant,
    isLoading,
    config,
    userId,
    scrollManager
  } = useChatContext();
  const messageEndRef = React8.useRef(null);
  const containerRef = React8.useRef(null);
  const [shouldShowContent, setShouldShowContent] = React8.useState(false);
  const isFirstLoadRef = React8.useRef(true);
  React8.useEffect(() => {
    if (!isLoading) {
      setShouldShowContent(true);
    } else {
      setShouldShowContent(false);
    }
  }, [isLoading]);
  React8.useEffect(() => {
    if (shouldShowContent && isFirstLoadRef.current && messages.length > 0) {
      const checkAndScroll = () => {
        if (containerRef.current) {
          const containerHeight = containerRef.current.scrollHeight;
          if (containerHeight > 0) {
            scrollManager.scrollToBottom("instant");
            isFirstLoadRef.current = false;
          } else {
            requestAnimationFrame(checkAndScroll);
          }
        }
      };
      requestAnimationFrame(checkAndScroll);
    }
  }, [shouldShowContent, messages.length, scrollManager]);
  if (isLoading || !shouldShowContent) {
    return /* @__PURE__ */ jsx18(
      Box19,
      {
        sx: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "200px"
        },
        children: /* @__PURE__ */ jsx18(CircularProgress3, {})
      }
    );
  }
  if (!isLoading && messages.length === 0) {
    return /* @__PURE__ */ jsxs11(MessageContainer, { ref: containerRef, children: [
      /* @__PURE__ */ jsx18(SystemMessage, { children: /* @__PURE__ */ jsx18(
        Typography8,
        {
          variant: "body2",
          color: "text.secondary",
          sx: {
            fontStyle: "italic",
            opacity: 0.7,
            fontSize: "0.85rem"
          },
          children: (config == null ? void 0 : config.welcomeMessage) || "Aucun message pour le moment"
        }
      ) }),
      /* @__PURE__ */ jsx18("div", { ref: messageEndRef })
    ] });
  }
  return /* @__PURE__ */ jsxs11(MessageContainer, { ref: containerRef, className: isLoading ? "loading" : "", children: [
    messages.map((message, index) => {
      var _a, _b, _c, _d;
      const isCurrentUser = message.userId === userId;
      const userColor = !isCurrentUser && (config == null ? void 0 : config.activeUserColor) ? generateColorFromId(message.userId) : void 0;
      const showTime = index === messages.length - 1 || ((_a = messages[index + 1]) == null ? void 0 : _a.userId) !== message.userId || moment2((_b = messages[index + 1]) == null ? void 0 : _b.createdAt).diff(
        moment2(message.createdAt),
        "minutes"
      ) > 5;
      const hasSpecialContent = message.attachments && message.attachments.length > 0;
      const hasAudio = (_c = message.attachments) == null ? void 0 : _c.some(
        (attachment) => attachment.name.match(/\.(mp3|wav|ogg|m4a)$/i)
      );
      if (((_d = message.type) == null ? void 0 : _d.toLowerCase()) === "system") {
        return /* @__PURE__ */ jsx18(SystemMessage, { children: /* @__PURE__ */ jsx18(
          Typography8,
          {
            variant: "body2",
            color: "text.secondary",
            sx: {
              fontStyle: "italic",
              opacity: 0.7,
              fontSize: "0.85rem"
            },
            children: message.content
          }
        ) }, message.id);
      }
      return /* @__PURE__ */ jsx18(
        MessageGroup,
        {
          className: "message-group",
          "data-message-id": message.id,
          children: /* @__PURE__ */ jsxs11(MessageContent, { children: [
            !isCurrentUser && /* @__PURE__ */ jsx18(Box19, { sx: { flexShrink: 0 }, children: /* @__PURE__ */ jsx18(UserAvatar, { user: getParticipant(message.userId) }) }),
            /* @__PURE__ */ jsxs11(Box19, { sx: { display: "flex", flexDirection: "column", flex: 1 }, children: [
              /* @__PURE__ */ jsx18(
                MessageBubble,
                {
                  isCurrentUser,
                  userColor,
                  hasSpecialContent,
                  hasAudio,
                  content: message.content,
                  attachments: message.attachments
                }
              ),
              showTime && /* @__PURE__ */ jsxs11(
                MessageTime,
                {
                  variant: "caption",
                  sx: {
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start"
                  },
                  children: [
                    /* @__PURE__ */ jsx18("span", { children: moment2(new Date(message.createdAt)).isBefore(moment2().subtract(1, "day")) ? moment2(new Date(message.createdAt)).format("DD/MM/YYYY HH:mm") : moment2(new Date(message.createdAt)).format("HH:mm") }),
                    isCurrentUser && /* @__PURE__ */ jsx18(
                      SeenBy,
                      {
                        message,
                        userId,
                        getParticipant,
                        totalParticipants: participants.length
                      }
                    )
                  ]
                }
              )
            ] }),
            isCurrentUser && /* @__PURE__ */ jsx18(Box19, { sx: { flexShrink: 0 }, children: /* @__PURE__ */ jsx18(UserAvatar, { user: getParticipant(message.userId) }) })
          ] })
        },
        message.id
      );
    }),
    /* @__PURE__ */ jsx18("div", { ref: messageEndRef })
  ] });
};

// src/client/components/Chat/components/TypingIndicator/index.tsx
import { Collapse, Typography as Typography9 } from "@mui/material";
import { useEffect as useEffect7, useState as useState8 } from "react";

// src/client/components/Chat/components/TypingIndicator/styles.ts
import { Box as Box20 } from "@mui/material";
import { styled as styled8 } from "@mui/material/styles";
var Container = styled8(Box20)(({ theme }) => ({
  padding: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  height: "24px",
  display: "flex",
  alignItems: "center"
}));

// src/client/components/Chat/components/TypingIndicator/index.tsx
import { jsx as jsx19 } from "react/jsx-runtime";
var TypingIndicator = () => {
  const { typingUsers, participants, userId } = useChatContext();
  const [isVisible, setIsVisible] = useState8(false);
  const typingUsersWithoutCurrentUser = typingUsers.filter(
    (user) => user !== userId
  );
  useEffect7(() => {
    if (typingUsersWithoutCurrentUser.length > 0) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1e3);
      return () => clearTimeout(timer);
    }
  }, [typingUsersWithoutCurrentUser]);
  const getTypingUsersNames = () => {
    if (!typingUsersWithoutCurrentUser.length) return "";
    const typingParticipants = participants.filter(
      (user) => typingUsersWithoutCurrentUser.includes(user.id) && user.id !== userId
    );
    if (typingParticipants.length === 0) return "";
    const names = typingParticipants.map((user) => user.name);
    if (names.length === 1) {
      return `${names[0]} \xE9crit...`;
    } else if (names.length === 2) {
      return `${names[0]} et ${names[1]} \xE9crivent...`;
    } else {
      return `${names[0]}, ${names[1]} et ${names.length - 2} autre(s) \xE9crivent...`;
    }
  };
  const typingText = getTypingUsersNames();
  return /* @__PURE__ */ jsx19(Collapse, { in: isVisible, sx: { pl: 2 }, children: /* @__PURE__ */ jsx19(Container, { children: /* @__PURE__ */ jsx19(
    Typography9,
    {
      variant: "caption",
      color: "text.secondary",
      sx: {
        fontStyle: "italic",
        fontSize: "0.75rem",
        opacity: typingText ? 1 : 0,
        transition: "opacity 0.3s ease-in-out"
      },
      children: typingText
    }
  ) }) });
};

// src/client/components/Chat/index.tsx
import { Fragment as Fragment2, jsx as jsx20, jsxs as jsxs12 } from "react/jsx-runtime";
var ChatConversationContent = () => {
  const { scrollManager } = useChatContext();
  const { contentRef } = scrollManager;
  return /* @__PURE__ */ jsxs12(Fragment2, { children: [
    /* @__PURE__ */ jsxs12(Content, { ref: contentRef, children: [
      /* @__PURE__ */ jsx20(LoadMoreMessages, {}),
      /* @__PURE__ */ jsx20(MessageList, {})
    ] }),
    /* @__PURE__ */ jsx20(ChatActions, {}),
    /* @__PURE__ */ jsx20(TypingIndicator, {}),
    /* @__PURE__ */ jsx20(MessageInput, {})
  ] });
};
var ChatNoConversationContent = ({ buttonJoin }) => {
  return /* @__PURE__ */ jsx20(Fragment2, { children: /* @__PURE__ */ jsx20(Content, { children: buttonJoin ? buttonJoin : /* @__PURE__ */ jsxs12(WaitingMessageContainer, { children: [
    /* @__PURE__ */ jsx20(WaitingMessageEmoji, { children: "\u{1F4AD}" }),
    /* @__PURE__ */ jsx20(WaitingMessageTitle, { children: "En attente de conversation" }),
    /* @__PURE__ */ jsx20(WaitingMessageText, { children: "La conversation n'est pas encore active. Revenez bient\xF4t pour discuter !" })
  ] }) }) });
};
var Chat = (props) => {
  const _a = props, { conversationId, buttonJoin } = _a, rest = __objRest(_a, ["conversationId", "buttonJoin"]);
  if (conversationId) {
    return /* @__PURE__ */ jsx20(ChatProvider, __spreadProps(__spreadValues({}, rest), { conversationId, children: /* @__PURE__ */ jsx20(ChatConversationContent, {}) }));
  }
  return /* @__PURE__ */ jsx20(ChatNoConversationContent, { buttonJoin });
};

// src/client/components/ChatBubble/index.tsx
import { useState as useState11 } from "react";
import { Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

// src/client/components/ChatPopup/index.tsx
import React13, { useEffect as useEffect8 } from "react";

// src/client/components/ChatPopup/components/Header/index.tsx
import { Box as Box27, IconButton as IconButton9, Typography as Typography13 } from "@mui/material";
import { useState as useState10 } from "react";
import Close from "@mui/icons-material/Close";
import CloseFullscreen from "@mui/icons-material/CloseFullscreen";

// src/client/components/ChatPopup/components/Header/DocumentsMenu/index.tsx
import { Box as Box23, IconButton as IconButton6, Typography as Typography10 } from "@mui/material";

// src/client/components/ChatPopup/components/Header/DocumentsMenu/styles.ts
import { Box as Box21, List, Popover as Popover2 } from "@mui/material";
import { styled as styled9 } from "@mui/material/styles";
var StyledPopover = styled9(Popover2)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: 280,
    maxHeight: 360,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    display: "flex",
    flexDirection: "column"
  }
}));
var MenuHeader = styled9(Box21)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1
}));
var StyledList = styled9(List)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  py: 0
}));

// src/client/components/ChatPopup/components/Header/DocumentsMenu/index.tsx
import { useRef as useRef9 } from "react";
import CloseIcon2 from "@mui/icons-material/Close";

// src/client/components/FileManager/styles.ts
import { Box as Box22 } from "@mui/material";
import { styled as styled10 } from "@mui/material/styles";
var FileContainer2 = styled10(Box22)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));

// src/client/components/FileManager/FileItem.tsx
import { jsx as jsx21 } from "react/jsx-runtime";
var FileItem = ({ file, onClick }) => {
  const handleClick = (e) => {
    if (isAudio(file.name)) {
      return;
    }
    if (onClick) {
      onClick(file);
    } else {
      window.open(file.url, "_blank");
    }
  };
  return /* @__PURE__ */ jsx21(FileContainer2, { onClick: handleClick, children: isImage(file.name) ? /* @__PURE__ */ jsx21(ImageFile, { url: file.url, name: file.name }) : isAudio(file.name) ? /* @__PURE__ */ jsx21(AudioMessage, { url: file.url }) : /* @__PURE__ */ jsx21(RegularFile, { url: file.url, name: file.name }) });
};

// src/client/components/ChatPopup/components/Header/DocumentsMenu/index.tsx
import InsertDriveFileIcon2 from "@mui/icons-material/InsertDriveFile";
import { Fragment as Fragment3, jsx as jsx22, jsxs as jsxs13 } from "react/jsx-runtime";
var DocumentsMenu = ({
  allAttachments,
  open,
  onClose
}) => {
  const anchorRef = useRef9(null);
  return /* @__PURE__ */ jsxs13(Fragment3, { children: [
    /* @__PURE__ */ jsx22(
      IconButton6,
      {
        ref: anchorRef,
        size: "small",
        sx: {
          color: (theme) => theme.palette.text.secondary,
          padding: 0.5,
          "&:hover": {
            color: (theme) => theme.palette.primary.main
          }
        },
        children: /* @__PURE__ */ jsx22(InsertDriveFileIcon2, { fontSize: "small" })
      }
    ),
    /* @__PURE__ */ jsxs13(
      StyledPopover,
      {
        open,
        anchorEl: anchorRef.current,
        onClose,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "right"
        },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs13(MenuHeader, { children: [
            /* @__PURE__ */ jsxs13(Box23, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
              /* @__PURE__ */ jsx22(InsertDriveFileIcon2, { fontSize: "small", color: "primary" }),
              /* @__PURE__ */ jsxs13(Typography10, { variant: "subtitle2", fontWeight: "bold", children: [
                "Documents (",
                (allAttachments == null ? void 0 : allAttachments.length) || 0,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx22(IconButton6, { size: "small", onClick: onClose, children: /* @__PURE__ */ jsx22(CloseIcon2, { fontSize: "small" }) })
          ] }),
          /* @__PURE__ */ jsx22(StyledList, { children: (allAttachments == null ? void 0 : allAttachments.length) === 0 ? /* @__PURE__ */ jsx22(Box23, { sx: { p: 2, textAlign: "center" }, children: /* @__PURE__ */ jsx22(Typography10, { variant: "body2", color: "text.secondary", children: "Aucun document partag\xE9 dans cette conversation" }) }) : allAttachments == null ? void 0 : allAttachments.map((file, index) => /* @__PURE__ */ jsx22(FileItem, { file }, index)) })
        ]
      }
    )
  ] });
};

// src/client/components/ChatPopup/components/Header/HeaderMenu.tsx
import {
  IconButton as IconButton8,
  Menu,
  MenuItem,
  Tooltip as Tooltip4,
  Typography as Typography12
} from "@mui/material";
import { useState as useState9 } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// src/client/components/ChatPopup/components/Header/ParticipantsMenu/index.tsx
import {
  Box as Box25,
  IconButton as IconButton7,
  ListItemIcon,
  ListItemText,
  Typography as Typography11
} from "@mui/material";

// src/client/components/ChatPopup/components/Header/ParticipantsMenu/styles.ts
import { Box as Box24, List as List2, ListItem, Popover as Popover3 } from "@mui/material";
import { styled as styled11 } from "@mui/material/styles";
var StyledPopover2 = styled11(Popover3)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: 280,
    maxHeight: 360,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    display: "flex",
    flexDirection: "column"
  }
}));
var MenuHeader2 = styled11(Box24)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1
}));
var ParticipantAvatar = styled11(Box24)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "0.9rem",
  fontWeight: 500,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
}));
var StyledListItem = styled11(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));
var StyledList2 = styled11(List2)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  py: 0
}));

// src/client/components/ChatPopup/components/Header/ParticipantsMenu/index.tsx
import { useRef as useRef10 } from "react";
import GroupIcon from "@mui/icons-material/Group";
import { Fragment as Fragment4, jsx as jsx23, jsxs as jsxs14 } from "react/jsx-runtime";
var ParticipantsMenu = ({
  participants,
  renderParticipant,
  open,
  onClose
}) => {
  const anchorRef = useRef10(null);
  return /* @__PURE__ */ jsxs14(Fragment4, { children: [
    /* @__PURE__ */ jsx23(
      IconButton7,
      {
        ref: anchorRef,
        size: "small",
        sx: {
          color: (theme) => theme.palette.text.secondary,
          padding: 0.5,
          "&:hover": {
            color: (theme) => theme.palette.primary.main
          }
        },
        children: /* @__PURE__ */ jsx23(GroupIcon, { fontSize: "small" })
      }
    ),
    /* @__PURE__ */ jsxs14(
      StyledPopover2,
      {
        open,
        anchorEl: anchorRef.current,
        onClose,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "right"
        },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsx23(MenuHeader2, { children: /* @__PURE__ */ jsxs14(Box25, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
            /* @__PURE__ */ jsx23(GroupIcon, { fontSize: "small", color: "primary" }),
            /* @__PURE__ */ jsxs14(Typography11, { variant: "subtitle2", fontWeight: "bold", children: [
              "Participants (",
              participants.length,
              ")"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx23(StyledList2, { children: participants.map((participant) => /* @__PURE__ */ jsxs14(StyledListItem, { children: [
            /* @__PURE__ */ jsx23(ListItemIcon, { sx: { minWidth: 36 }, children: renderParticipant ? renderParticipant(participant) : /* @__PURE__ */ jsx23(ParticipantAvatar, { children: /* @__PURE__ */ jsx23(
              Typography11,
              {
                variant: "caption",
                sx: { fontSize: "0.9rem", fontWeight: 500 },
                children: participant.name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2)
              }
            ) }) }),
            /* @__PURE__ */ jsx23(
              ListItemText,
              {
                primary: /* @__PURE__ */ jsx23(Typography11, { variant: "body2", fontWeight: 500, children: participant.name })
              }
            )
          ] }, participant.id)) })
        ]
      }
    )
  ] });
};

// src/client/components/ChatPopup/components/Header/HeaderMenu.tsx
import { Fragment as Fragment5, jsx as jsx24, jsxs as jsxs15 } from "react/jsx-runtime";
var HeaderMenu = ({
  participants,
  renderParticipant,
  allAttachments
}) => {
  const [anchorEl, setAnchorEl] = useState9(null);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState9(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState9(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsDocumentsOpen(false);
    setIsParticipantsOpen(false);
  };
  const handleDocumentClick = (e) => {
    setIsDocumentsOpen(true);
    setIsParticipantsOpen(false);
  };
  const handleParticipantsClick = (e) => {
    e.stopPropagation();
    setIsParticipantsOpen(true);
    setIsDocumentsOpen(false);
  };
  const handleDocumentClose = () => {
    setIsDocumentsOpen(false);
  };
  const handleParticipantsClose = () => {
    setIsParticipantsOpen(false);
  };
  return /* @__PURE__ */ jsxs15(Fragment5, { children: [
    /* @__PURE__ */ jsx24(Tooltip4, { title: "Options", children: /* @__PURE__ */ jsx24(
      IconButton8,
      {
        onClick: handleClick,
        size: "small",
        sx: {
          color: (theme) => theme.palette.text.secondary,
          padding: 0.5,
          "&:hover": {
            color: (theme) => theme.palette.primary.main
          }
        },
        children: /* @__PURE__ */ jsx24(MoreVertIcon, { fontSize: "small" })
      }
    ) }),
    /* @__PURE__ */ jsxs15(
      Menu,
      {
        anchorEl,
        open,
        onClose: handleClose,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "right"
        },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs15(MenuItem, { onClick: handleDocumentClick, children: [
            /* @__PURE__ */ jsx24(
              DocumentsMenu,
              {
                allAttachments,
                open: isDocumentsOpen,
                onClose: handleDocumentClose
              }
            ),
            /* @__PURE__ */ jsx24(Typography12, { variant: "body2", children: "Documents" })
          ] }),
          /* @__PURE__ */ jsxs15(MenuItem, { onClick: handleParticipantsClick, children: [
            /* @__PURE__ */ jsx24(
              ParticipantsMenu,
              {
                participants,
                renderParticipant,
                open: isParticipantsOpen,
                onClose: handleParticipantsClose
              }
            ),
            /* @__PURE__ */ jsx24(Typography12, { variant: "body2", children: "Participants" })
          ] })
        ]
      }
    )
  ] });
};

// src/client/components/ChatPopup/components/Header/index.tsx
import OpenInFull from "@mui/icons-material/OpenInFull";
import { styled as styled12 } from "@mui/material/styles";
import { Fragment as Fragment6, jsx as jsx25, jsxs as jsxs16 } from "react/jsx-runtime";
var HeaderContainer = styled12(Box27)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px"
}));
var UserInfo = styled12(Box27)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1)
}));
var UserAvatar2 = styled12(Box27)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "0.9rem",
  fontWeight: 500,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
}));
var UserName = styled12(Typography13)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: 600,
  margin: 0,
  lineHeight: 1.2
}));
var ActionButton = styled12(IconButton9)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: 0.5,
  "&:hover": {
    color: theme.palette.primary.main
  }
}));
var Header = ({
  title,
  onClose,
  onExpand,
  isExpanded,
  avatar,
  participants = [],
  renderParticipant,
  allAttachments,
  conversationId
}) => {
  const [isDocumentsOpen, setIsDocumentsOpen] = useState10(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState10(false);
  const handleDocumentClose = () => setIsDocumentsOpen(false);
  const handleParticipantsClose = () => setIsParticipantsOpen(false);
  const renderActionButtons = () => {
    if (isExpanded && conversationId) {
      return /* @__PURE__ */ jsxs16(Fragment6, { children: [
        /* @__PURE__ */ jsx25(ActionButton, { size: "small", onClick: () => setIsDocumentsOpen(true), children: /* @__PURE__ */ jsx25(
          DocumentsMenu,
          {
            allAttachments,
            open: isDocumentsOpen,
            onClose: handleDocumentClose
          }
        ) }),
        /* @__PURE__ */ jsx25(
          ActionButton,
          {
            size: "small",
            onClick: () => setIsParticipantsOpen(true),
            children: /* @__PURE__ */ jsx25(
              ParticipantsMenu,
              {
                participants,
                renderParticipant,
                open: isParticipantsOpen,
                onClose: handleParticipantsClose
              }
            )
          }
        )
      ] });
    }
    if (conversationId) {
      return /* @__PURE__ */ jsx25(
        HeaderMenu,
        {
          allAttachments,
          participants,
          renderParticipant
        }
      );
    }
    return null;
  };
  return /* @__PURE__ */ jsxs16(HeaderContainer, { children: [
    /* @__PURE__ */ jsxs16(UserInfo, { children: [
      avatar && /* @__PURE__ */ jsx25(UserAvatar2, { children: /* @__PURE__ */ jsx25("img", { src: avatar, alt: "title" }) }),
      /* @__PURE__ */ jsx25(Box27, { children: /* @__PURE__ */ jsx25(UserName, { variant: "subtitle1", children: title }) })
    ] }),
    /* @__PURE__ */ jsxs16(Box27, { sx: { display: "flex", gap: 1 }, children: [
      renderActionButtons(),
      onExpand && /* @__PURE__ */ jsx25(
        ActionButton,
        {
          onClick: onExpand,
          size: "small",
          sx: {
            transform: isExpanded ? "rotate(180deg)" : "none"
          },
          children: isExpanded ? /* @__PURE__ */ jsx25(CloseFullscreen, { fontSize: "small" }) : /* @__PURE__ */ jsx25(OpenInFull, { fontSize: "small" })
        }
      ),
      /* @__PURE__ */ jsx25(ActionButton, { onClick: onClose, size: "small", children: /* @__PURE__ */ jsx25(Close, { fontSize: "small" }) })
    ] })
  ] });
};
var Header_default = Header;

// src/client/components/ChatPopup/style.ts
import { Paper } from "@mui/material";
import { styled as styled13 } from "@mui/material/styles";
var StyledPaper = styled13(Paper, {
  shouldForwardProp: (prop) => prop !== "isClosing" && prop !== "isExpanded"
})(
  ({ theme, isClosing, isExpanded }) => ({
    position: "fixed",
    bottom: theme.spacing(12),
    right: theme.spacing(4),
    width: isExpanded ? "80%" : 350,
    height: isExpanded ? "80vh" : 500,
    zIndex: 1e3,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    overflow: "hidden",
    transformOrigin: "bottom right",
    borderRadius: "16px",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 0 0 1px ${theme.palette.primary.dark}33,
      0 0 0 2px ${theme.palette.primary.dark}11
    `,
    border: `1px solid ${theme.palette.primary.dark}33`,
    backdropFilter: "blur(10px)",
    background: `linear-gradient(180deg, 
      ${theme.palette.background.paper} 0%, 
      ${theme.palette.background.paper} 100%
    )`,
    transition: "all 0.3s ease-in-out",
    transform: isClosing ? "scale(0.95) translateY(20px)" : "scale(1)",
    opacity: isClosing ? 0 : 1,
    visibility: isClosing ? "hidden" : "visible",
    animation: !isClosing ? "popIn 0.3s ease-out" : "none",
    "&.loading": {
      overflow: "hidden"
    },
    "@keyframes popIn": {
      "0%": {
        transform: "scale(0.95) translateY(20px)",
        opacity: 0
      },
      "100%": {
        transform: "scale(1) translateY(0)",
        opacity: 1
      }
    }
  })
);

// src/client/components/ChatPopup/index.tsx
import { jsx as jsx26, jsxs as jsxs17 } from "react/jsx-runtime";
var ChatPopup = ({
  open,
  onClose,
  conversationId,
  title = "Chat",
  avatar,
  defaultMessages,
  participants,
  onReceiveMessage,
  onSendMessage,
  config,
  renderParticipant,
  isLoading,
  onMessageSeen,
  onLoadMoreMessages,
  allAttachments,
  totalMessages,
  buttonJoin
}) => {
  const [isClosing, setIsClosing] = React13.useState(false);
  const [isExpanded, setIsExpanded] = React13.useState(false);
  useEffect8(() => {
    if (!open) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);
  return /* @__PURE__ */ jsxs17(
    StyledPaper,
    {
      elevation: 3,
      isClosing,
      isExpanded,
      style: {
        display: !open && !isClosing ? "none" : "flex",
        pointerEvents: !open && !isClosing ? "none" : "auto"
      },
      children: [
        /* @__PURE__ */ jsx26(
          Header_default,
          {
            title,
            onClose: () => {
              setIsClosing(true);
              setTimeout(() => {
                onClose();
              }, 300);
            },
            allAttachments,
            onExpand: () => setIsExpanded(!isExpanded),
            isExpanded,
            avatar,
            conversationId,
            participants,
            renderParticipant
          }
        ),
        /* @__PURE__ */ jsx26(
          Chat,
          {
            config,
            participants,
            isLoading,
            defaultMessages,
            conversationId,
            onReceiveMessage,
            onSendMessage,
            onMessageSeen,
            onLoadMoreMessages,
            totalMessages,
            buttonJoin
          }
        )
      ]
    }
  );
};

// src/client/components/FloatingButton/index.tsx
import { Zoom, useTheme } from "@mui/material";

// src/client/components/FloatingButton/styles.ts
import { Fab } from "@mui/material";
import { styled as styled14 } from "@mui/material/styles";
var StyledFab = styled14(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1e3
}));

// src/client/components/FloatingButton/index.tsx
import { jsx as jsx27 } from "react/jsx-runtime";
var FloatingButton = ({
  icon,
  onClick,
  color = "primary",
  size = "large",
  sx,
  tooltip
}) => {
  const theme = useTheme();
  return /* @__PURE__ */ jsx27(
    Zoom,
    {
      in: true,
      timeout: {
        enter: 225,
        exit: 195
      },
      style: {
        transitionDelay: "0ms"
      },
      unmountOnExit: true,
      children: /* @__PURE__ */ jsx27(
        StyledFab,
        {
          onClick,
          color,
          size,
          "aria-label": tooltip,
          sx,
          children: icon
        }
      )
    }
  );
};

// src/client/components/ChatBubble/index.tsx
import { Fragment as Fragment7, jsx as jsx28, jsxs as jsxs18 } from "react/jsx-runtime";
var ChatBubble = ({
  onClick,
  unreadCount = 0,
  color = "primary",
  title = "Chat",
  conversationId,
  defaultMessages,
  participants,
  onReceiveMessage,
  onSendMessage,
  renderParticipant,
  config,
  isLoading,
  onMessageSeen,
  onLoadMoreMessages,
  allAttachments,
  totalMessages,
  buttonJoin
}) => {
  const [isOpen, setIsOpen] = useState11(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick == null ? void 0 : onClick();
  };
  const icon = unreadCount > 0 ? /* @__PURE__ */ jsx28(Badge, { badgeContent: unreadCount, color: "error", max: 99, children: /* @__PURE__ */ jsx28(ChatIcon, {}) }) : /* @__PURE__ */ jsx28(ChatIcon, {});
  return /* @__PURE__ */ jsxs18(Fragment7, { children: [
    /* @__PURE__ */ jsx28(
      FloatingButton,
      {
        icon,
        onClick: handleClick,
        color,
        tooltip: "Ouvrir le chat",
        sx: {
          "&:hover": {
            transform: "scale(1.1)"
          }
        }
      }
    ),
    /* @__PURE__ */ jsx28(
      ChatPopup,
      {
        participants,
        renderParticipant,
        open: isOpen,
        onClose: () => setIsOpen(false),
        title,
        conversationId,
        defaultMessages,
        onReceiveMessage,
        onSendMessage,
        onMessageSeen,
        config,
        isLoading,
        onLoadMoreMessages,
        allAttachments,
        totalMessages,
        buttonJoin
      }
    )
  ] });
};
export {
  Chat,
  ChatBubble,
  FileItem,
  NextPusherChatProvider,
  POST3 as POST,
  PagesRouterAdapter,
  getOrCreateSubscription,
  pusherEvent,
  pusherSubscriptions,
  useChat,
  useChatSubscribe,
  useNextPusherChat
};
//# sourceMappingURL=index.mjs.map