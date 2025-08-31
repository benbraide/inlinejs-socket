var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EvaluateLater, FindAncestor, IsObject } from '@benbraide/inlinejs';
import { CustomElement, Property, RegisterCustomElement } from '@benbraide/inlinejs-element';
export class SocketEvent extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.loaded_ = false;
        this.channel_ = null;
        this.name_ = '';
        this.action = '';
        this.handler_ = (data) => {
            var _a, _b;
            if (IsObject(data) && ('room' in data)) {
                const channelAncestor = this.FindChannel_();
                if (channelAncestor && data.room !== channelAncestor.GetName()) { // Ignore events from other channels
                    return;
                }
            }
            if (this.action || ((_a = this.textContent) === null || _a === void 0 ? void 0 : _a.trim())) {
                EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: (this.action || ((_b = this.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || ''),
                })(undefined, undefined, { data });
            }
        };
    }
    UpdateNameProperty(value) {
        var _a, _b;
        if (value !== this.name_) {
            this.loaded_ && this.name_ && ((_a = this.FindNative_()) === null || _a === void 0 ? void 0 : _a.off(this.name_, this.handler_));
            this.name_ = value;
            this.loaded_ && this.name_ && ((_b = this.FindNative_()) === null || _b === void 0 ? void 0 : _b.on(this.name_, this.handler_));
        }
    }
    UpdateChannelProperty(value) {
        typeof value !== 'string' && this.UpdateChannel_(value);
    }
    UpdateRoomProperty(value) {
        typeof value !== 'string' && this.UpdateChannel_(value);
    }
    HandleElementScopeDestroyed_(scope) {
        var _a;
        super.HandleElementScopeDestroyed_(scope);
        this.name_ && ((_a = this.FindNative_()) === null || _a === void 0 ? void 0 : _a.off(this.name_, this.handler_));
    }
    HandlePostAttributesProcessPostfix_() {
        var _a;
        super.HandlePostAttributesProcessPostfix_();
        this.loaded_ = true;
        this.name_ && ((_a = this.FindNative_()) === null || _a === void 0 ? void 0 : _a.on(this.name_, this.handler_));
    }
    UpdateChannel_(value) {
        var _a, _b;
        if (value !== this.channel_) {
            this.loaded_ && this.name_ && ((_a = this.FindNative_()) === null || _a === void 0 ? void 0 : _a.off(this.name_, this.handler_));
            this.channel_ = value;
            this.loaded_ && this.name_ && ((_b = this.FindNative_()) === null || _b === void 0 ? void 0 : _b.on(this.name_, this.handler_));
        }
    }
    FindChannel_() {
        return (this.channel_ || FindAncestor(this, ancestor => ('Subscribe' in ancestor)));
    }
    FindNative_() {
        if (this.channel_) {
            return (this.channel_.FindNative() || null);
        }
        const ancestor = FindAncestor(this, ancestor => ('GetNative' in ancestor));
        return (ancestor ? ancestor.GetNative() : null);
    }
}
__decorate([
    Property({ type: 'string' })
], SocketEvent.prototype, "action", void 0);
__decorate([
    Property({ type: 'string' })
], SocketEvent.prototype, "UpdateNameProperty", null);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], SocketEvent.prototype, "UpdateChannelProperty", null);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], SocketEvent.prototype, "UpdateRoomProperty", null);
export class SocketChannelEvent extends SocketEvent {
    constructor() {
        super();
    }
    UpdateNameProperty(value) {
        this.name_ = `socket:${value}`;
    }
}
__decorate([
    Property({ type: 'string' })
], SocketChannelEvent.prototype, "UpdateNameProperty", null);
export function SocketEventCompact() {
    RegisterCustomElement(SocketEvent, 'packet');
    RegisterCustomElement(SocketChannelEvent, 'lifecycle');
}
