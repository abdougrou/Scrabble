import { RESERVE_EXCHANGE_LIMIT } from '@app/constants';

export class Reserve {
    data: Map<string, number> = new Map();
    size: number = 0;

    constructor(reserve: Map<string, number> | string) {
        if (reserve instanceof Map) {
            for (const entry of reserve.entries()) {
                this.data.set(entry[0], entry[1]);
                this.size += entry[1];
            }
            return;
        }

        const lettersData: string[] = reserve.split(/\r?\n/);
        lettersData.forEach((letterData) => {
            const data = letterData.split(',');
            this.data.set(data[0], parseInt(data[1], 10));
            this.size += parseInt(data[1], 10);
        });
    }

    /**
     * Takes a letter from the reserve
     *
     * @param letter letter to remove from the reserve
     * @returns the letter, null if there's no more of that letter in reserve
     */
    getLetter(letter: string): string | null {
        const count = this.data.get(letter);
        if (count && count > 0) {
            this.data.set(letter, count - 1);
            this.size--;
        }
        return count ? letter : null;
    }

    /**
     * Returns letters into the reserve
     *
     * Does nothing if letter should not be in reserve
     *
     * @param letters letters to put into the reserve
     */
    returnLetters(letters: string[]) {
        for (const letter of letters) {
            const count = this.data.get(letter);
            if (count !== undefined) {
                this.data.set(letter, count + 1);
                this.size++;
            }
        }
    }

    /**
     * Checks if exchange is possible with the current reserve
     *
     * @returns true if exchange is possible
     */
    isExchangePossible(quantity: number): boolean {
        if (this.size < RESERVE_EXCHANGE_LIMIT) return false;
        else if (this.size - quantity < 0) return false;
        return true;
    }

    /**
     * Exchanges letters with the reserve
     *
     * @param letters letters to exchange
     * @returns a new array of letters
     */
    exchangeLetters(letters: string[]): string[] {
        const newLetters = this.getRandomLetters(letters.length);
        this.returnLetters(letters);
        return newLetters;
    }

    /**
     * Takes quantity amount of letters from the reserve
     *
     * Returns less than quantity amount if not enough letters are available
     *
     * @param quantity amount of letters to get from the reserve
     * @returns an array of letters
     */
    getRandomLetters(quantity: number): string[] {
        const output: string[] = [];
        let available = Array.from(this.data.entries()).filter((entry) => entry[1] > 0);
        for (let i = 0; i < quantity && available.length > 0; i++) {
            const [letter, count] = available[Math.floor(Math.random() * available.length)];
            this.data.set(letter, count - 1);
            this.size--;
            output.push(letter);
            available = Array.from(this.data.entries()).filter((entry) => entry[1] > 0);
        }
        return output;
    }

    /**
     * Prints the reserve in the following format:
     *
     * A: 2
     *
     * B: 3
     *
     * @return formatted string of the reserve
     */
    toString(): string {
        let output = '';
        Array.from(this.data.entries()).forEach((item) => {
            output += item[0].toUpperCase() + ': ' + item[1] + '\n';
        });
        return output.slice(0, output.length - 1);
    }
}
