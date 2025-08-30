import { IElementScopeCreatedCallbackParams } from '@benbraide/inlinejs';
import { CustomElement } from '@benbraide/inlinejs-element';
import { ISocketChannel, ISocketClient } from '../types';
export declare class SocketChannel extends CustomElement implements ISocketChannel {
    protected client_: ISocketClient | null;
    protected loaded_: boolean;
    protected subscribed_: boolean;
    protected name_: string;
    defer: boolean;
    UpdateNameProperty(value: string): void;
    UpdateClientProperty(value: ISocketClient | string): void;
    constructor();
    GetName(): string;
    IsSubscribed(): boolean;
    Subscribe(): void;
    Unsubscribe(): void;
    Resubscribe(): void;
    Emit(event: string, data: any): void;
    FindNative(): import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected FindClient_(): ISocketClient | null;
    protected FindNative_(): import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
    protected ToggleSubscribed_(subscribed: boolean): void;
}
export declare class SocketRoom extends SocketChannel {
}
export declare function SocketChannelCompact(): void;
