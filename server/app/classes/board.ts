import { BOARD_SIZE } from '@app/constants';
import { coordToKey, getStringCombinations } from './board-utils';
import { Trie } from './trie';
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

    // generateWords(word: string, easel: string, limit: number, node: TrieNode, dictionary: Trie) {
    //     const prefixes = this.generateEaselPrefix(easel, limit);
    // }

    /**
     * Finds all valid prefixes for the given parameters
     *
     * @param easel characters to find valid prefixes from
     * @param limit max prefix length
     */
    generateEaselPrefix(easel: string, limit: number, dictionary: Trie): string[] {
        const unvalidated: string[] = getStringCombinations(easel, limit);
        const validated = unvalidated.filter((item) => dictionary.find(item).length > 0);
        return validated;
    }

    // generateRightPart(prefix: string, node: TrieNode, ): string[] {
    //     // this.generateRightPart();
    //     // if (limit > 0) {
    //     //     for (const edge of node.children) {
    //     //         const [letter, newNode] = edge;
    //     //         if (easel.includes(letter)) {
    //     //             easel.replace(letter, '');
    //     //             this.generateLeftPart(prefix + letter, anchor, newNode, limit - 1, easel);
    //     //             easel.concat(letter);
    //     //         }
    //     //     }
    //     // }
    // }
}
