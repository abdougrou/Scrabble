import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';
import { Player } from '@app/classes/player';
import { Tile, TileCoords } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { GRID_SIZE, RANDOM_PLAYER_NAMES, SECOND_MD, STARTING_TILE_AMOUNT } from '@app/constants';
import { timer } from 'rxjs';
import { BoardService } from './board.service';
import { GridService } from './grid.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';
import { WordValidationService } from './word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    turnDuration: number;
    currentTurnDurationLeft: number;
    randomPlayerNameIndex: number;

    mainPlayerName: string;
    enemyPlayerName: string;

    constructor(
        private board: BoardService,
        private reserve: ReserveService,
        private players: PlayerService,
        private gridService: GridService,
        private wordValidation: WordValidationService,
    ) {}

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
        // if (Math.random() > FIRST_PLAYER_COIN_FLIP) this.switchPlayers();
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
        } else if (!player.easel.containsTiles(tiles)) {
            return 'Votre chevalet ne contient pas les lettres nécessaires';
        } else {
            const easelTiles: Tile[] = player.easel.getTiles(tiles); // getTiles remove and get the tiles
            const reserveTiles: Tile[] = this.reserve.getLetters(tiles.length);
            player.easel.addTiles(reserveTiles);
            this.reserve.returnLetters(easelTiles);
            return `${player.name} a échangé les lettres ${tiles}`;
        }
    }

    placeTiles(word: string, coordStr: string, vertical: boolean, player: Player): string {
        const coord: Vec2 = this.getCoordinateFromString(coordStr);
        if (this.players.current !== player) return "Ce n'est pas votre tour";

        //  check if word can fit on board
        if (!this.wordFitsOnBoard(vertical, word, coord)) return 'Commande impossible a realise';
        // chek first turn
        const coords: Vec2[] = new Array();
        const neededLetters = this.findNeededLetters(word, coord, coords, vertical);
        if (neededLetters === 'Commande impossible a realise') return 'Commande impossible a realise';
        if (neededLetters.length === 0) return 'Vous ne pouvez pas placer le mot';
        else if (!player.easel.containsTiles(neededLetters)) return 'Votre chevalet ne contient pas les lettres nécessaires';

        //  valider avant de place
        const neededTiles = player.easel.getTiles(neededLetters);
        if (this.validWordPosition(word, coords, vertical)) {
            if (this.validateWordsWrapper(coords, neededTiles)) {
                for (let i = 0; i < neededLetters.length; i++) {
                    this.board.placeTile(coords[i], { letter: neededTiles[i].letter, points: neededTiles[i].points });
                }
                player.easel.addTiles(this.reserve.getLetters(neededTiles.length));
            } else {
                player.easel.addTiles(neededTiles);
                return 'le mot nest pas dans le dictionnaire';
            }
        } else {
            player.easel.addTiles(neededTiles);
            return 'la position de votre mot nest pas valide';
        }
        this.gridService.drawBoard();
        return `${player.name} a placé le mot "${word}" ${vertical ? 'verticale' : 'horizentale'}ment à la case ${coordStr}`;
    }

    getCoordinateFromString(coordStr: string): Vec2 {
        const CHAR_OFFSET = 'a'.charCodeAt(0);
        const coordX = parseInt(coordStr.substr(1, coordStr.length), 10) - 1;
        const coordY = coordStr[0].toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        return { x: coordX, y: coordY } as Vec2;
    }

    private validWordPosition(word: string, coords: Vec2[], vertical: boolean): boolean {
        if (this.board.board.size === 0) return this.wordInCenterOfBoard(coords);
        // if the size of coords is inferior to the size of word, the word is made up of tiles from the board and the easel
        if (coords.length < word.length) return true;
        return this.notALoneWord(word, coords, vertical);
    }

    private wordInCenterOfBoard(coords: Vec2[]): boolean {
        const BOARD_CENTER: Vec2 = { x: 7, y: 7 };
        for (const coord of coords) {
            if (coord.x === BOARD_CENTER.x && coord.y === BOARD_CENTER.y) return true;
        }
        return false;
    }

    private notALoneWord(word: string, coords: Vec2[], vertical: boolean): boolean {
        let isTouching = false;
        let firstCoord: Vec2;
        let secondCoord: Vec2;
        for (const coord of coords) {
            if (vertical) {
                firstCoord = { x: coord.x + 1, y: coord.y };
                secondCoord = { x: coord.x + 1, y: coord.y };
            } else {
                firstCoord = { x: coord.x + 1, y: coord.y };
                secondCoord = { x: coord.x + 1, y: coord.y };
            }
            if (this.board.getTile(firstCoord) !== undefined || this.board.getTile(secondCoord) !== undefined) {
                isTouching = true;
            }
        }
        return isTouching;
    }
    private validateWordsWrapper(coordsLetterNeeded: Vec2[], neededTiles: Tile[]): boolean {
        const tileCoords: TileCoords[] = new Array();
        for (let i = 0; i < coordsLetterNeeded.length; i++) {
            tileCoords.push({ tile: neededTiles[i], coords: coordsLetterNeeded[i] });
        }
        return this.wordValidation.validateWords(tileCoords);
    }

    private wordFitsOnBoard(vertical: boolean, word: string, coord: Vec2): boolean {
        if (vertical) {
            if (coord.y + word.length > GRID_SIZE) return false;
        } else {
            if (coord.x + word.length > GRID_SIZE) return false;
        }
        return true;
    }

    private findNeededLetters(word: string, coord: Vec2, coordsNeeded: Vec2[], vertical: boolean): string {
        let neededLetters = '';
        for (let i = 0; i < word.length; i++) {
            let nextCoord: Vec2;
            if (!vertical) nextCoord = { x: coord.x + i, y: coord.y };
            else nextCoord = { x: coord.x, y: coord.y + i };

            const tile: Tile | undefined = this.board.getTile(nextCoord);
            if (tile !== undefined) {
                if (tile.letter !== word.charAt(i)) return 'Commande impossible a realise';
            } else if (word.charAt(i)) {
                neededLetters += word.charAt(i);
                coordsNeeded.push(nextCoord);
            }
        }
        return neededLetters;
    }
}
