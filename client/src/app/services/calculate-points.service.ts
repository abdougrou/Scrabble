import { Injectable } from '@angular/core';
import { TileCoords } from '@app/classes/tile';
//  r=red, e=empty, l=lightblue, p=pink, d=darkblue,
const COLORS: string[] = [
    'reeleeereeeleer',
    'epeeedeeedeeepe',
    'eepeeeleleeepee',
    'leepeeeleeepeel',
    'eeeepeeeeepeeee',
    'edeeedeeedeeede',
    'eeleeeleleeelee',
    'reeleeepeeeleer',
    'eeleeeleleeelee',
    'edeeedeeedeeede',
    'eeeepeeeeepeeee',
    'leepeeeleeepeel',
    'eepeeeleleeepee',
    'epeeedeeedeeepe',
    'reeleeereeeleer',
];
const TILE_NUM_BONUS = 7;
const FULL_EASEL_BONUS = 50;
const LIGHT_BLUE_MULTIPLIER = 2;
const DARK_BLUE_MULTIPLIER = 3;
const PINK_MULTIPLIER = 2;
const RED_MULTIPLIER = 3;

@Injectable({
    providedIn: 'root',
})
export class CalculatePointsService {
    calculatePoints(tileCoords: TileCoords[][], newTiles: TileCoords[]): number {
        let points = 0;
        if (newTiles.length === TILE_NUM_BONUS) {
            points += FULL_EASEL_BONUS;
        }
        for (const tile of tileCoords) {
            points += this.calculateWordPoint(tile, newTiles);
        }
        return points;
    }

    calculateWordPoint(tiles: TileCoords[], newTiles: TileCoords[]): number {
        let points = 0;
        let numNewPinkTiles = 0;
        let numNewRedTiles = 0;
        for (const tile of tiles) {
            if (!this.isNewTile(tile, newTiles)) {
                points += tile.tile.points;
            } else {
                const color = this.getTileColor(tile);
                switch (color) {
                    case 'e':
                        points += tile.tile.points;
                        break;
                    case 'l':
                        points += LIGHT_BLUE_MULTIPLIER * tile.tile.points;
                        break;
                    case 'd':
                        points += DARK_BLUE_MULTIPLIER * tile.tile.points;
                        break;
                    case 'p':
                        points += tile.tile.points;
                        numNewPinkTiles++;
                        break;
                    case 'r':
                        points += tile.tile.points;
                        numNewRedTiles++;
                        break;
                }
            }
        }
        if (numNewPinkTiles !== 0) {
            points *= Math.pow(PINK_MULTIPLIER, numNewPinkTiles);
        }
        if (numNewRedTiles !== 0) {
            points *= Math.pow(RED_MULTIPLIER, numNewRedTiles);
        }
        return points;
    }

    isNewTile(tile: TileCoords, newTiles: TileCoords[]): boolean {
        for (const aTile of newTiles) {
            if (JSON.stringify(tile) === JSON.stringify(aTile)) {
                return true;
            }
        }
        return false;
    }

    getTileColor(tile: TileCoords): string {
        return COLORS[tile.coords.y].charAt(tile.coords.x);
    }
}
