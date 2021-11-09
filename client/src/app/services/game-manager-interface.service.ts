import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '@app/classes/player';
import { GameManagerService } from './game-manager.service';
import { MultiplayerGameManagerService } from './multiplayer-game-manager.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerInterfaceService {
    isMultiplayer: boolean;
    constructor(
        public soloGameManager: GameManagerService,
        public multiGameManager: MultiplayerGameManagerService,
        public playerService: PlayerService,
        public router: Router,
    ) {
        this.isMultiplayer = this.router.url === '/multiplayer-game';
    }

    getMainPlayer(): Player {
        if (this.isMultiplayer) {
            return this.multiGameManager.players[0].name === this.multiGameManager.mainPlayerName
                ? this.multiGameManager.players[0]
                : this.multiGameManager.players[1];
        } else {
            return this.playerService.players[0].name === this.soloGameManager.mainPlayerName
                ? this.playerService.players[0]
                : this.playerService.players[1];
        }
    }

    getCurrentPlayer(): Player {
        return this.isMultiplayer ? this.multiGameManager.players[0] : this.soloGameManager.players.current;
    }

    skipTurn() {
        if (this.isMultiplayer) this.multiGameManager.skipTurn();
        else this.soloGameManager.skipTurn();
    }

    placeTiles(word: string, coordStr: string, vertical: boolean, player: Player) {
        if (this.isMultiplayer) this.multiGameManager.placeLetters(word, coordStr, vertical, player);
        else this.soloGameManager.placeTiles(word, coordStr, vertical, player);
    }

    switchPlayers() {
        if (this.isMultiplayer) this.multiGameManager.switchPlayers();
        else this.soloGameManager.switchPlayers();
    }
}
