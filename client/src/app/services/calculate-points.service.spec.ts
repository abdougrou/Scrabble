import { TestBed } from '@angular/core/testing';
import { TileCoords } from '@app/classes/tile';
import { GRID_SIZE } from '@app/constants';
import { BoardService } from './board.service';
import { CalculatePointsService } from './calculate-points.service';

describe('CalculatePoitnsService', () => {
    let boardService: BoardService;
    let service: CalculatePointsService;
    let newTiles: TileCoords[];

    beforeEach(() => {
        boardService = new BoardService();
        TestBed.configureTestingModule({
            providers: [{ provide: BoardService, useValue: boardService }],
        });
        service = TestBed.inject(CalculatePointsService);
        newTiles = [];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add a the bonus points if the player placed 7 tiles in one turn', () => {
        const BONUS_NUM = 7;
        const BONUS_POINTS = 50;
        for (let i = 0; i < BONUS_NUM; i++) {
            newTiles.push({ tile: { letter: 'a', points: 0 }, coords: { x: i, y: 0 } });
        }
        expect(service.calculatePoints(newTiles)).toBe(BONUS_POINTS);
    });

    //  Testing calculateWordPoint function
    it('should correctly calculate the points for a word containing tiles on light blue and red squares', () => {
        const tiles: TileCoords[] = new Array();
        const numTiles = 15;
        const numNewTiles = 7;
        for (let i = 0; i < numTiles; i++) {
            tiles.push({ tile: { letter: 'a', points: 1 }, coords: { x: 0, y: i } });
            if (i < numNewTiles) {
                newTiles[i] = tiles[i];
            }
        }
        const points = 48;
        expect(service.calculateWordPoint(tiles, newTiles)).toBe(points);
    });

    it('should correctly calculate the points for a word containing tiles on dark blue and pink squares', () => {
        const tiles: TileCoords[] = new Array();
        const numTiles = 15;
        const numNewTiles = 7;
        for (let i = 0; i < numTiles; i++) {
            tiles.push({ tile: { letter: 'a', points: 1 }, coords: { x: 1, y: i } });
            if (i < numNewTiles) {
                newTiles[i] = tiles[i];
            }
        }
        const points = 34;
        expect(service.calculateWordPoint(tiles, newTiles)).toBe(points);
    });

    it('should add the 50 point bonus if the player places 7 tiles', () => {
        const numTiles = 7;
        for (let i = 0; i < numTiles; i++) {
            newTiles.push({ tile: { letter: 'a', points: 1 }, coords: { x: i, y: 0 } });
            boardService.placeTile({ x: i, y: 0 }, { letter: 'a', points: 1 });
        }
        //  5 tiles of 1 point on blank squares, 1 on red and 1 on light blue
        //  50 + (6 * 1 + 2) * 3 = 50 + 8 * 3 = 74
        const points = 74;
        expect(service.calculatePoints(newTiles)).toBe(points);
    });

    it('should not add the points of existing words to the points of the new words', () => {
        const numTiles = 5;
        for (let i = GRID_SIZE - numTiles; i < GRID_SIZE; i++) {
            newTiles.push({ tile: { letter: 'a', points: 1 }, coords: { x: 0, y: i } });
            boardService.placeTile({ x: 0, y: i }, { letter: 'a', points: 1 });
        }
        //  Tiles that should not be taken into account
        for (let i = GRID_SIZE - numTiles; i < GRID_SIZE; i++) {
            boardService.placeTile({ x: i, y: 0 }, { letter: 'a', points: 1 });
        }
        //  5 tiles of 1 point on blank squares, 1 on red and 1 on light blue
        //  (4 * 1 + 2) * 3 = 6 * 3 = 18
        const points = 18;
        expect(service.calculatePoints(newTiles)).toBe(points);
    });
});
