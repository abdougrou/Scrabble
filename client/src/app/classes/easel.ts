import { EaselTile, Tile, TileState } from './tile';

export class Easel {
    tiles: EaselTile[] = [];
    get count(): number {
        return this.tiles.length;
    }

    constructor(tiles: Tile[] = []) {
        this.tiles = this.tileToEaselTile(tiles);
    }

    tileToEaselTile(tiles: Tile[]): EaselTile[] {
        const easelTiles: EaselTile[] = [];
        for (const tile of tiles) {
            easelTiles.push({ tile, state: TileState.None });
        }
        return easelTiles;
    }

    easelTileToTile(easelTiles: EaselTile[]): Tile[] {
        const tiles: Tile[] = [];
        for (const easelTile of easelTiles) {
            tiles.push(easelTile.tile);
        }
        return tiles;
    }

    addTiles(tiles: Tile[]) {
        this.tiles.push(...this.tileToEaselTile(tiles));
    }

    getTiles(tilesStr: string): Tile[] {
        const tiles: Tile[] = [];
        for (const letter of tilesStr) {
            const easelTile = this.tiles.find((item) => item.tile.letter === letter);
            if (easelTile) {
                const index = this.tiles.indexOf(easelTile);
                this.tiles.splice(index, 1);
                tiles.push(easelTile.tile);
            }
        }
        return tiles;
    }

    containsTiles(tilesStr: string): boolean {
        if (tilesStr.length > this.count) return false;

        const tileOccurrences: Map<string, number> = new Map();
        this.tiles.forEach((easelTile) => {
            const letter = easelTile.tile.letter;
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
        this.tiles.forEach((easelTile) => {
            easelStr += easelTile.tile.letter;
        });
        return easelStr;
    }
}
