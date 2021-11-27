import { Move } from '@common/move';
import { Observable } from 'rxjs';
import { Easel } from './easel';
import { Player } from './player';

export enum PlayAction {
    Pass,
    Exchange,
    Place,
}

export interface VirtualPlayer extends Player {
    name: string;
    easel: Easel;
    score: number;

    chooseAction: () => Observable<PlayAction>;
    place: () => Move;
    exchange: () => string[];
}
