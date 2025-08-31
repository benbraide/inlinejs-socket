import { EvaluateLater, FindAncestor, IElementScope, IsObject } from '@benbraide/inlinejs';
import { CustomElement, Property, RegisterCustomElement } from '@benbraide/inlinejs-element';
import { ISocketChannel, ISocketClient } from '../types';

export class SocketEvent extends CustomElement{
    protected loaded_ = false;
    protected channel_: ISocketChannel | null = null;

    protected handler_: (data: any) => void;
    protected name_ = '';
    
    @Property({ type: 'string' })
    public action = '';

    @Property({ type: 'string' })
    public UpdateNameProperty(value: string){
        if (value !== this.name_){
            this.loaded_ && this.name_ && this.FindNative_()?.off(this.name_, this.handler_);
            this.name_ = value;
            this.loaded_ && this.name_ && this.FindNative_()?.on(this.name_, this.handler_);
        }
    }

    @Property({ type: 'object', checkStoredObject: true })
    public UpdateChannelProperty(value: ISocketChannel | string){
        typeof value !== 'string' && this.UpdateChannel_(value);
    }

    @Property({ type: 'object', checkStoredObject: true })
    public UpdateRoomProperty(value: ISocketChannel | string){
        typeof value !== 'string' && this.UpdateChannel_(value);
    }
    
    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });

        this.handler_ = (data: any) => {
            if (IsObject(data) && ('room' in data)){
                const channelAncestor = this.FindChannel_();
                if (channelAncestor && data.room !== channelAncestor.GetName()){// Ignore events from other channels
                    return;
                }
            }
            
            if (this.action || this.textContent?.trim()){
                EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: (this.action || this.textContent?.trim() || ''),
                })(undefined, undefined, { data });
            }
        };
    }

    protected HandleElementScopeDestroyed_(scope: IElementScope): void {
        super.HandleElementScopeDestroyed_(scope);
        this.name_ && this.FindNative_()?.off(this.name_, this.handler_);
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();
        this.loaded_ = true;
        this.name_ && this.FindNative_()?.on(this.name_, this.handler_);
    }

    protected UpdateChannel_(value: ISocketChannel){
        if (value !== this.channel_){
            this.loaded_ && this.name_ && this.FindNative_()?.off(this.name_, this.handler_);
            this.channel_ = value;
            this.loaded_ && this.name_ && this.FindNative_()?.on(this.name_, this.handler_);
        }
    }

    protected FindChannel_(){
        return (this.channel_ || (FindAncestor(this, ancestor => ('Subscribe' in ancestor)) as ISocketChannel | null));
    }

    protected FindNative_(){
        if (this.channel_){
            return (this.channel_.FindNative() || null);
        }
        const ancestor = (FindAncestor(this, ancestor => ('GetNative' in ancestor)) as ISocketClient | null);
        return (ancestor ? ancestor.GetNative() : null);
    }
}

export class SocketChannelEvent extends SocketEvent{
    public constructor(){
        super();
    }

    @Property({ type: 'string' })
    public UpdateNameProperty(value: string){
        this.name_ = `socket:${value}`;
    }
}

export function SocketEventCompact(){
    RegisterCustomElement(SocketEvent, 'packet');
    RegisterCustomElement(SocketChannelEvent, 'lifecycle');
}
