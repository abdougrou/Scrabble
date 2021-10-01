import { Injectable } from '@angular/core';
import { Tile, TileCoords } from '@app/classes/tile';
import { BoardService } from './board.service';
import {
    GRID_SIZE,
    TILE_NUM_BONUS,
    FULL_EASEL_BONUS,
    LIGHT_BLUE_MULTIPLIER,
    DARK_BLUE_MULTIPLIER,
    PINK_MULTIPLIER,
    RED_MULTIPLIER,
    BOARD_MULTIPLIER,
} from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class CalculatePointsService {
    constructor(private boardService: BoardService) {}

    /**
     * @param newTiles an array of tileCoords that we would like to place on the board
     * @returns the points that the player would gain by placing these tiles
     */
    calculatePoints(newTiles: TileCoords[]): number {
        let points = 0;

        if (newTiles.length === TILE_NUM_BONUS) {
            points += FULL_EASEL_BONUS;
        }

        //  Find the words that were on the board before the addition of the new tiles
        const wordTilesBefore: TileCoords[][] = this.findWordTilesFromBoard(this.boardService.board);

        //  Place the new tiles on a temporary copy of the board
        const boardCopy: Map<number, Tile> = new Map(this.boardService.board);
        for (const aTile of newTiles) {
            boardCopy.set(this.boardService.coordToKey(aTile.coords), aTile.tile);
        }

        //  Find the words on the board with the addition of the new tiles
        let wordTilesAfter: TileCoords[][] = this.findWordTilesFromBoard(boardCopy);

        //  Keep only the words that were formed by the addition of the new tiles
        for (const wordA of wordTilesAfter) {
            for (const wordB of wordTilesBefore) {
                if (wordA.length === wordB.length) {
                    for (let i = 0; i < wordA.length; i++) {
                        if (wordA[i].coords.x === wordB[i].coords.x && wordA[i].coords.y === wordB[i].coords.y) {
                            wordTilesAfter = wordTilesAfter.filter((obj) => obj !== wordA);
                        }
                    }
                }
            }
        }
        for (const tile of wordTilesAfter) {
            points += this.calculateWordPoint(tile, newTiles);
        }
        return points;
    }

    /**
     * @param tiles all the tiles forming the new word
     * @param newTiles the tiles in the word that have been placed this turn
     * @returns the points associated to this word
     */
    calculateWordPoint(tiles: TileCoords[], newTiles: TileCoords[]): number {
        let points = 0;
        let numNewPinkTiles = 0;
        let numNewRedTiles = 0;
        const blank = 0;
        const lightBlue = 1;
        const darkBlue = 2;
        const pink = 3;
        const red = 4;
        for (const tile of tiles) {
            if (!this.isNewTile(tile, newTiles)) {
                points += tile.tile.points;
            } else {
                const multiplier = this.getTileMultiplier(tile);
                switch (multiplier) {
                    case blank:
                        points += tile.tile.points;
                        break;
                    case lightBlue:
                        points += LIGHT_BLUE_MULTIPLIER * tile.tile.points;
                        break;
                    case darkBlue:
                        points += DARK_BLUE_MULTIPLIER * tile.tile.points;
                        break;
                    case pink:
                        points += tile.tile.points;
                        numNewPinkTiles++;
                        break;
                    case red:
                        points += tile.tile.points;
                        numNewRedTiles++;
                        break;
                }
            }
        }
        if (numNewPinkTiles !== 0) {
            points *= Math.pow(PINK_MULTIPLIER, numNewPinkTiles);
        }
        if (numNewRedTiles !== 0) {
            points *= Math.pow(RED_MULTIPLIER, numNewRedTiles);
        }
        return points;
    }

    /**
     * @param tile a tile currently on the board
     * @param newTiles an array representing all the tiles placed on this turn
     * @returns wether or not the tile has been placed on this turn
     */
    private isNewTile(tile: TileCoords, newTiles: TileCoords[]): boolean {
        for (const aTile of newTiles) {
            if (JSON.stringify(tile) === JSON.stringify(aTile)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param tile a tile currently on the board
     * @returns the multiplier of that tile
     */
    private getTileMultiplier(tile: TileCoords): number {
        return BOARD_MULTIPLIER[tile.coords.y][tile.coords.x];
    }

    /**
     * @param board a map of tile values and number keys
     * @returns an array of TileCoords array where every array contains the tileCoords of a word
     */
    private findWordTilesFromBoard(board: Map<number, Tile>): TileCoords[][] {
        const boardWords: TileCoords[][] = [[]];

        //  Find all vertical words
        for (let i = 0; i < GRID_SIZE; i++) {
            let currentWordTiles: TileCoords[] = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board.get(this.boardService.coordToKey({ x: i, y: j }))) {
                    currentWordTiles.push({ tile: board.get(this.boardService.coordToKey({ x: i, y: j })) as Tile, coords: { x: i, y: j } });
                } else {
                    if (currentWordTiles.length > 1) {
                        boardWords.push(currentWordTiles);
                    }
                    currentWordTiles = [];
                }
            }

            if (currentWordTiles.length > 1) {
                boardWords.push(currentWordTiles);
            }
            currentWordTiles = [];

            //  Find all horizontal words
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board.get(this.boardService.coordToKey({ x: j, y: i }))) {
                    currentWordTiles.push({ tile: board.get(this.boardService.coordToKey({ x: j, y: i })) as Tile, coords: { x: j, y: i } });
                } else {
                    if (currentWordTiles.length > 1) {
                        boardWords.push(currentWordTiles);
                    }
                    currentWordTiles = [];
                }
            }

            if (currentWordTiles.length > 1) {
                boardWords.push(currentWordTiles);
            }
        }
        return boardWords;
    }
}
