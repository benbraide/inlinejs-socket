import { WaitForGlobal } from '@benbraide/inlinejs';
import { SocketClientCompact } from './components/client';
import { SocketChannelCompact } from './components/channel';
import { SocketEventCompact } from './components/event';
export function InlineJSSocket() {
    WaitForGlobal().then(() => {
        SocketClientCompact();
        SocketChannelCompact();
        SocketEventCompact();
    });
}
