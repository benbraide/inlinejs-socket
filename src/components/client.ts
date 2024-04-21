import { IElementScopeCreatedCallbackParams, IsObject } from '@benbraide/inlinejs';
import { CustomElement, Property, RegisterCustomElement } from '@benbraide/inlinejs-element';

import { io, Socket } from "socket.io-client";
import { ISocketChannel, ISocketClient } from '../types';

export class SocketClient extends CustomElement implements ISocketClient{
    protected io_: Socket | null = null;
    protected id_ = '';
    protected connected_ = false;

    @Property({  type: 'string' })
    public path = '';
    
    public constructor(){
        super({
            isTemplate: false,
            isHidden: true,
        });
    }

    public GetNative(){
        return this.io_;
    }

    public GetId(){
        return (this.id_ || this.io_?.id || '');
    }

    public IsConnected(){
        return this.connected_;
    }

    public Connect(){
        this.ToggleConnected_(true);
    }

    public Disconnect(){
        this.ToggleConnected_(false);
    }

    public Emit(event: string, data: any, room?: string){
        this.io_?.emit(event, {
            room: (room || (IsObject(data) && data.room) || ''),
            details: {
                id: this.id_,
                payload: data,
            },
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.io_ = (this.path ? io(this.path) : io());
            this.io_.on('socket:connect', () => {
                if (this.connected_){
                    Array.from(this.children).forEach((child) => {
                        ('Resubscribe' in child) && (child as unknown as ISocketChannel)['Resubscribe']();
                    });
                }
                else{
                    this.connected_ = true;
                }
            });
            postAttributesCallback && postAttributesCallback();
        });

        scope.AddUninitCallback(() => {
            this.io_?.close();
            this.io_ = null;
        });
    }

    protected ToggleConnected_(connected: boolean){
        (this.connected_ != connected) && (connected ? this.io_?.connect() : this.io_?.disconnect());
    }
}

export function SocketClientCompact(){
    RegisterCustomElement(SocketClient, 'socket');
}
