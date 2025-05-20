# Next Pusher Chat

Une bibliothèque React moderne pour intégrer facilement des fonctionnalités de chat en temps réel dans vos applications Next.js en utilisant Pusher.

## 🚀 Fonctionnalités

- Intégration simple avec Next.js
- Support du chat en temps réel via Pusher
- Interface utilisateur moderne et personnalisable
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
import { PusherProvider } from '@next-pusher-chat/core';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PusherProvider
      appKey={process.env.NEXT_PUBLIC_PUSHER_APP_KEY!}
      cluster={process.env.NEXT_PUBLIC_PUSHER_CLUSTER!}
    >
      {children}
    </PusherProvider>
  );
}
```

## 💻 Utilisation

### Composant Chat

Le composant `Chat` est le composant principal qui gère l'interface de chat complète. Il offre deux modes d'affichage :

#### Mode Conversation Active

```tsx
import { Chat } from '@next-pusher-chat/core';

function ActiveChat() {
  return (
    <Chat
      conversationId="conv-123"
      user={{
        id: "user-123",
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg"
      }}
    />
  );
}
```

#### Mode En Attente

```tsx
import { Chat } from '@next-pusher-chat/core';

function WaitingChat() {
  return (
    <Chat
      conversationId={null}
      buttonJoin={
        <button onClick={() => console.log("Rejoindre la conversation")}>
          Rejoindre
        </button>
      }
    />
  );
}
```

### Structure du Composant Chat

Le composant `Chat` est composé de plusieurs sous-composants :

1. **MessageList** : Affiche la liste des messages
2. **MessageInput** : Zone de saisie des messages
3. **ChatActions** : Actions disponibles dans le chat
4. **TypingIndicator** : Indicateur de frappe
5. **LoadMoreMessages** : Bouton pour charger plus de messages

### Props du Composant Chat

| Prop | Type | Description |
|------|------|-------------|
| conversationId | string \| null | ID de la conversation. Si null, affiche le mode en attente |
| user | User | Informations de l'utilisateur actuel |
| buttonJoin | ReactNode | Composant personnalisé pour rejoindre la conversation (optionnel) |
| onMessageReceived | (message: Message) => void | Callback pour les nouveaux messages |
| onMessageSeen | (messageSeen: MessageSeen) => void | Callback pour les messages vus |
| onTypingStatus | (typingStatus: TypingStatus) => void | Callback pour le statut de frappe |
| onError | (error: Error) => void | Callback pour les erreurs |

### Exemple Complet

```tsx
import { Chat } from '@next-pusher-chat/core';

function ChatExample() {
  return (
    <Chat
      conversationId="conv-123"
      user={{
        id: "user-123",
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg"
      }}
      onMessageReceived={(message) => {
        console.log("Nouveau message:", message);
      }}
      onMessageSeen={(messageSeen) => {
        console.log("Message vu:", messageSeen);
      }}
      onTypingStatus={(typingStatus) => {
        console.log("Statut de frappe:", typingStatus);
      }}
      onError={(error) => {
        console.error("Erreur:", error);
      }}
      buttonJoin={
        <button className="join-button">
          Rejoindre la conversation
        </button>
      }
    />
  );
}
```

### Personnalisation du Style

Le composant utilise des composants stylisés qui peuvent être personnalisés :

```tsx
import { styled } from '@mui/material/styles';
import { Content, WaitingMessageContainer } from '@next-pusher-chat/core';

const CustomContent = styled(Content)({
  backgroundColor: '#f5f5f5',
  borderRadius: '12px',
  padding: '20px',
});

const CustomWaitingMessage = styled(WaitingMessageContainer)({
  textAlign: 'center',
  padding: '40px',
});
```

### Hook personnalisé

```tsx
import { usePusherChat } from '@next-pusher-chat/core';

