import { CLASSIC_RESERVE } from '@app/constants';
import { Move } from '@common/move';
import { Vec2 } from '@common/vec2';
import { Anchor } from './anchor';
import { coordToKey, transpose } from './board-utils';
import { CrossCheck } from './cross-check';
import { Trie, TrieNode } from './trie';

const LIGHT_BLUE_MULTIPLIER = 2;
const DARK_BLUE_MULTIPLIER = 3;
const PINK_MULTIPLIER = 2;
const RED_MULTIPLIER = 3;

export class MoveGenerator {
    anchors: Anchor[] = [];
    crossChecks: Map<string, CrossCheck> = new Map();
    dictionary: Trie;
    legalMoves: Move[] = [];
    pointMap: Map<string, number> = new Map();
    pointGrid: number[][] = [];

    constructor(dictionary: Trie, pointGrid: number[][]) {
        this.dictionary = dictionary;
        this.pointGrid = pointGrid;

        const lettersData: string[] = CLASSIC_RESERVE.split(/\r?\n/);
        lettersData.forEach((letterData) => {
            const data = letterData.split(',');
            this.pointMap.set(data[0], parseInt(data[2], 10));
        });
    }

    /**
     * Calculate all anchors and cross-checks for a given board
     *
     * @param board board to calculate anchors and cross-checks for
     */
    calculateAnchorsAndCrossChecks(board: (string | null)[][]) {
        this.anchors = Anchor.findAnchors(board);
        this.crossChecks = new Map();
        this.anchors.forEach((anchor) => {
            const coord: Vec2 = { x: anchor.x, y: anchor.y };
            const crossCheck = CrossCheck.crossCheck(board, coord, this.dictionary);
            this.crossChecks.set(coordToKey(coord), crossCheck);
        });
    }

    calculateCrossSum(board: (string | null)[][], coord: Vec2, across: boolean): number {
        const row = across ? board[coord.x] : (transpose(board)[coord.y] as (string | null)[]);
        const coord1D = across ? coord.y : coord.x;
        return this.calculateCrossSumOneDimension(row, coord1D);
    }

    calculateCrossSumOneDimension(row: (string | null)[], coord: number): number {
        let points = 0;
        if (row[coord - 1]) {
            let i = coord - 1;
            while (row[i]) {
                points += this.pointMap.get(row[i] as string) as number;
                i--;
            }
        }
        if (row[coord + 1]) {
            let i = coord + 1;
            while (row[i]) {
                points += this.pointMap.get(row[i] as string) as number;
                i++;
            }
        }

        return points;
    }

    /**
     * Generate all legal move possible for a given board and player easel
     *
     * @param board board to generate moves for
     * @param easel current player's easel
     */
    async generateLegalMoves(board: (string | null)[][], easel: string) {
        this.legalMoves = [];
        this.calculateAnchorsAndCrossChecks(board);
        this.anchors.forEach((anchor) => {
            if (anchor.leftPart.length > 0) {
                const node = this.dictionary.getNode(anchor.leftPart);
                if (node) {
                    this.extendLeft(board, easel, anchor.leftPart, anchor, node, 0);
                }
            } else this.extendLeft(board, easel, '', anchor, this.dictionary.root, anchor.leftLength);
        });
    }

    /**
     * Extends the word to the left recursively and generates legal moves
     *
     * @param board the board to generate words for
     * @param easel current player's easel
     * @param partialWord left part of the word
     * @param anchor anchor
     * @param node last letter's node, root if partialWord is empty string
     * @param limit anchor.leftLength if anchor.leftPart is empty string, 0 otherwise
     */
    extendLeft(board: (string | null)[][], easel: string, partialWord: string, anchor: Anchor, node: TrieNode, limit: number) {
        this.extendRight(board, easel, partialWord, anchor, node, { x: anchor.x, y: anchor.y });
        if (limit > 0) {
            node.children.forEach((edge) => {
                if (edge.value && easel.includes(edge.value)) {
                    const nextNode = edge;
                    const nextEasel = easel.replace(edge.value, '');
                    this.extendLeft(board, nextEasel, partialWord + edge.value, anchor, nextNode, limit - 1);
                }
            });
        }
    }

