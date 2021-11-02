import { expect } from 'chai';
import { describe } from 'mocha';
import { Easel } from './easel';

describe('Easel', () => {
    let easel: Easel;

    beforeEach(() => {
        easel = new Easel();
    });

    it('constructor initializes the easel correctly', () => {
        expect(easel.count).to.equal(0);
        easel = new Easel(['a', 'b', 'c']);
        expect(easel.count).to.equal(3);
    });

    it('addLetters adds letter to the easel', () => {
        const letters = ['a', 'b', 'c'];
        easel.addLetters(letters);
        expect(easel.letters).to.have.deep.members(letters);
    });

    it('getLetters adds letter to the easel', () => {
        const letters = ['a', 'b', 'c'];
        const getLetters = ['a', 'b', 'd'];
        easel.addLetters(letters);
        const actual = easel.getLetters(getLetters);
        const expected = ['a', 'b'];
        expect(actual).to.have.deep.members(expected);
    });

    it('contains returns true when it contains all letters, false otherwise', () => {
        const letters = ['a', 'b', 'c'];
        const containsTrue = ['a'];
        const containsFalse = ['a', 'b', 'd'];
        const containsFalse2 = ['a', 'b', 'c', 'd'];
        easel.addLetters(letters);
        expect(easel.contains(containsTrue)).to.equal(true);
        expect(easel.contains(containsFalse)).to.equal(false);
        expect(easel.contains(containsFalse2)).to.equal(false);
    });

    it('toString returns correct string', () => {
        const letters = ['a', 'b', 'c'];
        easel.addLetters(letters);
        const expected = 'a,b,c';
        expect(easel.toString()).to.equal(expected);
    });
});
