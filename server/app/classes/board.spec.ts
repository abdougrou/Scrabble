import { expect } from 'chai';
import { describe } from 'mocha';
import { Board } from './board';

const BOARD_SIZE = 15;

describe('Board', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board();
    });

    it('initialize() give the board the correct size', () => {
        board.initialize();

        expect(board.data.length).to.equal(BOARD_SIZE);
        expect(board.data[0].length).to.equal(BOARD_SIZE);
    });

    it('initialize()  fills the board with empty character', () => {
        board.initialize();
        const rows: string[] = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            rows.push(board.data[i].join(''));
        }
        const boardString = rows.join('');

        expect(boardString).to.equal('');
    });

    it('getBoard() should return a copy of the board', () => {
        board.data = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
        ];
        const clone = board.clone();

        expect(clone).to.not.equal(board.data);
        expect(clone).to.deep.equal(board.data);
    });

    it('transpopse() should return a transposed matrix', () => {
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
});
