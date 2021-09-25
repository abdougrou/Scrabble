import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { BoardService } from './board.service';
import { GameManagerService } from './game-manager.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

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

    it('exchangeTiles should exchange letters with reserve', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.current.easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 7 });
        reserve.tileCount = 7;
        service.exchangeTiles('allo', playerService.current);
        expect(playerService.current.easel.toString()).toBe('aaaa');
    });
    it('reserve should get tiles from easel after successful exchange', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.current.easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 7 });
        reserve.tileCount = 7;
        service.exchangeTiles('allo', playerService.current);

        let test = '';
        for (const aTile of reserve.tiles.keys()) {
            test += aTile;
        }
        expect(test).toBe('alo');
    });
    it('exchangeTiles should not exchange letters with reserve if not enough tiles in reserve', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.current.easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 2 });
        reserve.tileCount = 2;
        service.exchangeTiles('allo', playerService.current);
        expect(playerService.current.easel.toString()).toBe('allo');
    });
    it('exchangeTiles should not exchange letters when they are not in the easel', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.current.easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 8 });
        reserve.tileCount = 8;
        service.exchangeTiles('bonj', playerService.current);
        expect(playerService.current.easel.toString()).toBe('allo');
    });
    it('exchangeTiles should not exchange letters when they are not in the easel', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.players[1].easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 8 });
        reserve.tileCount = 8;
        service.exchangeTiles('allo', playerService.players[1]);
        expect(playerService.players[1].easel.toString()).toBe('allo');
    });
});
