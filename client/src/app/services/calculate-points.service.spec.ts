import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { TileCoords } from '@app/classes/tile';
import { CalculatePointsService } from './calculate-points.service';

let player: Player;

describe('CalculatePoitnsService', () => {
    let service: CalculatePointsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CalculatePointsService);
        player = { name: 'test', score: 0, easel: new Easel() };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    //  Testing isNewTile function
    it('should return TRUE when the parameter tile is in the newTiles array', () => {
        const newTiles: TileCoords[] = [{ tile: { letter: 'a', points: 12 }, coords: { x: 4, y: 5 } }];
        const tile: TileCoords = { tile: { letter: 'a', points: 12 }, coords: { x: 4, y: 5 } };
        expect(service.isNewTile(tile, newTiles)).toBeTrue();
    });
    it('should return false when the parameter tile is not contained in the newTiles array', () => {
        const newTiles: TileCoords[] = [{ tile: { letter: 'a', points: 12 }, coords: { x: 4, y: 5 } }];
        const tile: TileCoords = { tile: { letter: 'a', points: 12 }, coords: { x: 5, y: 5 } };
        expect(service.isNewTile(tile, newTiles)).toBeFalse();
    });
    // Testing getTileColor function
    it('should return the correct string depending on the tiles location', () => {
        const tile: TileCoords = { tile: { letter: 'a', points: 12 }, coords: { x: 5, y: 5 } };
        const color = 'd';
        expect(service.getTileColor(tile)).toBe(color);
    });
    //  Testing calculateWordPoint function
    it('should correctly calculate the points for a word containing tiles on light blue and red squares', () => {
        const tiles: TileCoords[] = new Array();
        const newTiles: TileCoords[] = new Array();
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
        const newTiles: TileCoords[] = new Array();
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
    //  Testing calculatePoints function
    it('should accurately calculate a players point given valid parameters', () => {
        const tiles: TileCoords[][] = new Array();
        const newTiles: TileCoords[] = new Array();
        const numTiles = 15;
        const numNewTiles = 5;
        const row: TileCoords[] = new Array();
        for (let i = 0; i < numTiles; i++) {
            row.push({ tile: { letter: 'a', points: 1 }, coords: { x: i, y: 0 } });
        }
        tiles.push(row);

        for (let i = 0; i < numNewTiles; i++) {
            newTiles.push(tiles[0][i]);
            // eslint-disable-next-line no-console
            console.log(newTiles.length);
        }
        const points = 48;
        expect(service.calculatePoints(tiles, newTiles, player)).toBe(points);
    });
    it('should add the 50 point bonus if the player places 7 tiles', () => {
        const tiles: TileCoords[][] = new Array();
        const newTiles: TileCoords[] = new Array();
        const numTiles = 15;
        const numNewTiles = 7;
        const row: TileCoords[] = new Array();
        for (let i = 0; i < numTiles; i++) {
            row.push({ tile: { letter: 'a', points: 1 }, coords: { x: i, y: 0 } });
        }
        tiles.push(row);

        for (let i = 0; i < numNewTiles; i++) {
            newTiles.push(tiles[0][i]);
        }
        const points = 98;
        expect(service.calculatePoints(tiles, newTiles, player)).toBe(points);
    });
});
