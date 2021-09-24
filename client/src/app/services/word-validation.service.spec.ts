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
        service.dictionnary = ['aas', 'test', 'hey'];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should validate a correct word', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, x: 12, y: 2 },
            { tile: { letter: 'a', points: 2 }, x: 13, y: 2 },
            { tile: { letter: 's', points: 2 }, x: 14, y: 2 },
            { tile: { letter: 'h', points: 0 }, x: 3, y: 2 },
            { tile: { letter: 'e', points: 2 }, x: 4, y: 2 },
            { tile: { letter: 'y', points: 2 }, x: 5, y: 2 },
        ];
        board[4][5] = { letter: 'a', points: 0 };
        board[4][6] = { letter: 'a', points: 0 };
        board[4][7] = { letter: 's', points: 0 };

        expect(service.validateWords(board, newTiles)).toBe(true);
    });
    it('should not validate a word that isnt in the dictionnary', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 't', points: 0 }, x: 2, y: 11 },
            { tile: { letter: 'e', points: 2 }, x: 2, y: 12 },
            { tile: { letter: 'e', points: 2 }, x: 2, y: 13 },
            { tile: { letter: 't', points: 0 }, x: 2, y: 14 },
        ];

        expect(service.validateWords(board, newTiles)).toBe(false);
    });
    //  Testing removeAccents
    it('should remove accents', () => {
        const newTiles: TileCoords[] = new Array();
        newTiles.push({ tile: { letter: 'é', points: 0 }, x: 1, y: 2 });
        service.removeAccents(newTiles);
        const result = 'e';
        expect(newTiles[0].tile.letter).toBe(result);
    });
    it('should return false for invalid letters', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, x: 1, y: 2 },
            { tile: { letter: 'a', points: 2 }, x: 2, y: 2 },
            { tile: { letter: 's', points: 2 }, x: 3, y: 2 },
            { tile: { letter: '-', points: 2 }, x: 4, y: 2 },
        ];
        expect(service.validateWords(board, newTiles)).toBe(false);
    });
    it('should not validate a word where tiles overlap', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, x: 1, y: 2 },
            { tile: { letter: 'a', points: 2 }, x: 2, y: 2 },
            { tile: { letter: 's', points: 2 }, x: 3, y: 2 },
            { tile: { letter: 'a', points: 2 }, x: 1, y: 2 },
        ];
        expect(service.validateWords(board, newTiles)).toBe(false);
    });
    it('should return true when all the new tiles have adjacent tiles', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, x: 1, y: 2 },
            { tile: { letter: 'b', points: 2 }, x: 2, y: 2 },
            { tile: { letter: 'b', points: 2 }, x: 3, y: 2 },
            { tile: { letter: 'b', points: 2 }, x: 2, y: 1 },
            { tile: { letter: 'b', points: 2 }, x: 2, y: 3 },
        ];
        board[1][2] = newTiles[0].tile;
        board[2][2] = newTiles[1].tile;
        board[3][2] = newTiles[2].tile;
        board[2][1] = newTiles[3].tile;
        board[2][3] = newTiles[4].tile;
        expect(service.noLoneTile(newTiles, board)).toBe(true);
    });
    it('should return false when at least one new tile has no adjacent tiles', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, x: 1, y: 2 },
            { tile: { letter: 'a', points: 2 }, x: 2, y: 2 },
            { tile: { letter: 's', points: 2 }, x: 3, y: 2 },
            { tile: { letter: 'c', points: 2 }, x: 6, y: 6 },
        ];
        expect(service.validateWords(board, newTiles)).toBe(false);
    });
    it('should validate a word made up of old and new tiles', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, x: 12, y: 2 },
            { tile: { letter: 's', points: 2 }, x: 14, y: 2 },
        ];
        board[13][2] = { letter: 'a', points: 0 };

        expect(service.validateWords(board, newTiles)).toBe(true);
    });
});
