import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    // availableRooms: Set<number> = new Set<number>();
    // private connected = false;
    // private enableListeners(): void {
    //     this.socket.on('user connected', () => {
    //         this.connected = true;
    //     });
    //     this.socket.on('room created', (roomId: number) => this.availableRooms.add(roomId));
    //     this.socket.on('room unavailable', (roomId: number) => this.availableRooms.delete(roomId));
    // }
}
