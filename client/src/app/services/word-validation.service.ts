/* eslint-disable complexity */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//  import { BoardWord, Tile, TileCoords } from '@app/classes/tile';
import { BoardWord, Tile, TileCoords } from '@app/classes/tile';
import { GRID_SIZE } from '@app/constants';
import { BoardService } from './board.service';

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    dictionnary: string[];

    constructor(private httpClient: HttpClient, private boardService: BoardService) {
        this.getDictionnary();
    }

    /**
     * @param newTiles an array containing the tiles placed by the player and their coordinates
     * @returns a boolean value indicating whether or not all of the newly formed words are valid
     */
    validateWords(newTiles: TileCoords[]): boolean {
        const boardCopy: Map<number, Tile> = new Map(this.boardService.board);

        //  Validation fails if the player has placed a lone tile (tile with no adjacent tiles on the board)
        if (!this.noLoneTile(newTiles)) {
            return false;
        }
        //  Remove all the newly placed tile from the board copy
        for (const aTile of newTiles) {
            boardCopy.delete(this.boardService.coordToKey(aTile.coords));
        }

        //  Find the words that were on the board before the addition of the new tiles
        const wordsBefore: string[] = this.findWordsFromBoard(boardCopy);

        //  Find the words on the board with the addition of the new tiles
        let wordsAfter: string[] = this.findWordsFromBoard(this.boardService.board);

        //  Keep only the words that were formed by the addition of the new tiles
        for (const wordA of wordsAfter) {
            for (const wordB of wordsBefore) {
                if (JSON.stringify(wordA) === JSON.stringify(wordB)) {
                    wordsAfter = wordsAfter.filter((obj) => obj !== wordA);
                }
            }
        }

        for (const word of wordsAfter) {
            //  Validation fails if a word contains a hyphen or an apostrophe
            if (word.includes('-') || word.includes("'")) {
                return false;
            }
            //  Validation fails if a word is not contained in the dictionnary
            if (!this.wordInDictionnary(word)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param newTiles an array containing the tiles placed by the player and their coordinates
     * @returns true if all the new tiles have adjacent tiles false otherwise
     */
    noLoneTile(newTiles: TileCoords[]): boolean {
        for (const aTile of newTiles) {
            let hasAdjacentTile = false;
            if (this.boardService.getTile({ x: aTile.coords.x - 1, y: aTile.coords.y })) hasAdjacentTile = true;
            if (this.boardService.getTile({ x: aTile.coords.x + 1, y: aTile.coords.y })) hasAdjacentTile = true;
            if (this.boardService.getTile({ x: aTile.coords.x, y: aTile.coords.y - 1 })) hasAdjacentTile = true;
            if (this.boardService.getTile({ x: aTile.coords.x, y: aTile.coords.y + 1 })) hasAdjacentTile = true;
            if (!hasAdjacentTile) return false;
        }
        return true;
    }

    getPossibleWords(tiles: Tile[]): BoardWord[] {
        const possibleWords: BoardWord[] = [];
        const tileMap: Map<string, Tile> = new Map();
        tiles.forEach((tile) => {
            tileMap.set(tile.letter, tile);
        });
        const easelTilesStr = Array.from(tileMap.keys()).filter((str) => str !== '*');
        const possibleEaselPermutations: string[] = this.getTilePermutations(easelTilesStr);
        for (const possibleWord of possibleEaselPermutations) {
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    const boardWordH: BoardWord = { word: '', tileCoords: [], vertical: false, points: 0 };

                    // Horizontal
                    let offset = 0;
                    for (let x = 0; x < GRID_SIZE; x++) {
                        const tile: Tile | undefined = this.boardService.getTile({ x: i + x + offset, y: j });
                        if (tile) {
                            boardWordH.word += tile.letter;
                            offset++;
                            x--;
                        } else {
                            if (x < possibleWord.length) {
                                boardWordH.word += possibleWord[x];
                                boardWordH.tileCoords.push({
                                    tile: tileMap.get(possibleWord[x]) as Tile,
                                    coords: {
                                        x: i + x + offset,
                                        y: j,
                                    },
                                });
                            } else {
                                break;
                            }
                        }
                    }
                    if (this.noLoneTile(boardWordH.tileCoords) && boardWordH.word.length > 1 && this.wordInDictionnary(boardWordH.word))
                        possibleWords.push(boardWordH);

                    const boardWordV: BoardWord = { word: '', tileCoords: [], vertical: true, points: 0 };
                    // Vertical
                    offset = 0;
                    for (let x = 0; x < GRID_SIZE; x++) {
                        const tile: Tile | undefined = this.boardService.getTile({ x: i, y: j + x + offset });
                        if (tile) {
                            boardWordV.word += tile.letter;
                            offset++;
                            x--;
                        } else {
                            if (x < possibleWord.length) {
                                boardWordV.word += possibleWord[x];
                                boardWordV.tileCoords.push({
                                    tile: tileMap.get(possibleWord[x]) as Tile,
                                    coords: {
                                        x: i,
                                        y: j + x + offset,
                                    },
                                });
                            } else {
                                break;
                            }
                        }
                    }
                    if (this.noLoneTile(boardWordV.tileCoords) && boardWordV.word.length > 1 && this.wordInDictionnary(boardWordV.word))
                        possibleWords.push(boardWordV);
                }
            }
        }
        return possibleWords;
    }

    getTilePermutations(tiles: string[]): string[] {
        const permutations: string[] = [];

        if (tiles.length === 1) return tiles;
        for (const k of tiles) {
            this.getTilePermutations(tiles.join('').replace(k, '').split(''))
                .concat('')
                .map((subtree) => {
                    permutations.push(k.concat(subtree));
                });
        }

        return permutations;
    }

    /**
     * @param word string we want to validate
     * @returns boolean value corresponding to whether or not the word is in the dictionnary
     */
    wordInDictionnary(word: string): boolean {
        return this.dictionnary.includes(word);
    }

    /**
     * @param word from which we want to remove accents/diacritics
     * @returns string corresponding to the word without accents
     */
    removeAccents(word: string): string {
        //  This line of code was taken from https://stackoverflow.com/a/37511463
        return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * @param board the board from which we want to retrieve words
     * @returns an array of strings containing all the words on the board
     */
    private findWordsFromBoard(board: Map<number, Tile>): string[] {
        const boardWords: string[] = new Array();

        //  Find all vertical words
        for (let i = 0; i < GRID_SIZE; i++) {
            let currentWord = '';
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board.get(this.boardService.coordToKey({ x: i, y: j }))) {
                    currentWord += (board.get(this.boardService.coordToKey({ x: i, y: j })) as Tile).letter;
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(this.removeAccents(currentWord));
                    }
                    currentWord = '';
                }
            }

            if (currentWord.length > 1) {
                boardWords.push(this.removeAccents(currentWord));
            }
            currentWord = '';

            //  Find all horizontal words
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board.get(this.boardService.coordToKey({ x: j, y: i }))) {
                    currentWord += (board.get(this.boardService.coordToKey({ x: j, y: i })) as Tile).letter;
                } else {
                    if (currentWord.length > 1) {
                        boardWords.push(this.removeAccents(currentWord));
                    }
                    currentWord = '';
                }
            }

            if (currentWord.length > 1) {
                boardWords.push(this.removeAccents(currentWord));
            }
        }
        return boardWords;
    }

    private getDictionnary() {
        //  Hard coded dictionnary file path for sprint 1, it will become variable when more than 1 dictionnaries are available
        this.httpClient.get('../../assets/dictionnary.json').subscribe((data) => {
            const dictionnaryJson = data;
            this.dictionnary = JSON.parse(JSON.stringify(dictionnaryJson)).words;
        });
    }
}
