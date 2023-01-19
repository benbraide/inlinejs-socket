"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSSocket = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const client_1 = require("./components/client");
const client_proxy_1 = require("./components/client-proxy");
const channel_1 = require("./components/channel");
const event_1 = require("./components/event");
function InlineJSSocket() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, client_1.SocketClientCompact)();
        (0, client_proxy_1.SocketClientProxyCompact)();
        (0, channel_1.SocketChannelCompact)();
        (0, event_1.SocketEventCompact)();
    });
}
exports.InlineJSSocket = InlineJSSocket;
