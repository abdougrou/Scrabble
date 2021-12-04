import { Vec2 } from './vec2';

export interface Move {
    word: string;
    coord: Vec2;
    across: boolean;
    points: number;
    formedWords: number;
}
