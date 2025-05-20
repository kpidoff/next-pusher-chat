import Pusher from 'pusher-js';
interface ConnectionState {
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    connectionState: string;
}
export declare const createPusherSubscribes: (pusher: Pusher, onConnectionStateChange: (state: Partial<ConnectionState>) => void) => {
    setupConnectionSubscribes: () => void;
};
export {};
