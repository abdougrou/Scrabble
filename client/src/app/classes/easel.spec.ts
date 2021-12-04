import { Easel } from './easel';

describe('Easel', () => {
    let easel: Easel;

    beforeEach(() => {
        easel = new Easel();
    });

    it('constructor initializes the easel correctly', () => {
        expect(easel.count).toEqual(0);
        easel = new Easel(['a', 'b', 'c']);
        expect(easel.count).toEqual(3);
    });

    it('addLetters adds letter to the easel', () => {
        const letters = ['a', 'b', 'c'];
        easel.addLetters(letters);
        expect(easel.letters).toEqual(letters);
    });

    it('getLetters adds letter to the easel', () => {
        const letters = ['a', 'b', 'c'];
        const getLetters = ['a', 'b', 'd'];
        easel.addLetters(letters);
        const actual = easel.getLetters(getLetters);
        const expected = ['a', 'b'];
        expect(actual).toEqual(expected);
    });

    it('contains returns true when it contains all letters, false otherwise', () => {
        const letters = ['a', 'b', 'c'];
        const containsTrue = ['a'];
        const containsFalse = ['a', 'b', 'd'];
        const containsFalse2 = ['a', 'b', 'c', 'd'];
        easel.addLetters(letters);
        expect(easel.contains(containsTrue)).toEqual(true);
        expect(easel.contains(containsFalse)).toEqual(false);
        expect(easel.contains(containsFalse2)).toEqual(false);
    });

    it('toString returns correct string', () => {
        const letters = ['a', 'b', 'c'];
        easel.addLetters(letters);
        const expected = 'a,b,c';
        expect(easel.toString()).toEqual(expected);
    });
});
