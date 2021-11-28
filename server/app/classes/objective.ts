import { Move } from '@common/move';
import { Vec2 } from '@common/vec2';
import { Trie } from './trie';

export interface Objective {
    reward: number;
    check: (move: Move, usedLetters?: string[], placedWords?: Trie, pointMap?: Map<string, number>) => boolean;

    playerName?: string;
    private?: boolean;
    achieved?: boolean;
}

export const useFourOrMoreLetters: Objective = {
    reward: 35,
    check: (move: Move, usedLetters: string[]): boolean => {
        return usedLetters.length > 3;
    },
};

export const placeInCorner: Objective = {
    reward: 60,
    check: (move: Move): boolean => {
        const startCoord = move.coord;
        const endCoord: Vec2 = {
            x: move.coord.x + (move.across ? 0 : move.word.length - 1),
            y: move.coord.y + (move.across ? move.word.length - 1 : 0),
        };

        if (move.across) {
            if (startCoord === { x: 0, y: 0 } || startCoord === { x: 14, y: 0 } || endCoord === { x: 0, y: 14 } || endCoord === { x: 14, y: 14 }) {
                return true;
            }
        } else {
            if (startCoord === { x: 0, y: 0 } || startCoord === { x: 0, y: 14 } || endCoord === { x: 14, y: 0 } || endCoord === { x: 14, y: 14 }) {
                return true;
            }
        }
        return false;
    },
};

export const formThreeWords: Objective = {
    reward: 70,
    check: (move: Move): boolean => {
        return move.formedWords >= 3;
    },
};

export const formTenLetterWord: Objective = {
    reward: 70,
    check: (move: Move): boolean => {
        const TEN_LETTER_WORD_LENGTH = 10;
        return move.word.length >= TEN_LETTER_WORD_LENGTH;
    },
};

export const formWordAlreadyOnBoard: Objective = {
    reward: 30,
    check: (move: Move, lettersUsed: string[], placedWords: Trie): boolean => {
        return placedWords.contains(move.word);
    },
};

export const useOddPointLetters: Objective = {
    reward: 35,
    check: (move: Move, usedLetters: string[], placedWords: Trie, pointMap: Map<string, number>): boolean => {
        for (const letter of usedLetters) {
            const point = pointMap.get(letter);
            if (point && point % 2 === 0) return false;
        }
        return true;
    },
};

export const placeLetterX: Objective = {
    reward: 40,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move, usedLetters: string[]): boolean => {
        for (const letter of usedLetters) {
            if (letter === 'x') return true;
        }
        return false;
    },
};

export const formPalindrome: Objective = {
    reward: 45,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return move.word === move.word.split('').reverse().join();
    },
};

export const OBJECTIVES: Objective[] = [
    useFourOrMoreLetters,
    placeInCorner,
    formThreeWords,
    formTenLetterWord,
    formWordAlreadyOnBoard,
    useOddPointLetters,
    placeLetterX,
    formPalindrome,
];
