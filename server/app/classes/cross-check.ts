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

    addLetter(letter: string) {
        // this.value &= 1 << CrossCheck.getLetterBitShift(letter[0]);

        let letterValue = 1;
        const letterShift = CrossCheck.getLetterBitShift(letter[0]);
        for (let i = 0; i < letterShift; i++) letterValue *= 2;

        this.value += letterValue;
    }
}
