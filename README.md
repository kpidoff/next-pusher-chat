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

### Composant de Chat

Le composant `Chat` est le composant principal qui gère l'interface de chat complète. Il offre deux modes d'affichage :

#### Mode Conversation Active

```tsx
// app/page.tsx
"use client";

export default function ChatPage() {
  return (
    <Chat
      channel="my-channel"
      user={{
        id: "user-123",
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg"
      }}
    />
  );
}

### Hook personnalisé

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

### Hooks de Chat

#### useChat

Le hook `useChat` fournit toutes les fonctionnalités nécessaires pour gérer une conversation en temps réel :

```tsx
import { useChat } from '@next-pusher-chat/core';

function ChatComponent() {
  const {
    sendMessage,
    prepareMessage,
    updateTypingStatus,
    getParticipant,
    markMessageAsSeen,
    connection
  } = useChat({
    conversationId: "conv-123",
    participants: [
      { id: "user-1", name: "John Doe" },
      { id: "user-2", name: "Jane Smith" }
    ],
    onMessageReceived: (message) => {
      console.log("Nouveau message reçu:", message);
    },
    onMessageSeen: (messageSeen) => {
      console.log("Message vu:", messageSeen);
    },
    onTypingStatus: (typingStatus) => {
      console.log("Statut de frappe:", typingStatus);
    },
    onError: (error) => {
      console.error("Erreur:", error);
    }
  });

  // Exemple d'utilisation
  const handleSendMessage = () => {
    sendMessage({
      content: "Bonjour !",
      attachments: []
    });
  };

  return (
    <div>
      <button onClick={handleSendMessage}>Envoyer</button>
      <button onClick={() => updateTypingStatus(true)}>Je tape...</button>
    </div>
  );
}
```

#### useChatSubscribe

Le hook `useChatSubscribe` permet de gérer les abonnements aux événements Pusher de manière plus fine :

```tsx
import { useChatSubscribe } from '@next-pusher-chat/core';

function ChatSubscription() {
  const { isConnected } = useChatSubscribe({
    conversationId: "conv-123",
    onMessageReceived: (message) => {
      console.log("Nouveau message:", message);
    },
    onMessageSeen: (messageSeen) => {
      console.log("Message vu:", messageSeen);
    },
    onTypingStatus: (typingStatus) => {
      console.log("Statut de frappe:", typingStatus);
    },
    onError: (error) => {
      console.error("Erreur:", error);
    }
  });

  return (
    <div>
      <p>Statut de connexion: {isConnected ? "Connecté" : "Déconnecté"}</p>
    </div>
  );
}
```

### API des Hooks

#### useChat Props

| Prop | Type | Description |
|------|------|-------------|
| conversationId | string | ID unique de la conversation |
| participants | User[] | Liste des participants à la conversation |
| onMessageReceived | (message: ReceivedMessageEvent) => void | Callback pour les nouveaux messages |
| onMessageSeen | (messageSeen: ReceivedMessageSeenEvent) => void | Callback pour les messages vus |
| onTypingStatus | (typingStatus: ReceivedTypingEvent) => void | Callback pour le statut de frappe |
| onError | (error: Error) => void | Callback pour les erreurs |

#### useChat Return

| Méthode | Description |
|---------|-------------|
| sendMessage | Envoie un nouveau message |
| prepareMessage | Prépare un message sans l'envoyer |
| updateTypingStatus | Met à jour le statut de frappe |
| getParticipant | Récupère les informations d'un participant |
| markMessageAsSeen | Marque un message comme vu |
| connection | État de la connexion (isConnected, isLoading, error, connectionState) |

#### useChatSubscribe Props

| Prop | Type | Description |
|------|------|-------------|
| conversationId | string | ID unique de la conversation |
| onMessageReceived | (message: ReceivedMessageEvent) => void | Callback pour les nouveaux messages |
| onMessageSeen | (messageSeen: ReceivedMessageSeenEvent) => void | Callback pour les messages vus |
| onTypingStatus | (typingStatus: ReceivedTypingEvent) => void | Callback pour le statut de frappe |
| onError | (error: Error) => void | Callback pour les erreurs |

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

### Props du Composant Chat

| Prop | Type | Description |
|------|------|-------------|
| channel | string | Nom du canal Pusher |
| user | User | Informations de l'utilisateur |
| theme | Theme | Thème personnalisé (optionnel) |
| onMessage | (message: Message) => void | Callback pour les nouveaux messages |

## 🎨 Personnalisation

La bibliothèque offre plusieurs options de personnalisation :

```tsx
import { Chat, Theme } from '@next-pusher-chat/core';

const customTheme: Theme = {
  colors: {
    primary: '#007bff',
    background: '#ffffff',
    text: '#000000'
  },
  // ... autres options de thème
};

<Chat
  channel="my-channel"
  user={user}
  theme={customTheme}
/>
```

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

## 📦 Exports Disponibles

La bibliothèque exporte plusieurs modules que vous pouvez utiliser selon vos besoins :

### Composants

```tsx
import { Chat, ChatBubble, FileItem } from '@next-pusher-chat/core';

// Chat : Le composant principal de chat
<Chat channel="my-channel" user={user} />

// ChatBubble : Composant pour afficher un message individuel
<ChatBubble message={message} />

// FileItem : Composant pour afficher les pièces jointes
<FileItem file={file} />
```

### Hooks

```tsx
import { useChat, useChatSubscribe } from '@next-pusher-chat/core';

// useChat : Hook principal pour la gestion du chat
const { sendMessage, updateTypingStatus } = useChat({...});

// useChatSubscribe : Hook pour gérer les abonnements
const { isConnected } = useChatSubscribe({...});
```

### Provider

```tsx
import { NextPusherChatProvider } from '@next-pusher-chat/core';

// Provider pour configurer Pusher
<NextPusherChatProvider
  appKey={process.env.NEXT_PUBLIC_PUSHER_APP_KEY!}
  cluster={process.env.NEXT_PUBLIC_PUSHER_CLUSTER!}
>
  {children}
</NextPusherChatProvider>
```

### Types

```tsx
import { 
  Message, 
  User, 
  ChatEventHandler,
  SendMessageProps,
  UseChatProps 
} from '@next-pusher-chat/core';

// Types disponibles pour TypeScript
```

### API Server

```tsx
import { POST } from '@next-pusher-chat/core';

// Route handler pour Next.js
export { POST } from '@next-pusher-chat/core';
```

### Adaptateurs

```tsx
import { PagesRouterAdapter } from '@next-pusher-chat/core';

// Adaptateur pour le Pages Router de Next.js
```

### Services et Utilitaires

```tsx
import { 
  eventMessageSeenEvent,
  eventSendMessageEvent,
  eventTypingEvent 
} from '@next-pusher-chat/core';

// Services pour la gestion des événements
```

## 📚 Structure des Exports

| Catégorie | Exports | Description |
|-----------|---------|-------------|
| Composants | `Chat`, `ChatBubble`, `FileItem` | Composants React pour l'interface utilisateur |
| Hooks | `useChat`, `useChatSubscribe` | Hooks pour la gestion du chat et des abonnements |
| Provider | `NextPusherChatProvider` | Provider pour la configuration Pusher |
| Types | `Message`, `User`, etc. | Types TypeScript pour le typage |
| API Server | `POST` | Route handler pour Next.js |
| Adaptateurs | `PagesRouterAdapter` | Adaptateurs pour différents frameworks |
| Services | `eventMessageSeenEvent`, etc. | Services pour la gestion des événements |
