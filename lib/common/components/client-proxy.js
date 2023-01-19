"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketClientProxyCompact = exports.SocketClientProxy = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class SocketClientProxy extends inlinejs_element_1.CustomElement {
    constructor() {
        super({}, true);
        this.client_ = null;
        this.style.display = 'none';
    }
    get io() {
        var _a;
        return (((_a = this.client_) === null || _a === void 0 ? void 0 : _a.io) || null);
    }
    get socketId() {
        var _a;
        return (((_a = this.client_) === null || _a === void 0 ? void 0 : _a.socketId) || '');
    }
    get componentId() {
        var _a;
        return (((_a = this.client_) === null || _a === void 0 ? void 0 : _a.componentId) || '');
    }
    get connected() {
        var _a;
        return (((_a = this.client_) === null || _a === void 0 ? void 0 : _a.connected) || false);
    }
    get client() {
        return this.client_;
    }
    set client(obj) {
        var _a;
        if (this.client_ = obj) {
            let resolvedComponent = (0, inlinejs_1.FindComponentById)(this.client_.componentId);
            resolvedComponent && ((_a = resolvedComponent.CreateElementScope(this)) === null || _a === void 0 ? void 0 : _a.SetLocal('$client', resolvedComponent.FindElementLocalValue(this.client_, '$client', true)));
            this.client_.addEventListener('connected', e => this.dispatchEvent(new CustomEvent('connected', { detail: e.detail })));
        }
    }
    connect() {
        var _a;
        (_a = this.client_) === null || _a === void 0 ? void 0 : _a.connect();
    }
    disconnect() {
        var _a;
        (_a = this.client_) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
}
exports.SocketClientProxy = SocketClientProxy;
function SocketClientProxyCompact() {
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('socket-client-proxy'), SocketClientProxy);
}
exports.SocketClientProxyCompact = SocketClientProxyCompact;
