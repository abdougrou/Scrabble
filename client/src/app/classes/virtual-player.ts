import { FULL_EASEL_BONUS, SYSTEM_NAME } from '@app/constants';
import { BoardService } from '@app/services/board.service';
import { CalculatePointsService } from '@app/services/calculate-points.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Easel } from './easel';
import { ChatMessage } from './message';
import { PlayAction, Player } from './player';
import { BoardWord, PlaceTilesInfo } from './tile';

const PASS_CHANCE = 0.1;
const EXCHANGE_CHANCE = 0.2;
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
    place(
        validation: WordValidationService,
        calculatePoints: CalculatePointsService,
        boardService: BoardService,
        result: BehaviorSubject<ChatMessage>,
        debug: boolean,
    ): PlaceTilesInfo {
        const possiblePermutations: BoardWord[] = validation.getPossibleWords(this.easel.easelTileToTile(this.easel.tiles));
        const validPermutations: BoardWord[] = [];
        const msg: ChatMessage = { user: SYSTEM_NAME, body: '<br>' };
        for (const permutation of possiblePermutations) {
            if (validPermutations.length > 3) break;
            if (permutation.tileCoords.length > 0) {
                const points = calculatePoints.calculatePoints(permutation.tileCoords);
                if (points > 0) {
                    for (const aTile of permutation.tileCoords) {
                        boardService.placeTile(aTile.coords, aTile.tile);
                        if (debug) {
                            msg.body += ` ${String.fromCharCode('a'.charCodeAt(0) + aTile.coords.y)}${aTile.coords.x + 1}`;
                            msg.body += `:${aTile.tile.letter} `;
                        }
                    }
                    if (validation.validateWords(permutation.tileCoords)) {
                        permutation.points = points;
                        validPermutations.push(permutation);
                        if (debug) {
                            msg.body += `(${points})<br>`;
                            if (points >= FULL_EASEL_BONUS) msg.body += `Bingo! (${points})<br>`;
                        }
                    }
                    for (const aTile of permutation.tileCoords) {
                        boardService.board.delete(boardService.coordToKey(aTile.coords));
                    }
                }
            }
        }

        const chosen: BoardWord = validPermutations[0];
        if (chosen) {
            if (debug) result.next(msg);
            return {
                word: chosen.word,
                coordStr: `${String.fromCharCode('a'.charCodeAt(0) + chosen.tileCoords[0].coords.y)}${chosen.tileCoords[0].coords.x + 1}`,
                vertical: chosen.vertical,
            };
        } else {
            return {
                word: '',
                coordStr: '',
                vertical: false,
            };
        }
    }

    // coordToStringCoord(coord: Vec2): string {

    // };
}
