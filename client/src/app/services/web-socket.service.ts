import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    availableRooms: Set<number> = new Set<number>();
    private socket: io.Socket;
    private connected = false;
    constructor() {
        console.log("allo");
        this.socket = io.io('http://localhost:3000');
        this.enableListeners();
    }

    // TODO remove default value for testing purposes only
    startMultiplayerGame(playerName: string, roomId: number = 0): boolean {
        if (!this.connected) return false;
        this.socket.emit('start multiplayer game', playerName);
        this.socket.emit('on user join room', playerName, roomId);
        return true;
    }

    createRoom(playerName: string): void {
        this.socket.emit('user created room', playerName);
    }

    private enableListeners(): void {
        this.socket.on('user connected', (socketId: string) => {
            this.connected = true;
        });
        this.socket.on('room created', (roomId: number) => this.availableRooms.add(roomId));
        this.socket.on('room unavailable', (roomId: number) => this.availableRooms.delete(roomId));
    }
}
