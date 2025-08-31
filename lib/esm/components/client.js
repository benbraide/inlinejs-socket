var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsObject } from '@benbraide/inlinejs';
import { CustomElement, Property, RegisterCustomElement } from '@benbraide/inlinejs-element';
import { io } from "socket.io-client";
export class SocketClient extends CustomElement {
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
            room: (room || (IsObject(data) && data.room) || ''),
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
        this.io_ = (this.path ? io(this.path) : io());
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
    Property({ type: 'string' })
], SocketClient.prototype, "path", void 0);
export function SocketClientCompact() {
    RegisterCustomElement(SocketClient, 'socket');
}
