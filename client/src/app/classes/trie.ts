// Reference https://en.wikipedia.org/wiki/Trie

export interface TrieNode {
    terminal: boolean;
    parent: TrieNode | null;
    value: string | null;
    children: Map<string, TrieNode>;
}

export class Trie {
    root: TrieNode;

    constructor(dictionary?: string[]) {
        this.root = {
            terminal: false,
            parent: null,
            value: null,
            children: new Map(),
        };
        if (dictionary) {
            for (const word of dictionary) this.insert(word);
        }
    }

    /**
     * Inserts a word into the trie
     */
    insert(word: string) {
        let node = this.root;

        for (let i = 0; i < word.length; i++) {
            let nextNode = node.children.get(word[i]);
            // Check if node does not exists
            if (!nextNode) {
                // Create new node with parent and terminal assigned
                nextNode = {
                    terminal: i === word.length - 1,
                    parent: node,
                    value: word[i],
                    children: new Map(),
                };
                node.children.set(word[i], nextNode);
            } else if (i === word.length - 1) {
                nextNode.terminal = true;
            }
            node = nextNode;
        }
    }

    /**
     * Checks if a word exists in the trie
     *
     * @param word to check
     * @returns true if whole word exists, false otherwise
     */
    contains(word: string): boolean {
        const node = this.getNode(word);
        return node ? node.terminal : false;
    }

    /**
     * Searches for all words starting with the prefix
     *
     * @param prefix to find words starting with
     * @returns a string array containing all words starting with prefix
     */
    find(prefix: string): string[] {
        const output: string[] = [];
        const node = this.getNode(prefix);
        if (node) {
            this.findAllWords(node, output);
        }
        return output;
    }

    /**
     * Get the node of the last character of a word
     *
     * @param word word to get the last node from
     * @returns node found at the end of the word, null if word does not exist
     */
    getNode(word: string): TrieNode | undefined {
        let node = this.root;
        for (const char of word) {
            const nextNode = node.children.get(char);
            if (nextNode) node = nextNode;
            else return undefined;
        }
        return node;
    }

    private findAllWords(node: TrieNode, arr: string[]) {
        if (node.terminal) {
            let parentNode: TrieNode | null = node;
            const prefixWord: string[] = [];
            while (parentNode && parentNode.value) {
                prefixWord.push(parentNode.value);
                parentNode = parentNode.parent;
            }
            arr.push(prefixWord.reverse().join(''));
        }

        for (const child of Array.from(node.children.values())) {
            this.findAllWords(child, arr);
        }
    }
}
