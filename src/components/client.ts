import { AddChanges, BuildGetterProxyOptions, CreateInplaceProxy, FindComponentById, GetGlobal, IsObject } from '@benbraide/inlinejs';
import { CustomElement } from '@benbraide/inlinejs-element';

import { io, Socket } from "socket.io-client";
import { ISocketClient } from '../types';

export class SocketClient extends CustomElement implements ISocketClient{
    protected io_: Socket | null = null;
    protected id_ = '';
    protected componentId_ = '';
    protected changesId_ = '';
    protected connected_ = false;
    
    public constructor(){
        super({
            path: '',
        }, true);

        this.style.display = 'none';
        this.componentId_ = (GetGlobal().InferComponentFrom(this)?.GetId() || '');
        
        this.io_ = io(this.state_.path || undefined);
        this.io_.on('connected', (id) => {
            this.connected_ = true;
            this.changesId_ && AddChanges('set', `${this.changesId_}.connected`, 'connected', FindComponentById(this.componentId_)?.GetBackend().changes);
            this.dispatchEvent(new CustomEvent('connected', { detail: (this.id_ = id) }));
        });

        let resolvedComponent = FindComponentById(this.componentId_), elementScope = resolvedComponent?.CreateElementScope(this);

        if (resolvedComponent){
            this.changesId_ = resolvedComponent.GenerateUniqueId('socket_channel_proxy_');
            
            const componentId = resolvedComponent.GetId(), this_ = this, proxy = {
                connect: () => this.connect(),
                disconnect: () => this.disconnect(),
                emit: (event: string, data: any) => {
                    this.io_?.emit(event, {
                        room: ((IsObject(data) && data.room) || ''),
                        details: {
                            id: this.id_,
                            payload: data,
                        },
                    });
                },
                get id(){
                    return this_.id_;
                },
                get io(){
                    return this_.io_;
                },
                get connected(){
                    FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${this_.changesId_}.connected`);
                    return this_.connected_;
                },
            };

            elementScope?.SetLocal('$client', proxy);
        }
        
        elementScope?.AddUninitCallback(() => this.io_?.close());
    }

    public get io(){
        return this.io_;
    }

    public get socketId(){
        return (this.id_ || this.io?.id || '');
    }

    public get componentId(){
        return this.componentId_;
    }

    public get connected(){
        return this.connected_;
    }

    public connect(){
        this.toggleConnected_(true);
    }

    public disconnect(){
        this.toggleConnected_(false);
    }

    protected toggleConnected_(connected: boolean){
        if (this.connected_ !== connected){
            this.connected_ = connected;
            connected ? this.io?.connect() : this.io?.disconnect();
            if (!connected){
                this.connected_ = false;
                this.changesId_ && AddChanges('set', `${this.changesId_}.connected`, 'connected', FindComponentById(this.componentId_)?.GetBackend().changes);
            }
        }
    }
}

export function SocketClientCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('socket-client'), SocketClient);
}
