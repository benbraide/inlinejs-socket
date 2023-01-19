import { Socket } from "socket.io-client";

export interface ISocketClient{
    get io(): Socket | null;
    get socketId(): string;
    get componentId(): string;
    get connected(): boolean;
    connect(): void;
    disconnect(): void;
}

export interface ISocketChannel{
    get io(): Socket | null;
    get subscribed(): boolean;
    get name(): string;
    Subscribe(): void;
    Unsubscribe(): void;

}

export interface ISocketSubscribedInfo{
    room: string;
    clients: Array<string>;
}

export interface ISocketRoomInfo{
    room: string;
    id: string;
}
