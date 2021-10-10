import { expect } from 'chai';
import { describe } from 'mocha';
import { Anchor } from './anchor';
import { Board } from './board';

const BOARD_SIZE = 15;

describe('Board', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board();
    });

    it('board is 15 by 15', () => {
        expect(board.data.length).to.equal(BOARD_SIZE);
        expect(board.data[0].length).to.equal(BOARD_SIZE);
    });

    it('new board is filled with null', () => {
        const rows: string[] = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            rows.push(board.data[i].join(''));
        }
        const boardString = rows.join('');
        expect(boardString).to.equal('');
    });

    it('getBoard should return a copy of the board', () => {
        board.data = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
        ];
        const clone = board.clone();
        expect(clone).to.not.equal(board.data);
        expect(clone).to.deep.equal(board.data);
    });

    it('transpopse should return a transposed matrix', () => {
        board.data = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
        ];
        const transposedBoard = [
            ['1', '4', '7'],
            ['2', '5', '8'],
            ['3', '6', '9'],
        ];
        expect(board.transpose()).to.deep.equal(transposedBoard);
    });

    it('findAnchors returns all anchors in the board', () => {
        const matrix = [
            [null, null, null],
            [null, 'x', null],
            [null, null, null],
        ];
        board.data = matrix;
        const expectedAnchors: Anchor[] = [
            { coord: { x: 0, y: 1 } },
            { coord: { x: 1, y: 0 } },
            { coord: { x: 1, y: 2 } },
            { coord: { x: 2, y: 1 } },
        ];
        const anchors = board.findAnchors();
        expect(anchors).to.have.deep.members(expectedAnchors);
    });

    it('findAnchorsOneDimension returns all anchors in an array', () => {
        const array = [null, null, 'x', null, 'x', null, null, 'x'];
        const expectedAnchors: Anchor[] = [
            { coord: { x: 0, y: 1 } },
            { coord: { x: 0, y: 3 } },
            { coord: { x: 0, y: 5 } },
            { coord: { x: 0, y: 6 } },
        ];
        const anchors = board.findAnchorsOneDimension(array, 0);
        expect(anchors).to.deep.equal(expectedAnchors);
    });
});
