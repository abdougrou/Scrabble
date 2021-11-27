import { Injectable } from '@angular/core';
import { BOARD_SIZE, POINT_GRID } from '@app/constants';
import { Vec2 } from '@common/vec2';

const BONUS_STR = '4444444433333333333333332222222222222111111111111111111111111';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    /**
     * 2d character array storing letters
     */
    data: (string | null)[][] = [];
    pointGrid: number[][] = [];

    /**
     * Initializes a 15x15 null matrix
     */
    initialize(randomBonus: boolean) {
        this.data = [];
        this.pointGrid = [];
        for (let x = 0; x < BOARD_SIZE; x++) {
            const row: (string | null)[] = [];
            const anchorRow: boolean[] = [];
            const pointRow: number[] = [];
            for (let y = 0; y < BOARD_SIZE; y++) {
                row.push(null);
                anchorRow.push(false);
                pointRow.push(0);
            }
            this.data.push(row);
            this.pointGrid.push(pointRow);
        }

        if (!randomBonus) this.pointGrid = POINT_GRID;
        else this.randomizeBonuses();
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

    /**
     * Replace bonuses with a random one
     */
    randomizeBonuses() {
        const bonusStr = BONUS_STR;
        for (let x = 0; x < BOARD_SIZE; x++) {
            for (let y = 0; y < BOARD_SIZE; y++) {
                const bonus = bonusStr.charAt(Math.floor(Math.random() * BONUS_STR.length));
                if (POINT_GRID[x][y] !== 0 && bonus !== undefined) {
                    this.pointGrid[x][y] = parseInt(bonus, 10);
                    bonusStr.replace(bonus, '');
                }
            }
        }
    }
}
