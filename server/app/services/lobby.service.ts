import { Lobby } from '@app/classes/lobby';
import { LobbyConfig } from '@common/lobby-config';
import { Service } from 'typedi';

@Service()
export class LobbyService {
    /**
     * Map containing all active lobbies
     */
    lobbies: Map<string, Lobby> = new Map();

    /**
     * Creates a new lobby and adds it to the lobbies list
     *
     * @param config game configuration
     * @return lobby key
     */
    createLobby(config: LobbyConfig): string {
        let key = this.generateKey();
        while (this.lobbies.get(key)) key = this.generateKey();
        const lobby = new Lobby(key, config);
        this.lobbies.set(key, lobby);
        return key;
    }

    /**
     * Returns all lobbies
     *
     * @returns all lobbies in the service
     */
    getLobbies(): Lobby[] {
        return Array.from(this.lobbies.values());
    }

    /**
     * Join a lobby if it exists
     *
     * @param key lobby key
     * @return true a player has been added to the game, false otherwise
     */
    playerJoinLobby(name: string, key: string): boolean {
        const lobby = this.lobbies.get(key);
        if (lobby) return lobby.gameManager.addPlayer(name);
        return false;
    }

    playerLeaveLobby(name: string, key: string): boolean {
        const lobby = this.lobbies.get(key);
        if (lobby && lobby.gameManager.removePlayer(name)) {
            switch (lobby.gameManager.players.length) {
                case 0:
                    this.lobbies.delete(key);
                    return true;
                case 1:
                    // replace player by bot
                    return true;
            }
        }
        return false;
    }

    /**
     * Gets a lobby from the lobby list
     *
     * @param key lobby key
     * @return Lobby if the key exists, undefined otherwise
     */
    getLobby(key: string): Lobby | undefined {
        return this.lobbies.get(key);
    }

    /**
     * Destroys a lobby if it exists
     *
     * @param key lobby key
     */
    deleteLobby(key: string) {
        this.lobbies.delete(key);
    }

    /**
     * Generate a random string key
     *
     * @return unique key string
     */
    generateKey(): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const KEY_LEN = 8;
        for (let i = 0; i < KEY_LEN; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
