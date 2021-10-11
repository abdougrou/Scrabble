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
     * Calculates the bit value for a given letter
     *
     * @param letter to calculate bit value
     * @returns bit value
     */
    static getLetterValue(letter: string): number {
        let value = 1;
        const shift = CrossCheck.getLetterBitShift(letter[0]);
        if (shift === INVALID_LETTER) return INVALID_LETTER;
        for (let i = 0; i < shift; i++) value *= 2;
        return value;
    }
}
