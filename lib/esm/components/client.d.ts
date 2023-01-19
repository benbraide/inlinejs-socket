import { CustomElement } from '@benbraide/inlinejs-element';
import { Socket } from "socket.io-client";
import { ISocketClient } from '../types';
export declare class SocketClient extends CustomElement implements ISocketClient {
    protected io_: Socket | null;
    protected id_: string;
    protected componentId_: string;
    protected changesId_: string;
    protected connected_: boolean;
    constructor();
    get io(): Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
    get socketId(): string;
    get componentId(): string;
    get connected(): boolean;
    connect(): void;
    disconnect(): void;
    protected toggleConnected_(connected: boolean): void;
}
export declare function SocketClientCompact(): void;
