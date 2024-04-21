import { Socket } from "socket.io-client";
export interface ISocketClient {
    GetNative(): Socket | null;
    GetId(): string;
    IsConnected(): boolean;
    Connect(): void;
    Disconnect(): void;
    Emit(event: string, data: any, room?: string): void;
}
export interface ISocketChannel {
    GetName(): string;
    IsSubscribed(): boolean;
    Subscribe(): void;
    Unsubscribe(): void;
    Resubscribe(): void;
    Emit(event: string, data: any): void;
}
export interface ISocketSubscribedInfo {
    room: string;
    clients: Array<string>;
}
export interface ISocketRoomInfo {
    room: string;
    id: string;
}
