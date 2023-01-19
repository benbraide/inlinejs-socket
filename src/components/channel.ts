import { AddChanges, BuildGetterProxyOptions, CreateInplaceProxy, EvaluateLater, FindComponentById, GetGlobal, IsObject } from '@benbraide/inlinejs';
import { CustomElement, FindAncestor } from '@benbraide/inlinejs-element';
import { ISocketClient, ISocketRoomInfo, ISocketSubscribedInfo } from '../types';

import { Socket } from "socket.io-client";

export class SocketChannel extends CustomElement{
    protected subscribed_ = false;
    protected clientIds_ = new Array<string>();
    protected changesId_ = '';
    
    public constructor(){
        super({
            manual: false,
            name: '',
            joined: '',
            left: '',
            subscribed: '',
            unsubscribed: '',
        });

        let io = FindAncestor<ISocketClient>(this, 'io')?.io;
        if (io){
            this.Bootstrap_(io);
        }
    }

    public get io(){
        return FindAncestor<ISocketClient>(this, 'io')?.io;
    }

    public get socketId(){
        return (FindAncestor<ISocketClient>(this, 'socketId')?.socketId || '');
    }

    public get componentId(){
        return (FindAncestor<ISocketClient>(this, 'componentId')?.componentId || '');
    }

    public get subscribed(){
        return this.subscribed_;
    }

    public get name(){
        return this.state_.name;
    }

    public Subscribe(io?: Socket){
        this.ToggleSubscribed_(true, io);
    }

    public Unsubscribe(io?: Socket){
        this.ToggleSubscribed_(false, io);
    }

    protected ToggleSubscribed_(subscribed: boolean, io?: Socket){
        if (this.subscribed_ !== subscribed && this.state_.name){
            this.subscribed_ = subscribed;
            (io || this.io)?.emit((subscribed ? 'subscribe' : 'unsubscribe'), this.state_.name);
        }
    }

    protected FindComponent_(){
        return FindComponentById((FindAncestor<ISocketClient>(this, 'io')?.componentId || ''));
    }

    protected Bootstrap_(io: Socket){
        let createHandler = (name: string) => {
            return (data: any) => {
                if (this.state_[name]){
                    EvaluateLater({
                        componentId: (FindAncestor<ISocketClient>(this, 'io')?.componentId || ''),
                        expression: this.state_[name],
                        contextElement: this,
                    })(undefined, undefined, { data });
                }

                this.dispatchEvent(new CustomEvent(name, {
                    detail: data,
                }));
            };
        };

        let resolvedComponent = this.FindComponent_(), elementScope = resolvedComponent?.CreateElementScope(this);
        
        let subscribedHandler = createHandler('subscribed'), onSubscribedEvent = (info: ISocketSubscribedInfo | string) => {
            IsObject(info) && (this.clientIds_ = this.clientIds_.concat(((info as ISocketSubscribedInfo).clients || []).filter(id => !this.clientIds_.includes(id))));
            subscribedHandler(info);
        };

        io.on('subscribed', onSubscribedEvent);
        elementScope?.AddUninitCallback(() => io.off('subscribed', onSubscribedEvent));

        let unsubscribedHandler = createHandler('unsubscribed'), onUnsubscribedEvent = (info: ISocketRoomInfo | string) => {
            IsObject(info) && (this.clientIds_ = this.clientIds_.filter(id => (id !== (info as ISocketRoomInfo).id)));
            unsubscribedHandler(info);
        };

        io.on('unsubscribed', onUnsubscribedEvent);
        elementScope?.AddUninitCallback(() => io.off('unsubscribed', onUnsubscribedEvent));

        let joinedHandler = createHandler('joined'), onJoinedEvent = (room: string) => {
            this.subscribed_ = true;
            this.changesId_ && AddChanges('set', `${this.changesId_}.subscribed`, 'subscribed', this.FindComponent_()?.GetBackend().changes);
            joinedHandler(room);
        };

        io.on('joined', onJoinedEvent);
        elementScope?.AddUninitCallback(() => io.off('joined', onJoinedEvent));

        let leftHandler = createHandler('left'), onLeftEvent = (room: string) => {
            this.subscribed_ = false;
            this.changesId_ && AddChanges('set', `${this.changesId_}.subscribed`, 'subscribed', this.FindComponent_()?.GetBackend().changes);
            leftHandler(room);
        };

        io.on('left', onLeftEvent);
        elementScope?.AddUninitCallback(() => io.off('left', onLeftEvent));

        if (resolvedComponent){
            this.changesId_ = resolvedComponent.GenerateUniqueId('socket_channel_proxy_');
            
            const componentId = resolvedComponent.GetId(), this_ = this, proxy = {
                subscribe: () => this.Subscribe(),
                unsubscribe: () => this.Unsubscribe(),
                emit: (event: string, data: any) => io.emit(event, {
                    room: this.state_.name,
                    details: {
                        id: this_.socketId,
                        payload: data,
                    },
                }),
                get subscribed(){
                    FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${this_.changesId_}.subscribed`);
                    return this_.subscribed_;
                },
                get clients(){
                    return [...this_.clientIds_];
                },
            };

            let elementScope = resolvedComponent.CreateElementScope(this);
            
            elementScope?.SetLocal('$channel', proxy);
            elementScope?.SetLocal('$room', proxy);

            elementScope?.AddUninitCallback(() => {
                if (this.subscribed_){
                    this.Unsubscribe(io);
                    if (this.state_.left){
                        EvaluateLater({
                            componentId,
                            expression: this.state_.left,
                            contextElement: this,
                        })(undefined, undefined, { data: { room: this.state_.name } });
                    }
                }
            });
        }

        if (!this.state_.manual){
            this.Subscribe(io);
        }
    }
}

export class SocketRoom extends SocketChannel{}

export function SocketChannelCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('socket-channel'), SocketChannel);
    customElements.define(GetGlobal().GetConfig().GetElementName('socket-room'), SocketRoom);
}
