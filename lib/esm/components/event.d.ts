import { IElementScope } from '@benbraide/inlinejs';
import { CustomElement } from '@benbraide/inlinejs-element';
import { ISocketChannel } from '../types';
export declare class SocketEvent extends CustomElement {
    protected loaded_: boolean;
    protected channel_: ISocketChannel | null;
    protected handler_: (data: any) => void;
    protected name_: string;
    action: string;
    UpdateNameProperty(value: string): void;
    UpdateChannelProperty(value: ISocketChannel | string): void;
    UpdateRoomProperty(value: ISocketChannel | string): void;
    constructor();
    protected HandleElementScopeDestroyed_(scope: IElementScope): void;
    protected HandlePostAttributesProcessPostfix_(): void;
    protected UpdateChannel_(value: ISocketChannel): void;
    protected FindChannel_(): ISocketChannel | null;
    protected FindNative_(): import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
}
export declare class SocketChannelEvent extends SocketEvent {
    constructor();
    UpdateNameProperty(value: string): void;
}
export declare function SocketEventCompact(): void;
