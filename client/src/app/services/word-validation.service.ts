import { Injectable } from '@angular/core';
import { Tile, TileCoords } from '@app/classes/tile';
import { HttpClient } from '@angular/common/http';

const BOARD_SIZE = 15;

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    // eslint-disable-next-line @typescript-eslint/ban-types

    dictionnary: string[];

    constructor(private httpClient: HttpClient) {
        this.getDictionnary();
    }

    validateWords(board: Tile[][], newTiles: TileCoords[]): boolean {
        const newBoard: Tile[][] = board;
        const wordsBefore: string[] = this.findWordsFromBoard(board);

        //  End validation if the player places a hyphen or an apostrophe
        if (!this.checkValidLetters(newTiles)) {
            return false;
        }

        //  End validation if a new tile overlapses an already existant tile
        for (const aTile of newTiles) {
            if (board[aTile.x][aTile.y].letter !== '' && board[aTile.x][aTile.y].points !== 0) {
                return false;
            }
        }

        //  Removing the accents from the new tiles and adding them to a temporary copy of the board
        for (const aTile of newTiles) {
            aTile.tile.letter = this.uniformLetters(aTile.tile.letter);
            newBoard[aTile.x][aTile.y] = aTile.tile;
        }

        //  checking That all tiles have at least one adjacent tile
        for (const aTile of newTiles) {
            if (!this.hasAdjacentLetters(board, aTile)) {
                return false;
            }
        }

        //  Getting all the words from the board and only keeping the newly formed ones
        const wordsAfter: string[] = this.findWordsFromBoard(newBoard);
        for (const wordA of wordsAfter) {
            for (const wordB of wordsBefore) {
                if (wordA === wordB) {
                    wordsAfter.filter((obj) => obj !== wordA);
                }
            }
        }

        //  check if all the new words are contained in the dictionary

        if (!this.wordInDictionnary(wordsAfter)) {
            return false;
        }
        return true;
    }

    /**
     * @param board conceptual representation of the board and the tiles
     * @returns an array of strings representing all the words on the board
     */
    findWordsFromBoard(board: Tile[][]): string[] {
        const boardWords: string[] = new Array();
        for (let i = 0; i < BOARD_SIZE; i++) {
            let currentWord = '';
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j].letter !== '') {
                    currentWord += board[i][j].letter;
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                    }
                    currentWord = '';
                }
            }
        }
        for (let j = 0; j < BOARD_SIZE; j++) {
            let currentWord = '';
            for (let i = 0; i < BOARD_SIZE; i++) {
                if (board[i][j].letter !== '') {
                    currentWord += board[i][j].letter;
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                    }
                    currentWord = '';
                }
            }
        }
        return boardWords;
    }

    /**
     * @param letter letter that may or may not contain an accent
     * @returns the letter with no accents
     */
    uniformLetters(letter: string): string {
        //  ligne de code tirer de https://www.codegrepper.com/code-examples/javascript/javascript+remove+accents
        return letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    checkValidLetters(tiles: TileCoords[]): boolean {
        for (const aTile of tiles) {
            if (aTile.tile.letter === '-' || aTile.tile.letter === ',') {
                return false;
            }
        }
        return true;
    }

    hasAdjacentLetters(board: Tile[][], aTile: TileCoords): boolean {
        if (aTile.x !== 0) {
            if (board[aTile.x - 1][aTile.y].letter !== '') {
                return true;
            }
        }
        if (aTile.x < BOARD_SIZE - 1) {
            if (board[aTile.x + 1][aTile.y].letter !== '') {
                return true;
            }
        }
        if (aTile.y !== 0) {
            if (board[aTile.x][aTile.y - 1].letter !== '') {
                return true;
            }
        }
        if (aTile.y < BOARD_SIZE - 1) {
            if (board[aTile.x][aTile.y + 1].letter !== '') {
                return true;
            }
        }
        return false;
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
