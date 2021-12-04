import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { PlayAction, VirtualPlayer } from '@app/classes/virtual-player';
import { Move } from '@common/move';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
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

    setupVirtualPlayer(name: string, easel: Easel, score: number, expert: boolean) {
        this.virtualPlayer = {
            name,
            easel,
            score,
            chooseAction: expert ? this.expertChoose : this.beginnerChoose,
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
    expertChoose(reserve: ReserveService, legalMoves: Move[]): Observable<PlayAction> {
        let action: PlayAction = PlayAction.Pass;
        if (legalMoves.length > 0) action = PlayAction.Place;
        else if (reserve.isExchangePossibleBot(1)) action = PlayAction.Exchange; // We can exchange at least 1 letter

        return new BehaviorSubject<PlayAction>(action).pipe(delay(IDLE_TIME_MS));
    }

    /**
     * Chooses the word that gives the most points
     *
     * @returns The move that gives the most points
     */
    expertPlace(legalMoves: Move[]): Move {
        return legalMoves.reduce((highest, move) => (highest.points > move.points ? highest : move));
    }

    /**
     * Tries to exchange the maximum amount of letters possible
     *
     * @returns array of letters to exchange
     */
    expertExchange(reserve: ReserveService): string[] {
        for (let i = this.virtualPlayer.easel.letters.length; i >= 0; i--) {
            if (!reserve.isExchangePossibleBot(i)) continue;

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
    beginnerChoose(reserve: ReserveService, legalMoves: Move[]): Observable<PlayAction> {
        const random = Math.random();
        let action: PlayAction = PlayAction.Pass;
        if (random < PASS_CHANCE) action = PlayAction.Pass;
        else if (random < EXCHANGE_CHANCE && reserve.isExchangePossible(1)) action = PlayAction.Exchange;
        else if (legalMoves.length > 0) action = PlayAction.Place;

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
    beginnerPlace(legalMoves: Move[]): Move {
        return legalMoves.sort(() => SORT_RANDOM - Math.random())[0];
    }

    beginnerExchange(reserve: ReserveService): string[] {
        const output: string[] = [];
        const easelLetters: string[] = this.virtualPlayer.easel.toString().split('');

        let amount = Math.random() * this.virtualPlayer.easel.count;
        while (!reserve.isExchangePossibleBot(amount)) {
            amount = Math.random() * this.virtualPlayer.easel.count;
        }

        for (let i = amount; i > 0; i--) {
            output.push(easelLetters.sort(() => SORT_RANDOM - Math.random()).pop() as string);
        }

        return output;
    }
}
