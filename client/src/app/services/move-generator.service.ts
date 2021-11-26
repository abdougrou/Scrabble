import { Injectable } from '@angular/core';
import { Anchor } from '@app/classes/anchor';
import { coordToKey, transpose } from '@app/classes/board-utils';
import { CrossCheck } from '@app/classes/cross-check';
import { Move } from '@app/classes/move';
import { Trie, TrieNode } from '@app/classes/trie';
import { Vec2 } from '@app/classes/vec2';
import { CLASSIC_RESERVE, DARK_BLUE_MULTIPLIER, LIGHT_BLUE_MULTIPLIER, PINK_MULTIPLIER, RED_MULTIPLIER } from '@app/constants';
import { BoardService } from './board.service';

@Injectable({
    providedIn: 'root',
})
export class MoveGeneratorService {
    anchors: Anchor[] = [];
    crossChecks: Map<string, CrossCheck> = new Map();
    dictionary: Trie;
    legalMoves: Move[] = [];
    pointMap: Map<string, number> = new Map();

    constructor(private board: BoardService) {
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
    calculateAnchorsAndCrossChecks() {
        this.anchors = Anchor.findAnchors(this.board.data);
        this.crossChecks = new Map();
        this.anchors.forEach((anchor) => {
            const coord: Vec2 = { x: anchor.x, y: anchor.y };
            const crossCheck = CrossCheck.crossCheck(this.board.data, coord, this.dictionary);
            this.crossChecks.set(coordToKey(coord), crossCheck);
        });
    }

    calculateCrossSum(coord: Vec2, across: boolean): number {
        const row = across ? this.board.data[coord.x] : (transpose(this.board.data)[coord.y] as (string | null)[]);
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
    generateLegalMoves(easel: string) {
        this.anchors.forEach((anchor) => {
            if (anchor.leftPart.length > 0) {
                const node = this.dictionary.getNode(anchor.leftPart);
                if (node) {
                    this.extendLeft(easel, anchor.leftPart, anchor, node, 0);
                }
            } else this.extendLeft(easel, '', anchor, this.dictionary.root, anchor.leftLength);
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
    extendLeft(easel: string, partialWord: string, anchor: Anchor, node: TrieNode, limit: number) {
        this.extendRight(easel, partialWord, anchor, node, { x: anchor.x, y: anchor.y });
        if (limit > 0) {
            node.children.forEach((edge) => {
                if (edge.value && easel.includes(edge.value)) {
                    const nextNode = edge;
                    const nextEasel = easel.replace(edge.value, '');
                    this.extendLeft(nextEasel, partialWord + edge.value, anchor, nextNode, limit - 1);
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
    extendRight(easel: string, partialWord: string, anchor: Anchor, node: TrieNode, square: Vec2) {
        if (square.x >= this.board.data.length && square.y >= this.board.data.length) return;

        const boardLetter = this.board.data[square.x][square.y];
        if (!boardLetter) {
            if (node.terminal) {
                const coord = anchor.across ? { x: square.x, y: square.y - partialWord.length } : { x: square.x - partialWord.length, y: square.y };
                this.legalMove(partialWord, coord, anchor.across);
            }

            node.children.forEach((edge) => {
                const crossCheck = this.crossChecks.get(coordToKey(square));
                if (edge.value && easel.includes(edge.value) && (crossCheck ? CrossCheck.hasLetter(crossCheck, edge.value) : true)) {
                    const nextNode = edge;
                    const nextEasel = easel.replace(edge.value, '');
                    const nextSquare = anchor.across ? { x: square.x, y: square.y + 1 } : { x: square.x + 1, y: square.y };
                    if (nextSquare.x < this.board.data.length && nextSquare.y < this.board.data.length)
                        this.extendRight(nextEasel, partialWord + edge.value, anchor, nextNode, nextSquare);
                }
            });
        } else {
            const nextNode = node.children.get(boardLetter);
            if (nextNode) {
                const nextSquare = anchor.across ? { x: square.x, y: square.y + 1 } : { x: square.x + 1, y: square.y };
                this.extendRight(easel, partialWord + boardLetter, anchor, nextNode, nextSquare);
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
    legalMove(word: string, coord: Vec2, across: boolean) {
        const move = { word, coord, across, points: 0 };
        const nextCoord = { x: coord.x, y: coord.y };
        let points = 0;
        const row: (string | null)[] = across ? this.board.data[coord.x] : (transpose(this.board.data)[coord.y] as (string | null)[]);
        const pointRow: number[] = across ? this.board.pointGrid[coord.x] : (transpose(this.board.pointGrid)[coord.y] as number[]);
        word.split('').forEach(() => {
            points += this.calculateCrossSum(coord, across);

            if (across) nextCoord.y++;
            else nextCoord.x++;
        });
        points += this.calculateWordPoints(move, row, pointRow);
        move.points = points;
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
            const letter = row[coord];
            if (letter) {
                points += this.pointMap.get(letter) as number;
            } else {
                const multiplier = pointRow[coord];
                switch (multiplier) {
                    case blank:
                        points += pointRow[coord];
                        break;
                    case lightBlue:
                        points += LIGHT_BLUE_MULTIPLIER * pointRow[coord];
                        break;
                    case darkBlue:
                        points += DARK_BLUE_MULTIPLIER * pointRow[coord];
                        break;
                    case pink:
                        points += pointRow[coord];
                        numNewPinkTiles++;
                        break;
                    case red:
                        points += pointRow[coord];
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
