import { Trie } from './trie';

describe('Trie', () => {
    let trie: Trie;

    beforeEach(() => {
        trie = new Trie();
    });

    it('insert inserts the word into the trie', () => {
        const word = 'word';
        trie.insert(word);

        expect(trie.contains(word)).toEqual(true);
    });

    it('contains returns true if word is in trie, false otherwise', () => {
        const words = ['abc', 'xyz', 'uwu'];

        trie.insert(words[0]);
        trie.insert(words[1]);

        expect(trie.contains(words[0])).toEqual(true);
        expect(trie.contains(words[1])).toEqual(true);
        expect(trie.contains(words[2])).toEqual(false);
    });

    it('find returns all possible words using a prefix', () => {
        const words = ['abc', 'aabbcc', 'aabbaabb', 'aabcbc'];
        trie.insert(words[0]);
        trie.insert(words[1]);
        trie.insert(words[2]);
        trie.insert(words[3]);

        const prefix = 'aab';
        const expectedWords = ['aabbcc', 'aabbaabb', 'aabcbc'];
        expect(trie.find(prefix)).toEqual(expectedWords);
    });

    it('find returns empty array if no words in the trie start with prefix', () => {
        const words = ['abc', 'aabbcc', 'aabbaabb', 'aabcbc'];
        trie.insert(words[0]);
        trie.insert(words[1]);
        trie.insert(words[2]);
        trie.insert(words[3]);

        const prefix = 'aac';
        const expectedWords: string[] = [];
        expect(trie.find(prefix)).toEqual(expectedWords);
    });

    it('getNode returns node if word exists, undefined otherwise', () => {
        const words = ['abc', 'xyz'];

        trie.insert(words[0]);
        trie.insert(words[1]);

        expect(trie.getNode('ab')).toBeDefined();
        expect(trie.getNode('xy')).toBeDefined();
        expect(trie.getNode('uwu')).toBeUndefined();
    });
});
