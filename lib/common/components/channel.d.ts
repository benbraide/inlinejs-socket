import { CustomElement } from '@benbraide/inlinejs-element';
import { Socket } from "socket.io-client";
export declare class SocketChannel extends CustomElement {
    protected subscribed_: boolean;
    protected clientIds_: string[];
    protected changesId_: string;
    constructor();
    get io(): Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null | undefined;
    get socketId(): string;
    get componentId(): string;
    get subscribed(): boolean;
    get name(): any;
    Subscribe(io?: Socket): void;
    Unsubscribe(io?: Socket): void;
    protected ToggleSubscribed_(subscribed: boolean, io?: Socket): void;
    protected FindComponent_(): import("@benbraide/inlinejs").IComponent | null;
    protected Bootstrap_(io: Socket): void;
}
export declare class SocketRoom extends SocketChannel {
}
export declare function SocketChannelCompact(): void;
