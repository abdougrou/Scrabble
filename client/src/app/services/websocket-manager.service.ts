import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';

@Injectable()
export class WebsocketManagerService {
    socket: Socket = io('http://localhost:3000');
    constructor() {
        this.socket.on('hello', (args: string) => {
            console.log(this.socket.id, args);
        });
    }
}
