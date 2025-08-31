"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketClientCompact = exports.SocketClient = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const socket_io_client_1 = require("socket.io-client");
class SocketClient extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: false,
            isHidden: true,
        });
        this.io_ = null;
        this.connected_ = false;
        this.path = '';
    }
    GetNative() {
        return this.io_;
    }
    GetId() {
        var _a;
        return (((_a = this.io_) === null || _a === void 0 ? void 0 : _a.id) || '');
    }
    IsConnected() {
        return this.connected_;
    }
    Connect() {
        this.ToggleConnected_(true);
    }
    Disconnect() {
        this.ToggleConnected_(false);
    }
    Emit(event, data, room) {
        var _a;
        (_a = this.io_) === null || _a === void 0 ? void 0 : _a.emit(event, {
            room: (room || ((0, inlinejs_1.IsObject)(data) && data.room) || ''),
            details: { payload: data },
        });
    }
    HandleElementScopeDestroyed_(scope) {
        var _a;
        super.HandleElementScopeDestroyed_(scope);
        (_a = this.io_) === null || _a === void 0 ? void 0 : _a.close();
        this.io_ = null;
    }
    HandlePostAttributesProcessPostfix_() {
        super.HandlePostAttributesProcessPostfix_();
        this.io_ = (this.path ? (0, socket_io_client_1.io)(this.path) : (0, socket_io_client_1.io)());
        this.io_.on('socket:connect', () => {
            this.connected_ = true;
            Array.from(this.children).forEach((child) => {
                ('Resubscribe' in child) && child['Resubscribe']();
            });
        });
        this.io_.on('disconnect', () => (this.connected_ = false));
    }
    ToggleConnected_(connected) {
        var _a, _b;
        (this.connected_ != connected) && (connected ? (_a = this.io_) === null || _a === void 0 ? void 0 : _a.connect() : (_b = this.io_) === null || _b === void 0 ? void 0 : _b.disconnect());
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], SocketClient.prototype, "path", void 0);
exports.SocketClient = SocketClient;
function SocketClientCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(SocketClient, 'socket');
}
exports.SocketClientCompact = SocketClientCompact;
