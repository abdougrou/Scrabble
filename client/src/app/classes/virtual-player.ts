import { WordValidationService } from '@app/services/word-validation.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Easel } from './easel';
import { PlayAction, Player } from './player';
import { PlaceTilesInfo } from './tile';

const PASS_CHANCE = 0.3;
const EXCHANGE_CHANCE = 0.6;
const IDLE_TIME_MS = 3000;

export class VirtualPlayer implements Player {
    name: string;
    score: number;
    easel: Easel;

    constructor(name: string, easel: Easel) {
        this.name = name;
        this.score = 0;
        this.easel = easel;
    }

    play(): Observable<PlayAction> {
        const random = Math.random();
        let action: PlayAction = PlayAction.Pass;
        if (random < PASS_CHANCE) action = PlayAction.Pass;
        else if (random < EXCHANGE_CHANCE) action = PlayAction.ExchangeTiles;
        else action = PlayAction.PlaceTiles;

        return new BehaviorSubject<PlayAction>(action).pipe(delay(IDLE_TIME_MS));
    }

    exchange(): string {
        const randomLetters = Math.random() * this.easel.count + 1;
        return this.easel.toString().slice(0, randomLetters);
    }

    // eslint-disable-next-line no-unused-vars
    place(validation: WordValidationService): PlaceTilesInfo {
        return {
            word: 'word',
            coordStr: 'h8',
            vertical: false,
        };
    }
}
