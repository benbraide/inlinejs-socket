"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketChannelCompact = exports.SocketRoom = exports.SocketChannel = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class SocketChannel extends inlinejs_element_1.CustomElement {
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
        let io = (_a = (0, inlinejs_element_1.FindAncestor)(this, 'io')) === null || _a === void 0 ? void 0 : _a.io;
        if (io) {
            this.Bootstrap_(io);
        }
    }
    get io() {
        var _a;
        return (_a = (0, inlinejs_element_1.FindAncestor)(this, 'io')) === null || _a === void 0 ? void 0 : _a.io;
    }
    get socketId() {
        var _a;
        return (((_a = (0, inlinejs_element_1.FindAncestor)(this, 'socketId')) === null || _a === void 0 ? void 0 : _a.socketId) || '');
    }
    get componentId() {
        var _a;
        return (((_a = (0, inlinejs_element_1.FindAncestor)(this, 'componentId')) === null || _a === void 0 ? void 0 : _a.componentId) || '');
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
        return (0, inlinejs_1.FindComponentById)((((_a = (0, inlinejs_element_1.FindAncestor)(this, 'io')) === null || _a === void 0 ? void 0 : _a.componentId) || ''));
    }
    Bootstrap_(io) {
        let createHandler = (name) => {
            return (data) => {
                var _a;
                if (this.state_[name]) {
                    (0, inlinejs_1.EvaluateLater)({
                        componentId: (((_a = (0, inlinejs_element_1.FindAncestor)(this, 'io')) === null || _a === void 0 ? void 0 : _a.componentId) || ''),
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
            (0, inlinejs_1.IsObject)(info) && (this.clientIds_ = this.clientIds_.concat((info.clients || []).filter(id => !this.clientIds_.includes(id))));
            subscribedHandler(info);
        };
        io.on('subscribed', onSubscribedEvent);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => io.off('subscribed', onSubscribedEvent));
        let unsubscribedHandler = createHandler('unsubscribed'), onUnsubscribedEvent = (info) => {
            (0, inlinejs_1.IsObject)(info) && (this.clientIds_ = this.clientIds_.filter(id => (id !== info.id)));
            unsubscribedHandler(info);
        };
        io.on('unsubscribed', onUnsubscribedEvent);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => io.off('unsubscribed', onUnsubscribedEvent));
        let joinedHandler = createHandler('joined'), onJoinedEvent = (room) => {
            var _a;
            this.subscribed_ = true;
            this.changesId_ && (0, inlinejs_1.AddChanges)('set', `${this.changesId_}.subscribed`, 'subscribed', (_a = this.FindComponent_()) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
            joinedHandler(room);
        };
        io.on('joined', onJoinedEvent);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => io.off('joined', onJoinedEvent));
        let leftHandler = createHandler('left'), onLeftEvent = (room) => {
            var _a;
            this.subscribed_ = false;
            this.changesId_ && (0, inlinejs_1.AddChanges)('set', `${this.changesId_}.subscribed`, 'subscribed', (_a = this.FindComponent_()) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
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
                    (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this_.changesId_}.subscribed`);
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
                        (0, inlinejs_1.EvaluateLater)({
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
exports.SocketChannel = SocketChannel;
class SocketRoom extends SocketChannel {
}
exports.SocketRoom = SocketRoom;
function SocketChannelCompact() {
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('socket-channel'), SocketChannel);
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('socket-room'), SocketRoom);
}
exports.SocketChannelCompact = SocketChannelCompact;
