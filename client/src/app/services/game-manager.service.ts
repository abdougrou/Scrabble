/* eslint-disable complexity */
import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';
import { Player } from '@app/classes/player';
import { LetterCoords, Tile, TileCoords } from '@app/classes/tile';
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
    debug: boolean = false;

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

    activateDebug(): string {
        if (this.debug) {
            this.debug = false;
            return 'affichages de débogage désactivés';
        } else {
            this.debug = true;
            return 'affichages de débogage activés';
        }
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
        //  Transform coordinates from string to vec2
        const coord: Vec2 = this.getCoordinateFromString(coordStr);

        //  Check if it's the player's turn to play
        if (this.players.current !== player) return "Ce n'est pas votre tour";

        //  Find the coordinates of each letter of the word
        const lettersToRetrieve: LetterCoords[] = new Array();
        for (let i = 0; i < word.length; i++) {
            const letterCoord: Vec2 = vertical ? { x: coord.x, y: coord.y + i } : { x: coord.x + i, y: coord.y };
            const currentLetter = word.charAt(i);
            if (currentLetter === currentLetter.toUpperCase()) {
                lettersToRetrieve.push({ letter: '*', coords: letterCoord });
            } else {
                lettersToRetrieve.push({ letter: currentLetter, coords: letterCoord });
            }
        }

        //  Compare the letter positions to the tiles on the board
        if (this.lettersCollideWithBoardTiles(lettersToRetrieve)) return 'Commande impossible a realise';

        //  Check that the command will lead to tiles being placed
        if (lettersToRetrieve.length === 0) return 'Le mot que vous tentez de placer se trouve deja sur le tableau';

        //  Check that the easel contains all the needed letters
        if (!player.easel.containsTiles(this.getStringToRetrieve(lettersToRetrieve))) return 'Votre chevalet ne contient pas les lettres nécessaires';

        //  Retrieve the correct tiles from the player's easel
        const retrievedTiles: Tile[] = player.easel.getTiles(this.getStringToRetrieve(lettersToRetrieve));
        //  Get the tiles to be placed on the board
        const tilesToPlace: TileCoords[] = this.getTilesToPlace(lettersToRetrieve, retrievedTiles, word, coord, vertical);

        //  Check that the position of the word is valid
        if (this.validWordPosition(word, tilesToPlace, vertical)) {
            //  check that the word itself is valid
            if (this.wordValidation.validateWords(tilesToPlace, player)) {
                //  We place the tiles on the board and give the player new tiles if the word and position are valid
                for (const aTile of tilesToPlace) {
                    this.board.placeTile(aTile.coords, aTile.tile);
                }
                const numTiles = this.reserve.tileCount < tilesToPlace.length ? this.reserve.tileCount : tilesToPlace.length;
                player.easel.addTiles(this.reserve.getLetters(numTiles));
            } else {
                //  we give the player his tiles back if the position of his word is invalid
                player.easel.addTiles(retrievedTiles);
                return 'le mot nest pas dans le dictionnaire';
            }
        } else {
            //  We give the player his tiles back if the word is invalid
            player.easel.addTiles(retrievedTiles);
            return 'placement de mot invalide';
        }
        this.gridService.drawBoard();
        return `${player.name} a placé le mot "${word}" ${vertical ? 'verticale' : 'horizontale'}ment à la case ${coordStr}`;
    }

    getCoordinateFromString(coordStr: string): Vec2 {
        const CHAR_OFFSET = 'a'.charCodeAt(0);
        const coordX = parseInt(coordStr.substr(1, coordStr.length), 10) - 1;
        const coordY = coordStr[0].toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        return { x: coordX, y: coordY } as Vec2;
    }

    private lettersCollideWithBoardTiles(lettersToRetrieve: LetterCoords[]): boolean {
        //  We iterate backwards in order to splice elements without having to break the loop
        for (let i = lettersToRetrieve.length - 1; i >= 0; i--) {
            const boardTile: Tile | undefined = this.board.getTile(lettersToRetrieve[i].coords);
            if (boardTile !== undefined) {
                if (boardTile.letter === lettersToRetrieve[i].letter) {
                    lettersToRetrieve.splice(i, 1);
                } else {
                    return true;
                }
            }
        }
        return false;
    }
    private getTilesToPlace(lettersToRetrieve: LetterCoords[], retrievedTiles: Tile[], word: string, coord: Vec2, vertical: boolean): TileCoords[] {
        const tilesToPlace: TileCoords[] = new Array();
        for (let i = 0; i < retrievedTiles.length; i++) {
            if (retrievedTiles[i].letter !== '*') {
                tilesToPlace.push({ tile: retrievedTiles[i], coords: lettersToRetrieve[i].coords });
            } else {
                const index = vertical ? lettersToRetrieve[i].coords.y - coord.y : lettersToRetrieve[i].coords.x - coord.x;
                tilesToPlace.push({
                    tile: { letter: word.charAt(index).toLowerCase(), points: retrievedTiles[i].points },
                    coords: lettersToRetrieve[i].coords,
                });
            }
        }
        return tilesToPlace;
    }
    private getStringToRetrieve(lettersToRetrieve: LetterCoords[]): string {
        let stringToRetrieve = '';
        for (const aLetter of lettersToRetrieve) {
            stringToRetrieve += aLetter.letter;
        }
        return stringToRetrieve;
    }
    private validWordPosition(word: string, tilesToPlace: TileCoords[], vertical: boolean): boolean {
        const BOARD_CENTER: Vec2 = { x: 7, y: 7 };
        //  Check if word is placed outside of the board
        for (const aTile of tilesToPlace) {
            if (aTile.coords.x >= GRID_SIZE || aTile.coords.y >= GRID_SIZE) return false;
        }
        //  if first turn, the word must touch the center of the board
        if (this.board.board.size === 0) {
            let isCenter = false;
            for (const aTile of tilesToPlace) {
                if (aTile.coords.x === BOARD_CENTER.x && aTile.coords.y === BOARD_CENTER.y) {
                    isCenter = true;
                }
            }
            return isCenter;
        }
        // If size of tiles to be placed is inferior to size of word we can determine the word touches another one
        if (tilesToPlace.length < word.length) {
            return true;
        } else {
            //  Iterate through the tiles to see if any of them is adjacent to a tile on the board
            let isTouching = false;
            for (const aTile of tilesToPlace) {
                const firstCoord = vertical ? { x: aTile.coords.x + 1, y: aTile.coords.y } : { x: aTile.coords.x, y: aTile.coords.y + 1 };
                const secondCoord = vertical ? { x: aTile.coords.x - 1, y: aTile.coords.y } : { x: aTile.coords.x, y: aTile.coords.y - 1 };
                if (this.board.getTile(firstCoord) !== undefined || this.board.getTile(secondCoord) !== undefined) isTouching = true;
            }
            return isTouching;
        }
    }
}
