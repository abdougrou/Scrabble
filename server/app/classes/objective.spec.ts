import { Trie } from '@app/classes/trie';
import { LETTER_POINTS } from '@app/constants';
import { Move } from '@common/move';
import { expect } from 'chai';
import {
    formPalindrome,
    formTenLetterWord,
    formThreeWords,
    formWordAlreadyOnBoard,
    placeInCorner,
    placeLetterX,
    useFourOrMoreLetters,
    useOddPointLetters,
} from './objective';

describe('Objective', () => {
    // Place four or more letters

    it('should return false if usedLetters length is inferior to 4', () => {
        const move: Move = { word: 'word', coord: { x: 5, y: 5 }, across: true, points: 2, formedWords: 1 };
        const result = useFourOrMoreLetters.check(move, ['a', 'b', 'c']);
        expect(result).to.equal(false);
    });
    it('should return true if usedLetters length is superior or equal to 4', () => {
        const move: Move = { word: 'word', coord: { x: 5, y: 5 }, across: true, points: 2, formedWords: 1 };
        const result = useFourOrMoreLetters.check(move, ['a', 'b', 'c', 'd']);
        expect(result).to.equal(true);
    });
    // Place in corner
    it('should return true if a tile is placed on a corner', () => {
        const move: Move = { word: 'word', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 1 };
        const result = placeInCorner.check(move);
        expect(result).to.equal(true);
        const moveVertical: Move = { word: 'word', coord: { x: 0, y: 0 }, across: false, points: 2, formedWords: 1 };
        const resultVertical = placeInCorner.check(moveVertical);
        expect(resultVertical).to.equal(true);
    });

    it('should return false if no tiles are placed on the corners', () => {
        const move: Move = { word: 'word', coord: { x: 5, y: 5 }, across: true, points: 2, formedWords: 1 };
        const result = placeInCorner.check(move);
        expect(result).to.equal(false);
        const moveVertical: Move = { word: 'word', coord: { x: 5, y: 5 }, across: false, points: 2, formedWords: 1 };
        const resultVertical = placeInCorner.check(moveVertical);
        expect(resultVertical).to.equal(false);
    });
    // Forms three words
    it('should return true if a move forms three words', () => {
        const move: Move = { word: 'word', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 3 };
        const result = formThreeWords.check(move);
        expect(result).to.equal(true);
    });

    // Forms 10 letter word
    it('should return true if a move forms three words', () => {
        const move: Move = { word: 'wordislongerthanten', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 1 };
        const result = formTenLetterWord.check(move);
        expect(result).to.equal(true);
    });

    // Place letter x
    it('should return true if a move places the letter x', () => {
        const move: Move = { word: 'wordhasanx', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 1 };
        const result = placeLetterX.check(move, ['x']);
        expect(result).to.equal(true);
        const moveNoX: Move = { word: 'wordhasan', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 1 };
        const resultNoX = placeLetterX.check(moveNoX, ['a', 'b']);
        expect(resultNoX).to.equal(false);
    });

    // Word already on board
    it('should return true if the user places a word already on the board', () => {
        const trie: Trie = new Trie();
        trie.insert('duplicateword');
        const move: Move = { word: 'duplicateword', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 1 };
        const result = formWordAlreadyOnBoard.check(move, ['x'], trie);
        expect(result).to.equal(true);
    });

    // Use odd point letters
    it('should return true if the word places contains only odd letters', () => {
        const trie: Trie = new Trie();
        trie.insert('duplicateword');
        const move: Move = { word: 'duplicateword', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 1 };
        const result = useOddPointLetters.check(move, ['a', 'b', 'c'], trie, LETTER_POINTS);
        expect(result).to.equal(true);
    });
    it('should return false if the word placed contains an even letter', () => {
        const trie: Trie = new Trie();
        trie.insert('duplicateword');
        const move: Move = { word: 'duplicateword', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 1 };
        const result = useOddPointLetters.check(move, ['a', 'b', 'd'], trie, LETTER_POINTS);
        expect(result).to.equal(false);
    });

    // Form palindrome
    it('should return true if the word is a palindrome', () => {
        const move: Move = { word: 'laval', coord: { x: 0, y: 0 }, across: true, points: 2, formedWords: 1 };
        const result = formPalindrome.check(move);
        expect(result).to.equal(true);
    });
});
