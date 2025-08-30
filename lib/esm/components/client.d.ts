import { IElementScopeCreatedCallbackParams } from '@benbraide/inlinejs';
import { CustomElement } from '@benbraide/inlinejs-element';
import { Socket } from "socket.io-client";
import { ISocketClient } from '../types';
export declare class SocketClient extends CustomElement implements ISocketClient {
    protected io_: Socket | null;
    protected connected_: boolean;
    path: string;
    constructor();
    GetNative(): Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | null;
    GetId(): string;
    IsConnected(): boolean;
    Connect(): void;
    Disconnect(): void;
    Emit(event: string, data: any, room?: string): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected ToggleConnected_(connected: boolean): void;
}
export declare function SocketClientCompact(): void;
