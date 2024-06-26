var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
        this.id_ = '';
        this.connected_ = false;
        this.path = '';
    }
    GetNative() {
        return this.io_;
    }
    GetId() {
        var _a;
        return (this.id_ || ((_a = this.io_) === null || _a === void 0 ? void 0 : _a.id) || '');
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
            details: {
                id: this.id_,
                payload: data,
            },
        });
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            this.io_ = (this.path ? io(this.path) : io());
            this.io_.on('socket:connect', () => {
                if (this.connected_) {
                    Array.from(this.children).forEach((child) => {
                        ('Resubscribe' in child) && child['Resubscribe']();
                    });
                }
                else {
                    this.connected_ = true;
                }
            });
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddUninitCallback(() => {
            var _a;
            (_a = this.io_) === null || _a === void 0 ? void 0 : _a.close();
            this.io_ = null;
        });
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
