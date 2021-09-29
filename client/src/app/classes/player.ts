import { Easel } from './easel';

export interface Player {
    name: string;
    score: number;
    easel: Easel;
}

export enum PlayAction {
    Pass,
    ExchangeTiles,
    PlaceTiles,
}
