import { TestBed } from '@angular/core/testing';
import { POINT_GRID } from '@app/constants';
import { BoardService } from './board.service';

const BOARD_SIZE = 15;

describe('BoardService', () => {
    let board: BoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        board = TestBed.inject(BoardService);
    });

    it('board is 15 by 15', () => {
        board.initialize(false);
        expect(board.data.length).toEqual(BOARD_SIZE);
        expect(board.data[0].length).toEqual(BOARD_SIZE);
    });

    it('new board is filled with null', () => {
        board.initialize(false);
        const rows: string[] = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            rows.push(board.data[i].join(''));
        }
        const boardString = rows.join('');
        expect(boardString).toEqual('');
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
        expect(clone).toEqual(board.data);
        expect(clone).not.toBe(board.data);
    });

    it('setLetters places the letter in the board', () => {
        board.initialize(false);
        const letter = 'x';
        const coord = { x: 3, y: 8 };
        board.setLetter(coord, letter);
        expect(board.data[coord.x][coord.y]).toEqual(letter);
    });

    it('getLetter returns the letter at coord if it exists, null otherwise', () => {
        board.initialize(false);
        const coord = { x: 5, y: 11 };
        const letter = 'x';
        board.setLetter(coord, letter);
        expect(board.getLetter(coord)).toEqual(letter);
    });

    it('randomizeBonuses randomizes pointGrid if randombonus is true', () => {
        board.initialize(true);
        expect(board.pointGrid).not.toEqual(POINT_GRID);
    });

    it('randomizeBonuses do not randomizes pointGrid if randombonus is false', () => {
        board.initialize(false);
        expect(board.pointGrid).toEqual(POINT_GRID);
    });
});
