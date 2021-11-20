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
        expect(moveGenerator.legalMoves).toEqual(expectedLegalMoves);
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
        expect(moveGenerator.legalMoves).toEqual(expectedLegalMoves);
    });

    it('calculateAnchorsAndCrossChecks finds all anchors and cross checks for a given board', () => {
        board = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, 'c', null, 't', null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ];
        dictionary = new Trie(['cacat', 'cat']);
        moveGenerator = new MoveGenerator(dictionary);
        moveGenerator.calculateAnchorsAndCrossChecks(board);

        const expectedLength = 7;
        expect(moveGenerator.anchors.length).toEqual(expectedLength);
        expect(moveGenerator.crossChecks.size).toEqual(expectedLength);
    });

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
            { word: 'cab', coord, across: false },
            { word: 'cba', coord, across: false },
            { word: 'cat', coord, across: true },
            { word: 'cbt', coord, across: true },
        ];
        expect(moveGenerator.legalMoves).toEqual(expectedMoves);
    });

    it('calculateCrossSums returns correct value for given coord', () => {
        board = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, 'c', null, 't', null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ];
        dictionary = new Trie(['cat']);
        moveGenerator = new MoveGenerator(dictionary);

        const coord1 = { x: 3, y: 3 };
        const across1 = true;
        const expectedValue1 = 4;
        expect(moveGenerator.calculateCrossSum(board, coord1, across1)).toEqual(expectedValue1);

        const coord2 = coord1;
        const across2 = false;
        const expectedValue2 = 0;
        expect(moveGenerator.calculateCrossSum(board, coord2, across2)).toEqual(expectedValue2);
    });

    it('calculateWordPoints returns correct value', () => {
        board = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, 'o', null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ];
        dictionary = new Trie(['carotte']);
        moveGenerator = new MoveGenerator(dictionary);

        const coord = { x: 2, y: 1 };
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const pointRow = [0, 1, 2, 0, 3, 4, 0];
        const points = moveGenerator.calculateWordPoints({ word: 'carotte', coord, across: true }, board[coord.x], pointRow);
        const expectedPoints = 96;
        expect(points).toEqual(expectedPoints);
    });
});
