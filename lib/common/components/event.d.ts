import { IElementScopeCreatedCallbackParams } from '@benbraide/inlinejs';
import { CustomElement } from '@benbraide/inlinejs-element';
import { ISocketChannel } from '../types';
export declare class SocketEvent extends CustomElement {
    protected loaded_: boolean;
    protected channel_: ISocketChannel | null;
    protected handler_: (data: any) => void;
    protected name_: string;
    action: string;
    UpdateNameProperty(value: string): void;
    UpdateChannelProperty(value: ISocketChannel): void;
    UpdateRoomProperty(value: ISocketChannel): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected UpdateChannel_(value: ISocketChannel): void;
    protected FindChannel_(): ISocketChannel | null;
    protected FindNative_(): import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
}
export declare class SocketChannelEvent extends SocketEvent {
    constructor();
    UpdateNameProperty(value: string): void;
}
export declare function SocketEventCompact(): void;
