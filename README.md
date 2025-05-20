# Next Pusher Chat

Une bibliothèque React moderne pour intégrer facilement des fonctionnalités de chat en temps réel dans vos applications Next.js en utilisant Pusher.

## 🚀 Fonctionnalités

- Intégration simple avec Next.js
- Support du chat en temps réel via Pusher
- Interface utilisateur moderne avec Material-UI
- Support TypeScript
- Gestion des messages, des utilisateurs et des salons
- Composants React optimisés pour les performances

## 📦 Installation

```bash
# Utilisation de npm
npm install @next-pusher-chat/core

# Utilisation de yarn
yarn add @next-pusher-chat/core

# Utilisation de pnpm
pnpm add @next-pusher-chat/core
```

## 🔧 Configuration

1. Créez un compte sur [Pusher](https://pusher.com) et obtenez vos clés d'API

2. Configurez vos variables d'environnement dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_PUSHER_APP_KEY=votre_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=votre_cluster
PUSHER_APP_ID=votre_app_id
PUSHER_APP_SECRET=votre_app_secret
```

3. Configurez le provider dans votre application :

```tsx
// app/providers.tsx
"use client";

import { NextPusherChatProvider } from "@next-pusher-chat/core";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextPusherChatProvider
      appKey={process.env.NEXT_PUBLIC_PUSHER_APP_KEY!}
      cluster={process.env.NEXT_PUBLIC_PUSHER_CLUSTER!}
    >
      {children}
    </NextPusherChatProvider>
  );
}
```

## 💻 Utilisation

### Exemple d'Intégration

```tsx
// app/page.tsx
"use client";

import { Box, Paper, Typography } from "@mui/material";
import { useNextPusherChat } from "@next-pusher-chat/core";
import Bubble from "./components/Bubble";

export default function Home() {
  const { isConnected, isLoading, error, connectionState } = useNextPusherChat();

  return (
    <Box sx={{ minHeight: "100vh", p: 4, bgcolor: "background.default" }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Next Pusher Chat Demo
        </Typography>
        
        <Bubble conversationId="conv-123" />
      </Paper>
    </Box>
  );
}

// app/components/Bubble.tsx
"use client";

import { ChatBubble } from "@next-pusher-chat/core";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";

export default function Bubble({ conversationId }: { conversationId?: string | null }) {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!conversationId) return;
      
      // Charger les données initiales
      const [participantsData, messagesData, attachmentsData, total] = await Promise.all([
        getParticipants(conversationId),
        getMessages(conversationId),
        getAttachments(conversationId),
        getTotalMessages(conversationId)
      ]);

      setParticipants(participantsData);
      setMessages(messagesData);
      setAttachments(attachmentsData);
      setTotalMessages(total);
      setIsLoading(false);
    };

    loadData();
  }, [conversationId]);

  return (
    <ChatBubble
      totalMessages={totalMessages}
      allAttachments={attachments}
      participants={participants}
      isLoading={isLoading}
      defaultMessages={messages}
      conversationId={conversationId}
      buttonJoin={
        <Button fullWidth variant="contained" color="primary">
          Rejoindre la conversation
        </Button>
      }
      onReceiveMessage={async (eventId, message) => {
        if (message.attachmentsCount > 0) {
          const messageFromDb = await getMessageByEventId(eventId);
          if (messageFromDb) {
            return {
              ...message,
              content: messageFromDb.content,
              attachments: messageFromDb.attachments,
            };
          }
        }
        return message;
      }}
      onSendMessage={async ({ eventId, message, conversationId }) => {
        await sendMessage({
          content: message.content,
          userId: message.userId,
          conversationId,
          eventId,
          attachments: message.attachments,
        });
        return message;
      }}
      onMessageSeen={async ({ lastMessage, conversationId, userId }) => {
        if (!lastMessage) return;
        await markAllMessagesAsSeen(conversationId, userId);
      }}
      onLoadMoreMessages={async ({ oldestMessageId }) => {
        if (!conversationId) return [];
        return await getMessages(conversationId, oldestMessageId);
      }}
    />
  );
}
```

## 📚 API Reference

### ChatBubble Props

| Prop | Type | Description |
|------|------|-------------|
| conversationId | string \| null | ID de la conversation |
| participants | User[] | Liste des participants |
| defaultMessages | Message[] | Messages initiaux |
| isLoading | boolean | État de chargement |
| allAttachments | Attachment[] | Pièces jointes disponibles |
| totalMessages | number | Nombre total de messages |
| buttonJoin | ReactNode | Bouton personnalisé pour rejoindre |
| onReceiveMessage | (eventId, message) => Promise<Message> | Gestion des messages reçus |
| onSendMessage | (params) => Promise<Message> | Gestion de l'envoi de messages |
| onMessageSeen | (params) => Promise<void> | Gestion des messages vus |
| onLoadMoreMessages | (params) => Promise<Message[]> | Chargement de messages plus anciens |

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📝 Licence

MIT

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
