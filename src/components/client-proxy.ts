import { FindComponentById, GetGlobal } from '@benbraide/inlinejs';
import { CustomElement } from '@benbraide/inlinejs-element';

import { ISocketClient } from '../types';

export class SocketClientProxy extends CustomElement implements ISocketClient{
    protected client_: ISocketClient | null = null;
    
    public constructor(){
        super({}, true);
        this.style.display = 'none';
    }
    
    public get io(){
        return (this.client_?.io || null);
    }

    public get socketId(){
        return (this.client_?.socketId || '');
    }

    public get componentId(){
        return (this.client_?.componentId || '');
    }

    public get connected(){
        return (this.client_?.connected || false);
    }

    public get client(){
        return this.client_;
    }

    public set client(obj: ISocketClient | null){
        if (this.client_ = obj){
            let resolvedComponent = FindComponentById(this.client_.componentId);
            resolvedComponent && resolvedComponent.CreateElementScope(this)?.SetLocal('$client', resolvedComponent.FindElementLocalValue(this.client_, '$client', true));
            (this.client_ as unknown as HTMLElement).addEventListener('connected', e => this.dispatchEvent(new CustomEvent('connected', { detail: (e as CustomEvent).detail })));
        }
    }

    public connect(){
        this.client_?.connect();
    }

    public disconnect(){
        this.client_?.disconnect();
    }
}

export function SocketClientProxyCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('socket-client-proxy'), SocketClientProxy);
}
