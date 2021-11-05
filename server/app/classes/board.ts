import { BOARD_SIZE } from '@app/constants';
import { Vec2 } from './vec2';

export class Board {
    /**
     * 2d character array storing letters
     */
    data: (string | null)[][] = [];

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
}
