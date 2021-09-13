export interface Tile {
    letter: string;
    points: number;
}

export interface ReserveTile {
    tile: Tile;
    count: number;
}
