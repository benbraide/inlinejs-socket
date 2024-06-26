import { EvaluateLater, FindAncestor, IElementScopeCreatedCallbackParams, IsObject } from '@benbraide/inlinejs';
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
    public UpdateChannelProperty(value: ISocketChannel){
        this.UpdateChannel_(value);
    }

    @Property({ type: 'object', checkStoredObject: true })
    public UpdateRoomProperty(value: ISocketChannel){
        this.UpdateChannel_(value);
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

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.loaded_ = true;
            this.name_ && this.FindNative_()?.on(this.name_, this.handler_);
            postAttributesCallback && postAttributesCallback();
        });

        scope.AddUninitCallback(() => {
            this.name_ && this.FindNative_()?.off(this.name_, this.handler_);
        });
    }

    protected UpdateChannel_(value: ISocketChannel){
        if (value !== this.channel_){
            this.loaded_ && this.name_ && this.FindNative_()?.off(this.name_, this.handler_);
            this.channel_ = value;
            this.loaded_ && this.name_ && this.FindNative_()?.on(this.name_, this.handler_);
        }
    }

    protected FindChannel_(){
        return (this.channel_ = (this.channel_ || (FindAncestor(this, ancestor => ('Subscribe' in ancestor)) as unknown as (ISocketChannel | null))));
    }

    protected FindNative_(){
        return ((FindAncestor(this, ancestor => ('GetNative' in ancestor)) as unknown as ISocketClient)?.GetNative() || null);
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
