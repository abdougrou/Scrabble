import { Injectable } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { GRID_SIZE, LETTER_POINTS } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Map<number, Tile> = new Map();
    multiplayerBoard: (string | null)[][];

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

    multiplayerBoardToBoard() {
        this.board.clear();
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (this.multiplayerBoard[i][j]) {
                    const boardTile: Tile = {
                        letter: this.multiplayerBoard[i][j] as string,
                        points: LETTER_POINTS.get(this.multiplayerBoard[i][j] as string) as number,
                    };
                    this.board.set(this.coordToKey({ x: i, y: j }), boardTile);
                }
            }
        }
    }
}
