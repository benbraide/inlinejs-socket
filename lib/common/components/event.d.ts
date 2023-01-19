import { CustomElement } from '@benbraide/inlinejs-element';
import { Socket } from "socket.io-client";
export declare class SocketEvent extends CustomElement {
    constructor();
    protected FindComponent_(): import("@benbraide/inlinejs").IComponent | null;
    protected Bootstrap_(io: Socket): void;
}
export declare function SocketEventCompact(): void;
