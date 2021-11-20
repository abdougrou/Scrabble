import { Easel } from './easel';

export interface Player {
    name: string;
    easel: Easel;
    score: number;
    debug?: boolean;
}
