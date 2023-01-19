import { CustomElement } from '@benbraide/inlinejs-element';
import { ISocketClient } from '../types';
export declare class SocketClientProxy extends CustomElement implements ISocketClient {
    protected client_: ISocketClient | null;
    constructor();
    get io(): import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
    get socketId(): string;
    get componentId(): string;
    get connected(): boolean;
    get client(): ISocketClient | null;
    set client(obj: ISocketClient | null);
    connect(): void;
    disconnect(): void;
}
export declare function SocketClientProxyCompact(): void;
