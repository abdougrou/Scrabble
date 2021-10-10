import { BOARD_SIZE } from '@app/constants';
import { Anchor } from './anchor';
import { coordToKey } from './utils';
import { Vec2 } from './vec2';

export class Board {
    /**
     * 2d character array storing letters
     */
    data: (string | null)[][] = [];
    /**
     * 2d array storing anchors
     */
    anchors: Set<string> = new Set();

    /**
     * Initializes a 15x15 null matrix
     */
    initialize() {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const row: (string | null)[] = [];
            const anchorRow: boolean[] = [];
            for (let y = 0; y < BOARD_SIZE; y++) {
                row.push(null);
                anchorRow.push(false);
            }
            this.data.push(row);
        }
        this.anchors.add(coordToKey({ x: 7, y: 7 }));
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
        this.data[coord.x][coord.y] = letter;
        this.anchors.delete(coordToKey(coord));
    }

    /**
     * Get a letter at the provided coordinate
     *
     * @param coord letter coordinate
     * @returns letter at coordinate if it null if it does not exist
     */
    getLetter(coord: Vec2): string | null {
        return this.data[coord.x][coord.y];
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
            for (const tAnchor of transposedAnchors) anchors.push({ x: tAnchor.y, y: tAnchor.x });
        }
        for (const anchor of anchors) {
            this.anchors.add(coordToKey(anchor));
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
                anchors.push({ x: rowNumber, y: i });
            }
        }
        return anchors;
    }
}
