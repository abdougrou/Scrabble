import { BOARD_SIZE } from "@app/constants";
import { Vec2 } from "./vec2";

export class Board {
    data: string[][] = [];

    /**
     * Fills the board with empty characters
     */
    initialize() {
        for (let x = 0; x < BOARD_SIZE; x++) {
            let row: string[] = [];
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
        let newBoard: string[][] = [];
        for (let i = 0; i < this.data.length; i++) {
            newBoard.push(this.data[i].slice());
        }
        return newBoard;
    }

    /**
     * Places a letter in the board
     * @param coord tile coordinate to place the letter
     * @param letter the letter to place
     */
    setLetter(coord: Vec2, letter: string) {
    }

    /**
     * @returns a transposed copy of the current board state
     */
    transpose(): string[][] {
        return this.data[0].map((_, colIndex) => this.data.map(row => row[colIndex]));
    }
}