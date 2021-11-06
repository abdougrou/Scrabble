import { POINT_GRID } from '@app/constants';
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
        board.initialize(false);
        expect(board.data.length).to.equal(BOARD_SIZE);
        expect(board.data[0].length).to.equal(BOARD_SIZE);
    });

    it('new board is filled with null', () => {
        board.initialize(false);
        const rows: string[] = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            rows.push(board.data[i].join(''));
        }
        const boardString = rows.join('');
        expect(boardString).to.equal('');
    });

    it('new board has one centered anchor', () => {
        board.initialize(false);
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
        board.initialize(false);
        const letter = 'x';
        const coord = { x: 3, y: 8 };
        board.setLetter(coord, letter);
        expect(board.data[coord.x][coord.y]).to.equal(letter);
    });

    it('getLetter returns the letter at coord if it exists, null otherwise', () => {
        board.initialize(false);
        const coord = { x: 5, y: 11 };
        const letter = 'x';
        board.setLetter(coord, letter);
        expect(board.getLetter(coord)).to.equal(letter);
    });

    it('randomizeBonuses randomizes pointGrid if randombonus is true', () => {
        board.initialize(true);
        const bool = board.pointGrid === POINT_GRID;
        expect(bool).to.equal(false);
    });

    it('randomizeBonuses do not randomizes pointGrid if randombonus is false', () => {
        board.initialize(false);
        const bool = board.pointGrid === POINT_GRID;
        expect(bool).to.equal(true);
    });
});
