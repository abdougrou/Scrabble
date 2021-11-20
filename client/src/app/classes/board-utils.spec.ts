import { coordToKey, keyToCoord, transpose, transposeCoord } from './board-utils';

describe('BoardUtils', () => {
    it('coordToKey returns correct string key', () => {
        const coord1 = { x: 0, y: 7 };
        const coord2 = { x: 7, y: 7 };
        const coord3 = { x: 11, y: 8 };
        const expectedCoord1 = '0.7';
        const expectedCoord2 = '7.7';
        const expectedCoord3 = '11.8';

        expect(coordToKey(coord1)).toEqual(expectedCoord1);
        expect(coordToKey(coord2)).toEqual(expectedCoord2);
        expect(coordToKey(coord3)).toEqual(expectedCoord3);
    });

    it('keyToCoord returns correct Vec2 coordinate', () => {
        const coord1 = '0.7';
        const coord2 = '7.7';
        const coord3 = '11.8';
        const expectedCoord1 = { x: 0, y: 7 };
        const expectedCoord2 = { x: 7, y: 7 };
        const expectedCoord3 = { x: 11, y: 8 };

        expect(keyToCoord(coord1)).toEqual(expectedCoord1);
        expect(keyToCoord(coord2)).toEqual(expectedCoord2);
        expect(keyToCoord(coord3)).toEqual(expectedCoord3);
    });

    // it('getStringCombinations returns all combinations of the given length', () => {
    //     const str = 'abc';
    //     const length = 2;
    //     const expectedOutput = ['a', 'b', 'c', 'ab', 'ac', 'ba', 'bc', 'ca', 'cb'];

    //     expect(getStringCombinations(str, length)).toContain(jasmine.objectContaining(expectedOutput));
    // });

    // it('getStringCombinations returns no duplicates', () => {
    //     const str = 'aaaaaaa';
    //     const expectedOutput = ['a', 'aa', 'aaa', 'aaaa', 'aaaaa', 'aaaaaa', 'aaaaaaa'];

    //     expect(getStringCombinations(str, str.length)).toContain(jasmine.objectContaining(expectedOutput));
    // });

    it('transpopse should return a transposed matrix', () => {
        const board = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
        ];
        const transposedBoard = [
            ['1', '4', '7'],
            ['2', '5', '8'],
            ['3', '6', '9'],
        ];
        expect(transpose(board)).toEqual(transposedBoard);
    });

    it('transposeCoord should return the coordinates flipped', () => {
        const coord = { x: 10, y: 65 };
        const expectedCoord = { x: 65, y: 10 };
        expect(transposeCoord(coord)).toEqual(expectedCoord);
    });
});
