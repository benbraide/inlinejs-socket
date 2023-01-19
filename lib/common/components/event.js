"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEventCompact = exports.SocketEvent = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class SocketEvent extends inlinejs_element_1.CustomElement {
    constructor() {
        var _a;
        super({
            name: '',
            triggered: '',
        });
        let io = (_a = (0, inlinejs_element_1.FindAncestor)(this, 'io')) === null || _a === void 0 ? void 0 : _a.io;
        if (io) {
            this.Bootstrap_(io);
        }
    }
    FindComponent_() {
        var _a;
        return (0, inlinejs_1.FindComponentById)((((_a = (0, inlinejs_element_1.FindAncestor)(this, 'io')) === null || _a === void 0 ? void 0 : _a.componentId) || ''));
    }
    Bootstrap_(io) {
        var _a, _b;
        let onEvent = (data) => {
            var _a;
            if ((0, inlinejs_1.IsObject)(data)) {
                const channelAncestor = (0, inlinejs_element_1.FindAncestor)(this, 'Subscribe');
                if (channelAncestor && data.room !== channelAncestor.name) { // Ignore events from other channels
                    return;
                }
            }
            if (this.state_.triggered || this.textContent) {
                (0, inlinejs_1.EvaluateLater)({
                    componentId: (((_a = (0, inlinejs_element_1.FindAncestor)(this, 'componentId')) === null || _a === void 0 ? void 0 : _a.componentId) || ''),
                    expression: (this.state_.triggered || this.textContent),
                    contextElement: this,
                })(undefined, undefined, { data });
            }
            this.dispatchEvent(new CustomEvent('triggered', {
                detail: data,
            }));
        };
        io.on(this.state_.name, onEvent);
        (_b = (_a = this.FindComponent_()) === null || _a === void 0 ? void 0 : _a.FindElementScope(this)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => io.off(this.state_.name, onEvent));
    }
}
exports.SocketEvent = SocketEvent;
function SocketEventCompact() {
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('socket-event'), SocketEvent);
}
exports.SocketEventCompact = SocketEventCompact;
