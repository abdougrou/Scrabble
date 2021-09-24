import { Injectable } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Map<Vec2, Tile> = new Map();

    getTile(coord: Vec2): Tile | undefined {
        return this.board.get(coord);
    }

    placeTile(coord: Vec2, tile: Tile): boolean {
        if (this.getTile(coord)) return false;
        this.board.set(coord, tile);
        return true;
    }
}
