import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '@app/classes/player';
import { GameManagerService } from '@app/services/game-manager.service';
import { PlaceResult } from '@common/command-result';
import { Vec2 } from '@common/vec2';
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
            return this.multiGameManager.getMainPlayer();
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

    placeWord(word: string, coord: Vec2, vertical: boolean, player: Player): PlaceResult {
        if (this.isMultiplayer) {
            this.multiGameManager.placeMouseLetters(word, coord, vertical, player);
            return PlaceResult.Success;
        } else return this.soloGameManager.placeLetters(player, word, coord, vertical);
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
