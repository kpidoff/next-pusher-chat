# @next-pusher-chat/core

Une solution de chat en temps réel pour Next.js utilisant Pusher.

## Installation

Le package est disponible sur npm. Vous pouvez l'installer avec :

```bash
npm install @next-pusher-chat/core
# ou
yarn add @next-pusher-chat/core
```

## Dépendances requises

- Next.js ^14.0.0
- Pusher ^5.2.0
- pusher-js ^8.4.0
- React ^18.2.0
- React DOM ^18.2.0

## Configuration

### Configuration de Pusher

1. Créez un compte sur [Pusher](https://pusher.com)
2. Créez une nouvelle application Pusher
3. Configurez les variables d'environnement dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_PUSHER_APP_KEY=votre_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=votre_cluster
PUSHER_APP_ID=votre_app_id
PUSHER_SECRET=votre_secret
```

### Activation des logs

Pour activer les logs de débogage, ajoutez la variable d'environnement suivante :

```env
NEXT_PUBLIC_PUSHER_DEBUG=true
```

Cette variable activera les logs détaillés de Pusher dans la console du navigateur, ce qui est utile pour le débogage des connexions et des événements.

## Composants disponibles

### Chat

Le composant `Chat` est le composant principal qui offre une interface de chat complète.

```tsx
import { Chat } from "@next-pusher-chat/core";

export default function Conversation({ conversationId }: { conversationId: string }) {
  return (
    <Chat
      config={{
        activeEmoji: true,        // Active le sélecteur d'emojis
        activeFile: true,         // Active l'envoi de fichiers
        activeVoice: true,        // Active l'enregistrement vocal
        activeUserColor: true,    // Active les couleurs personnalisées pour les utilisateurs
        welcomeMessage: "Bienvenue dans la conversation" // Message de bienvenue
      }}
      participants={participants}
      defaultMessages={messages}
      conversationId={conversationId}
      onReceiveMessage={async (eventId, message) => {
        // Gérer la réception des messages
        return message;
      }}
      onSendMessage={async (eventId, message) => {
        // Gérer l'envoi des messages
        return message;
      }}
      onMessageSeen={async ({ lastMessage, conversationId, userId }) => {
        // Gérer les notifications de messages lus
      }}
    />
  );
}
```

### ChatBubble

Le composant `ChatBubble` offre une interface de chat plus légère et compacte.

```tsx
import { ChatBubble } from "@next-pusher-chat/core";

export default function Bubble({ conversationId }: { conversationId: string }) {
  return (
    <ChatBubble
      config={{
        activeEmoji: true,    // Active le sélecteur d'emojis
        activeFile: true      // Active l'envoi de fichiers
      }}
      participants={participants}
      defaultMessages={messages}
      conversationId={conversationId}
      onReceiveMessage={async (eventId, message) => {
        // Gérer la réception des messages
        return message;
      }}
      onSendMessage={async (eventId, message) => {
        // Gérer l'envoi des messages
        return message;
      }}
    />
  );
}
```

## Fonctionnalités

### Configuration

Le paramètre `config` permet d'activer ou désactiver différentes fonctionnalités :

- `activeEmoji`: Active/désactive le sélecteur d'emojis
- `activeFile`: Active/désactive l'envoi de fichiers
- `activeVoice`: Active/désactive l'enregistrement vocal
- `activeUserColor`: Active/désactive les couleurs personnalisées pour les utilisateurs
- `welcomeMessage`: Définit le message de bienvenue

### Notifications de messages lus

Pour activer les notifications de messages lus, vous devez implémenter la fonction `onMessageSeen` dans le composant `Chat`. Cette fonction est appelée lorsqu'un utilisateur lit les messages.

```tsx
onMessageSeen={async ({ lastMessage, conversationId, userId }) => {
  try {
    if (!lastMessage) return;
    // Implémentez votre logique de marquage des messages comme lus
    await markAllMessagesAsSeen(conversationId, userId);
  } catch (error) {
    console.error("Erreur lors de la lecture des messages:", error);
  }
}}
```

## Types

La bibliothèque exporte plusieurs types utiles :

```typescript
import { User, Message } from "@next-pusher-chat/core";
```

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub. 