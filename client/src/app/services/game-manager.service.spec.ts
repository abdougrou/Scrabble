import { TestBed } from '@angular/core/testing';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { GameManagerService } from './game-manager.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';
import { Tile } from '@app/classes/tile';
import { Player } from '@app/classes/player';
import { Easel } from '@app/classes/easel';
import { BoardService } from './board.service';

describe('GameManagerService', () => {
    let service: GameManagerService;
    let board: BoardService;
    let playerService: PlayerService;
    let reserve: ReserveService;

    beforeEach(() => {
        board = new BoardService();
        reserve = new ReserveService();
        playerService = new PlayerService();
        TestBed.configureTestingModule({
            providers: [
                { provide: BoardService, useValue: board },
                { provide: ReserveService, useValue: reserve },
                { provide: PlayerService, useValue: playerService },
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
        const word = 'WORD';
        const coord = {
            x: 1,
            y: 1,
        };
        const vertical = false;
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
        service.placeTiles(word, coord, vertical, player);
        for (let i = 0; i < word.length; i++) {
            expect(board.getTile({ x: coord.x + i, y: coord.y })).toEqual(tiles[i]);
        }
    });
});
