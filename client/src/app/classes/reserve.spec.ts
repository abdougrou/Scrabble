import { Reserve } from './reserve';
import { ReserveTile, Tile } from '@app/classes/tile';

const FULL_RESERVE_COUNT = 102;

describe('Reserve', () => {
    let reserve: Reserve;

    beforeEach(() => {
        reserve = new Reserve();
    });

    it('should create an instance', () => {
        expect(new Reserve()).toBeTruthy();
    });

    it('should be created', () => {
        expect(reserve).toBeTruthy();
    });

    it('new reserve should be 102 tiles', () => {
        expect(reserve.tileCount).toBe(FULL_RESERVE_COUNT);
    });

    it('isLetterExchangePossible', () => {
        // Exchange when reserve full
        const possibleAmount1 = 0;
        const possibleAmount2 = 7;
        const possibleAmount3 = 102;
        expect(reserve.isLetterExchangePossible(possibleAmount1)).toBe(true);
        expect(reserve.isLetterExchangePossible(possibleAmount2)).toBe(true);
        expect(reserve.isLetterExchangePossible(possibleAmount3)).toBe(true);

        // Exchange more than reserve
        const impossibleAmount = 103;
        expect(reserve.isLetterExchangePossible(impossibleAmount)).toBe(false);

        // Exchange when reserve has less than 7
        const getAmount = 96;
        reserve.getLetters(getAmount);
        expect(reserve.isLetterExchangePossible(possibleAmount1)).toBe(false);
    });

    it('getLetters returns correct amount', () => {
        const amount = 50;

        const letters: Tile[] = reserve.getLetters(amount);
        expect(letters.length).toBe(amount);
        expect(reserve.tileCount).toBe(FULL_RESERVE_COUNT - amount);

        const letters2: Tile[] = reserve.getLetters(amount);
        expect(letters2.length).toBe(amount);
        expect(reserve.tileCount).toBe(FULL_RESERVE_COUNT - amount * 2);
    });

    it('returnLetters', () => {
        // Deep copy of the reserve
        const originalReserve: Map<string, ReserveTile> = new Map(JSON.parse(JSON.stringify(Array.from(reserve.tiles.entries()))));

        const getAmount = 7;
        const tiles = reserve.getLetters(getAmount);
        expect(reserve.tileCount).toBe(FULL_RESERVE_COUNT - getAmount);
        expect(tiles.length).toBe(getAmount);

        reserve.returnLetters(tiles);
        expect(reserve.tileCount).toBe(FULL_RESERVE_COUNT);
        expect(Array.from(originalReserve.entries())).toEqual(Array.from(reserve.tiles.entries()));
    });
});
