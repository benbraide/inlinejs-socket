"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketClientCompact = exports.SocketClient = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const socket_io_client_1 = require("socket.io-client");
class SocketClient extends inlinejs_element_1.CustomElement {
    constructor() {
        var _a;
        super({
            path: '',
        }, true);
        this.io_ = null;
        this.id_ = '';
        this.componentId_ = '';
        this.changesId_ = '';
        this.connected_ = false;
        this.style.display = 'none';
        this.componentId_ = (((_a = (0, inlinejs_1.GetGlobal)().InferComponentFrom(this)) === null || _a === void 0 ? void 0 : _a.GetId()) || '');
        this.io_ = (0, socket_io_client_1.io)(this.state_.path || undefined);
        this.io_.on('connected', (id) => {
            var _a;
            this.connected_ = true;
            this.changesId_ && (0, inlinejs_1.AddChanges)('set', `${this.changesId_}.connected`, 'connected', (_a = (0, inlinejs_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
            this.dispatchEvent(new CustomEvent('connected', { detail: (this.id_ = id) }));
        });
        let resolvedComponent = (0, inlinejs_1.FindComponentById)(this.componentId_), elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.CreateElementScope(this);
        if (resolvedComponent) {
            this.changesId_ = resolvedComponent.GenerateUniqueId('socket_channel_proxy_');
            const componentId = resolvedComponent.GetId(), this_ = this, proxy = {
                connect: () => this.connect(),
                disconnect: () => this.disconnect(),
                emit: (event, data) => {
                    var _a;
                    (_a = this.io_) === null || _a === void 0 ? void 0 : _a.emit(event, {
                        room: (((0, inlinejs_1.IsObject)(data) && data.room) || ''),
                        details: {
                            id: this.id_,
                            payload: data,
                        },
                    });
                },
                get id() {
                    return this_.id_;
                },
                get io() {
                    return this_.io_;
                },
                get connected() {
                    var _a;
                    (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this_.changesId_}.connected`);
                    return this_.connected_;
                },
            };
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$client', proxy);
        }
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => { var _a; return (_a = this.io_) === null || _a === void 0 ? void 0 : _a.close(); });
    }
    get io() {
        return this.io_;
    }
    get socketId() {
        var _a;
        return (this.id_ || ((_a = this.io) === null || _a === void 0 ? void 0 : _a.id) || '');
    }
    get componentId() {
        return this.componentId_;
    }
    get connected() {
        return this.connected_;
    }
    connect() {
        this.toggleConnected_(true);
    }
    disconnect() {
        this.toggleConnected_(false);
    }
    toggleConnected_(connected) {
        var _a, _b, _c;
        if (this.connected_ !== connected) {
            this.connected_ = connected;
            connected ? (_a = this.io) === null || _a === void 0 ? void 0 : _a.connect() : (_b = this.io) === null || _b === void 0 ? void 0 : _b.disconnect();
            if (!connected) {
                this.connected_ = false;
                this.changesId_ && (0, inlinejs_1.AddChanges)('set', `${this.changesId_}.connected`, 'connected', (_c = (0, inlinejs_1.FindComponentById)(this.componentId_)) === null || _c === void 0 ? void 0 : _c.GetBackend().changes);
            }
        }
    }
}
exports.SocketClient = SocketClient;
function SocketClientCompact() {
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('socket-client'), SocketClient);
}
exports.SocketClientCompact = SocketClientCompact;
