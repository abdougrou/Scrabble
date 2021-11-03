import { LobbyConfig } from '@common/lobby-config';
import { GameManager } from './game-manager';

export class Lobby {
    config: LobbyConfig;
    gameManager: GameManager;
    started: boolean = false;

    constructor(config: LobbyConfig) {
        this.config = config;
        this.gameManager = new GameManager();
    }
}
