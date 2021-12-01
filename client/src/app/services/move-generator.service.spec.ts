import { TestBed } from '@angular/core/testing';
import { Trie } from '@app/classes/trie';
import { BoardService } from './board.service';
import { MoveGeneratorService } from './move-generator.service';

const POINT_GRID_TEST = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

describe('MoveGeneratorService', () => {
    let service: MoveGeneratorService;
    let board: BoardService;

    beforeEach(() => {
        board = new BoardService();
        board.pointGrid = POINT_GRID_TEST;
        TestBed.configureTestingModule({
            providers: [{ provide: BoardService, useValue: board }],
        });
        service = TestBed.inject(MoveGeneratorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('extendRight returns all legal moves for anchor with left part from board', () => {
    //     board.data = [
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, 'a', null, null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, 'a', null, 'c', null, 'e', null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, 'd', null, null, null],
    //     ];
    //     service.dictionary = new Trie(['abcde', 'abc']);
    //     service.anchors = Anchor.findAnchors(board.data);

    //     const anchor = service.anchors.filter((item) => item.across && item.x === 3 && item.y === 2)[0];
    //     const easel = 'bd';
    //     const crossCheck1 = new CrossCheck();
    //     const crossCheck2 = new CrossCheck();
    //     CrossCheck.addLetter(crossCheck1, 'b');
    //     CrossCheck.addLetter(crossCheck2, 'd');
    //     service.crossChecks.set(coordToKey({ x: anchor.x, y: anchor.y }), crossCheck1);
    //     service.crossChecks.set(coordToKey({ x: anchor.x, y: anchor.y + 2 }), crossCheck2);

    //     service.extendLeft(easel, 'a', anchor, service.dictionary.getNode('a') as TrieNode, anchor.leftPart.length > 0 ? 0 : anchor.leftLength);
    //     const expectedLegalMoves = [
    //         { word: 'abc', coord: { x: 3, y: 1 }, across: true, points: 4 },
    //         { word: 'abcde', coord: { x: 3, y: 1 }, across: true, points: 5 },
    //     ];
    //     expect(service.legalMoves).toEqual(expectedLegalMoves);
    // });

    // it('extendRight returns all legal moves for anchor with left part from easel', () => {
    //     board.data = [
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, 'a', null, null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, 'c', null, 'e', null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, 'd', null, null, null],
    //     ];
    //     service.dictionary = new Trie(['abcde', 'bcde']);
    //     service.anchors = Anchor.findAnchors(board.data);

    //     const anchor = service.anchors.filter((item) => item.across && item.x === 3 && item.y === 2)[0];
    //     const easel = 'abd';
    //     const crossCheck1 = new CrossCheck();
    //     const crossCheck2 = new CrossCheck();
    //     CrossCheck.addLetter(crossCheck1, 'b');
    //     CrossCheck.addLetter(crossCheck2, 'd');
    //     service.crossChecks.set(coordToKey({ x: anchor.x, y: anchor.y }), crossCheck1);
    //     service.crossChecks.set(coordToKey({ x: anchor.x, y: anchor.y + 2 }), crossCheck2);

    //     service.extendLeft(easel, '', anchor, service.dictionary.root, anchor.leftPart.length > 0 ? 0 : anchor.leftLength);
    //     const expectedLegalMoves = [
    //         { word: 'bcde', coord: { x: 3, y: 2 }, across: true, points: 16 },
    //         { word: 'abcde', coord: { x: 3, y: 1 }, across: true, points: 4 },
    //     ];
    //     expect(service.legalMoves).toEqual(expectedLegalMoves);
    // });

    it('calculateAnchorsAndCrossChecks finds all anchors and cross checks for a given board', () => {
        board.data = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, 'c', null, 't', null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ];
        service.dictionary = new Trie(['cacat', 'cat']);
        service.calculateAnchorsAndCrossChecks();

        const expectedLength = 7;
        expect(service.anchors.length).toEqual(expectedLength);
        expect(service.crossChecks.size).toEqual(expectedLength);
    });

    // it('generateLegalMoves finds all legal moves for a given board and easel', () => {
    //     board.data = [
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, 'c', null, 't', null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, null, null, null, null],
    //         [null, null, null, null, null, null, null],
    //     ];
    //     service.dictionary = new Trie(['cat', 'cbt', 'cab', 'cba']);
    //     service.calculateAnchorsAndCrossChecks();
    //     const easel = 'ab';
    //     service.generateLegalMoves(easel);
    //     const coord = { x: 3, y: 2 };
    //     const expectedMoves = [
    //         { word: 'cab', coord, across: false, points: 3 },
    //         { word: 'cba', coord, across: false, points: 3 },
    //         { word: 'cat', coord, across: true, points: 4 },
    //         { word: 'cbt', coord, across: true, points: 4 },
    //     ];
    //     expect(service.legalMoves).toEqual(expectedMoves);
    // });

    it('calculateCrossSums returns correct value for given coord', () => {
        board.data = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, 'c', null, 't', null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ];
        service.dictionary = new Trie(['cat']);

        const coord1 = { x: 3, y: 3 };
        const across1 = true;
        const expectedValue1 = 4;
        expect(service.calculateCrossSum(coord1, across1)).toEqual(expectedValue1);

        const coord2 = coord1;
        const across2 = false;
        const expectedValue2 = 0;
        expect(service.calculateCrossSum(coord2, across2)).toEqual(expectedValue2);
    });

    //     it('calculateWordPoints returns correct value', () => {
    //         board.data = [
    //             [null, null, null, null, null, null, null],
    //             [null, null, null, null, null, null, null],
    //             [null, null, null, 'o', null, null, null],
    //             [null, null, null, null, null, null, null],
    //             [null, null, null, null, null, null, null],
    //             [null, null, null, null, null, null, null],
    //             [null, null, null, null, null, null, null],
    //         ];
    //         service.dictionary = new Trie(['carotte']);

    //         const coord = { x: 2, y: 1 };
    //         // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    //         const pointRow = [0, 1, 2, 0, 3, 4, 0];
    //         const points = service.calculateWordPoints({ word: 'carotte', coord, across: true, points: 0 }, board.data[coord.x], pointRow);
    //         const expectedPoints = 96;
    //         expect(points).toEqual(expectedPoints);
    //     });
});
