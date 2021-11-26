import { TestBed } from '@angular/core/testing';
import { FULL_RESERVE_COUNT } from '@app/constants';
import { ReserveService } from './reserve.service';

describe('ReserveService', () => {
    let reserve: ReserveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        reserve = TestBed.inject(ReserveService);
    });

    it('reserve has correct size on instantiation', () => {
        expect(reserve.size).toEqual(FULL_RESERVE_COUNT);
    });

    it('getLetter returns a letter and reduces its count when it there is more than 0 letters', () => {
        const res = new Map<string, number>();
        const letter = 'a';
        const count = 5;
        res.set(letter, count);
        reserve.data = res;
        reserve.getLetter(letter);
        expect(reserve.data.get(letter)).toEqual(count - 1);
    });

    it("getLetter returns null when a letter's count is 0", () => {
        const res = new Map<string, number>();
        const letter = 'a';
        const count = 0;
        res.set(letter, count);
        reserve.data = res;
        const get = reserve.getLetter(letter);
        expect(get).toBeNull();
        expect(reserve.data.get(letter)).toEqual(0);
    });

    it('returnLetter returns tiles into the reserve', () => {
        const res = new Map<string, number>();
        const aCount = 2;
        res.set('a', aCount);
        reserve.data = res;
        reserve.size = 2;
        reserve.returnLetters(['a', 'b']);
        expect(reserve.size).toEqual(aCount + 1);
    });

    it('isExchangePossible returns true when conditions are met, false otherwise', () => {
        const exchangeAmount = 3;
        expect(reserve.isExchangePossible(exchangeAmount)).toEqual(true);
        // Exchange more than available in reserve
        reserve.size = 20;
        expect(reserve.isExchangePossible(exchangeAmount * exchangeAmount * exchangeAmount)).toEqual(false);
        // Exchange when reserve is low
        reserve.size = 5;
        reserve.getRandomLetters(exchangeAmount);
        expect(reserve.isExchangePossible(exchangeAmount)).toEqual(false);
    });

    it('isExchangePossibleBot returns true when conditions are met, false otherwise', () => {
        const exchangeAmountTrue = 3;
        expect(reserve.isExchangePossibleBot(exchangeAmountTrue)).toEqual(true);
        // Exchange more than available in reserve
        reserve.size = 10;
        const exchangeAmountFalse = 20;
        expect(reserve.isExchangePossibleBot(exchangeAmountFalse)).toEqual(false);
        // Exchange when reserve is low
        reserve.size = 5;
        expect(reserve.isExchangePossibleBot(exchangeAmountTrue)).toEqual(true);
    });

    it('exchangeLetters exchanges letters with the reserve', () => {
        const res = new Map<string, number>();
        const aCount = 5;
        const bCount = 0;
        res.set('a', aCount);
        res.set('b', bCount);
        reserve.data = res;
        reserve.size = aCount;
        const exchange = ['b', 'b', 'b', 'b', 'b'];
        const expected = ['a', 'a', 'a', 'a', 'a'];
        expect(reserve.exchangeLetters(exchange)).toEqual(expected);
        expect(reserve.size).toEqual(aCount);
    });

    it('getRandomLetters returns random letters taken from the reserve', () => {
        const res = new Map<string, number>();
        const aCount = 2;
        const bCount = 3;
        const cCount = 1;
        res.set('a', aCount);
        res.set('b', bCount);
        res.set('c', cCount);
        reserve.data = res;

        const getCount = 7;
        const letters = reserve.getRandomLetters(getCount);
        expect(letters.length).toBeLessThanOrEqual(getCount);
    });

    it('toString returns the reserve in the correct format', () => {
        const res = new Map<string, number>();
        const aCount = 5;
        const bCount = 3;
        res.set('a', aCount);
        res.set('b', bCount);
        reserve.data = res;

        const expected = 'A: 5\nB: 3';
        expect(reserve.toString()).toEqual(expected);
    });
});
