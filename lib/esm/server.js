import { Server } from 'socket.io';
import { createServer } from 'http';
import { IsObject } from '@benbraide/inlinejs';
const WEBSOCKET_CORS = {
    origin: '*',
    methods: ['GET', 'POST'],
};
class SocketServer extends Server {
    constructor(http) {
        super(http, {
            cors: WEBSOCKET_CORS,
        });
        this.messageEventName_ = 'message';
        this.customEventHandlers_ = {};
        this.eventHandler_ = (socket) => {
            socket.on('disconnect', () => {
                for (const room in socket.rooms) { // Alert clients in all rooms that the client was connected to that the client has disconnected
                    socket.to(room).emit('unsubscribed', {
                        room,
                        id: socket.id,
                    });
                }
            });
            socket.on('error', (error) => {
                console.log('error', error);
            });
            socket.on('subscribe', (room) => {
                let subscribed = () => {
                    this.in(room).fetchSockets().then(sockets => {
                        socket.emit('subscribed', {
                            room,
                            clients: sockets.map(s => s.id).filter(id => (id !== socket.id)),
                        });
                    });
                    socket.to(room).emit('subscribed', {
                        room,
                        clients: [socket.id],
                    });
                    socket.emit('joined', room); // Alert the client that they have joined the room
                }, response = socket.join(room);
                (response instanceof Promise) ? response.then(subscribed) : subscribed();
            });
            socket.on('unsubscribe', (room) => {
                let unsubscribed = () => {
                    socket.emit('left', room); // Alert the client that they have left the room
                    socket.to(room).emit('unsubscribed', {
                        room,
                        id: socket.id,
                    });
                }, response = socket.leave(room);
                (response instanceof Promise) ? response.then(unsubscribed) : unsubscribed();
            });
            if (this.messageEventName_) {
                socket.on(this.messageEventName_, (message) => {
                    if (IsObject(message) && message.room && typeof message.room === 'string') { // Message is a room message
                        socket.to(message.room).emit(this.messageEventName_, message);
                    }
                    else { // Message is a broadcast message
                        socket.broadcast.emit(this.messageEventName_, message);
                    }
                });
                socket.on('typing', (room) => {
                    socket.to(room).emit('typing', {
                        room,
                        id: socket.id,
                    });
                });
                socket.on('typing.stop', (room) => {
                    socket.to(room).emit('typing.stop', {
                        room,
                        id: socket.id,
                    });
                });
            }
            Object.entries(this.customEventHandlers_).forEach(([eventName, handler]) => {
                socket.on(eventName, (...args) => {
                    handler(socket, ...args);
                });
            });
            socket.emit('connected', socket.id); // Echo socket ID to the client that connected
        };
        SocketServer.http_ = http;
    }
    get MessageEventName() {
        return this.messageEventName_;
    }
    set MessageEventName(value) {
        this.messageEventName_ = value;
    }
    AddCustomEventHandler(eventName, handler) {
        this.customEventHandlers_[eventName] = handler;
    }
    RemoveCustomEventHandler(eventName) {
        delete this.customEventHandlers_[eventName];
    }
    Start() {
        this.on('connection', this.eventHandler_);
    }
    Stop() {
        this.off('connection', this.eventHandler_);
    }
    static GetInstance(listener, http) {
        if (!SocketServer.io_) {
            SocketServer.io_ = new SocketServer(http || SocketServer.GetHttpServer(listener));
        }
        return SocketServer.io_;
    }
    static DestroyInstance() {
        var _a, _b;
        (_a = SocketServer.io_) === null || _a === void 0 ? void 0 : _a.Stop();
        (_b = SocketServer.io_) === null || _b === void 0 ? void 0 : _b.close();
        SocketServer.io_ = null;
    }
    static GetHttpServer(listener) {
        if (!SocketServer.http_) {
            SocketServer.http_ = createServer(listener);
        }
        return SocketServer.http_;
    }
}
export default SocketServer;
