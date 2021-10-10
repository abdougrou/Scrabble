import { expect } from 'chai';
import { describe } from 'mocha';
import { Anchor } from './anchor';
import { Board } from './board';
import { Trie } from './trie';
import { coordToKey } from './utils';

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
        expect(board.anchors.size).to.equal(1);
        expect(board.anchors.has(coordToKey({ x: 7, y: 7 })));
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

    it('findAnchors sets board anchors', () => {
        const matrix = [
            [null, null, null],
            [null, 'x', null],
            [null, null, null],
        ];
        board.data = matrix;
        const expectedAnchorCount = 4;
        board.findAnchors();
        expect(board.anchors.size).to.equal(expectedAnchorCount);
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
            { x: 0, y: 1, leftLength: 0 },
            { x: 2, y: 1, leftLength: 1 },
        ];
        const anchors = board.findAnchors();
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
        const anchors = board.findAnchorsOneDimension(array, 0);
        expect(anchors).to.deep.equal(expectedAnchors);
    });

    it('generatePrefixes returns valid prefixes', () => {
        const dictionary = new Trie(['aacbb', 'acbbc', 'bbcaa', 'ccabc']);
        const easel = 'aab';
        const limit = 3;
        const expectedPrefixes = ['aa', 'a', 'b'];
        const validated = board.generatePrefixes(easel, limit, dictionary);

        expect(validated).to.have.deep.members(expectedPrefixes);
    });
});
