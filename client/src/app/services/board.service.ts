import { Injectable } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Map<number, Tile> = new Map();

    getTile(coord: Vec2): Tile | undefined {
        return this.board.get(this.coordToKey(coord));
    }

    placeTile(coord: Vec2, tile: Tile): boolean {
        if (this.getTile(coord)) return false;
        this.board.set(this.coordToKey(coord), tile);
        return true;
    }

    coordToKey(coord: Vec2): number {
        const xMultiplier = 100;
        return coord.x * xMultiplier + coord.y;
    }
}
