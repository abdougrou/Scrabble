import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Move } from '@app/classes/move';
import { PlayAction, VirtualPlayer } from '@app/classes/virtual-player';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MoveGeneratorService } from './move-generator.service';
import { ReserveService } from './reserve.service';

const SORT_RANDOM = 0.5;
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
        this.virtualPlayer = {
            name,
            easel,
            score,
            chooseAction: expert ? this.beginnerChoose : this.expertChoose,
            place: expert ? this.expertPlace : this.beginnerPlace,
            exchange: expert ? this.expertExchange : this.beginnerExchange,
        };
    }

    /**
     * Chooses an action in the following sequence:
     *
     * - Place highest rewarding word if possible,
     *
     * - Exchange the maximum amount of letters,
     *
     * - Skip
     *
     * @returns Observable<PlayAction>
     */
    expertChoose(): Observable<PlayAction> {
        let action: PlayAction = PlayAction.Pass;
        if (this.moveGenerator.legalMoves.length > 0) action = PlayAction.Place;
        else if (this.reserve.isExchangePossibleBot(1)) action = PlayAction.Exchange; // We can exchange at least 1 letter

        return new BehaviorSubject<PlayAction>(action).pipe(delay(IDLE_TIME_MS));
    }

    /**
     * Chooses the word that gives the most points
     *
     * @returns The move that gives the most points
     */
    expertPlace(): Move {
        return this.moveGenerator.legalMoves.reduce((highest, move) => (highest.points > move.points ? highest : move));
    }

    /**
     * Tries to exchange the maximum amount of letters possible
     *
     * @returns array of letters to exchange
     */
    expertExchange(): string[] {
        for (let i = this.virtualPlayer.easel.letters.length; i >= 0; i--) {
            if (!this.reserve.isExchangePossibleBot(i)) continue;

            const easelLetters = this.virtualPlayer.easel.letters.sort(() => SORT_RANDOM - Math.random());
            while (easelLetters.length > i) easelLetters.pop();
            return easelLetters;
        }
        return [];
    }

    /**
     * Chooses an action randomly according to the following chances:
     *
     * - 10% Pass,
     *
     * - 10% Exchange,
     *
     * - 80% Place (if a placement is possible)
     *
     * @returns Observable<PlayAction>
     */
    beginnerChoose(): Observable<PlayAction> {
        const random = Math.random();
        let action: PlayAction = PlayAction.Pass;
        if (random < PASS_CHANCE) action = PlayAction.Pass;
        else if (random < EXCHANGE_CHANCE && this.reserve.isExchangePossible(1)) action = PlayAction.Exchange;
        else if (this.moveGenerator.legalMoves.length > 0) action = PlayAction.Place;

        return new BehaviorSubject<PlayAction>(action).pipe(delay(IDLE_TIME_MS));
    }

    /**
     * Chooses a random move from the generated moves
     *
     * TODO 40% 6 points or less,
     * 30% 7 to 12 points
     * 30% 13 to 18 points
     *
     * @returns A possible move
     */
    beginnerPlace(): Move {
        return this.moveGenerator.legalMoves.sort(() => SORT_RANDOM - Math.random())[0];
    }

    beginnerExchange() {
        //
    }
}
