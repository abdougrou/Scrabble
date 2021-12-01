import { Easel } from '@app/classes/easel';

export interface Player {
    name: string;
    easel: Easel;
    score: number;
    debug?: boolean;
}
