import { Lobby, LobbyConfig } from '@common/lobby';
import { Socket } from 'socket.io';
import { Service } from 'typedi';

@Service()
export class LobbyManager {
    /**
     * Map containing all active lobbies
     */
    static lobbies: Map<string, Lobby> = new Map();
    
    /**
     * Creates a new lobby and adds it to the lobbies list
     * 
     * @param config game configuration
     * @return lobby key
     */
    static createLobby(config: LobbyConfig): string {
        let key = this.generateKey();
        while (this.lobbies.get(key)) key = this.generateKey();
        const lobby: Lobby = { key: key, config: config };
        this.lobbies.set(key, lobby);
        return key;
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
            // Join
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
        this.lobbies.delete(key);
    }

    /**
     * Generate a random string key
     * 
     * @return unique key string
     */
    static generateKey(): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 8; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
