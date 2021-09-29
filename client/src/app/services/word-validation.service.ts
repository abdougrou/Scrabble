import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player } from '@app/classes/player';
import { Tile, TileCoords } from '@app/classes/tile';
import { BoardService } from './board.service';
import { CalculatePointsService } from './calculate-points.service';

const BOARD_SIZE = 15;

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    dictionnary: string[];
    newWordTiles: TileCoords[][];

    constructor(private httpClient: HttpClient, private boardService: BoardService, private calculatePointsService: CalculatePointsService) {
        this.getDictionnary();
    }

    /**
     * @param newTiles the tiles placed on the board by the player
     * @param player the player which has placed the tiles
     * @returns true if validation is complete, otherwise it returns false
     */
    validateWords(newTiles: TileCoords[], player: Player): boolean {
        let isValid = true;
        const wordsBefore: string[] = this.findWordsFromBoard();
        //  Removing the accents from the new tiles and adding them to a temporary copy of the board
        this.removeAccents(newTiles);

        //  End validation if the player entered an invalid character or placed a tile on top of another
        if (!this.checkValidLetters(newTiles)) {
            isValid = false;
        }

        //  Checks that no tiles overlapse before placing them on the board
        if (!this.placeNewTiles(newTiles)) {
            isValid = false;
        }
        //  checking That all tiles have at least one adjacent tile
        if (!this.noLoneTile(newTiles)) {
            isValid = false;
        }

        //  Getting all the words from the board and only keeping the newly formed ones
        let wordsAfter: string[] = this.findWordsFromBoard();
        for (const wordA of wordsAfter) {
            for (const wordB of wordsBefore) {
                if (JSON.stringify(wordA) === JSON.stringify(wordB)) {
                    wordsAfter = wordsAfter.filter((obj) => obj !== wordA);
                }
            }
        }

        //  check if all the new words are contained in the dictionary
        if (!this.wordInDictionnary(wordsAfter)) {
            isValid = false;
        }
        //  Resetting the board after validation
        for (const aTile of newTiles) {
            this.boardService.board.delete(this.boardService.coordToKey(aTile.coords));
        }
        if (isValid) {
            this.calculatePointsService.calculatePoints(this.newWordTiles, newTiles, player);
        }
        return isValid;
    }

    private findWordsFromBoard(): string[] {
        this.newWordTiles = new Array();
        const boardWords: string[] = new Array();
        for (let i = 0; i < BOARD_SIZE; i++) {
            let currentWord = '';
            let currentWordTile: TileCoords[] = new Array();
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.boardService.getTile({ x: i, y: j }) !== undefined) {
                    currentWord += this.boardService.getTile({ x: i, y: j })?.letter;
                    const currentTile: Tile = {
                        letter: this.boardService.getTile({ x: i, y: j })?.letter as string,
                        points: this.boardService.getTile({ x: i, y: j })?.points as number,
                    };
                    currentWordTile.push({ tile: currentTile, coords: { x: i, y: j } });
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                        this.newWordTiles.push(currentWordTile);
                    }
                    currentWord = '';
                    currentWordTile = new Array();
                }
            }
            if (currentWord.length > 1) {
                boardWords.push(currentWord);
                this.newWordTiles.push(currentWordTile);
            }
            currentWord = '';
            currentWordTile = new Array();
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.boardService.getTile({ x: j, y: i }) !== undefined) {
                    currentWord += this.boardService.getTile({ x: j, y: i })?.letter;
                    const currentTile: Tile = {
                        letter: this.boardService.getTile({ x: j, y: i })?.letter as string,
                        points: this.boardService.getTile({ x: j, y: i })?.points as number,
                    };
                    currentWordTile.push({ tile: currentTile, coords: { x: j, y: i } });
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                        this.newWordTiles.push(currentWordTile);
                    }
                    currentWord = '';
                    currentWordTile = new Array();
                }
            }
            if (currentWord.length > 1) {
                boardWords.push(currentWord);
                this.newWordTiles.push(currentWordTile);
            }
        }
        return boardWords;
    }

    private removeAccents(newTiles: TileCoords[]) {
        for (const aTile of newTiles) {
            aTile.tile.letter = aTile.tile.letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
    }

    private checkValidLetters(newTiles: TileCoords[]): boolean {
        for (const aTile of newTiles) {
            if (aTile.tile.letter === '-' || aTile.tile.letter === "'") {
                return false;
            }
        }
        return true;
    }

    private placeNewTiles(newTiles: TileCoords[]) {
        for (const aTile of newTiles) {
            if (aTile.coords.x >= BOARD_SIZE || aTile.coords.y >= BOARD_SIZE) {
                return false;
            }
            if (this.boardService.getTile(aTile.coords) === undefined) {
                this.boardService.placeTile(aTile.coords, aTile.tile);
            } else {
                return false;
            }
        }
        return true;
    }

    private noLoneTile(newTiles: TileCoords[]): boolean {
        for (const aTile of newTiles) {
            let hasAdjacent = false;
            if (aTile.coords.x !== 0) {
                if (this.boardService.getTile({ x: aTile.coords.x - 1, y: aTile.coords.y }) !== undefined) {
                    hasAdjacent = true;
                }
            }
            if (aTile.coords.x < BOARD_SIZE - 1) {
                if (this.boardService.getTile({ x: aTile.coords.x + 1, y: aTile.coords.y }) !== undefined) {
                    hasAdjacent = true;
                }
            }
            if (aTile.coords.y !== 0) {
                if (this.boardService.getTile({ x: aTile.coords.x, y: aTile.coords.y - 1 }) !== undefined) {
                    hasAdjacent = true;
                }
            }
            if (aTile.coords.y < BOARD_SIZE - 1) {
                if (this.boardService.getTile({ x: aTile.coords.x, y: aTile.coords.y + 1 }) !== undefined) {
                    hasAdjacent = true;
                }
            }
            if (!hasAdjacent) {
                return false;
            }
        }
        return true;
    }

    private wordInDictionnary(words: string[]): boolean {
        for (const word of words) {
            if (!this.dictionnary.includes(word)) {
                return false;
            }
        }
        return true;
    }

    private getDictionnary() {
        this.httpClient.get('../../assets/dictionnary.json').subscribe((data) => {
            const dictionnaryJson = data;
            this.dictionnary = JSON.parse(JSON.stringify(dictionnaryJson)).words;
        });
    }
}
