import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { GameConfig } from '@app/classes/game-config';
import { Player } from '@app/classes/player';
import { Reserve } from '@app/classes/reserve';
import { Tile } from '@app/classes/tile';
import { timer } from 'rxjs';

// const BOARD_DIMENSION = 15;
const FIRST_PLAYER_COIN_FLIP = 0.5;
const STARTING_TILE_AMOUNT = 7;
const SECOND_MD = 1000;

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    board: Tile[][];
    reserve: Reserve;

    players: Player[] = [];
    get currentPlayer(): Player {
        return this.players[0];
    }

    turnDuration: number;
    currentTurnDurationLeft: number;

    initialize(gameConfig: GameConfig) {
        this.board = [[]];
        this.reserve = new Reserve();

        this.turnDuration = gameConfig.duration;
        this.currentTurnDurationLeft = gameConfig.duration;

        this.initializePlayers([gameConfig.playerName1, gameConfig.playerName2]);

        this.givePlayerTiles(this.players[0], STARTING_TILE_AMOUNT);
        this.givePlayerTiles(this.players[1], STARTING_TILE_AMOUNT);

        this.startTimer();
    }

    startTimer() {
        const source = timer(0, SECOND_MD);
        source.subscribe((seconds) => {
            this.currentTurnDurationLeft = this.turnDuration - (seconds % this.turnDuration) - 1;
            if (this.currentTurnDurationLeft === 0) {
                this.currentTurnDurationLeft = this.turnDuration;
                this.switchPlayer();

                // TODO send player switch event
            }
        });
    }

    initializePlayers(playerNames: string[], chance: number = Math.random()) {
        this.players = [];
        this.players.push({
            name: playerNames[0],
            score: 0,
            easel: new Easel(),
        });
        this.players.push({
            name: playerNames[1],
            score: 0,
            easel: new Easel(),
        });
        if (chance > FIRST_PLAYER_COIN_FLIP) this.players.reverse();
    }

    switchPlayer() {
        this.players.reverse();
        this.currentTurnDurationLeft = this.turnDuration;
    }

    givePlayerTiles(player: Player, amount: number) {
        const tiles: Tile[] = this.reserve.getLetters(amount);
        player.easel.addTiles(tiles);
    }

    // TODO to be used by commands
    // exchangeTiles(tiles: Tile[]) {}
    // placeTiles(word: string, coord: Vec2, vertical: boolean) {}
}
