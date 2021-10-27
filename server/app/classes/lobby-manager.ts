import { Server } from '@app/server';
import { Socket } from 'socket.io';
import { GameConfig } from './game-config';
import { Lobby } from './lobby';

export class LobbyManager {
    /**
     * Map containing all active lobbies
     */
    static lobbies: Map<string, Lobby> = new Map();

    constructor( server: Server) {};
    
    /**
     * Creates a new lobby and adds it to the lobb
     * 
     * @param config game configuration
     */
    static createLobby(config: GameConfig) {
        const lobby = new Lobby('',config);
        this.lobbies.set('uwu', lobby);
    }

    /**
     * Join a lobby if it exists
     * 
     * @param key lobby key
     * @return true if the lobbie exists, false otherwise
     */
    static joinLobby(key: string, socket: Socket): boolean {
        const lobby = this.lobbies.get(key);
        if (lobby) {
            lobby.join(socket);
            return true;
        }
        return false;
    }

    /**
     * Gets a lobby from the lobby list
     * 
     * @param key lobby key
     * @return Lobby if the key exists, undefined otherwise
     */
    static getLobby(key: string): Lobby | undefined {
        return this.lobbies.get(key);
    }

    /**
     * Destroys a lobby if it exists
     * 
     * @param key lobby key
     */
    static deleteLobby(key: string) {
        this.lobbies.get(key)?.destroy();
        this.lobbies.delete(key);
    }
}

