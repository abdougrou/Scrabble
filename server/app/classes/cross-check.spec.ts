import { expect } from 'chai';
import { describe } from 'mocha';
import { CrossCheck } from './cross-check';

describe('Trie', () => {
    let crossCheck: CrossCheck;

    beforeEach(() => {
        crossCheck = new CrossCheck();
    });

    it('getLetterBitShift() returns correct shift', () => {
        const a = 'a';
        const v = 'v';
        const star = '*';

        const aBitShift = 0;
        const vBitShift = 21;
        const starBitShift = 26;
        const invalidBitShift = -1;

        expect(CrossCheck.getLetterBitShift(a)).to.equal(aBitShift);
        expect(CrossCheck.getLetterBitShift(v)).to.equal(vBitShift);
        expect(CrossCheck.getLetterBitShift(star)).to.equal(starBitShift);
        expect(CrossCheck.getLetterBitShift(']')).to.equal(invalidBitShift);
    });

    it('addLetter() adds a letter to the bit vector', () => {
        const a = 'a';
        const n = 'n';
        const star = '*';

        const expectA = 1;
        const expectAn = 8193;
        const expectAnSTAR = 67117057;

        crossCheck.addLetter(a);
        expect(crossCheck.value).to.equal(expectA);
        crossCheck.addLetter(n);
        expect(crossCheck.value).to.equal(expectAn);
        crossCheck.addLetter(star);
        expect(crossCheck.value).to.equal(expectAnSTAR);
    });
});
