import { LobbyConfig } from '@common/lobby-config';
import { GameManager } from './game-manager';

export class Lobby {
    key: string;
    config: LobbyConfig;
    gameManager: GameManager;
    started: boolean = false;

    constructor(key: string, config: LobbyConfig) {
        this.key = key;
        this.config = config;
        this.gameManager = new GameManager(config);
    }
}
