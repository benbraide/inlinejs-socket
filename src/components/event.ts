import { EvaluateLater, FindComponentById, GetGlobal, IsObject } from '@benbraide/inlinejs';
import { CustomElement, FindAncestor } from '@benbraide/inlinejs-element';
import { ISocketChannel, ISocketClient } from '../types';

import { Socket } from "socket.io-client";

export class SocketEvent extends CustomElement{
    public constructor(){
        super({
            name: '',
            triggered: '',
        });

        let io = FindAncestor<ISocketClient>(this, 'io')?.io;
        if (io){
            this.Bootstrap_(io);
        }
    }

    protected FindComponent_(){
        return FindComponentById((FindAncestor<ISocketClient>(this, 'io')?.componentId || ''));
    }

    protected Bootstrap_(io: Socket){
        let onEvent = (data: any) => {
            if (IsObject(data)){
                const channelAncestor = FindAncestor<ISocketChannel>(this, 'Subscribe');
                if (channelAncestor && data.room !== channelAncestor.name){// Ignore events from other channels
                    return;
                }
            }
            
            if (this.state_.triggered || this.textContent){
                EvaluateLater({
                    componentId: (FindAncestor<ISocketClient>(this, 'componentId')?.componentId || ''),
                    expression: (this.state_.triggered || this.textContent),
                    contextElement: this,
                })(undefined, undefined, { data });
            }

            this.dispatchEvent(new CustomEvent('triggered', {
                detail: data,
            }));
        };
        
        io.on(this.state_.name, onEvent);
        this.FindComponent_()?.FindElementScope(this)?.AddUninitCallback(() => io.off(this.state_.name, onEvent));
    }
}

export function SocketEventCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('socket-event'), SocketEvent);
}
