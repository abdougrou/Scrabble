import { Easel } from './easel';
import { Tile } from './tile';

describe('Easel', () => {
    let easel: Easel;

    beforeEach(() => {
        easel = new Easel();
    });

    it('should create an instance', () => {
        expect(easel).toBeTruthy();
    });

    it('should not return invalid tile', () => {
        expect(easel.getTiles('4')).toEqual([]);
    });

    it('addTiles adds tiles to the easel', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'b', points: 0 },
            { letter: 'c', points: 0 },
            { letter: 'd', points: 0 },
        ];
        easel.addTiles(tiles);
        expect(easel.count).toBe(tiles.length);
    });

    it('getTiles removes tiles from easel and returns them', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'b', points: 0 },
            { letter: 'c', points: 0 },
            { letter: 'd', points: 0 },
        ];
        easel.addTiles(tiles);
        const tilesGot = easel.getTiles('ac');

        expect(easel.toString()).toBe('bd');
        expect(easel.count).toBe(2);
        expect(tilesGot.length).toBe(2);
        expect(new Easel(tilesGot).toString()).toBe('ac');
    });

    it('toString returns letters in the easel as a string', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'b', points: 0 },
            { letter: 'c', points: 0 },
            { letter: 'd', points: 0 },
        ];
        easel.addTiles(tiles);
        expect(easel.toString()).toBe('abcd');
    });

    it('containsTiles should return false when the easel does not contain all the tiles', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'b', points: 0 },
            { letter: 'c', points: 0 },
            { letter: 'd', points: 0 },
        ];
        easel.addTiles(tiles);

        expect(easel.containsTiles('z')).toBe(false);
        expect(easel.containsTiles('abcde')).toBe(false);
    });

    it('containsTiles should return true when the easel contains all the tiles', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'b', points: 0 },
            { letter: 'c', points: 0 },
            { letter: 'd', points: 0 },
        ];
        easel.addTiles(tiles);

        expect(easel.containsTiles('a')).toBe(true);
        expect(easel.containsTiles('abcd')).toBe(true);
    });
});
