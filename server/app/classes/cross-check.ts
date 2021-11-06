/* eslint-disable no-bitwise */
import { transpose } from './board-utils';
import { Trie } from './trie';
import { Vec2 } from './vec2';

const CHAR_CODE_A = 'a'.charCodeAt(0);
const CHAR_CODE_Z = 'z'.charCodeAt(0);
const CHAR_CODE_STAR = '*'.charCodeAt(0);
const INVALID_LETTER = -1;

/**
 * Contains all possible letters for a coordinate in a bit vector
 */
export class CrossCheck {
    value: number;

    constructor() {
        this.value = 0;
    }

    /**
     * Adds a letter to the bit vector
     *
     * @param check bit vector
     * @param letter letter to add to bit vector
     */
    static addLetter(check: CrossCheck, letter: string) {
        check.value += this.getLetterValue(letter[0]);
    }

    /**
     * Removes a letter from the bit vector
     *
     * @param check bit vector
     * @param letter letter to remove from the bit vector
     */
    static removeLetter(check: CrossCheck, letter: string) {
        check.value -= this.getLetterValue(letter[0]);
    }

    /**
     * Check if a letter is in the bit vector
     *
     * @param check bit vector
     * @param letter letter to check if it is in the bit vector
     * @returns true if it is in the bit vector
     */
    static hasLetter(check: CrossCheck, letter: string): boolean {
        return (check.value & this.getLetterValue(letter)) > 0;
    }

    /**
     * Calculates the bit value for a given letter
     *
     * @param letter to calculate bit value
     * @returns bit value
     */
    static getLetterValue(letter: string): number {
        const shift = CrossCheck.getLetterBitShift(letter[0]);
        if (shift === INVALID_LETTER) return INVALID_LETTER;
        return 1 << shift;
    }

    /**
     * Get a letters shift value, with 'a' being 1 and * = 27
     *
     * @param letter letter to shift
     * @returns letter shift value (position in bit vector)
     */
    static getLetterBitShift(letter: string): number {
        const charCode = letter.charCodeAt(0);
        if (charCode >= CHAR_CODE_A && charCode <= CHAR_CODE_Z) return charCode - CHAR_CODE_A;
        else if (charCode === CHAR_CODE_STAR) return CHAR_CODE_Z - CHAR_CODE_A + 1;
        return INVALID_LETTER;
    }

    /**
     * Calculates the cross check for the given board, coordinate and dictionary
     *
     * @param board 2d array to calculate cross check from
     * @param coord cross check coordinate
     * @param dictionary used dictionary
     * @returns CrossCheck for said coordinate
     */
    static crossCheck(board: (string | null)[][], coord: Vec2, dictionary: Trie): CrossCheck {
        const crossCheck = new CrossCheck();
        const transposedBoard = transpose(board);
        const rowLetters = this.crossCheckOneDimension(board[coord.x], coord.y, dictionary);
        const colLetters = this.crossCheckOneDimension(transposedBoard[coord.y] as (string | null)[], coord.x, dictionary);
        const letters =
            rowLetters.length === 0
                ? colLetters
                : colLetters.length === 0
                ? rowLetters
                : rowLetters.filter((letter) => colLetters.indexOf(letter) >= 0);
        for (const letter of letters) CrossCheck.addLetter(crossCheck, letter);

        return crossCheck;
    }

    /**
     * Find all cross checks for given row
     *
     * @param row row containing board letters
     * @param coord index in row
     * @param dictionary dictionary to validate words
     * @returns array of valid letters for coord
     */
    static crossCheckOneDimension(row: (string | null)[], coord: number, dictionary: Trie): string[] {
        const validLetters: Set<string> = new Set();
        const rowStr = row.map((item) => (item ? item : ' ')).join('');
        if (row.join('').length === 0) return [];
        let boardPrefix = '';
        let boardSuffix = '';

        if (row[coord - 1]) {
            let i = coord - 1;
            while (row[i]) i--;
            boardPrefix = rowStr.slice(i + 1, coord);
        }
        if (row[coord + 1]) {
            let i = coord + 1;
            while (row[i]) i++;
            boardSuffix = rowStr.slice(coord + 1, i);
        }
        let suffixes: string[] = [];
        if (boardPrefix.length > 0) {
            suffixes = dictionary.find(boardPrefix).map((item) => item.slice(boardPrefix.length));
        } else {
            for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
                suffixes = suffixes.concat(dictionary.find(String.fromCharCode(i)));
            }
        }
        for (const suffix of suffixes) {
            if (suffix.length > row.length - coord) continue;
            let valid = true;
            for (let i = 1; i <= suffix.length; i++) {
                if (boardSuffix[i - 1] && boardSuffix[i - 1] !== suffix[i]) valid = false;
            }
            if (valid) {
                validLetters.add(suffix[0]);
            }
        }
        return Array.from(validLetters.keys());
    }
}
