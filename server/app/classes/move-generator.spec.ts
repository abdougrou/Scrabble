import { expect } from 'chai';
import { describe } from 'mocha';
import { Anchor } from './anchor';
import { coordToKey } from './board-utils';
import { CrossCheck } from './cross-check';
import { MoveGenerator } from './move-generator';
import { Trie, TrieNode } from './trie';

describe('MoveGenerator', () => {
    let moveGenerator: MoveGenerator;
    let board: (string | null)[][];
    let dictionary: Trie;

    it('extendRight returns all legal moves for anchor with left part from board', () => {
        board = [
            [null, null, null, null, null, null, null],
            [null, null, null, 'a', null, null, null],
            [null, null, null, null, null, null, null],
            [null, 'a', null, 'c', null, 'e', null],
            [null, null, null, null, null, null, null],
            [null, null, null, 'd', null, null, null],
        ];
        dictionary = new Trie(['abcde', 'abc']);
        moveGenerator = new MoveGenerator(dictionary);
        moveGenerator.anchors = Anchor.findAnchors(board);

        const anchor = moveGenerator.anchors.filter((item) => item.across && item.x === 3 && item.y === 2)[0];
        const easel = 'bd';
        const crossCheck1 = new CrossCheck();
        const crossCheck2 = new CrossCheck();
        CrossCheck.addLetter(crossCheck1, 'b');
        CrossCheck.addLetter(crossCheck2, 'd');
        moveGenerator.crossChecks.set(coordToKey({ x: anchor.x, y: anchor.y }), crossCheck1);
        moveGenerator.crossChecks.set(coordToKey({ x: anchor.x, y: anchor.y + 2 }), crossCheck2);

        moveGenerator.extendLeft(board, easel, 'a', anchor, dictionary.getNode('a') as TrieNode, anchor.leftPart.length > 0 ? 0 : anchor.leftLength);
        const expectedLegalMoves = [
            { word: 'abc', coord: { x: 3, y: 1 }, across: true },
            { word: 'abcde', coord: { x: 3, y: 1 }, across: true },
        ];
        expect(moveGenerator.legalMoves).to.have.deep.members(expectedLegalMoves);
    });

    it('extendRight returns all legal moves for anchor with left part from easel', () => {
        board = [
            [null, null, null, null, null, null, null],
            [null, null, null, 'a', null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, 'c', null, 'e', null],
            [null, null, null, null, null, null, null],
            [null, null, null, 'd', null, null, null],
        ];
        dictionary = new Trie(['abcde', 'bcde']);
        moveGenerator = new MoveGenerator(dictionary);
        moveGenerator.anchors = Anchor.findAnchors(board);

        const anchor = moveGenerator.anchors.filter((item) => item.across && item.x === 3 && item.y === 2)[0];
        const easel = 'abd';
        const crossCheck1 = new CrossCheck();
        const crossCheck2 = new CrossCheck();
        CrossCheck.addLetter(crossCheck1, 'b');
        CrossCheck.addLetter(crossCheck2, 'd');
        moveGenerator.crossChecks.set(coordToKey({ x: anchor.x, y: anchor.y }), crossCheck1);
        moveGenerator.crossChecks.set(coordToKey({ x: anchor.x, y: anchor.y + 2 }), crossCheck2);

        moveGenerator.extendLeft(board, easel, '', anchor, dictionary.root, anchor.leftPart.length > 0 ? 0 : anchor.leftLength);
        const expectedLegalMoves = [
            { word: 'bcde', coord: { x: 3, y: 2 }, across: true },
            { word: 'abcde', coord: { x: 3, y: 1 }, across: true },
        ];
        expect(moveGenerator.legalMoves).to.have.deep.members(expectedLegalMoves);
    });

    // it('calculateAnchorsAndCrossChecks finds all anchors and cross checks for a given board', () => {
    //     board = [
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, 'c', null, 't', null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, null, null, null, null],
    //     ];
    //     dictionary = new Trie(['cacat', 'cat']);
    //     moveGenerator = new MoveGenerator(dictionary);
    //     moveGenerator.calculateAnchorsAndCrossChecks(board);

    //     const expectedLength = 7;
    //     expect(moveGenerator.anchors.length).to.equal(expectedLength);
    //     expect(moveGenerator.crossChecks.size).to.equal(expectedLength);
    // });

    it('generateLegalMoves finds all legal moves for a given board and easel', () => {
        board = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, 'c', null, 't', null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ];
        dictionary = new Trie(['cat', 'cbt', 'cab', 'cba']);
        moveGenerator = new MoveGenerator(dictionary);
        moveGenerator.calculateAnchorsAndCrossChecks(board);
        const easel = 'ab';
        moveGenerator.generateLegalMoves(board, easel);
        const coord = { x: 3, y: 2 };
        const expectedMoves = [
            { word: 'cat', coord, across: true },
            { word: 'cbt', coord, across: true },
            { word: 'cab', coord, across: false },
            { word: 'cba', coord, across: false },
        ];
        expect(moveGenerator.legalMoves).to.have.deep.members(expectedMoves);
    });
});
