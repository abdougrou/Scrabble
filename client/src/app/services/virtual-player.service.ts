import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { PlayAction, VirtualPlayer } from '@app/classes/virtual-player';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MoveGeneratorService } from './move-generator.service';
import { ReserveService } from './reserve.service';

const PASS_CHANCE = 0.1;
const EXCHANGE_CHANCE = 0.2;
const IDLE_TIME_MS = 3000;

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    virtualPlayer: VirtualPlayer;

    constructor(private moveGenerator: MoveGeneratorService, private reserve: ReserveService) {}

    setupVirtualPlayer(name: string, easel: Easel, score: number, expert: boolean) {
        this.virtualPlayer = { name, easel, score, chooseAction: expert ? this.beginnerChoose : this.expertChoose };
    }

    expertChoose(): Observable<PlayAction> {
        let action: PlayAction = PlayAction.Pass;
        if (this.moveGenerator.legalMoves.length > 0) action = PlayAction.Place;
        else if (this.reserve.isExchangePossible(1)) action = PlayAction.Exchange; // We can exchange at least 1 letter

        return new BehaviorSubject<PlayAction>(action).pipe(delay(IDLE_TIME_MS));
    }

    beginnerChoose(): Observable<PlayAction> {
        const random = Math.random();
        let action: PlayAction = PlayAction.Pass;
        if (random < PASS_CHANCE) action = PlayAction.Pass;
        else if (random < EXCHANGE_CHANCE) action = PlayAction.Exchange;
        else if (this.moveGenerator.legalMoves.length > 0) action = PlayAction.Place;

        return new BehaviorSubject<PlayAction>(action).pipe(delay(IDLE_TIME_MS));
    }
}
