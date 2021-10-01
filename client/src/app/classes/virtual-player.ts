import { CalculatePointsService } from '@app/services/calculate-points.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Easel } from './easel';
import { PlayAction, Player } from './player';
//  import { BoardWord, PlaceTilesInfo } from './tile';
import { PlaceTilesInfo } from './tile';

// const PASS_CHANCE = 0.1;
// const EXCHANGE_CHANCE = 0.2;
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
        // const random = Math.random();
        // let action: PlayAction = PlayAction.Pass;
        // if (random < PASS_CHANCE) action = PlayAction.Pass;
        // else if (random < EXCHANGE_CHANCE) action = PlayAction.ExchangeTiles;
        // else action = PlayAction.PlaceTiles;

        // return new BehaviorSubject<PlayAction>(action).pipe(delay(IDLE_TIME_MS));

        return new BehaviorSubject<PlayAction>(PlayAction.PlaceTiles).pipe(delay(IDLE_TIME_MS));
    }

    exchange(): string {
        const randomLetters = Math.random() * this.easel.count + 1;
        return this.easel.toString().slice(0, randomLetters);
    }

    // eslint-disable-next-line no-unused-vars
    place(validation: WordValidationService, calculatePoints: CalculatePointsService): PlaceTilesInfo {
        // const possiblePermutations: BoardWord[] = validation.getPossibleWords(this.easel.tiles);
        // //  console.log(possiblePermutations);
        // const validPermutations: BoardWord[] = [];

        // for (const permutation of possiblePermutations) {
        //     if (validPermutations.length > 3) break;
        //     if (permutation.tileCoords.length > 2) {
        //         const points = calculatePoints.calculatePoints(permutation.tileCoords);
        //         //  console.log(points);
        //         if (points > 0) {
        //             validPermutations.push(permutation);
        //         }
        //     }
        // }
        // console.log(validPermutations);

        return {
            word: 'word',
            coordStr: 'h8',
            vertical: false,
        };
    }

    // coordToStringCoord(coord: Vec2): string {

    // };
}
