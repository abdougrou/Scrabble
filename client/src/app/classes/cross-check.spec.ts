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

        expect(CrossCheck.getLetterBitShift(a)).toEqual(aBitShift);
        expect(CrossCheck.getLetterBitShift(v)).toEqual(vBitShift);
        expect(CrossCheck.getLetterBitShift(star)).toEqual(starBitShift);
        expect(CrossCheck.getLetterBitShift(']')).toEqual(invalidBitShift);
    });

    it('addLetter adds a letter to the bit vector', () => {
        const a = 'a';
        const n = 'n';
        const star = '*';

        const expectA = 1;
        const expectAn = 8193;
        const expectAnSTAR = 67117057;

        CrossCheck.addLetter(check, a);
        expect(check.value).toEqual(expectA);
        CrossCheck.addLetter(check, n);
        expect(check.value).toEqual(expectAn);
        CrossCheck.addLetter(check, star);
        expect(check.value).toEqual(expectAnSTAR);
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
        expect(check.value).toEqual(expectAn);
        CrossCheck.removeLetter(check, n);
        expect(check.value).toEqual(expectA);
        CrossCheck.removeLetter(check, a);
        expect(check.value).toEqual(0);
    });

    it('hasLetter returns true only when a letter is in the bit vector', () => {
        const anStar = 67117057;
        check.value = anStar;
        expect(CrossCheck.hasLetter(check, 'a')).toEqual(true);
        expect(CrossCheck.hasLetter(check, '*')).toEqual(true);
        expect(CrossCheck.hasLetter(check, 'b')).toEqual(false);
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

        expect(CrossCheck.getLetterValue(a)).toEqual(expectA);
        expect(CrossCheck.getLetterValue(n)).toEqual(expectN);
        expect(CrossCheck.getLetterValue(star)).toEqual(expectSTAR);
        expect(CrossCheck.getLetterValue(invalid)).toEqual(invalidBitShift);
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
        expect(CrossCheck.crossCheck(board, coord, dict).value).toEqual(crossCheckValue);
    });

    it('crossCheck should return valid letters when prefix on both directions', () => {
        const dict: Trie = new Trie(['abc', 'acd']);
        const board = [
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, 'c', 'd', null, null],
            [null, 'b', null, null, null, null],
            [null, 'c', null, null, null, null],
            [null, null, null, null, null, null],
        ];
        const coord = { x: 2, y: 1 };
        const crossCheckValue = 1;
        expect(CrossCheck.crossCheck(board, coord, dict).value).toEqual(crossCheckValue);
    });

    it('crossCheck should return valid letters when suffix on buth directions', () => {
        const dict: Trie = new Trie(['abc', 'dxc']);
        const board = [
            [null, null, null, null, null, null],
            [null, null, null, null, 'a', null],
            [null, null, null, null, 'b', null],
            [null, null, 'd', 'x', null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
        ];
        const coord = { x: 3, y: 4 };
        const crossCheckValue = 4;
        expect(CrossCheck.crossCheck(board, coord, dict).value).toEqual(crossCheckValue);
    });

    it('crossCheck should return valid letters when across suffix and down prefix', () => {
        const dict: Trie = new Trie(['abc', 'cdx']);
        const board = [
            [null, null, null, null, null, null],
            [null, 'a', null, null, null, null],
            [null, 'b', null, null, null, null],
            [null, null, 'd', 'x', null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
        ];
        const coord = { x: 3, y: 1 };
        const crossCheckValue = 4;
        expect(CrossCheck.crossCheck(board, coord, dict).value).toEqual(crossCheckValue);
    });

    it('crossCheck should return valid letters when across prefix and down suffix', () => {
        const dict: Trie = new Trie(['abc', 'dxa']);
        const board = [
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, 'd', 'x', null, null],
            [null, null, null, null, 'b', null],
            [null, null, null, null, 'c', null],
            [null, null, null, null, null, null],
        ];
        const coord = { x: 2, y: 4 };
        const crossCheckValue = 1;
        expect(CrossCheck.crossCheck(board, coord, dict).value).toEqual(crossCheckValue);
    });

    it('crossCheckOneDimension returns all valid letters when prefix only exists', () => {
        const dict: Trie = new Trie(['aavce', 'aaxxe']);
        const row = [null, 'a', 'a', null, null, null];
        const coord = 3;
        const expectLetters = ['v', 'x'];

        expect(CrossCheck.crossCheckOneDimension(row, coord, dict)).toEqual(expectLetters);
    });

    it('crossCheckOneDimension returns all valid letters when suffix only exists', () => {
        const dict: Trie = new Trie(['aavce', 'aaxxe', 'baa', 'maa']);
        const row = [null, null, 'a', null, null, null];
        const coord = 1;
        const expectLetters = ['a', 'b', 'm'];

        expect(CrossCheck.crossCheckOneDimension(row, coord, dict)).toEqual(expectLetters);
    });

    it('crossCheckOneDimension returns all valid letters when suffix and prefix exists', () => {
        const dict: Trie = new Trie(['aavce', 'aaxxe']);
        const row = [null, 'a', 'a', null, 'c', null];
        const coord = 3;
        const expectLetters = ['v'];

        const output = CrossCheck.crossCheckOneDimension(row, coord, dict);
        expect(output).toEqual(expectLetters);
    });

    it('crossCheckOneDimension returns only valid letters when the word fits in the row', () => {
        const dict: Trie = new Trie(['aavce', 'aaxce']);
        const row = [null, 'a', 'a', null];
        const coord = 3;

        expect(CrossCheck.crossCheckOneDimension(row, coord, dict)).toEqual([]);
    });
});
