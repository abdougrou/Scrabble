import { Vec2 } from './vec2';

export interface Tile {
    letter: string;
    points: number;
}

export interface ReserveTile {
    tile: Tile;
    count: number;
}

export interface TileCoords {
    tile: Tile;
    coords: Vec2;
}

export interface PlaceTilesInfo {
    word: string;
    coordStr: string;
    vertical: boolean;
}

export interface LetterCoords {
    letter: string;
    coords: Vec2;
}
