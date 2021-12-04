export class Easel {
    letters: string[] = [];
    get count(): number {
        return this.letters.length;
    }

    constructor(letters: string[] = []) {
        this.letters = this.letters.concat(letters);
    }

    /**
     * Adds letters to the easel
     *
     * @param letters array containing letters to add
     */
    addLetters(letters: string[]) {
        this.letters = this.letters.concat(letters);
    }

    /**
     * Takes letters from the easel
     *
     * @param letters letters to remove from the easel
     * @return array of letters
     */
    getLetters(letters: string[]): string[] {
        const output: string[] = [];

        for (const letterToTake of letters) {
            const letter = this.letters.find((item) => item === letterToTake);
            if (letter) {
                const index = this.letters.indexOf(letter);
                this.letters.splice(index, 1);
                output.push(letter);
            }
        }

        return output;
    }

    /**
     * Checks if the easel contains the letters
     *
     * @param letters letters to check for existence
     * @returns true if all letters exist, false otherwise
     */
    contains(letters: string[]): boolean {
        if (letters.length > this.letters.length) return false;

        const getLetters = this.getLetters(letters);
        if (getLetters.length < letters.length) {
            this.addLetters(getLetters);
            return false;
        }
        this.addLetters(getLetters);
        return true;
    }

    /**
     * @returns string containing all letters
     */
    toString(): string {
        return this.letters.join('');
    }
}
