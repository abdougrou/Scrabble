// Reference https://en.wikipedia.org/wiki/Trie

interface TrieNode {
    terminal: boolean;
    parent: TrieNode | null;
    value: string | null;
    children: Map<string, TrieNode>;
}

export class Trie {
    private root: TrieNode;

    constructor() {
        this.root = {
            terminal: false,
            parent: null,
            value: null,
            children: new Map(),
        };
    }

    /**
     * Inserts a word into the trie
     */
    insert(word: string) {
        let node = this.root;

        for (let i = 0; i < word.length; i++) {
            let nextNode = node.children.get(word[i]);
            // Check if node exists
            if (!nextNode) {
                // Create new node with parent and terminal assigned
                nextNode = {
                    terminal: i === word.length - 1,
                    parent: node,
                    value: word[i],
                    children: new Map(),
                };
                node.children.set(word[i], nextNode);
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
        let node = this.root;

        for (const char of word) {
            const nextNode = node.children.get(char);
            if (nextNode) node = nextNode;
            else return false;
        }

        return node.terminal;
    }

    /**
     * Searches for all words starting with the prefix
     *
     * @param prefix to find words starting with
     * @returns a string array containing all words starting with prefix
     */
    find(prefix: string): string[] {
        let node = this.root;
        const output: string[] = [];

        for (const char of prefix) {
            const nextNode = node.children.get(char);
            if (nextNode) node = nextNode;
            else return output;
        }

        this.findAllWords(node, output);

        return output;
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
