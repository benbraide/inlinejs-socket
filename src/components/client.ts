import { IElementScope, IsObject } from '@benbraide/inlinejs';
import { CustomElement, Property, RegisterCustomElement } from '@benbraide/inlinejs-element';

import { io, Socket } from "socket.io-client";
import { ISocketChannel, ISocketClient } from '../types';

export class SocketClient extends CustomElement implements ISocketClient{
    protected io_: Socket | null = null;
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
        return (this.io_?.id || '');
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
            details: { payload: data },
        });
    }

    protected HandleElementScopeDestroyed_(scope: IElementScope): void {
        super.HandleElementScopeDestroyed_(scope);
        this.io_?.close();
        this.io_ = null;
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();

        this.io_ = (this.path ? io(this.path) : io());

        this.io_.on('socket:connect', () => {
            this.connected_ = true;
            Array.from(this.children).forEach((child) => {
                ('Resubscribe' in child) && (child as unknown as ISocketChannel)['Resubscribe']();
            });
        });

        this.io_.on('disconnect', () => (this.connected_ = false));
    }

    protected ToggleConnected_(connected: boolean){
        (this.connected_ != connected) && (connected ? this.io_?.connect() : this.io_?.disconnect());
    }
}

export function SocketClientCompact(){
    RegisterCustomElement(SocketClient, 'socket');
}
