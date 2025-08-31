"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketChannelCompact = exports.SocketRoom = exports.SocketChannel = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class SocketChannel extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: false,
            isHidden: true,
        });
        this.client_ = null;
        this.loaded_ = false;
        this.subscribed_ = false;
        this.name_ = '';
        this.defer = false;
    }
    UpdateNameProperty(value) {
        if (this.subscribed_ && value !== this.name_) {
            this.ToggleSubscribed_(false);
            this.name_ = value;
            this.ToggleSubscribed_(true);
        }
        else {
            this.name_ = value;
            this.loaded_ && !this.defer && this.ToggleSubscribed_(true);
        }
    }
    UpdateClientProperty(value) {
        if (typeof value === 'string')
            return;
        if (this.subscribed_ && value !== this.client_) {
            this.ToggleSubscribed_(false);
            this.client_ = value;
            this.ToggleSubscribed_(true);
        }
        else {
            this.client_ = value;
            this.loaded_ && !this.defer && this.ToggleSubscribed_(true);
        }
    }
    GetName() {
        return this.name_;
    }
    IsSubscribed() {
        return this.subscribed_;
    }
    Subscribe() {
        this.ToggleSubscribed_(true);
    }
    Unsubscribe() {
        this.ToggleSubscribed_(false);
    }
    Resubscribe() {
        if (this.subscribed_) {
            this.subscribed_ = false;
            this.ToggleSubscribed_(true);
        }
    }
    Emit(event, data) {
        var _a;
        (_a = this.FindClient_()) === null || _a === void 0 ? void 0 : _a.Emit(event, data, this.name_);
    }
    FindNative() {
        return this.FindNative_();
    }
    HandleElementScopeDestroyed_(scope) {
        super.HandleElementScopeDestroyed_(scope);
        this.ToggleSubscribed_(false);
        this.client_ = null;
    }
    HandlePostAttributesProcessPostfix_() {
        super.HandlePostAttributesProcessPostfix_();
        this.loaded_ = true;
    }
    HandlePostProcess_() {
        super.HandlePostProcess_();
        !this.defer && this.ToggleSubscribed_(true);
    }
    FindClient_() {
        return this.client_ || (0, inlinejs_1.FindAncestor)(this, ancestor => ('Emit' in ancestor));
    }
    FindNative_() {
        var _a;
        return (((_a = this.FindClient_()) === null || _a === void 0 ? void 0 : _a.GetNative()) || null);
    }
    ToggleSubscribed_(subscribed) {
        var _a;
        if (this.subscribed_ !== subscribed && this.name_) {
            this.subscribed_ = subscribed;
            (_a = this.FindNative_()) === null || _a === void 0 ? void 0 : _a.emit((subscribed ? 'socket:subscribe' : 'socket:unsubscribe'), this.name_);
        }
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], SocketChannel.prototype, "defer", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], SocketChannel.prototype, "UpdateNameProperty", null);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], SocketChannel.prototype, "UpdateClientProperty", null);
exports.SocketChannel = SocketChannel;
class SocketRoom extends SocketChannel {
}
exports.SocketRoom = SocketRoom;
function SocketChannelCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(SocketChannel, 'channel');
    (0, inlinejs_element_1.RegisterCustomElement)(SocketRoom, 'room');
}
exports.SocketChannelCompact = SocketChannelCompact;
