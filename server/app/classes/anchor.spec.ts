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
            { x: 1, y: 0, leftLength: 0 },
            { x: 1, y: 2, leftLength: 1 },
        ];
        const anchors = Anchor.findAnchors(board.data);
        expect(anchors).to.have.deep.members(expectedAnchors);
    });

    it('findAnchorsOneDimension returns all anchors in an array', () => {
        const array = [null, null, 'x', null, null, null, null, 'x', 'x', 'x', null, null, null, 'x', null];
        const expectedAnchors: Anchor[] = [
            { x: 0, y: 1, leftLength: 1 },
            { x: 0, y: 3, leftLength: 1 },
            { x: 0, y: 6, leftLength: 2 },
            { x: 0, y: 10, leftLength: 3 },
            { x: 0, y: 12, leftLength: 1 },
            { x: 0, y: 14, leftLength: 1 },
        ];
        const anchors = Anchor.findAnchorsOneDimension(array, 0);
        expect(anchors).to.deep.equal(expectedAnchors);
    });
});
