import { PusherEvent } from "../types/pusher";
export declare const pusherEvent: <T>({ event, conversationId, data, eventId: providedEventId }: Omit<PusherEvent<T>, "eventId"> & {
    eventId?: string;
}) => Promise<{
    eventId: string;
    data: any;
}>;
