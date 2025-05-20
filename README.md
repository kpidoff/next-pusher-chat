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

### Composant de Chat

```tsx
import { Chat } from '@next-pusher-chat/core';

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
