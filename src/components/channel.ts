import { FindAncestor, IElementScopeCreatedCallbackParams } from '@benbraide/inlinejs';
import { CustomElement, Property, RegisterCustomElement } from '@benbraide/inlinejs-element';
import { ISocketChannel, ISocketClient } from '../types';

export class SocketChannel extends CustomElement implements ISocketChannel{
    protected client_: ISocketClient | null = null;
    
    protected loaded_ = false;
    protected subscribed_ = false;
    protected name_ = '';

    @Property({ type: 'boolean' })
    public defer = false;

    @Property({ type: 'string' })
    public UpdateNameProperty(value: string){
        if (this.subscribed_ && value !== this.name_){
            this.ToggleSubscribed_(false);
            this.name_ = value;
            this.ToggleSubscribed_(true);
        }
        else{
            this.name_ = value;
            this.loaded_ && !this.defer && this.ToggleSubscribed_(true);
        }
    }

    @Property({ type: 'object', checkStoredObject: true })
    public UpdateClientProperty(value: ISocketClient | string){
        if (typeof value === 'string') return;
        
        if (this.subscribed_ && value !== this.client_){
            this.ToggleSubscribed_(false);
            this.client_ = value;
            this.ToggleSubscribed_(true);
        }
        else{
            this.client_ = value;
            this.loaded_ && !this.defer && this.ToggleSubscribed_(true);
        }
    }
    
    public constructor(){
        super({
            isTemplate: false,
            isHidden: true,
        });
    }

    public GetName(){
        return this.name_;
    }

    public IsSubscribed(){
        return this.subscribed_;
    }

    public Subscribe(){
        this.ToggleSubscribed_(true);
    }

    public Unsubscribe(){
        this.ToggleSubscribed_(false);
    }

    public Resubscribe(){
        if (this.subscribed_){
            this.subscribed_ = false;
            this.ToggleSubscribed_(true);
        }
    }

    public Emit(event: string, data: any){
        this.FindClient_()?.Emit(event, data, this.name_);
    }

    public FindNative(){
        return this.FindNative_();
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.loaded_ = true;
            !this.defer && scope.AddPostProcessCallback(() => this.ToggleSubscribed_(true));
            postAttributesCallback && postAttributesCallback();
        });

        scope.AddUninitCallback(() => {
            this.ToggleSubscribed_(false);
            this.client_ = null;
        });
    }

    protected FindClient_(){
        return this.client_ || (FindAncestor(this, ancestor => ('Emit' in ancestor)) as ISocketClient | null);
    }

    protected FindNative_(){
        return (this.FindClient_()?.GetNative() || null);
    }

    protected ToggleSubscribed_(subscribed: boolean){
        if (this.subscribed_ !== subscribed && this.name_){
            this.subscribed_ = subscribed;
            this.FindNative_()?.emit((subscribed ? 'socket:subscribe' : 'socket:unsubscribe'), this.name_);
        }
    }
}

export class SocketRoom extends SocketChannel{}

export function SocketChannelCompact(){
    RegisterCustomElement(SocketChannel, 'channel');
    RegisterCustomElement(SocketRoom, 'room');
}
