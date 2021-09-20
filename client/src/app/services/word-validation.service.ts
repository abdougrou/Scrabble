import { Injectable } from '@angular/core';
import { Tile, TileCoords } from '@app/classes/tile';
import { HttpClient } from '@angular/common/http';
import { CalculatePointsService } from './calculate-points.service';
import { GameManagerService } from './game-manager.service';

const BOARD_SIZE = 15;

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    dictionnary: string[];

    constructor(private httpClient: HttpClient, private calculatePoints: CalculatePointsService, private gameManager: GameManagerService) {
        this.getDictionnary();
    }

    validateWords(board: Tile[][], newTiles: TileCoords[]): boolean {
        const newBoard: Tile[][] = board;
        const wordsBefore: TileCoords[][] = this.findWordsFromBoard(board);

        //  End validation if the player entered an invalid character or placed a tile on top of another
        for (const aTile of newTiles) {
            if (!this.checkValidLetters(aTile)) {
                this.gameManager.switchPlayer();
                return false;
            }
            if (!this.tilePositionIsEmpty(aTile, board)) {
                this.gameManager.switchPlayer();
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
                this.gameManager.switchPlayer();
                return false;
            }
        }

        //  Getting all the words from the board and only keeping the newly formed ones
        let wordsAfter: TileCoords[][] = this.findWordsFromBoard(newBoard);
        for (const wordA of wordsAfter) {
            for (const wordB of wordsBefore) {
                if (JSON.stringify(wordA) === JSON.stringify(wordB)) {
                    wordsAfter = wordsAfter.filter((obj) => obj !== wordA);
                }
            }
        }
        const newWords: string[] = new Array();
        for (const wordA of wordsAfter) {
            newWords.push(this.getStringFromTileArray(wordA));
        }

        //  check if all the new words are contained in the dictionary
        if (!this.wordInDictionnary(newWords)) {
            this.gameManager.switchPlayer();
            return false;
        }
        this.calculatePoints.calculatePoints(wordsAfter, newTiles);
        this.gameManager.switchPlayer();
        return true;
    }

    /**
     * @param board conceptual representation of the board and the tiles
     * @returns an array of strings representing all the words on the board
     */
    findWordsFromBoard(board: Tile[][]): TileCoords[][] {
        const boardWords: TileCoords[][] = new Array();
        for (let i = 0; i < BOARD_SIZE; i++) {
            let currentWord: TileCoords[] = new Array<TileCoords>();
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j].letter !== '') {
                    currentWord.push({ tile: board[i][j], x: i, y: j });
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                    }
                    currentWord = [];
                }
            }
            if (currentWord.length > 1) {
                boardWords.push(currentWord);
            }
            currentWord = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[j][i].letter !== '') {
                    currentWord.push({ tile: board[j][i], x: j, y: i });
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                    }
                    currentWord = [];
                }
            }
            if (currentWord.length > 1) {
                boardWords.push(currentWord);
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

    checkValidLetters(aTile: TileCoords): boolean {
        if (aTile.tile.letter === '-' || aTile.tile.letter === "'") {
            return false;
        }
        return true;
    }

    tilePositionIsEmpty(aTile: TileCoords, board: Tile[][]): boolean {
        if (board[aTile.x][aTile.y].letter !== '') {
            return false;
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
    getStringFromTileArray(tiles: TileCoords[]): string {
        let word = '';
        for (const aTile of tiles) {
            word += aTile.tile.letter;
        }
        return word;
    }
}
