import { WordValidationService } from '@app/services/word-validation.service';
import { Easel } from './easel';
import { PlayAction, Player } from './player';

const PASS_CHANCE = 0.1;
const EXCHANGE_CHANCE = 0.2;

export class VirtualPlayer implements Player {
    name: string;
    score: number;
    easel: Easel;

    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.easel = new Easel();
    }

    play(): PlayAction {
        const random = Math.random();
        if (random < PASS_CHANCE) return PlayAction.Pass;
        else if (random < EXCHANGE_CHANCE) return PlayAction.ExchangeTiles;
        else return PlayAction.PlaceTiles;
    }

    exchange(): string {
        return '';
    }

    place(validation: WordValidationService) {
        //
    }
}
