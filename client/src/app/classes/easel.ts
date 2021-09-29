import { Tile } from './tile';

export class Easel {
    tiles: Tile[] = [];
    get count(): number {
        return this.tiles.length;
    }

    constructor(tiles: Tile[] = []) {
        this.tiles = tiles;
    }

    addTiles(tiles: Tile[]) {
        this.tiles.push(...tiles);
    }

    getTiles(tilesStr: string): Tile[] {
        const tiles: Tile[] = [];
        for (const letter of tilesStr) {
            const tile = this.tiles.find((item) => item.letter === letter);
            if (tile) {
                const index = this.tiles.indexOf(tile);
                this.tiles.splice(index, 1);
                tiles.push(tile);
            }
        }
        return tiles;
    }

    containsTiles(tilesStr: string): boolean {
        if (tilesStr.length > this.count) return false;

        const tileOccurrences: Map<string, number> = new Map();
        this.tiles.forEach((tile) => {
            const letter = tile.letter;
            const occurrences = tileOccurrences.get(letter);
            if (occurrences) {
                tileOccurrences.set(letter, occurrences + 1);
            } else {
                tileOccurrences.set(letter, 1);
            }
        });
        for (const letter of tilesStr) {
            const occurrences = tileOccurrences.get(letter);
            if (occurrences && occurrences > 0) {
                tileOccurrences.set(letter, occurrences - 1);
            } else {
                return false;
            }
        }
        return true;
    }

    toString(): string {
        let easelStr = '';
        this.tiles.forEach((tile) => {
            easelStr += tile.letter;
        });
        return easelStr;
    }
}
