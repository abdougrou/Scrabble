import { Tile } from './tile';

export class Easel {
    tiles: Tile[] = [];

    addTiles(tiles: Tile[]) {
        this.tiles.push(...tiles);
    }

    get count(): number {
        return this.tiles.length;
    }
}
