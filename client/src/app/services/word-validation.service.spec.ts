import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TileCoords } from '@app/classes/tile';
import { BoardService } from './board.service';
import { CalculatePointsService } from './calculate-points.service';
import { WordValidationService } from './word-validation.service';

describe('WordValidationService', () => {
    let service: WordValidationService;
    let calculatePointsService: CalculatePointsService;
    let board: BoardService;

    beforeEach(() => {
        board = new BoardService();
        calculatePointsService = new CalculatePointsService();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: BoardService, useValue: board },
                { provide: CalculatePointsService, useValue: calculatePointsService },
            ],
        });
        service = TestBed.inject(WordValidationService);
        TestBed.inject(HttpClient);
        service.dictionnary = ['aas', 'test', 'hey'];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should validate a correct word', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 4 }, coords: { x: 12, y: 2 } },
            { tile: { letter: 'a', points: 4 }, coords: { x: 13, y: 2 } },
            { tile: { letter: 's', points: 4 }, coords: { x: 14, y: 2 } },
            { tile: { letter: 'h', points: 4 }, coords: { x: 3, y: 2 } },
            { tile: { letter: 'e', points: 4 }, coords: { x: 4, y: 2 } },
            { tile: { letter: 'y', points: 4 }, coords: { x: 5, y: 2 } },
        ];
        board.placeTile({ x: 4, y: 5 }, { letter: 'a', points: 4 });
        board.placeTile({ x: 4, y: 6 }, { letter: 'a', points: 4 });
        board.placeTile({ x: 4, y: 7 }, { letter: 's', points: 4 });

        expect(service.validateWords(newTiles)).toBeGreaterThan(0);
    });
    it('should not validate a word placed outside the board', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, coords: { x: 13, y: 2 } },
            { tile: { letter: 'a', points: 2 }, coords: { x: 14, y: 2 } },
            { tile: { letter: 's', points: 2 }, coords: { x: 15, y: 2 } },
        ];
        expect(service.validateWords(newTiles)).toEqual(0);
    });
    it('should not validate a word that isnt in the dictionnary', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 't', points: 0 }, coords: { x: 2, y: 11 } },
            { tile: { letter: 'e', points: 2 }, coords: { x: 2, y: 12 } },
            { tile: { letter: 'e', points: 2 }, coords: { x: 2, y: 13 } },
            { tile: { letter: 't', points: 0 }, coords: { x: 2, y: 14 } },
        ];

        expect(service.validateWords(newTiles)).toEqual(0);
    });
    it('should remove accents', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 't', points: 0 }, coords: { x: 2, y: 11 } },
            { tile: { letter: 'é', points: 2 }, coords: { x: 2, y: 12 } },
            { tile: { letter: 's', points: 2 }, coords: { x: 2, y: 13 } },
            { tile: { letter: 't', points: 0 }, coords: { x: 2, y: 14 } },
        ];
        service.validateWords(newTiles);
        const result = 'e';
        expect(newTiles[1].tile.letter).toBe(result);
    });
    it('should return false for invalid letters', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, coords: { x: 1, y: 2 } },
            { tile: { letter: 'a', points: 2 }, coords: { x: 2, y: 2 } },
            { tile: { letter: 's', points: 2 }, coords: { x: 3, y: 2 } },
            { tile: { letter: '-', points: 2 }, coords: { x: 4, y: 2 } },
        ];
        expect(service.validateWords(newTiles)).toEqual(0);
    });
    it('should not validate a word where tiles overlap', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, coords: { x: 1, y: 2 } },
            { tile: { letter: 'a', points: 2 }, coords: { x: 2, y: 2 } },
            { tile: { letter: 's', points: 2 }, coords: { x: 3, y: 2 } },
            { tile: { letter: 'a', points: 2 }, coords: { x: 1, y: 2 } },
        ];
        expect(service.validateWords(newTiles)).toEqual(0);
    });
    it('should return true when all the new tiles have adjacent tiles', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 0 }, coords: { x: 1, y: 2 } },
            { tile: { letter: 'b', points: 2 }, coords: { x: 2, y: 2 } },
            { tile: { letter: 'b', points: 2 }, coords: { x: 3, y: 2 } },
            { tile: { letter: 'b', points: 2 }, coords: { x: 2, y: 1 } },
            { tile: { letter: 'b', points: 2 }, coords: { x: 2, y: 3 } },
        ];
        board.placeTile({ x: 1, y: 2 }, newTiles[0].tile);
        board.placeTile({ x: 2, y: 2 }, newTiles[1].tile);
        board.placeTile({ x: 3, y: 2 }, newTiles[2].tile);
        board.placeTile({ x: 2, y: 1 }, newTiles[3].tile);
        board.placeTile({ x: 2, y: 3 }, newTiles[4].tile);

        expect(service.noLoneTile(newTiles)).toBe(true);
    });
    // it('should return false when at least one new tile has no adjacent tiles', () => {
    //     const newTiles: TileCoords[] = [
    //         { tile: { letter: 'a', points: 0 }, coords: { x: 1, y: 2 } },
    //         { tile: { letter: 'a', points: 2 }, coords: { x: 2, y: 2 } },
    //         { tile: { letter: 's', points: 2 }, coords: { x: 3, y: 2 } },
    //         { tile: { letter: 'c', points: 2 }, coords: { x: 6, y: 6 } },
    //     ];
    //     expect(service.validateWords(newTiles, player)).toBe(false);
    // });
    it('should validate a word made up of old and new tiles', () => {
        const newTiles: TileCoords[] = [
            { tile: { letter: 'a', points: 4 }, coords: { x: 12, y: 2 } },
            { tile: { letter: 's', points: 2 }, coords: { x: 14, y: 2 } },
        ];
        board.placeTile({ x: 13, y: 2 }, { letter: 'a', points: 4 });

        console.log(service.validateWords(newTiles));
        expect(service.validateWords(newTiles)).toBeGreaterThan(0);
    });

    // it('test', () => {
    //     const tiles: Tile[] = [
    //         { letter: 'a', points: 0 },
    //         { letter: 'b', points: 0 },
    //         { letter: 'c', points: 0 },
    //     ];
    //     board.placeTile({ x: 7, y: 7 }, { letter: '*', points: 0 });
    //     board.placeTile({ x: 8, y: 7 }, { letter: '*', points: 0 });
    //     board.placeTile({ x: 10, y: 7 }, { letter: '*', points: 0 });
    //     // const possibilities: BoardWord[] = service.getPossibleWords(tiles);

    //     expect(service).toBeTruthy();
    // });
});
