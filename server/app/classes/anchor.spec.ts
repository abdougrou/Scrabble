import { expect } from 'chai';
import { describe } from 'mocha';
import { Anchor } from './anchor';
import { Board } from './board';

describe('Anchor', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board();
    });

    it('findAnchors returns all anchors in the board', () => {
        const matrix = [
            [null, null, null],
            [null, 'x', null],
            [null, null, null],
        ];
        board.data = matrix;
        const expectedAnchors: Anchor[] = [
            { x: 1, y: 0, leftPart: '', leftLength: 0 },
            { x: 1, y: 2, leftPart: 'x', leftLength: 1 },
        ];
        const anchors = Anchor.findAnchors(board.data);
        expect(anchors).to.have.deep.members(expectedAnchors);
    });

    it('findAnchorsOneDimension returns all anchors in an array', () => {
        const array = [null, null, 'a', null, null, null, null, 'b', 'c', 'a', null, null, null, 'x', null];
        const expectedAnchors: Anchor[] = [
            { x: 0, y: 1, leftPart: '', leftLength: 1 },
            { x: 0, y: 3, leftPart: 'a', leftLength: 1 },
            { x: 0, y: 6, leftPart: '', leftLength: 2 },
            { x: 0, y: 10, leftPart: 'bca', leftLength: 3 },
            { x: 0, y: 12, leftPart: '', leftLength: 1 },
            { x: 0, y: 14, leftPart: 'x', leftLength: 1 },
        ];
        const anchors = Anchor.findAnchorsOneDimension(array, 0);
        expect(anchors).to.deep.equal(expectedAnchors);
    });
});