    /**
     * Extends the word to the right recursively and generates legal moves
     *
     * @param board the board generate words for
     * @param easel current player's easel
     * @param partialWord left part of the word
     * @param anchor anchor
     * @param node last letter's node
     * @param square square to fill
     */
    extendRight(board: (string | null)[][], easel: string, partialWord: string, anchor: Anchor, node: TrieNode, square: Vec2) {
        if (square.x >= board.length && square.y >= board.length) return;

        const boardLetter = board[square.x][square.y];
        if (!boardLetter) {
            if (node.terminal) {
                const coord = anchor.across ? { x: square.x, y: square.y - partialWord.length } : { x: square.x - partialWord.length, y: square.y };
                this.legalMove(board, partialWord, coord, anchor.across);
            }

            node.children.forEach((edge) => {
                const crossCheck = this.crossChecks.get(coordToKey(square));
                if (edge.value && easel.includes(edge.value) && (crossCheck ? CrossCheck.hasLetter(crossCheck, edge.value) : true)) {
                    const nextNode = edge;
                    const nextEasel = easel.replace(edge.value, '');
                    const nextSquare = anchor.across ? { x: square.x, y: square.y + 1 } : { x: square.x + 1, y: square.y };
                    if (nextSquare.x < board.length && nextSquare.y < board.length)
                        this.extendRight(board, nextEasel, partialWord + edge.value, anchor, nextNode, nextSquare);
                }
            });
        } else {
            const nextNode = node.children.get(boardLetter);
            if (nextNode) {
                const nextSquare = anchor.across ? { x: square.x, y: square.y + 1 } : { x: square.x + 1, y: square.y };
                this.extendRight(board, easel, partialWord + boardLetter, anchor, nextNode, nextSquare);
            }
        }
    }

    /**
     * Stores the generated legal move
     *
     * @param word word to save
     * @param coord word's starting coordinate
     * @param across whether the word is across or down
     */
    legalMove(board: (string | null)[][], word: string, coord: Vec2, across: boolean) {
        const move = { word, coord, across, points: 0, formedWords: 1 };
        const nextCoord = { x: coord.x, y: coord.y };
        const row: (string | null)[] = across ? board[coord.x] : (transpose(board)[coord.y] as (string | null)[]);
        const pointRow: number[] = across ? this.pointGrid[coord.x] : (transpose(this.pointGrid)[coord.y] as number[]);
        word.split('').forEach(() => {
            const crossPoints = this.calculateCrossSum(board, coord, across);
            if (crossPoints > 0) {
                move.points += crossPoints;
                move.formedWords++;
            }

            if (across) nextCoord.y++;
            else nextCoord.x++;
        });
        move.points += this.calculateWordPoints(move, row, pointRow);
        this.legalMoves.push(move);
    }

    calculateWordPoints(move: Move, row: (string | null)[], pointRow: number[]): number {
        let points = 0;
        let numNewPinkTiles = 0;
        let numNewRedTiles = 0;
        const blank = 0;
        const lightBlue = 1;
        const darkBlue = 2;
        const pink = 3;
        const red = 4;

        for (let i = 0; i < move.word.length; i++) {
            const coord = i + (move.across ? move.coord.y : move.coord.x);
            const letter = move.word[i];
            const letterPoint = this.pointMap.get(letter) as number;
            const boardLetter = row[coord];
            if (boardLetter) {
                points += this.pointMap.get(boardLetter) as number;
            } else {
                const multiplier = pointRow[coord];
                switch (multiplier) {
                    case blank:
                        points += letterPoint;
                        break;
                    case lightBlue:
                        points += LIGHT_BLUE_MULTIPLIER * letterPoint;
                        break;
                    case darkBlue:
                        points += DARK_BLUE_MULTIPLIER * letterPoint;
                        break;
                    case pink:
                        points += letterPoint;
                        numNewPinkTiles++;
                        break;
                    case red:
                        points += letterPoint;
                        numNewRedTiles++;
                        break;
                }
            }
        }
        if (numNewPinkTiles !== 0) {
            points *= Math.pow(PINK_MULTIPLIER, numNewPinkTiles);
        }
        if (numNewRedTiles !== 0) {
            points *= Math.pow(RED_MULTIPLIER, numNewRedTiles);
        }
        return points;
    }
}
