import Pusher from 'pusher-js';
import { logger } from '@/client/utils/logger';

interface ConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectionState: string;
}

// Fonction pour créer les subscribers Pusher
export const createPusherSubscribes = (
  pusher: Pusher,
  onConnectionStateChange: (state: Partial<ConnectionState>) => void
) => {
  const setupConnectionSubscribes = () => {
    const connection = pusher.connection;

    connection.bind('connected', () => {
      logger.info('✅ Pusher connecté avec succès!');
      onConnectionStateChange({
        isConnected: true,
        isLoading: false,
        error: null,
        connectionState: 'connected'
      });
    });

    connection.bind('connecting', () => {
      logger.info('🔄 Tentative de connexion à Pusher...');
      onConnectionStateChange({
        isLoading: true,
        connectionState: 'connecting'
      });
    });

    connection.bind('disconnected', () => {
      logger.info('❌ Pusher déconnecté');
      onConnectionStateChange({
        isConnected: false,
        isLoading: false,
        connectionState: 'disconnected'
      });
    });

    connection.bind('error', (err: any) => {
      console.error('⚠️ Erreur de connexion Pusher:', err);
      onConnectionStateChange({
        isConnected: false,
        isLoading: false,
        error: err.message || 'Erreur de connexion',
        connectionState: 'error'
      });
    });

    connection.bind('state_change', (states: any) => {
      logger.info('🔄 Changement d\'état Pusher:', states);
    });
  };

  return {
    setupConnectionSubscribes,
  };
}; 