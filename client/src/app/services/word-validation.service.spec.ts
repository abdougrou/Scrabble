import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Tile, TileCoords } from '@app/classes/tile';
import { WordValidationService } from './word-validation.service';

const BOARD_SIZE = 15;

describe('WordValidationService', () => {
    let service: WordValidationService;
    let board: Tile[][];
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        service = TestBed.inject(WordValidationService);
        TestBed.inject(HttpClient);

        board = new Array<Tile[]>();
        for (let y = 0; y < BOARD_SIZE; y++) {
            const row: Tile[] = new Array<Tile>();
            for (let x = 0; x < BOARD_SIZE; x++) {
                row.push({ letter: '', points: 0 });
            }
            board.push(row);
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    //  Testing the uniformLetters function
    it('should remove accents', () => {
        const characterWithAccent = 'é';
        const characterWithoutAccent = 'e';
        expect(service.uniformLetters(characterWithAccent)).toBe(characterWithoutAccent);
    });
    it('should not change characters that dont have accents', () => {
        const normalCharacter = 'a';
        expect(service.uniformLetters(normalCharacter)).toBe(normalCharacter);
    });
    it('should not affect special characters that dont contain accents', () => {
        const specialCharacters = '13#$<>-+=&;;":~`';
        expect(service.uniformLetters(specialCharacters)).toBe(specialCharacters);
    });
    //  Testing the checkValidLetters function
    it('should not validate a tile containing a hyphen or an apostrophe', () => {
        const aTile: TileCoords = { tile: { letter: '-', points: 0 }, x: 0, y: 0 };
        const bTile: TileCoords = { tile: { letter: "'", points: 0 }, x: 0, y: 0 };
        expect(service.checkValidLetters(aTile)).toBe(false);
        expect(service.checkValidLetters(bTile)).toBe(false);
    });
    it('should validate characters that arent hyphens or apostrophes', () => {
        const aTile: TileCoords = { tile: { letter: 'q', points: 0 }, x: 0, y: 0 };
        expect(service.checkValidLetters(aTile)).toBe(true);
    });
    //  Testing tilePositionIsEmpty function
    it('should not validate a position taken up by another tile', () => {
        board[1][0].letter = 'a';
        const aTile: TileCoords = { tile: { letter: 'b', points: 0 }, x: 1, y: 0 };
        expect(service.tilePositionIsEmpty(aTile, board)).toBe(false);
    });
    it('should validate an empty position', () => {
        board[1][0].letter = 'a';
        const aTile: TileCoords = { tile: { letter: 'b', points: 0 }, x: 2, y: 2 };
        expect(service.tilePositionIsEmpty(aTile, board)).toBe(true);
    });
    //  Testing findWordsFromBoard function
    it('should find words on the board', () => {
        board[0][1].letter = 'a';
        board[0][2].letter = 'b';
        board[1][1].letter = 'c';
        const result: string[] = ['ab', 'ac'];
        expect(service.findWordsFromBoard(board)).toEqual(result);
    });
    it('should not return words containing less than 2 letters', () => {
        board[4][4].letter = 'c';
        const result: string[] = [];
        expect(service.findWordsFromBoard(board)).toEqual(result);
    });
    it('should not merge words from diferent lines of the board', () => {
        board[0][13].letter = 'a';
        board[0][14].letter = 'b';
        board[1][0].letter = 'c';
        const result: string[] = ['ab'];
        expect(service.findWordsFromBoard(board)).toEqual(result);
    });
    //  Testing hasAdjacentLetters function
    it('should return true when the parameter tile has adjacent tiles', () => {
        board[0][0].letter = 'a';
        const aTile: TileCoords = { tile: { letter: 'b', points: 0 }, x: 0, y: 1 };
        expect(service.hasAdjacentLetters(board, aTile)).toBe(true);
    });
    it('should return false when the parameter tile has no adjacent tiles', () => {
        const aTile: TileCoords = { tile: { letter: 'a', points: 0 }, x: 4, y: 4 };
        expect(service.hasAdjacentLetters(board, aTile)).toBe(false);
    });
});
