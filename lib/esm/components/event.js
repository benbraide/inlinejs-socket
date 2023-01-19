import { EvaluateLater, FindComponentById, GetGlobal, IsObject } from '@benbraide/inlinejs';
import { CustomElement, FindAncestor } from '@benbraide/inlinejs-element';
export class SocketEvent extends CustomElement {
    constructor() {
        var _a;
        super({
            name: '',
            triggered: '',
        });
        let io = (_a = FindAncestor(this, 'io')) === null || _a === void 0 ? void 0 : _a.io;
        if (io) {
            this.Bootstrap_(io);
        }
    }
    FindComponent_() {
        var _a;
        return FindComponentById((((_a = FindAncestor(this, 'io')) === null || _a === void 0 ? void 0 : _a.componentId) || ''));
    }
    Bootstrap_(io) {
        var _a, _b;
        let onEvent = (data) => {
            var _a;
            if (IsObject(data)) {
                const channelAncestor = FindAncestor(this, 'Subscribe');
                if (channelAncestor && data.room !== channelAncestor.name) { // Ignore events from other channels
                    return;
                }
            }
            if (this.state_.triggered || this.textContent) {
                EvaluateLater({
                    componentId: (((_a = FindAncestor(this, 'componentId')) === null || _a === void 0 ? void 0 : _a.componentId) || ''),
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
export function SocketEventCompact() {
    customElements.define(GetGlobal().GetConfig().GetElementName('socket-event'), SocketEvent);
}
