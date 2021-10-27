import { Socket } from 'socket.io';
import { GameConfig } from './game-config';

export class Lobby {
    socket: Socket;
    key: string;
    gameConfig: GameConfig;
    
    constructor(key: string, config: GameConfig) {
        this.key = key;
        this.gameConfig = config;
    }
    
    /**
     * Connects Lobby socket to Client socket
     */
    join(socket: Socket) {
        this.socket.emit('join', (playerName: string) => {
            console.log(`${playerName} joined the lobby`);
        });
    }
    
    /**
     * Disconnects all clients
     */
    destroy() {
        
    }
}
