import { Injectable } from '@angular/core';
import { TileCoords } from '@app/classes/tile';
import { HttpClient } from '@angular/common/http';
import { BoardService } from './board.service';

const BOARD_SIZE = 15;

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    dictionnary: string[];

    constructor(private httpClient: HttpClient, private boardService: BoardService) {
        this.getDictionnary();
    }

    validateWords(newTiles: TileCoords[]): boolean {
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
        return isValid;
    }

    findWordsFromBoard(): string[] {
        const boardWords: string[] = new Array();
        for (let i = 0; i < BOARD_SIZE; i++) {
            let currentWord = '';
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.boardService.getTile({ x: i, y: j }) !== undefined) {
                    currentWord += this.boardService.getTile({ x: i, y: j })?.letter;
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                    }
                    currentWord = '';
                }
            }
            if (currentWord.length > 1) {
                boardWords.push(currentWord);
            }
            currentWord = '';
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.boardService.getTile({ x: j, y: i }) !== undefined) {
                    currentWord += this.boardService.getTile({ x: j, y: i })?.letter;
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                    }
                    currentWord = '';
                }
            }
            if (currentWord.length > 1) {
                boardWords.push(currentWord);
            }
        }
        return boardWords;
    }

    removeAccents(newTiles: TileCoords[]) {
        for (const aTile of newTiles) {
            aTile.tile.letter = aTile.tile.letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
    }

    checkValidLetters(newTiles: TileCoords[]): boolean {
        for (const aTile of newTiles) {
            if (aTile.tile.letter === '-' || aTile.tile.letter === "'") {
                return false;
            }
        }
        return true;
    }

    placeNewTiles(newTiles: TileCoords[]) {
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

    noLoneTile(newTiles: TileCoords[]): boolean {
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

    wordInDictionnary(words: string[]): boolean {
        for (const word of words) {
            if (!this.dictionnary.includes(word)) {
                return false;
            }
        }
        return true;
    }

    getDictionnary() {
        this.httpClient.get('../../assets/dictionnary.json').subscribe((data) => {
            const dictionnaryJson = data;
            this.dictionnary = JSON.parse(JSON.stringify(dictionnaryJson)).words;
        });
    }
}
