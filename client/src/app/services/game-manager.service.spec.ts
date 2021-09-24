import { TestBed } from '@angular/core/testing';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { GameManagerService } from './game-manager.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';
import { Tile } from '@app/classes/tile';
import { Player } from '@app/classes/player';
import { Easel } from '@app/classes/easel';

describe('GameManagerService', () => {
    let service: GameManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ReserveService, useValue: new ReserveService() },
                { provide: PlayerService, useValue: new PlayerService() },
            ],
        });
        service = TestBed.inject(GameManagerService);
        service.initialize({
            playerName1: 'player1',
            playerName2: 'player2',
            gameMode: GameMode.Classic,
            isMultiPlayer: false,
            dictionary: Dictionary.French,
            duration: 30,
            bonusEnabled: false,
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('placeTiles should place the tiles in the board', () => {
        const word = 'word';
        const coord = {
            x: 1,
            y: 1,
        };
        const direction = false;
        const tiles: Tile[] = [
            { letter: 'W', points: 0 },
            { letter: 'O', points: 0 },
            { letter: 'R', points: 0 },
            { letter: 'D', points: 0 },
        ];
        const player: Player = {
            name: 'player',
            score: 0,
            easel: new Easel(tiles),
        };
        service.placeTiles(word, coord, direction, player);
        // for (let i = 0; i < word.length; i++) {
        //     console.log(service.board[coord.x + i][coord.y].letter, word[i]);
        //     // expect(service.board[coord.x + i][coord.y].letter).toBe(word[i]);
        // }
    });
});
