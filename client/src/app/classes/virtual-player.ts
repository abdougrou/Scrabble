import { ReserveService } from '@app/services/reserve.service';
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

    chooseAction: (reserve: ReserveService, legalMoves: Move[]) => Observable<PlayAction>;
    place: (legalMoves: Move[]) => Move;
    exchange: (reserve: ReserveService) => string[];
}
