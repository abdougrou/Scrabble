import { expect } from 'chai';
import { describe } from 'mocha';
import { CrossCheck } from './cross-check';
import { Trie } from './trie';

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

    it('hasLetter returns true only when a letter is in the bit vector', () => {
        const anStar = 67117057;
        check.value = anStar;
        expect(CrossCheck.hasLetter(check, 'a')).to.equal(true);
        expect(CrossCheck.hasLetter(check, '*')).to.equal(true);
        expect(CrossCheck.hasLetter(check, 'b')).to.equal(false);
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

    it('crossCheck should return only valid letters for both row and column', () => {
        const dict: Trie = new Trie(['aaac', 'abac', 'acac', 'aa', 'ba', 'bac', 'caa', 'zaa']);
        const board = [
            [null, null, null, null, null],
            [null, 'a', null, null, null],
            [null, null, 'a', null, null],
            [null, 'a', null, null, null],
            [null, 'c', null, null, null],
        ];
        const coord = { x: 2, y: 1 };
        const crossCheckValue = 7;
        expect(CrossCheck.crossCheck(board, coord, dict).value).to.equal(crossCheckValue);
    });

    it('crossCheckOneDimension returns all valid letters when prefix only exists', () => {
        const dict: Trie = new Trie(['aavce', 'aaxxe']);
        const row = [null, 'a', 'a', null, null, null];
        const coord = 3;
        const expectLetters = ['v', 'x'];

        expect(CrossCheck.crossCheckOneDimension(row, coord, dict)).to.have.members(expectLetters);
    });

    it('crossCheckOneDimension returns all valid letters when suffix only exists', () => {
        const dict: Trie = new Trie(['aavce', 'aaxxe', 'baa', 'maa']);
        const row1 = [null, null, 'a', null, null, null];
        const row2 = [null, null, 'a', null, null, null];
        const coord = 1;
        const expectLetters = ['a', 'b', 'm'];

        expect(CrossCheck.crossCheckOneDimension(row1, coord, dict)).to.have.members(expectLetters);
        expect(CrossCheck.crossCheckOneDimension(row2, coord, dict)).to.have.members(expectLetters);
    });

    it('crossCheckOneDimension returns all valid letters when suffix and prefix exists', () => {
        const dict: Trie = new Trie(['aavce', 'aaxxe']);
        const row = [null, 'a', 'a', null, 'c', null];
        const coord = 3;
        const expectLetters = ['v'];

        const output = CrossCheck.crossCheckOneDimension(row, coord, dict);
        expect(output).to.have.members(expectLetters);
    });

    it('crossCheckOneDimension returns only valid letters when the word fits in the row', () => {
        const dict: Trie = new Trie(['aavce', 'aaxce']);
        const row = [null, 'a', 'a', null];
        const coord = 3;

        expect(CrossCheck.crossCheckOneDimension(row, coord, dict)).to.have.members([]);
    });
});
