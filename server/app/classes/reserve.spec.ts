import { expect } from 'chai';
import { describe } from 'mocha';
import { Reserve } from './reserve';

const RESERVE_STR = `a,5
b,3`;

describe('Reserve', () => {
    let reserve: Reserve;

    it('reserve has correct size on instantiation', () => {
        const res = new Map<string, number>();
        const aCount = 5;
        res.set('a', aCount);
        reserve = new Reserve(res);
        expect(reserve.data).to.not.equal(res);
        expect(reserve.size).to.equal(aCount);
    });

    it('reserve can be initialized with either a map or a string', () => {
        const res = new Map<string, number>();
        const aCount = 5;
        const bCount = 3;
        res.set('a', aCount);
        res.set('b', bCount);
        reserve = new Reserve(res);
        const reserve2 = new Reserve(RESERVE_STR);
        expect(reserve.size).to.equal(reserve2.size);
        expect(reserve.data).to.deep.equal(reserve2.data);
    });

    it('reserve initialized with', () => {
        const res = new Map<string, number>();
        const aCount = 5;
        const bCount = 3;
        res.set('a', aCount);
        res.set('b', bCount);
        reserve = new Reserve(res);
        expect(reserve.size).to.equal(aCount + bCount);
    });

    it('getLetter returns a letter and reduces its count when it there is more than 0 letters', () => {
        const res = new Map<string, number>();
        const letter = 'a';
        const count = 5;
        res.set(letter, count);
        reserve = new Reserve(res);
        reserve.getLetter(letter);
        expect(reserve.data.get(letter)).to.equal(count - 1);
    });

    it("getLetter returns null when a letter's count is 0", () => {
        const res = new Map<string, number>();
        const letter = 'a';
        const count = 0;
        res.set(letter, count);
        reserve = new Reserve(res);
        const get = reserve.getLetter(letter);
        expect(get).to.equal(null);
        expect(reserve.data.get(letter)).to.equal(0);
    });

    it('returnLetter returns tiles into the reserve', () => {
        const res = new Map<string, number>();
        const aCount = 2;
        res.set('a', aCount);
        reserve = new Reserve(res);
        reserve.returnLetters(['a', 'b']);
        expect(reserve.size).to.equal(aCount + 1);
    });

    it('isExchangePossible returns true when conditions are met, false otherwise', () => {
        const res = new Map<string, number>();
        const aCount = 8;
        const exchangeAmount = 3;
        res.set('a', aCount);
        reserve = new Reserve(res);
        expect(reserve.isExchangePossible(exchangeAmount)).to.equal(true);
        // Exchange more than available in reserve
        expect(reserve.isExchangePossible(exchangeAmount * exchangeAmount)).to.equal(false);
        // Exchange when reserve is low
        reserve.getRandomLetters(exchangeAmount);
        expect(reserve.isExchangePossible(exchangeAmount)).to.equal(false);
    });

    it('exchangeLetters exchanges letters with the reserve', () => {
        const res = new Map<string, number>();
        const aCount = 5;
        const bCount = 0;
        res.set('a', aCount);
        res.set('b', bCount);
        reserve = new Reserve(res);
        const exchange = ['b', 'b', 'b', 'b', 'b'];
        const expected = ['a', 'a', 'a', 'a', 'a'];
        expect(reserve.exchangeLetters(exchange)).to.have.members(expected);
        expect(reserve.size).to.equal(aCount);
    });

    it('getRandomLetters returns random letters taken from the reserve', () => {
        const res = new Map<string, number>();
        const aCount = 2;
        const bCount = 3;
        const cCount = 1;
        res.set('a', aCount);
        res.set('b', bCount);
        res.set('c', cCount);
        reserve = new Reserve(res);

        const getCount = 7;
        const letters = reserve.getRandomLetters(getCount);
        expect(letters.length).to.lessThanOrEqual(getCount);
    });
});
