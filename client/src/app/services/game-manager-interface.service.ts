import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { GameManagerService } from './game-manager.service';
import { MultiplayerGameManagerService } from './multiplayer-game-manager.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerInterfaceService {
    mainPlayer: Player;

    isMultiplayer: boolean;
    constructor(
        public soloGameManager: GameManagerService,
        public multiGameManager: MultiplayerGameManagerService,
        public playerService: PlayerService,
        public router: Router,
    ) {
        this.isMultiplayer = this.router.url === '/multiplayer-game';
        this.mainPlayer = this.getMainPlayer();
        this.multiGameManager.updatePlayer.asObservable().subscribe((msg) => {
            this.update(msg);
        });
    }

    update(msg: string) {
        if (msg === 'updated') {
            this.mainPlayer = this.getMainPlayer();
        }
    }

    getMainPlayer(): Player {
        if (this.isMultiplayer) {
            return this.multiGameManager.players.find((player) => player.name === this.multiGameManager.mainPlayerName) as Player;
        } else {
            return this.playerService.players.find((player) => player.name === this.soloGameManager.mainPlayerName) as Player;
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

    placeTilesMouse(word: string, coordStr: Vec2, vertical: boolean, player: Player) {
        this.multiGameManager.placeMouseLetters(word, coordStr, vertical, player);
    }

    switchPlayers() {
        if (this.isMultiplayer) this.multiGameManager.switchPlayers();
        else this.soloGameManager.switchPlayers();
    }
    exchangeTiles(letters: string, player: Player) {
        if (this.isMultiplayer) this.multiGameManager.exchangeLetters(letters, player);
        else this.soloGameManager.exchangeLetters(player, letters.split(''));
    }
}
