import { expect } from 'chai';
import { describe } from 'mocha';
import { CrossCheck } from './cross-check';

describe('CrossCheck', () => {
    let check: CrossCheck;

    beforeEach(() => {
        check = new CrossCheck();
    });

    it('getLetterBitShift returns correct shift', () => {
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

    it('addLetter adds a letter to the bit vector', () => {
        const a = 'a';
        const n = 'n';
        const star = '*';

        const expectA = 1;
        const expectAn = 8193;
        const expectAnSTAR = 67117057;

        CrossCheck.addLetter(check, a);
        expect(check.value).to.equal(expectA);
        CrossCheck.addLetter(check, n);
        expect(check.value).to.equal(expectAn);
        CrossCheck.addLetter(check, star);
        expect(check.value).to.equal(expectAnSTAR);
    });

    it('removeLetter removes a letter from the bit vector', () => {
        const a = 'a';
        const n = 'n';
        const star = '*';

        const expectA = 1;
        const expectAn = 8193;
        const anStar = 67117057;
        check.value = anStar;

        CrossCheck.removeLetter(check, star);
        expect(check.value).to.equal(expectAn);
        CrossCheck.removeLetter(check, n);
        expect(check.value).to.equal(expectA);
        CrossCheck.removeLetter(check, a);
        expect(check.value).to.equal(0);
    });

    it('getLetterValue returns the correct values', () => {
        const a = 'a';
        const n = 'n';
        const star = '*';
        const invalid = ']';

        const expectA = 1;
        const expectN = 8192;
        const expectSTAR = 67108864;
        const invalidBitShift = -1;

        expect(CrossCheck.getLetterValue(a)).to.equal(expectA);
        expect(CrossCheck.getLetterValue(n)).to.equal(expectN);
        expect(CrossCheck.getLetterValue(star)).to.equal(expectSTAR);
        expect(CrossCheck.getLetterValue(invalid)).to.equal(invalidBitShift);
    });
});
