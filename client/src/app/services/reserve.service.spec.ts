import { TestBed } from '@angular/core/testing';
import { ReserveTile, Tile } from '@app/classes/tile';
import { FULL_RESERVE_COUNT } from '@app/constants';

import { ReserveService } from './reserve.service';

describe('ReserveService', () => {
    let service: ReserveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ReserveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('new reserve should be 102 tiles', () => {
        expect(service.tileCount).toBe(FULL_RESERVE_COUNT);
    });

    it('isExchangePossible respects constraints', () => {
        // Exchange when reserve full
        const possibleAmount1 = 0;
        const possibleAmount2 = 7;
        const possibleAmount3 = 102;
        expect(service.isExchangePossible(possibleAmount1)).toBe(true);
        expect(service.isExchangePossible(possibleAmount2)).toBe(true);
        expect(service.isExchangePossible(possibleAmount3)).toBe(true);

        // Exchange more than reserve
        const impossibleAmount = 103;
        expect(service.isExchangePossible(impossibleAmount)).toBe(false);

        // Exchange when reserve has less than 7
        const getAmount = 96;
        service.getLetters(getAmount);
        expect(service.isExchangePossible(possibleAmount1)).toBe(false);
    });

    it('getLetters returns correct amount', () => {
        const amount = 50;

        const letters: Tile[] = service.getLetters(amount);
        expect(letters.length).toBe(amount);
        expect(service.tileCount).toBe(FULL_RESERVE_COUNT - amount);

        const letters2: Tile[] = service.getLetters(amount);
        expect(letters2.length).toBe(amount);
        expect(service.tileCount).toBe(FULL_RESERVE_COUNT - amount * 2);
    });

    it('reserve should be the same after executing getLetters and returnLetters', () => {
        // Deep copy of the reserve
        const originalReserve: Map<string, ReserveTile> = new Map(JSON.parse(JSON.stringify(Array.from(service.tiles.entries()))));
        const getAmount = 7;
        const tiles = service.getLetters(getAmount);
        service.returnLetters(tiles);
        expect(service.tileCount).toBe(FULL_RESERVE_COUNT);
        expect(Array.from(originalReserve.entries())).toEqual(Array.from(service.tiles.entries()));
    });
});
