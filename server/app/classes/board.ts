import { BOARD_SIZE } from '@app/constants';
import { Anchor } from './anchor';
import { Vec2 } from './vec2';

export class Board {
    data: (string | null)[][] = [];
    anchors: Anchor[] = [];

    /**
     * Creates and initializes a 15x15 null matrix
     */
    constructor() {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const row: (string | null)[] = [];
            for (let y = 0; y < BOARD_SIZE; y++) {
                row.push(null);
            }
            this.data.push(row);
        }
    }

    /**
     * @returns a copy of the board
     */
    clone(): (string | null)[][] {
        const newBoard: (string | null)[][] = [];
        for (const row of this.data) {
            newBoard.push(row.slice());
        }
        return newBoard;
    }

    /**
     * Places a letter in the board
     *
     * @param coord tile coordinate to place the letter
     * @param letter the letter to place
     */
    setLetter(coord: Vec2, letter: string) {
        this.data[coord.y][coord.x] = letter[0];
    }

    /**
     * @returns a transposed copy of the current board state
     */
    transpose(): (string | null)[][] {
        return this.data[0].map((_, colIndex) => this.data.map((row) => row[colIndex]));
    }

    /**
     * Finds all anchors in the board
     * An anchor is a null element adjacent to a non null element
     *
     * @returns array of anchors
     */
    findAnchors(): Anchor[] {
        let anchors: Anchor[] = [];
        for (let i = 0; i < this.data.length; i++) {
            anchors = anchors.concat(this.findAnchorsOneDimension(this.data[i], i));
        }
        const transposed = this.transpose();
        for (let i = 0; i < this.data.length; i++) {
            const transposedAnchors = this.findAnchorsOneDimension(transposed[i], i);
            for (const tAnchor of transposedAnchors) {
                const coord = tAnchor.coord;
                tAnchor.coord = { x: coord.y, y: coord.x };
            }
            anchors = anchors.concat(transposedAnchors);
        }
        return anchors;
    }

    /**
     * Finds all anchors for a given array
     * An anchor is a null element adjacent to a non null element
     *
     * @param arr array of elements to find anchors in
     * @param rowNumber to use in anchor coordinate
     * @returns array of anchors
     */
    findAnchorsOneDimension(arr: (string | null)[], rowNumber: number): Anchor[] {
        const anchors: Anchor[] = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) continue;

            if (arr[i - 1] || arr[i + 1]) {
                anchors.push({ coord: { x: rowNumber, y: i } });
            }
        }
        return anchors;
    }
}
