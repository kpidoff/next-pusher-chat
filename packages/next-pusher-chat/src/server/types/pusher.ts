export interface PusherEvent<T> {
  event: string;
  eventId: string;
  conversationId: string;
  data: T;
}