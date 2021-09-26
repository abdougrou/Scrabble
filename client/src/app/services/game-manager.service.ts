import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { FIRST_PLAYER_COIN_FLIP, GRID_SIZE, RANDOM_PLAYER_NAMES, SECOND_MD, STARTING_TILE_AMOUNT } from '@app/constants';
import { timer } from 'rxjs';
import { BoardService } from './board.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    turnDuration: number;
    currentTurnDurationLeft: number;
    randomPlayerNameIndex: number;
    isFirstTurn: boolean = true;

    mainPlayerName: string;
    enemyPlayerName: string;

    constructor(private board: BoardService, private reserve: ReserveService, private players: PlayerService) {}

    initialize(gameConfig: GameConfig) {
        this.mainPlayerName = gameConfig.playerName1;
        this.enemyPlayerName = gameConfig.playerName2;
        this.turnDuration = gameConfig.duration;
        this.currentTurnDurationLeft = gameConfig.duration;
        this.randomPlayerNameIndex = Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length);

        this.initializePlayers([gameConfig.playerName1, RANDOM_PLAYER_NAMES[this.randomPlayerNameIndex]]);

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

    skipTurn() {
        this.players.incrementSkipCounter();
        this.switchPlayers();
    }

    // TODO skipCounter to reset when place or exchange command excuted

    // TODO implement stopTimer() to end the game after 6 skipTurn

    reset() {
        this.players.clear();
    }

    exchangeTiles(tiles: string, player: Player): string {
        if (this.players.current !== player) {
            return "Ce n'est pas votre tour";
        } else if (!this.reserve.isExchangePossible(tiles.length)) {
            return "Il n'y a pas assez de tuiles dans la réserve";
            // } else if (!player.easel.containsTiles(tiles)) {
            //     return 'Votre chevalet ne contient pas les lettres nécessaires';
        } else {
            const easelTiles: Tile[] = player.easel.getTiles(tiles);
            const reserveTiles: Tile[] = this.reserve.getLetters(tiles.length);
            player.easel.addTiles(reserveTiles);
            this.reserve.returnLetters(easelTiles);
            return player.name + ' a échangé les lettres suivantes (' + tiles + ') avec la réserve';
        }
    }

    placeTiles(word: string, coord: Vec2, vertical: boolean, player: Player) {
        //  check if word can fit on board
        if (this.players.current !== player) {
            //  return error message to chatbox saying not players turn
            return;
        }
        if (vertical) {
            if (coord.y + word.length > GRID_SIZE) {
                //  return error message to chatbox saying word is outside of board
                return;
            }
        } else {
            if (coord.x + word.length > GRID_SIZE) {
                //  return error message to chatbox saying word is outside of board
                return;
            }
        }
        const coords: Vec2[] = new Array();
        let counter = 0;
        const wordLenght = word.length;
        for (let i = 0; i < wordLenght; i++) {
            let nextCoord: Vec2;
            if (!vertical) {
                nextCoord = { x: coord.x + i, y: coord.y };
            } else {
                nextCoord = { x: coord.x, y: coord.y + i };
            }
            if (this.board.getTile(nextCoord) !== undefined) {
                if (this.board.getTile(nextCoord)?.letter !== word.charAt(counter)) {
                    //  return error message to chatbox saying word cant be placed
                    return;
                } else {
                    word = word.slice(0, counter) + word.slice(counter + 1);
                }
            } else {
                coords.push(nextCoord);
                counter++;
            }
        }
        if (word.length === 0) {
            //  return error message to chatbox saying no tiles to place
            return;
        }
        if (!player.easel.containsTiles(word)) {
            //  return error message to chatbox saying player doesnt have tiles
            return;
        } // player doesn't have tiles in easel

        //  valider avant de placer
        for (let i = 0; i < word.length; i++) {
            this.board.placeTile(
                {
                    x: coords[i].x,
                    y: coords[i].y,
                },
                {
                    letter: player.easel.getTiles(word[i])[0].letter,
                    points: 0,
                },
            );
        }
    }
}
