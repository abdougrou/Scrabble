import * as words from '../../assets/dictionnary.json';
import { Tile } from './tile';

export interface TileCoords {
    tile: Tile;
    x: number;
    y: number;
}

const BOARD_SIZE = 15;

export class WordValidation {

    public static validateWords(board: Tile[][], newTiles: TileCoords[]): boolean {
        let newBoard: Tile[][] = board;
        let wordsBefore: string[] = this.findWordsFromBoard(board);

        //End validation if the player places a hyphen or an apostrophe
        if (!this.checkValidLetters(newTiles)) {
            return false;
        }

        //End validation if a new tile overlapses an already existant tile
        for (let i = 0; i < newTiles.length; i++) {
            if (board[newTiles[i].x][newTiles[i].y].letter != '' && board[newTiles[i].x][newTiles[i].y].points != 0) {
                return false;
            }
        }

        //Removing the accents from the new tiles and adding them to a temporary copy of the board
        for (let i = 0; i < newTiles.length; i++) {
            newTiles[i].tile.letter = this.uniformLetters(newTiles[i].tile.letter);
            newBoard[newTiles[i].x][newTiles[i].y] = newTiles[i].tile;
        }

        //checking That all tiles have at least one adjacent tile
        for (let i = 0; i < newTiles.length; i++) {
            if (!this.hasAdjacentLetters(board, newTiles[i])) {
                return false;
            }
        }

        //Getting all the words from the board and only keeping the newly formed ones
        let wordsAfter = this.findWordsFromBoard(newBoard);
        for (let wordA of wordsAfter) {
            for (let wordB of wordsBefore) {
                if (wordA == wordB) {
                    wordsAfter.filter(obj => obj !== wordA);
                }
            }
        }

        //check if all the new words are contained in the dictionary
        for (let word of wordsAfter) {
            if (!this.checkIfWordInDictionary(word)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param board conceptual representation of the board and the tiles 
     * @returns an array of strings representing all the words on the board
     */
    public static findWordsFromBoard(board: Tile[][]): string[] {
        var boardWords: string[] = new Array();
        for (let i = 0; i < BOARD_SIZE; i++) {
            var currentWord: string = '';
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j].letter != '') {
                    currentWord += board[i][j].letter;
                }
                else {
                    if (currentWord.length > 1) {
                        boardWords.push(currentWord);
                    }
                    currentWord = '';
                }
            }
        }
        for (let j = 0; j < BOARD_SIZE; j++) {
            var currentWord: string = '';
            for (let i = 0; i < BOARD_SIZE; i++) {
                if (board[i][j].letter != '') {
                    currentWord += board[i][j].letter;
                }
                else {
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
    public static uniformLetters(letter: string): string {
        //ligne de code tirer de https://www.codegrepper.com/code-examples/javascript/javascript+remove+accents
        var result = letter.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        return result;
    }

    public static checkValidLetters(tiles: TileCoords[]): boolean {
        for (let aTile of tiles) {
            if (aTile.tile.letter == "-" || aTile.tile.letter == ",") {
                return false;
            }
        }
        return true;
    }

    public static hasAdjacentLetters(board: Tile[][], aTile: TileCoords): boolean {
        if (aTile.x != 0) {
            if (board[aTile.x - 1][aTile.y].letter != '') {
                return true;
            }
        }
        if (aTile.x < BOARD_SIZE - 1) {
            if (board[aTile.x + 1][aTile.y].letter != '') {
                return true;
            }
        }
        if (aTile.y != 0) {
            if (board[aTile.x][aTile.y - 1].letter != '') {
                return true;
            }
        }
        if (aTile.y < BOARD_SIZE - 1) {
            if (board[aTile.x][aTile.y + 1].letter != '') {
                return true;
            }
        }
        return false;
    }

    public static checkIfWordInDictionary(wordToCheck: string): boolean {
        //Read dictionary and store it in array
        var dictionaryString = JSON.stringify(words);
        var parsedDictionary = JSON.parse(dictionaryString);
        var wordsArray = parsedDictionary.words;

        //Iterate array of words and compare them to the input string
        for (var word of wordsArray) {
            if (wordToCheck == word) {
                return true;
            }
        }
        return false;
    }
}