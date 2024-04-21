"use strict";
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
        this.clientIds_ = new Array();
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
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            this.loaded_ = true;
            !this.defer && scope.AddPostProcessCallback(() => this.ToggleSubscribed_(true));
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddUninitCallback(() => {
            this.ToggleSubscribed_(false);
            this.client_ = null;
        });
    }
    FindClient_() {
        if (this.client_) {
            return this.client_;
        }
        const ancestor = (0, inlinejs_1.FindAncestor)(this, ancestor => ('Emit' in ancestor));
        return (this.client_ = (ancestor ? ancestor : null));
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
