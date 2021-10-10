import { BOARD_SIZE } from '@app/constants';
import { Vec2 } from './vec2';

export class Board {
    data: string[][] = [];

    /**
     * Fills the board with empty characters
     */
    initialize() {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const row: string[] = [];
            for (let y = 0; y < BOARD_SIZE; y++) {
                row.push('');
            }
            this.data.push(row);
        }
    }

    /**
     * @returns a copy of the board
     */
    clone(): string[][] {
        const newBoard: string[][] = [];
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
    transpose(): string[][] {
        return this.data[0].map((_, colIndex) => this.data.map((row) => row[colIndex]));
    }
}
