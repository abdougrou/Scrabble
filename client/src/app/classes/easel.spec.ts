import { Easel } from './easel';
import { Tile } from './tile';

describe('Easel', () => {
    let easel: Easel;

    beforeEach(() => {
        easel = new Easel([]);
    });

    it('should create an instance', () => {
        expect(easel).toBeTruthy();
    });

    it('addTiles adds tiles to the easel', () => {
        const tiles: Tile[] = [
            { letter: 'A', points: 0 },
            { letter: 'B', points: 0 },
            { letter: 'C', points: 0 },
            { letter: 'D', points: 0 },
        ];
        easel.addTiles(tiles);
        expect(easel.count).toBe(tiles.length);
    });

    it('toString returns letters in the easel as a string', () => {
        const tiles: Tile[] = [
            { letter: 'A', points: 0 },
            { letter: 'B', points: 0 },
            { letter: 'C', points: 0 },
            { letter: 'D', points: 0 },
        ];
        easel.addTiles(tiles);
        expect(easel.toString()).toBe('ABCD');
    });

    it('containsTiles should return false when the easel does not contain all the tiles', () => {
        const tiles: Tile[] = [
            { letter: 'A', points: 0 },
            { letter: 'B', points: 0 },
            { letter: 'C', points: 0 },
            { letter: 'D', points: 0 },
        ];
        easel.addTiles(tiles);

        expect(easel.containsTiles('Z')).toBe(false);
        expect(easel.containsTiles('ABCDE')).toBe(false);
    });

    it('containsTiles should return false when the easel contains all the tiles', () => {
        const tiles: Tile[] = [
            { letter: 'A', points: 0 },
            { letter: 'B', points: 0 },
            { letter: 'C', points: 0 },
            { letter: 'D', points: 0 },
        ];
        easel.addTiles(tiles);

        expect(easel.containsTiles('A')).toBe(true);
        expect(easel.containsTiles('ABCD')).toBe(true);
    });
});
