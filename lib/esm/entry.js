import { WaitForGlobal } from '@benbraide/inlinejs';
import { SocketClientCompact } from './components/client';
import { SocketClientProxyCompact } from './components/client-proxy';
import { SocketChannelCompact } from './components/channel';
import { SocketEventCompact } from './components/event';
export function InlineJSSocket() {
    WaitForGlobal().then(() => {
        SocketClientCompact();
        SocketClientProxyCompact();
        SocketChannelCompact();
        SocketEventCompact();
    });
}
