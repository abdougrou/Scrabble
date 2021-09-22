import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { FIRST_PLAYER_COIN_FLIP, SECOND_MD, STARTING_TILE_AMOUNT } from '@app/constants';
import { timer } from 'rxjs';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    board: Tile[][] = [[]];

    turnDuration: number;
    currentTurnDurationLeft: number;

    constructor(private reserve: ReserveService, private players: PlayerService) {}

    initialize(gameConfig: GameConfig) {
        this.turnDuration = gameConfig.duration;
        this.currentTurnDurationLeft = gameConfig.duration;

        this.initializePlayers([gameConfig.playerName1, gameConfig.playerName2]);

        this.startTimer();
    }

    startTimer() {
        const source = timer(0, SECOND_MD);
        source.subscribe((seconds) => {
            this.currentTurnDurationLeft = this.turnDuration - (seconds % this.turnDuration) - 1;
            if (this.currentTurnDurationLeft === 0) {
                this.currentTurnDurationLeft = this.turnDuration;
                this.switchPlayers();

                // TODO send player switch event
            }
        });
    }

    initializePlayers(playerNames: string[]) {
        this.players.createPlayer(playerNames[0], this.reserve.getLetters(STARTING_TILE_AMOUNT));
        this.players.createPlayer(playerNames[1], this.reserve.getLetters(STARTING_TILE_AMOUNT));
        if (Math.random() > FIRST_PLAYER_COIN_FLIP) this.switchPlayers();
    }

    switchPlayers() {
        this.players.switchPlayers();
        this.currentTurnDurationLeft = this.turnDuration;
        // Send player switch event
    }

    giveTiles(player: Player, amount: number) {
        const tiles: Tile[] = this.reserve.getLetters(amount);
        player.easel.addTiles(tiles);
    }

    // TODO to be used by commands
    // exchangeTiles(tiles: Tile[]) {}
    // placeTiles(word: string, coord: Vec2, vertical: boolean) {}
}
