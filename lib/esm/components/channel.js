import { AddChanges, EvaluateLater, FindComponentById, GetGlobal, IsObject } from '@benbraide/inlinejs';
import { CustomElement, FindAncestor } from '@benbraide/inlinejs-element';
export class SocketChannel extends CustomElement {
    constructor() {
        var _a;
        super({
            manual: false,
            name: '',
            joined: '',
            left: '',
            subscribed: '',
            unsubscribed: '',
        });
        this.subscribed_ = false;
        this.clientIds_ = new Array();
        this.changesId_ = '';
        let io = (_a = FindAncestor(this, 'io')) === null || _a === void 0 ? void 0 : _a.io;
        if (io) {
            this.Bootstrap_(io);
        }
    }
    get io() {
        var _a;
        return (_a = FindAncestor(this, 'io')) === null || _a === void 0 ? void 0 : _a.io;
    }
    get socketId() {
        var _a;
        return (((_a = FindAncestor(this, 'socketId')) === null || _a === void 0 ? void 0 : _a.socketId) || '');
    }
    get componentId() {
        var _a;
        return (((_a = FindAncestor(this, 'componentId')) === null || _a === void 0 ? void 0 : _a.componentId) || '');
    }
    get subscribed() {
        return this.subscribed_;
    }
    get name() {
        return this.state_.name;
    }
    Subscribe(io) {
        this.ToggleSubscribed_(true, io);
    }
    Unsubscribe(io) {
        this.ToggleSubscribed_(false, io);
    }
    ToggleSubscribed_(subscribed, io) {
        var _a;
        if (this.subscribed_ !== subscribed && this.state_.name) {
            this.subscribed_ = subscribed;
            (_a = (io || this.io)) === null || _a === void 0 ? void 0 : _a.emit((subscribed ? 'subscribe' : 'unsubscribe'), this.state_.name);
        }
    }
    FindComponent_() {
        var _a;
        return FindComponentById((((_a = FindAncestor(this, 'io')) === null || _a === void 0 ? void 0 : _a.componentId) || ''));
    }
    Bootstrap_(io) {
        let createHandler = (name) => {
            return (data) => {
                var _a;
                if (this.state_[name]) {
                    EvaluateLater({
                        componentId: (((_a = FindAncestor(this, 'io')) === null || _a === void 0 ? void 0 : _a.componentId) || ''),
                        expression: this.state_[name],
                        contextElement: this,
                    })(undefined, undefined, { data });
                }
                this.dispatchEvent(new CustomEvent(name, {
                    detail: data,
                }));
            };
        };
        let resolvedComponent = this.FindComponent_(), elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.CreateElementScope(this);
        let subscribedHandler = createHandler('subscribed'), onSubscribedEvent = (info) => {
            IsObject(info) && (this.clientIds_ = this.clientIds_.concat((info.clients || []).filter(id => !this.clientIds_.includes(id))));
            subscribedHandler(info);
        };
        io.on('subscribed', onSubscribedEvent);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => io.off('subscribed', onSubscribedEvent));
        let unsubscribedHandler = createHandler('unsubscribed'), onUnsubscribedEvent = (info) => {
            IsObject(info) && (this.clientIds_ = this.clientIds_.filter(id => (id !== info.id)));
            unsubscribedHandler(info);
        };
        io.on('unsubscribed', onUnsubscribedEvent);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => io.off('unsubscribed', onUnsubscribedEvent));
        let joinedHandler = createHandler('joined'), onJoinedEvent = (room) => {
            var _a;
            this.subscribed_ = true;
            this.changesId_ && AddChanges('set', `${this.changesId_}.subscribed`, 'subscribed', (_a = this.FindComponent_()) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
            joinedHandler(room);
        };
        io.on('joined', onJoinedEvent);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => io.off('joined', onJoinedEvent));
        let leftHandler = createHandler('left'), onLeftEvent = (room) => {
            var _a;
            this.subscribed_ = false;
            this.changesId_ && AddChanges('set', `${this.changesId_}.subscribed`, 'subscribed', (_a = this.FindComponent_()) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
            leftHandler(room);
        };
        io.on('left', onLeftEvent);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => io.off('left', onLeftEvent));
        if (resolvedComponent) {
            this.changesId_ = resolvedComponent.GenerateUniqueId('socket_channel_proxy_');
            const componentId = resolvedComponent.GetId(), this_ = this, proxy = {
                subscribe: () => this.Subscribe(),
                unsubscribe: () => this.Unsubscribe(),
                emit: (event, data) => io.emit(event, {
                    room: this.state_.name,
                    details: {
                        id: this_.socketId,
                        payload: data,
                    },
                }),
                get subscribed() {
                    var _a;
                    (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this_.changesId_}.subscribed`);
                    return this_.subscribed_;
                },
                get clients() {
                    return [...this_.clientIds_];
                },
            };
            let elementScope = resolvedComponent.CreateElementScope(this);
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$channel', proxy);
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$room', proxy);
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => {
                if (this.subscribed_) {
                    this.Unsubscribe(io);
                    if (this.state_.left) {
                        EvaluateLater({
                            componentId,
                            expression: this.state_.left,
                            contextElement: this,
                        })(undefined, undefined, { data: { room: this.state_.name } });
                    }
                }
            });
        }
        if (!this.state_.manual) {
            this.Subscribe(io);
        }
    }
}
export class SocketRoom extends SocketChannel {
}
export function SocketChannelCompact() {
    customElements.define(GetGlobal().GetConfig().GetElementName('socket-channel'), SocketChannel);
    customElements.define(GetGlobal().GetConfig().GetElementName('socket-room'), SocketRoom);
}
