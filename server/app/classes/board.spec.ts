import { expect } from 'chai';
import { describe } from 'mocha';
import { Board } from './board';

const BOARD_SIZE = 15;

describe('Board', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board();
    });

    it('board is 15 by 15', () => {
        board.initialize();
        expect(board.data.length).to.equal(BOARD_SIZE);
        expect(board.data[0].length).to.equal(BOARD_SIZE);
    });

    it('new board is filled with null', () => {
        board.initialize();
        const rows: string[] = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            rows.push(board.data[i].join(''));
        }
        const boardString = rows.join('');
        expect(boardString).to.equal('');
    });

    it('new board has one centered anchor', () => {
        board.initialize();
    });

    it('clone should return a copy of the board', () => {
        board.data = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
        ];
        const clone = board.clone();
        expect(clone).to.not.equal(board.data);
        expect(clone).to.deep.equal(board.data);
    });

    it('setLetters places the letter in the board', () => {
        board.initialize();
        const letter = 'x';
        const coord = { x: 3, y: 8 };
        board.setLetter(coord, letter);
        expect(board.data[coord.x][coord.y]).to.equal(letter);
    });

    it('getLetter returns the letter at coord if it exists, null otherwise', () => {
        board.initialize();
        const coord = { x: 5, y: 11 };
        const letter = 'x';
        board.setLetter(coord, letter);
        expect(board.getLetter(coord)).to.equal(letter);
    });
});
