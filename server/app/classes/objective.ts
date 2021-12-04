import { vecEqual } from '@app/constants';
import { Move } from '@common/move';
import { Vec2 } from '@common/vec2';
import { Trie } from './trie';

export interface Objective {
    reward: number;
    description: string;
    check: (move: Move, usedLetters?: string[], placedWords?: Trie, pointMap?: Map<string, number>) => boolean;

    playerName?: string;
    private?: boolean;
    achieved?: boolean;
}

export const useFourOrMoreLetters: Objective = {
    reward: 35,
    description: 'Former mot en utilisant 4 ou plus de letters de votre chevalet',
    check: (move: Move, usedLetters: string[]): boolean => {
        return usedLetters.length > 3;
    },
};

export const placeInCorner: Objective = {
    reward: 60,
    description: 'Placer une lettre dans un coin du tableau',
    check: (move: Move): boolean => {
        const startCoord = move.coord;
        const endCoord: Vec2 = {
            x: move.coord.x + (move.across ? 0 : move.word.length - 1),
            y: move.coord.y + (move.across ? move.word.length - 1 : 0),
        };

        if (move.across) {
            if (
                vecEqual(startCoord, { x: 0, y: 0 }) ||
                vecEqual(startCoord, { x: 14, y: 0 }) ||
                vecEqual(endCoord, { x: 0, y: 14 }) ||
                vecEqual(endCoord, { x: 14, y: 14 })
            ) {
                return true;
            }
        } else {
            if (
                vecEqual(startCoord, { x: 0, y: 0 }) ||
                vecEqual(startCoord, { x: 0, y: 14 }) ||
                vecEqual(endCoord, { x: 14, y: 0 }) ||
                vecEqual(endCoord, { x: 14, y: 14 })
            ) {
                return true;
            }
        }
        return false;
    },
};

export const formThreeWords: Objective = {
    reward: 70,
    description: 'Former 3 mots en une seule action',
    check: (move: Move): boolean => {
        return move.formedWords >= 3;
    },
};

export const formTenLetterWord: Objective = {
    reward: 70,
    description: 'Former un mot de 10 lettres',
    check: (move: Move): boolean => {
        const TEN_LETTER_WORD_LENGTH = 10;
        return move.word.length >= TEN_LETTER_WORD_LENGTH;
    },
};

export const formWordAlreadyOnBoard: Objective = {
    reward: 30,
    description: 'Former un mot deja dans le tableau',
    check: (move: Move, lettersUsed: string[], placedWords: Trie): boolean => {
        return placedWords.contains(move.word);
    },
};

export const useOddPointLetters: Objective = {
    reward: 35,
    description: 'Former un mot en utilisant juste des lettres de point impair',
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
    description: 'Placer la lettre X',
    check: (move: Move, usedLetters: string[]): boolean => {
        for (const letter of usedLetters) {
            if (letter === 'x') return true;
        }
        return false;
    },
};

export const formPalindrome: Objective = {
    reward: 45,
    description: 'Former un palindrome',
    check: (move: Move): boolean => {
        return move.word === move.word.split('').reverse().join('');
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
