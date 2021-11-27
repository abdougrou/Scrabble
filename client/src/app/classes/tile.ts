import { Vec2 } from '@common/vec2';

export enum TileState {
    None = 0,
    Manipulation = 1,
    Exchange = 2,
}

export interface ReserveTile {
    letter: string;
    count: number;
}

export interface EaselTile {
    letter: string;
    state: TileState;
}

export interface TileCoords {
    letter: string;
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

export interface BoardWord {
    word: string;
    tileCoords: TileCoords[];
    vertical: boolean;
    points: number;
}