function MyCustomChat() {
  const { messages, sendMessage, isConnected } = usePusherChat({
    channel: "my-channel",
    user: {
      id: "user-123",
      name: "John Doe"
    }
  });

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
      <button onClick={() => sendMessage("Hello!")}>Envoyer</button>
    </div>
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

### Props du Provider

| Prop | Type | Description |
|------|------|-------------|
| appKey | string | Clé d'application Pusher |
| cluster | string | Cluster Pusher |
| options | PusherOptions | Options supplémentaires pour la configuration Pusher |

### Props du Composant Chat

| Prop | Type | Description |
|------|------|-------------|
| channel | string | Nom du canal Pusher |
| user | User | Informations de l'utilisateur |
| theme | Theme | Thème personnalisé (optionnel) |
| onMessage | (message: Message) => void | Callback pour les nouveaux messages |

## 🎨 Personnalisation

La bibliothèque offre plusieurs options de personnalisation :

### Intégration avec Material-UI (MUI)

La bibliothèque est entièrement compatible avec Material-UI et ses thèmes. Vous pouvez utiliser les composants MUI pour personnaliser l'apparence de votre chat :

```tsx
import { Chat } from '@next-pusher-chat/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Création d'un thème MUI personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function ChatWithMUI() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Chat
        channel="my-channel"
        user={{
          id: "user-123",
          name: "John Doe"
        }}
        // Le composant Chat utilisera automatiquement les styles MUI
      />
    </ThemeProvider>
  );
}
```

### Composants MUI Recommandés

Vous pouvez utiliser les composants MUI suivants pour personnaliser votre chat :

```tsx
import { 
  Paper, 
  Box, 
  Typography, 
  TextField, 
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

function CustomChatUI() {
  const { sendMessage, messages } = useChat({
    // ... configuration
  });

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 600, margin: 'auto' }}>
      <Box sx={{ height: 400, overflow: 'auto' }}>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id}>
              <ListItemAvatar>
                <Avatar src={message.user.avatar} />
              </ListItemAvatar>
              <ListItemText 
                primary={message.content}
                secondary={message.user.name}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Écrivez votre message..."
          size="small"
        />
        <IconButton color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
```

### Thèmes MUI Prédéfinis

La bibliothèque inclut des thèmes MUI prédéfinis que vous pouvez utiliser :

```tsx
import { Chat } from '@next-pusher-chat/core';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '@next-pusher-chat/core/themes';

// Utilisation du thème clair
function LightChat() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Chat channel="my-channel" user={user} />
    </ThemeProvider>
  );
}

// Utilisation du thème sombre
function DarkChat() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Chat channel="my-channel" user={user} />
    </ThemeProvider>
  );
}
```

### Composant ChatBubble

Le composant `ChatBubble` est un bouton flottant qui affiche une bulle de chat avec un compteur de messages non lus et qui ouvre une popup de chat au clic.

```tsx
import { ChatBubble } from '@next-pusher-chat/core';

function ChatBubbleExample() {
  return (
    <ChatBubble
      unreadCount={5}
      color="primary"
      title="Support Client"
      conversationId="conv-123"
      participants={[
        { id: "user-1", name: "John Doe" },
        { id: "user-2", name: "Jane Smith" }
      ]}
      onReceiveMessage={(message) => {
        console.log("Message reçu:", message);
      }}
      onSendMessage={(message) => {
        console.log("Message envoyé:", message);
      }}
      renderParticipant={(participant) => (
        <div>
          <img src={participant.avatar} alt={participant.name} />
          <span>{participant.name}</span>
        </div>
      )}
    />
  );
}
```

#### Props du ChatBubble

| Prop | Type | Description |
|------|------|-------------|
| onClick | () => void | Callback lors du clic sur la bulle |
| unreadCount | number | Nombre de messages non lus (affiche un badge) |
| color | "primary" \| "secondary" | Couleur du bouton flottant |
| title | string | Titre de la popup de chat |
| renderParticipant | (participant: User) => React.ReactNode | Fonction pour personnaliser l'affichage des participants |
| allAttachments | Attachment[] | Liste des pièces jointes disponibles |
| conversationId | string \| null | ID de la conversation |
| buttonJoin | React.ReactNode | Composant personnalisé pour rejoindre la conversation |
| defaultMessages | Message[] | Messages initiaux |
| participants | User[] | Liste des participants |
| onReceiveMessage | (message: Message) => void | Callback pour les messages reçus |
| onSendMessage | (message: Message) => void | Callback pour les messages envoyés |
| config | ChatConfig | Configuration du chat |
| isLoading | boolean | État de chargement |
| onMessageSeen | (messageSeen: MessageSeen) => void | Callback pour les messages vus |
| onLoadMoreMessages | () => void | Callback pour charger plus de messages |
| totalMessages | number | Nombre total de messages |

#### Personnalisation du Style

```tsx
import { ChatBubble } from '@next-pusher-chat/core';
import { styled } from '@mui/material/styles';

// Personnalisation du bouton flottant
const CustomChatBubble = styled(ChatBubble)({
  '& .MuiBadge-badge': {
    backgroundColor: '#ff4444',
    color: 'white',
  },
  '& .MuiFab-root': {
    backgroundColor: '#1976d2',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
});

// Utilisation
function CustomChatBubbleExample() {
  return (
    <CustomChatBubble
      unreadCount={3}
      color="primary"
      title="Chat Support"
      conversationId="conv-123"
    />
  );
}
```

#### Fonctionnalités

- **Badge de messages non lus** : Affiche un compteur de messages non lus
- **Popup de chat** : S'ouvre au clic sur la bulle
- **Personnalisation des participants** : Possibilité de personnaliser l'affichage des participants
- **Gestion des pièces jointes** : Support des pièces jointes
- **Mode en attente** : Support du mode en attente avec un bouton personnalisé
- **Chargement progressif** : Support du chargement progressif des messages

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
