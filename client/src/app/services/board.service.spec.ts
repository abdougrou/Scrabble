import { TestBed } from '@angular/core/testing';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';

import { BoardService } from './board.service';

describe('BoardService', () => {
    let service: BoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BoardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('placeTile places the tile in the board, returns true if no tile exists at coord', () => {
        const coord: Vec2 = { x: 3, y: 3 };
        const tile: Tile = { letter: 'X', points: 0 };
        service.placeTile(coord, tile);
        expect(service.getTile(coord)).toEqual(tile);
        expect(service.getTile({ x: 3, y: 3 })).toEqual(tile);
    });

    it('getTile returns true if tile exist at coord, undefined otherwise', () => {
        const coord: Vec2 = { x: 3, y: 3 };
        const tile: Tile = { letter: 'X', points: 0 };
        service.placeTile(coord, tile);
        expect(service.getTile(coord)).toEqual(tile);
        expect(service.getTile({ x: 3, y: 3 })).toEqual(tile);
        expect(service.getTile({ x: 3, y: 4 })).toBeUndefined();
    });

    it('coordToKey returns correct key', () => {
        const coordVec1: Vec2 = { x: 3, y: 3 };
        const coordVec2: Vec2 = { x: 40, y: 99 };
        const coordKey1 = service.coordToKey(coordVec1);
        const coordKey2 = service.coordToKey(coordVec2);
        const coordNum1 = 303;
        const coordNum2 = 4099;
        expect(coordKey1).toEqual(coordNum1);
        expect(coordKey2).toEqual(coordNum2);
    });
});
